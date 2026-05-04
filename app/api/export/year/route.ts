import { NextResponse } from "next/server"
import ExcelJS from "exceljs"
import { createClient } from "@/lib/supabase/server"
import { getPeriodRange } from "@/lib/period"
import { C, fmtDate, sectionHeader, colHeader, dataRow, totalRow, docHeader, legalNote } from "@/lib/excel-helpers"

const MONTHS_FR = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"]

export async function GET(req: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: profile } = await supabase
    .from("profiles").select("*").eq("id", user.id).single()

  if (!profile) return NextResponse.json({ error: "Profil introuvable" }, { status: 404 })

  const isPremium = profile.plan === "premium"
  if (!isPremium) return NextResponse.json({ error: "Premium requis" }, { status: 403 })

  const frequency = profile.declaration_frequency === "quarterly" ? "quarterly" : "monthly"

  // Year param — default to current year
  const yearParam = searchParams.get("year")
  const year = yearParam ? parseInt(yearParam) : new Date().getFullYear()
  const yearStart = `${year}-01-01`
  const yearEnd = `${year}-12-31`

  // ── Data ──────────────────────────────────────────────────────────────────
  const { data: revenues } = await supabase
    .from("revenues").select("*").eq("user_id", user.id)
    .gte("date", yearStart).lte("date", yearEnd)
    .order("date", { ascending: true })

  const { data: allExpenses } = await supabase
    .from("expenses").select("*").eq("user_id", user.id)
    .order("date", { ascending: true })

  // One-time expenses in year + recurring active ones (listed once)
  const oneTimeExpenses = (allExpenses || []).filter(
    (e) => e.type === "one_time" && e.date >= yearStart && e.date <= yearEnd
  )
  const recurringExpenses = (allExpenses || []).filter(
    (e) => e.type === "recurring" && e.active
  )

  const totalRevenues = (revenues || []).reduce((s, r) => s + Number(r.amount), 0)
  const totalOneTime = oneTimeExpenses.reduce((s, e) => s + Number(e.amount), 0)

  // Monthly recurring cost (x periods in year)
  const periodsInYear = frequency === "quarterly" ? 4 : 12
  const totalRecurringPerPeriod = recurringExpenses.reduce((s, e) => s + Number(e.amount), 0)
  const totalRecurringYear = totalRecurringPerPeriod * periodsInYear
  const totalExpenses = totalOneTime + totalRecurringYear

  // ── Build period breakdown for recap ─────────────────────────────────────
  const periodLabels: string[] = []
  const periodRevTotals: number[] = []

  if (frequency === "monthly") {
    for (let m = 0; m < 12; m++) {
      const pStart = `${year}-${String(m + 1).padStart(2, "0")}-01`
      const lastDay = new Date(year, m + 1, 0).getDate()
      const pEnd = `${year}-${String(m + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`
      const total = (revenues || [])
        .filter((r) => r.date >= pStart && r.date <= pEnd)
        .reduce((s, r) => s + Number(r.amount), 0)
      periodLabels.push(MONTHS_FR[m])
      periodRevTotals.push(total)
    }
  } else {
    for (let q = 0; q < 4; q++) {
      const firstMonth = q * 3
      const p = getPeriodRange("quarterly", new Date(year, firstMonth, 15))
      const total = (revenues || [])
        .filter((r) => r.date >= p.start && r.date <= p.end)
        .reduce((s, r) => s + Number(r.amount), 0)
      periodLabels.push(`T${q + 1} ${year}`)
      periodRevTotals.push(total)
    }
  }

  // ── Workbook ──────────────────────────────────────────────────────────────
  const workbook = new ExcelJS.Workbook()
  workbook.creator = "Keskireste"
  workbook.created = new Date()

  const ws = workbook.addWorksheet("Livre comptable annuel", {
    pageSetup: { paperSize: 9, orientation: "landscape", fitToPage: true, fitToWidth: 1 },
  })

  ws.columns = [
    { key: "num",     width: 7  },
    { key: "date",    width: 14 },
    { key: "tiers",   width: 28 },
    { key: "nature",  width: 36 },
    { key: "mode",    width: 20 },
    { key: "montant", width: 16 },
  ]

  const COL_COUNT = 6
  const AMOUNT_COL = 6
  const companyName = profile.company_name || profile.first_name || user.email || ""

  docHeader(ws, `LIVRE COMPTABLE ANNUEL · ${year}`, companyName, `Année ${year}`, COL_COUNT)

  // ── RECETTES ──────────────────────────────────────────────────────────────
  sectionHeader(ws, "LIVRE DES RECETTES  —  Tous les encaissements de l'année", C.violet, COL_COUNT)
  colHeader(ws, ["N°", "Date", "Client", "Nature de la prestation", "Mode de règlement", "Montant"], C.violet)

  if ((revenues || []).length === 0) {
    const r = ws.addRow([null, null, "Aucun encaissement enregistré pour cette année.", null, null, null])
    ws.mergeCells(r.number, 3, r.number, COL_COUNT)
    r.getCell(3).font = { italic: true, color: { argb: C.greyText }, size: 10 }
    r.getCell(3).alignment = { vertical: "middle", indent: 1 }
    r.height = 20
  } else {
    ;(revenues || []).forEach((rev, i) => {
      const row = dataRow(ws, [i + 1, fmtDate(rev.date), rev.client_name || "", rev.label || "Prestation de service", rev.payment_method || "", Number(rev.amount)], i % 2 === 1, C.violetLight, AMOUNT_COL)
      row.getCell(2).numFmt = "dd/mm/yyyy"
      row.getCell(2).alignment = { vertical: "middle", horizontal: "center" }
      row.getCell(1).alignment = { vertical: "middle", horizontal: "center" }
      row.getCell(6).numFmt = '#,##0.00 "€"'
    })
  }
  totalRow(ws, "TOTAL RECETTES", totalRevenues, COL_COUNT, AMOUNT_COL, C.violetMid)

  ws.addRow([])

  // ── DÉPENSES PONCTUELLES ──────────────────────────────────────────────────
  sectionHeader(ws, "REGISTRE DES ACHATS  —  Dépenses ponctuelles de l'année", C.rose, COL_COUNT)
  colHeader(ws, ["N°", "Date", "Fournisseur", "Nature de l'achat", "Mode de règlement", "Montant"], C.rose)

  if (oneTimeExpenses.length === 0) {
    const r = ws.addRow([null, null, "Aucune dépense ponctuelle enregistrée pour cette année.", null, null, null])
    ws.mergeCells(r.number, 3, r.number, COL_COUNT)
    r.getCell(3).font = { italic: true, color: { argb: C.greyText }, size: 10 }
    r.getCell(3).alignment = { vertical: "middle", indent: 1 }
    r.height = 20
  } else {
    oneTimeExpenses.forEach((exp, i) => {
      const row = dataRow(ws, [i + 1, fmtDate(exp.date), exp.supplier_name || "", exp.label || "Achat", exp.payment_method || "", Number(exp.amount)], i % 2 === 1, C.roseLight, AMOUNT_COL)
      row.getCell(2).numFmt = "dd/mm/yyyy"
      row.getCell(2).alignment = { vertical: "middle", horizontal: "center" }
      row.getCell(1).alignment = { vertical: "middle", horizontal: "center" }
      row.getCell(6).numFmt = '#,##0.00 "€"'
    })
  }
  totalRow(ws, "TOTAL DÉPENSES PONCTUELLES", totalOneTime, COL_COUNT, AMOUNT_COL, C.roseMid)

  ws.addRow([])

  // ── DÉPENSES RÉCURRENTES ──────────────────────────────────────────────────
  if (recurringExpenses.length > 0) {
    sectionHeader(ws, `CHARGES FIXES RÉCURRENTES  —  Actives (× ${periodsInYear} ${frequency === "monthly" ? "mois" : "trimestres"}/an)`, "FF9333EA", COL_COUNT)
    colHeader(ws, ["N°", "Date début", "Fournisseur", "Libellé", "Fréquence", "Montant/période"], "FF9333EA")

    recurringExpenses.forEach((exp, i) => {
      const row = dataRow(ws, [i + 1, exp.date ? fmtDate(exp.date) : null, exp.supplier_name || "", exp.label || "Charge récurrente", frequency === "monthly" ? "Mensuelle" : "Trimestrielle", Number(exp.amount)], i % 2 === 1, "FFF3E8FF", AMOUNT_COL)
      row.getCell(2).numFmt = "dd/mm/yyyy"
      row.getCell(2).alignment = { vertical: "middle", horizontal: "center" }
      row.getCell(1).alignment = { vertical: "middle", horizontal: "center" }
      row.getCell(6).numFmt = '#,##0.00 "€"'
    })
    totalRow(ws, `TOTAL CHARGES FIXES (projeté annuel × ${periodsInYear})`, totalRecurringYear, COL_COUNT, AMOUNT_COL, "FFE9D5FF")
    ws.addRow([])
  }

  // ── RÉCAP PAR PÉRIODE ─────────────────────────────────────────────────────
  sectionHeader(ws, `RÉCAPITULATIF PAR PÉRIODE  —  CA mensuel ${year}`, C.ink, COL_COUNT)

  // Sub-header
  const subHeaders = frequency === "monthly"
    ? ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."]
    : ["T1", "T2", "T3", "T4"]

  // Add recap in a 2-row block (label + amount)
  const recapLabelRow = ws.addRow(["", ...subHeaders, ""])
  recapLabelRow.eachCell({ includeEmpty: true }, (cell, col) => {
    if (col > 1 && col <= subHeaders.length + 1) {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.grey } }
      cell.font = { bold: true, size: 9, color: { argb: C.greyText } }
      cell.alignment = { vertical: "middle", horizontal: "center" }
    }
  })
  recapLabelRow.height = 18

  const recapAmtRow = ws.addRow(["CA encaissé", ...periodRevTotals, totalRevenues])
  ws.mergeCells(recapAmtRow.number, subHeaders.length + 2, recapAmtRow.number, COL_COUNT)
  recapAmtRow.eachCell({ includeEmpty: true }, (cell, col) => {
    const isTotal = col === subHeaders.length + 2
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: isTotal ? C.violetMid : C.white } }
    cell.font = { size: 10, bold: isTotal, color: { argb: col === 1 ? C.greyText : C.ink } }
    cell.border = { top: { style: "thin", color: { argb: C.grey } }, bottom: { style: "thin", color: { argb: C.grey } }, left: { style: "thin", color: { argb: C.grey } }, right: { style: "thin", color: { argb: C.grey } } }
    cell.alignment = { vertical: "middle", horizontal: col === 1 ? "left" : "right" }
    if (col > 1) cell.numFmt = '#,##0 "€"'
  })
  recapAmtRow.height = 22

  ws.addRow([])

  // ── RÉSULTAT NET ──────────────────────────────────────────────────────────
  const net = totalRevenues - totalExpenses
  const netRow = ws.addRow([`RÉSULTAT NET ${year}  (Recettes − Dépenses totales)`, null, null, null, null, net])
  ws.mergeCells(netRow.number, 1, netRow.number, AMOUNT_COL - 1)
  netRow.eachCell({ includeEmpty: true }, (cell, col) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.ink } }
    cell.font = { bold: true, size: 12, color: { argb: net >= 0 ? C.lime : "FFFB7185" } }
    cell.border = { top: { style: "medium", color: { argb: C.ink } }, bottom: { style: "medium", color: { argb: C.ink } }, left: { style: "thin", color: { argb: C.ink } }, right: { style: "thin", color: { argb: C.ink } } }
    cell.alignment = { vertical: "middle", horizontal: col === AMOUNT_COL ? "right" : "left", indent: 1 }
    if (col === AMOUNT_COL) cell.numFmt = '#,##0.00 "€"'
  })
  netRow.height = 32

  legalNote(ws, COL_COUNT)

  const buffer = await workbook.xlsx.writeBuffer()
  const filename = `keskireste-annuel-${year}.xlsx`

  return new NextResponse(buffer as ArrayBuffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}
