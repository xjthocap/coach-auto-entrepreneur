import { NextResponse } from "next/server"
import ExcelJS from "exceljs"
import { createClient } from "@/lib/supabase/server"
import { getPeriodRange } from "@/lib/period"

function parseLocalDate(value: string) {
  const [year, month, day] = value.split("-").map(Number)
  return new Date(year, month - 1, day)
}

export async function GET(req: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!profile) {
    return NextResponse.json({ error: "Profil introuvable" }, { status: 404 })
  }

  if (profile.plan !== "premium") {
    return NextResponse.json({ error: "Premium requis" }, { status: 403 })
  }

  const frequency =
    profile.declaration_frequency === "quarterly" ? "quarterly" : "monthly"

  const dateParam = searchParams.get("date")
  const baseDate = dateParam ? parseLocalDate(dateParam) : new Date()
  const period = getPeriodRange(frequency, baseDate)

  // ===== DATA =====
  const { data: revenues } = await supabase
    .from("revenues")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", period.start)
    .lte("date", period.end)
    .order("date", { ascending: true })

  const { data: expenses } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: true })

  const periodExpenses =
    expenses?.filter((exp) => {
      if (exp.type === "one_time") {
        return exp.date >= period.start && exp.date <= period.end
      }
      return exp.type === "recurring" && exp.active
    }) || []

  // ===== EXCEL =====
  const workbook = new ExcelJS.Workbook()
  workbook.creator = "Keskireste"

  const recettes = workbook.addWorksheet("Livre des recettes")
  const achats = workbook.addWorksheet("Registre des achats")

  // ===== COLONNES (sans header pour éviter l'écrasement de la ligne 1) =====
  recettes.columns = [
    { key: "date", width: 16 },
    { key: "client", width: 26 },
    { key: "label", width: 32 },
    { key: "amount", width: 16 },
    { key: "payment", width: 20 },
    { key: "reference", width: 26 },
  ]

  achats.columns = [
    { key: "date", width: 16 },
    { key: "client", width: 26 },
    { key: "label", width: 32 },
    { key: "amount", width: 16 },
    { key: "payment", width: 20 },
    { key: "reference", width: 26 },
  ]

  // ===== LIGNES D'EN-TÊTE =====
  recettes.addRow(["Livre des recettes - Keskireste"])
  recettes.addRow([`Utilisateur : ${profile.first_name || ""}`])
  recettes.addRow([`Période : ${period.label}`])
  recettes.addRow([])

  achats.addRow(["Registre des achats - Keskireste"])
  achats.addRow([`Utilisateur : ${profile.first_name || ""}`])
  achats.addRow([`Période : ${period.label}`])
  achats.addRow([])

  // ===== LIGNE DE COLONNES (row 5) =====
  recettes.addRow(["Date", "Client", "Libellé", "Montant", "Paiement", "Référence"])
  achats.addRow(["Date", "Fournisseur", "Libellé", "Montant", "Paiement", "Référence"])

  // ===== DONNÉES (row 6+) =====
  recettes.addRows(
    (revenues || []).map((rev) => ({
      date: rev.date,
      client: rev.client_name || "",
      label: rev.label || "Revenu",
      amount: Number(rev.amount),
      payment: rev.payment_method || "",
      reference: rev.reference || "",
    }))
  )

  achats.addRows(
    periodExpenses.map((exp) => ({
      date: exp.date,
      client: exp.supplier_name || "",
      label: exp.label || "Dépense",
      amount: Number(exp.amount),
      payment: exp.payment_method || "",
      reference: exp.reference || "",
    }))
  )

  // ===== STYLE =====
  for (const sheet of [recettes, achats]) {
    const headerRowIndex = 5

    // Style ligne titre
    const titleRow = sheet.getRow(1)
    titleRow.font = { bold: true, size: 13 }

    // Style ligne colonnes
    const header = sheet.getRow(headerRowIndex)
    header.font = { bold: true, color: { argb: "FFFFFF" } }
    header.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "1E293B" },
    }

    sheet.getColumn("A").numFmt = "dd/mm/yyyy"
    sheet.getColumn("D").numFmt = '#,##0.00 "€"'

    sheet.eachRow((row, index) => {
      if (index >= headerRowIndex) {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          }

          if (index > headerRowIndex) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: {
                argb: index % 2 === 0 ? "F8FAFC" : "FFFFFF",
              },
            }
          }
        })
      }
    })

    sheet.views = [{ state: "frozen", ySplit: headerRowIndex }]
  }

  // ===== BUFFER =====
  const buffer = await workbook.xlsx.writeBuffer()

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="keskireste-${period.label}.xlsx"`,
    },
  })
}
