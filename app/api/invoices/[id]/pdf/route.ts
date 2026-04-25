import { NextResponse } from "next/server"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { createClient } from "@/lib/supabase/server"

function money(value: number) {
  return `${value.toFixed(2).replace(".", ",")} €`
}

function safe(value?: string | null) {
  return value && value.trim() ? value.trim() : "-"
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: invoice, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error || !invoice) {
    return NextResponse.json({ error: "Facture introuvable" }, { status: 404 })
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842])

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const black = rgb(0.05, 0.07, 0.12)
  const gray = rgb(0.35, 0.39, 0.46)
  const blue = rgb(0.2, 0.5, 0.9)
  const line = rgb(0.65, 0.68, 0.72)

  const amount = Number(invoice.amount || 0)

  const issuerName =
    profile?.company_name ||
    profile?.first_name ||
    user.email ||
    "Auto-entrepreneur"

  const invoiceNumber = safe(invoice.invoice_number)
  const invoiceDate = safe(invoice.issued_at)

  // Logo simple
  page.drawRectangle({
    x: 50,
    y: 765,
    width: 34,
    height: 34,
    color: blue,
  })

  page.drawText("K", {
    x: 61,
    y: 774,
    size: 22,
    font: bold,
    color: rgb(1, 1, 1),
  })

  page.drawText(issuerName, {
    x: 92,
    y: 784,
    size: 22,
    font: bold,
    color: blue,
  })

  page.drawText("Facture", {
    x: 430,
    y: 780,
    size: 12,
    font: bold,
    color: black,
  })

  page.drawText(`: ${invoiceNumber}`, {
    x: 478,
    y: 780,
    size: 12,
    font: bold,
    color: black,
  })

  page.drawText(`Fait le ${invoiceDate}`, {
    x: 445,
    y: 758,
    size: 11,
    font,
    color: black,
  })

  // Émetteur
  page.drawText(issuerName, {
    x: 50,
    y: 690,
    size: 12,
    font: bold,
    color: black,
  })

  page.drawText(safe(profile?.address), {
    x: 50,
    y: 670,
    size: 11,
    font,
    color: black,
  })

  page.drawText(safe(profile?.postal_city), {
    x: 50,
    y: 654,
    size: 11,
    font,
    color: black,
  })

  page.drawText(safe(user.email), {
    x: 50,
    y: 620,
    size: 11,
    font,
    color: black,
  })

  page.drawText(safe(profile?.phone), {
    x: 50,
    y: 604,
    size: 11,
    font,
    color: black,
  })

  page.drawText(`SIRET N° ${safe(profile?.siret)}`, {
    x: 50,
    y: 570,
    size: 11,
    font,
    color: gray,
  })

  // Client
  page.drawText("Le Client", {
    x: 360,
    y: 640,
    size: 10,
    font,
    color: gray,
  })

  page.drawText(`Nom : ${safe(invoice.client_name)}`, {
    x: 360,
    y: 622,
    size: 11,
    font: bold,
    color: black,
  })

  page.drawText(`Société : ${safe(invoice.client_company)}`, {
    x: 360,
    y: 606,
    size: 11,
    font: bold,
    color: black,
  })

  page.drawText(`Adresse : ${safe(invoice.client_address)}`, {
    x: 360,
    y: 590,
    size: 11,
    font: bold,
    color: black,
  })

  // Tableau
  const tableTop = 500

  page.drawText("Désignation", {
    x: 50,
    y: tableTop,
    size: 10,
    font,
    color: black,
  })

  page.drawText("Quantité", {
    x: 255,
    y: tableTop,
    size: 10,
    font,
    color: black,
  })

  page.drawText("Prix", {
    x: 385,
    y: tableTop,
    size: 10,
    font,
    color: black,
  })

  page.drawText("Total HT", {
    x: 500,
    y: tableTop,
    size: 10,
    font: bold,
    color: black,
  })

  page.drawLine({
    start: { x: 50, y: tableTop - 12 },
    end: { x: 545, y: tableTop - 12 },
    thickness: 1,
    color: line,
  })

  page.drawText(safe(invoice.description || "Prestation"), {
    x: 50,
    y: tableTop - 38,
    size: 10,
    font,
    color: black,
    maxWidth: 190,
  })

  page.drawText("1", {
    x: 270,
    y: tableTop - 38,
    size: 10,
    font,
    color: black,
  })

  page.drawText(money(amount), {
    x: 380,
    y: tableTop - 38,
    size: 10,
    font,
    color: black,
  })

  page.drawText(money(amount), {
    x: 500,
    y: tableTop - 38,
    size: 10,
    font: bold,
    color: black,
  })

  if (invoice.description_details) {
    page.drawText(invoice.description_details, {
      x: 50,
      y: tableTop - 72,
      size: 9,
      font,
      color: gray,
      maxWidth: 220,
    })
  }

  page.drawLine({
    start: { x: 50, y: tableTop - 115 },
    end: { x: 545, y: tableTop - 115 },
    thickness: 1,
    color: line,
  })

  // Totaux
  const totalX = 380
  const valueX = 510
  const totalY = tableTop - 160

  page.drawText("Total HT", {
    x: totalX,
    y: totalY,
    size: 10,
    font: bold,
    color: black,
  })

  page.drawText(money(amount), {
    x: valueX,
    y: totalY,
    size: 10,
    font,
    color: black,
  })

  page.drawText("TVA", {
    x: totalX,
    y: totalY - 22,
    size: 10,
    font: bold,
    color: black,
  })

  page.drawText("0,00 €", {
    x: valueX,
    y: totalY - 22,
    size: 10,
    font,
    color: black,
  })

  page.drawText("Net à payer", {
    x: totalX,
    y: totalY - 44,
    size: 10,
    font: bold,
    color: black,
  })

  page.drawText(money(amount), {
    x: valueX,
    y: totalY - 44,
    size: 10,
    font: bold,
    color: black,
  })

  page.drawText("Montant à payer", {
    x: totalX,
    y: totalY - 72,
    size: 10,
    font: bold,
    color: black,
  })

  page.drawText(money(amount), {
    x: valueX,
    y: totalY - 72,
    size: 10,
    font: bold,
    color: black,
  })

  // Footer légal
  page.drawText("TVA non applicable, article 293B du Code Général des Impôts", {
    x: 50,
    y: 115,
    size: 9,
    font,
    color: gray,
  })

  page.drawText("Détails bancaires :", {
    x: 50,
    y: 80,
    size: 10,
    font,
    color: black,
  })

  page.drawText(`Titulaire : ${safe(profile?.bank_holder || issuerName)}`, {
    x: 50,
    y: 58,
    size: 9,
    font,
    color: black,
  })

  page.drawText(`IBAN : ${safe(profile?.iban)}`, {
    x: 50,
    y: 40,
    size: 9,
    font,
    color: black,
  })

  page.drawText(`BIC : ${safe(profile?.bic)}`, {
    x: 50,
    y: 22,
    size: 9,
    font,
    color: black,
  })

  const pdfBytes = await pdfDoc.save()
    const pdfBuffer = Buffer.from(pdfBytes)

    return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="facture-${invoiceNumber}.pdf"`,
    },
  })
}