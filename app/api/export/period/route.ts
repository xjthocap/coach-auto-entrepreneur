import { NextResponse } from "next/server"
import ExcelJS from "exceljs"
import { createClient } from "@/lib/supabase/server"
import { getPeriodRange } from "@/lib/period"

function parseLocalDate(value: string) {
  const [year, month, day] = value.split("-").map(Number)
  return new Date(year, month - 1, day)
}

function fmtDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number)
  return new Date(y, m - 1, d)
}

// ─── Palette ───────────────────────────────────────────────────────────────
const C = {
  ink:        "FF0F172A",  // --ink-900
  violet:     "FF7C3AED",  // violet foncé
  violetLight:"FFF5F3FF",  // violet très clair
  violetMid:  "FFEDE9FE",  // violet clair
  rose:       "FFE11D48",  // rose foncé
  roseLight:  "FFFFF1F2",  // rose très clair
  roseMid:    "FFFECDD3",  // rose clair
  white:      "FFFFFFFF",
  cream:      "FFFAF9F7",
  grey:       "FFE2E8F0",
  greyText:   "FF64748B",
}

function sectionHeader(
  ws: ExcelJS.Worksheet,
  label: string,
  bgColor: string,
  colCount: number,
): ExcelJS.Row {
  const row = ws.addRow([label])
  ws.mergeCells(row.number, 1, row.number, colCount)
  const cell = row.getCell(1)
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } }
  cell.font = { bold: true, size: 11, color: { argb: C.white } }
  cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 }
  row.height = 26
  return row
}

function colHeader(ws: ExcelJS.Worksheet, labels: string[], bgColor: string): ExcelJS.Row {
  const row = ws.addRow(labels)
  row.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } }
    cell.font = { bold: true, size: 10, color: { argb: C.white } }
    cell.alignment = { vertical: "middle", horizontal: "center" }
    cell.border = {
      top: { style: "thin", color: { argb: C.grey } },
      bottom: { style: "thin", color: { argb: C.grey } },
      left: { style: "thin", color: { argb: C.grey } },
      right: { style: "thin", color: { argb: C.grey } },
    }
  })
  row.height = 22
  return row
}

function dataRow(
  ws: ExcelJS.Worksheet,
  values: (string | number | Date | null)[],
  evenRow: boolean,
  lightColor: string,
  amountCol: number,
): ExcelJS.Row {
  const row = ws.addRow(values)
  const bg = evenRow ? lightColor : C.white
  row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bg } }
    cell.font = { size: 10, color: { argb: C.ink } }
    cell.border = {
      top: { style: "thin", color: { argb: C.grey } },
      bottom: { style: "thin", color: { argb: C.grey } },
      left: { style: "thin", color: { argb: C.grey } },
      right: { style: "thin", color: { argb: C.grey } },
    }
    cell.alignment = { vertical: "middle" }
    if (colNumber === amountCol) {
      cell.alignment = { vertical: "middle", horizontal: "right" }
    }
  })
  row.height = 20
  return row
}

function totalRow(
  ws: ExcelJS.Worksheet,
  label: string,
  total: number,
  colCount: number,
  amountCol: number,
  bgColor: string,
): ExcelJS.Row {
  const values = Array(colCount).fill(null)
  values[0] = label
  values[amountCol - 1] = total
  const row = ws.addRow(values)
  ws.mergeCells(row.number, 1, row.number, amountCol - 1)
  row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } }
    cell.font = { bold: true, size: 10, color: { argb: C.ink } }
    cell.border = {
      top: { style: "medium", color: { argb: bgColor } },
      bottom: { style: "medium", color: { argb: bgColor } },
      left: { style: "thin", color: { argb: C.grey } },
      right: { style: "thin", color: { argb: C.grey } },
    }
    cell.alignment = { vertical: "middle", horizontal: colNumber === amountCol ? "right" : "left", indent: 1 }
    if (colNumber === amountCol) {
      cell.numFmt = '#,##0.00 "€"'
    }
  })
  row.height = 24
  return row
}

export async function GET(req: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: profile } = await supabase
    .from("profiles").select("*").eq("id", user.id).single()

  if (!profile) return NextResponse.json({ error: "Profil introuvable" }, { status: 404 })

  const isPremium = profile.plan === "premium" || !!profile.founder_number
  if (!isPremium) return NextResponse.json({ error: "Premium requis" }, { status: 403 })

  const frequency = profile.declaration_frequency === "quarterly" ? "quarterly" : "monthly"
  const dateParam = searchParams.get("date")
  const baseDate = dateParam ? parseLocalDate(dateParam) : new Date()
  const period = getPeriodRange(frequency, baseDate)

  // ── Data ──────────────────────────────────────────────────────────────────
  const { data: revenues } = await supabase
    .from("revenues").select("*").eq("user_id", user.id)
    .gte("date", period.start).lte("date", period.end)
    .order("date", { ascending: true })

  const { data: allExpenses } = await supabase
    .from("expenses").select("*").eq("user_id", user.id)
    .order("date", { ascending: true })

  const expenses = (allExpenses || []).filter((exp) =>
    exp.type === "one_time"
      ? exp.date >= period.start && exp.date <= period.end
      : exp.type === "recurring" && exp.active
  )

  const totalRevenues = (revenues || []).reduce((s, r) => s + Number(r.amount), 0)
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0)

  // ── Workbook ──────────────────────────────────────────────────────────────
  const workbook = new ExcelJS.Workbook()
  workbook.creator = "Keskireste"
  workbook.created = new Date()

  const ws = workbook.addWorksheet("Livre comptable", {
    pageSetup: { paperSize: 9, orientation: "landscape", fitToPage: true, fitToWidth: 1 },
  })

  // Column widths (6 colonnes)
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

  // ── En-tête document ──────────────────────────────────────────────────────
  ws.addRow([]) // spacer

  // Titre principal (row 2)
  {
    const r = ws.addRow(["LIVRE COMPTABLE · Auto-entrepreneur"])
    ws.mergeCells(r.number, 1, r.number, COL_COUNT)
    const cell = r.getCell(1)
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.ink } }
    cell.font = { bold: true, size: 14, color: { argb: C.white } }
    cell.alignment = { vertical: "middle", horizontal: "center" }
    r.height = 32
  }

  // Infos (row 3)
  {
    const companyName = profile.company_name || profile.first_name || user.email || ""
    const r = ws.addRow([`Nom / Entreprise : ${companyName}`, "", "", `Période : ${period.label}`, "", `Généré le : ${new Date().toLocaleDateString("fr-FR")}`])
    ws.mergeCells(r.number, 1, r.number, 3)
    ws.mergeCells(r.number, 4, r.number, 5)
    r.eachCell({ includeEmpty: true }, (cell) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.grey } }
      cell.font = { size: 10, color: { argb: C.greyText } }
      cell.alignment = { vertical: "middle", indent: 1 }
    })
    r.height = 20
  }

  ws.addRow([]) // spacer

  // ── Section RECETTES ──────────────────────────────────────────────────────
  sectionHeader(ws, "LIVRE DES RECETTES  —  Encaissements de la période", C.violet, COL_COUNT)
  colHeader(ws, ["N°", "Date", "Client", "Nature de la prestation", "Mode de règlement", "Montant"], C.violet)

  if ((revenues || []).length === 0) {
    const r = ws.addRow([null, null, "Aucun encaissement sur cette période.", null, null, null])
    ws.mergeCells(r.number, 3, r.number, COL_COUNT)
    r.getCell(3).font = { italic: true, color: { argb: C.greyText }, size: 10 }
    r.getCell(3).alignment = { vertical: "middle", indent: 1 }
    r.height = 20
  } else {
    ;(revenues || []).forEach((rev, i) => {
      const row = dataRow(
        ws,
        [
          i + 1,
          fmtDate(rev.date),
          rev.client_name || "",
          rev.label || "Prestation de service",
          rev.payment_method || "",
          Number(rev.amount),
        ],
        i % 2 === 1,
        C.violetLight,
        AMOUNT_COL,
      )
      // Format date & amount
      row.getCell(2).numFmt = "dd/mm/yyyy"
      row.getCell(2).alignment = { vertical: "middle", horizontal: "center" }
      row.getCell(1).alignment = { vertical: "middle", horizontal: "center" }
      row.getCell(6).numFmt = '#,##0.00 "€"'
    })
  }

  totalRow(ws, "TOTAL RECETTES", totalRevenues, COL_COUNT, AMOUNT_COL, C.violetMid)

  ws.addRow([]) // spacer

  // ── Section DÉPENSES ──────────────────────────────────────────────────────
  sectionHeader(ws, "REGISTRE DES ACHATS  —  Dépenses de la période", C.rose, COL_COUNT)
  colHeader(ws, ["N°", "Date", "Fournisseur", "Nature de l'achat", "Mode de règlement", "Montant"], C.rose)

  if (expenses.length === 0) {
    const r = ws.addRow([null, null, "Aucune dépense sur cette période.", null, null, null])
    ws.mergeCells(r.number, 3, r.number, COL_COUNT)
    r.getCell(3).font = { italic: true, color: { argb: C.greyText }, size: 10 }
    r.getCell(3).alignment = { vertical: "middle", indent: 1 }
    r.height = 20
  } else {
    expenses.forEach((exp, i) => {
      const row = dataRow(
        ws,
        [
          i + 1,
          exp.date ? fmtDate(exp.date) : null,
          exp.supplier_name || "",
          exp.label || "Achat",
          exp.payment_method || "",
          Number(exp.amount),
        ],
        i % 2 === 1,
        C.roseLight,
        AMOUNT_COL,
      )
      row.getCell(2).numFmt = "dd/mm/yyyy"
      row.getCell(2).alignment = { vertical: "middle", horizontal: "center" }
      row.getCell(1).alignment = { vertical: "middle", horizontal: "center" }
      row.getCell(6).numFmt = '#,##0.00 "€"'
    })
  }

  totalRow(ws, "TOTAL DÉPENSES", totalExpenses, COL_COUNT, AMOUNT_COL, C.roseMid)

  ws.addRow([]) // spacer

  // ── Récap ─────────────────────────────────────────────────────────────────
  {
    const netLabel = "RÉSULTAT NET PÉRIODE (Recettes − Dépenses)"
    const net = totalRevenues - totalExpenses
    const r = ws.addRow([netLabel, null, null, null, null, net])
    ws.mergeCells(r.number, 1, r.number, AMOUNT_COL - 1)
    r.eachCell({ includeEmpty: true }, (cell, col) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.ink } }
      cell.font = { bold: true, size: 11, color: { argb: net >= 0 ? "FF84CC16" : "FFFB7185" } }
      cell.border = {
        top: { style: "medium", color: { argb: C.ink } },
        bottom: { style: "medium", color: { argb: C.ink } },
        left: { style: "thin", color: { argb: C.ink } },
        right: { style: "thin", color: { argb: C.ink } },
      }
      cell.alignment = { vertical: "middle", horizontal: col === AMOUNT_COL ? "right" : "left", indent: 1 }
      if (col === AMOUNT_COL) cell.numFmt = '#,##0.00 "€"'
    })
    r.height = 28
  }

  ws.addRow([]) // bottom spacer

  // ── Note légale ───────────────────────────────────────────────────────────
  {
    const r = ws.addRow(["Document généré par Keskireste · Tenu conformément à l'article 50-0 du CGI et aux obligations du régime micro-entreprise."])
    ws.mergeCells(r.number, 1, r.number, COL_COUNT)
    r.getCell(1).font = { italic: true, size: 8, color: { argb: C.greyText } }
    r.getCell(1).alignment = { horizontal: "center" }
  }

  // ── Buffer ────────────────────────────────────────────────────────────────
  const buffer = await workbook.xlsx.writeBuffer()

  const filename = `keskireste-${period.label.replace(/\s/g, "-")}.xlsx`

  return new NextResponse(buffer as ArrayBuffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}
