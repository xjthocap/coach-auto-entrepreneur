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

  // ── Logo (optionnel) ──────────────────────────────────────────────────────
  // Protection SSRF : on n'autorise que les URLs du bucket Supabase Storage de ce projet
  const ALLOWED_LOGO_PREFIX = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Logos/`

  type EmbeddedImage = Awaited<ReturnType<typeof pdfDoc.embedPng>>
  let logoImage: EmbeddedImage | null = null
  const rawLogoUrl = (profile as { logo_url?: string | null })?.logo_url
  if (rawLogoUrl && rawLogoUrl.startsWith(ALLOWED_LOGO_PREFIX)) {
    try {
      // Nettoyer l'URL (enlever cache-bust si présent)
      const cleanUrl = rawLogoUrl.split("?")[0]
      const logoRes = await fetch(cleanUrl)
      if (logoRes.ok) {
        const logoBytes = await logoRes.arrayBuffer()
        const ct = logoRes.headers.get("content-type") ?? ""
        if (ct.includes("png") || ct.includes("svg") || cleanUrl.endsWith(".png")) {
          logoImage = await pdfDoc.embedPng(logoBytes)
        } else if (ct.includes("jpg") || ct.includes("jpeg") || cleanUrl.endsWith(".jpg") || cleanUrl.endsWith(".jpeg")) {
          logoImage = await pdfDoc.embedJpg(logoBytes)
        } else {
          // WebP — essayer en PNG, échoue silencieusement
          try { logoImage = await pdfDoc.embedPng(logoBytes) } catch { /* ignore */ }
        }
      }
    } catch {
      // Logo non disponible → on continue sans
    }
  }

  type InvoiceItem = {
    description?: string
    quantity?: number | string
    unit_price?: number | string
    total?: number | string
  }

  const rawItems: InvoiceItem[] = Array.isArray(invoice.items) ? invoice.items : []

  const invoiceItems: InvoiceItem[] =
    rawItems.length > 0
      ? rawItems
      : [
          {
            description: invoice.description || "Prestation",
            quantity: 1,
            unit_price: Number(invoice.amount || 0),
            total: Number(invoice.amount || 0),
          },
        ]

  const amountHT = invoiceItems.reduce((sum: number, item: InvoiceItem) => {
    const quantity = Number(item.quantity || 0)
    const unitPrice = Number(item.unit_price || 0)
    const total = Number(item.total || quantity * unitPrice)

    return sum + total
  }, 0)

  const isVatApplicable = profile?.vat_applicable === true
  const vatRate = Number(profile?.vat_rate || 20)
  const vatAmount = isVatApplicable ? amountHT * (vatRate / 100) : 0
  const amountTTC = amountHT + vatAmount

  const issuerName =
    profile?.company_name ||
    profile?.first_name ||
    user.email ||
    "Auto-entrepreneur"

  const invoiceNumber = safe(invoice.invoice_number)
  const invoiceDate = safe(invoice.issued_at)

  if (logoImage) {
    // ── Logo image ──────────────────────────────────────────────────────────
    const logoMaxW = 120
    const logoMaxH = 48
    const { width: imgW, height: imgH } = logoImage.size()
    const scale = Math.min(logoMaxW / imgW, logoMaxH / imgH, 1)
    const drawW = imgW * scale
    const drawH = imgH * scale
    // Centrer verticalement dans la zone header (y ≈ 765..799)
    const logoY = 765 + (logoMaxH - drawH) / 2

    page.drawImage(logoImage, {
      x: 50,
      y: logoY,
      width: drawW,
      height: drawH,
    })

    // Nom entreprise à droite du logo
    page.drawText(issuerName, {
      x: 50 + drawW + 12,
      y: 784,
      size: 18,
      font: bold,
      color: black,
    })
  } else {
    // ── Fallback : carré violet + "K" ────────────────────────────────────────
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
  }

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

  page.drawText(`${invoiceDate}`, {
    x: 445,
    y: 758,
    size: 11,
    font,
    color: black,
  })

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

  page.drawText("Prix HT", {
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

  let rowY = tableTop - 38

  invoiceItems.forEach((item) => {
    const description = safe(item.description)
    const quantity = Number(item.quantity || 0)
    const unitPrice = Number(item.unit_price || 0)
    const total = Number(item.total || quantity * unitPrice)

    page.drawText(description, {
      x: 50,
      y: rowY,
      size: 10,
      font,
      color: black,
      maxWidth: 190,
    })

    page.drawText(String(quantity), {
      x: 270,
      y: rowY,
      size: 10,
      font,
      color: black,
    })

    page.drawText(money(unitPrice), {
      x: 380,
      y: rowY,
      size: 10,
      font,
      color: black,
    })

    page.drawText(money(total), {
      x: 500,
      y: rowY,
      size: 10,
      font: bold,
      color: black,
    })

    rowY -= 24
  })

  const tableBottomY = rowY - 30

  page.drawLine({
    start: { x: 50, y: tableBottomY },
    end: { x: 545, y: tableBottomY },
    thickness: 1,
    color: line,
  })

  const totalX = 380
  const valueX = 510
  const totalY = tableBottomY - 45

  page.drawText("Total HT", {
    x: totalX,
    y: totalY,
    size: 10,
    font: bold,
    color: black,
  })

  page.drawText(money(amountHT), {
    x: valueX,
    y: totalY,
    size: 10,
    font,
    color: black,
  })

  page.drawText(`TVA ${isVatApplicable ? `${vatRate}%` : "0%"}`, {
    x: totalX,
    y: totalY - 22,
    size: 10,
    font: bold,
    color: black,
  })

  page.drawText(money(vatAmount), {
    x: valueX,
    y: totalY - 22,
    size: 10,
    font,
    color: black,
  })

  page.drawText("Total TTC", {
    x: totalX,
    y: totalY - 44,
    size: 10,
    font: bold,
    color: black,
  })

  page.drawText(money(amountTTC), {
    x: valueX,
    y: totalY - 44,
    size: 10,
    font: bold,
    color: black,
  })

  page.drawText("Net à payer", {
    x: totalX,
    y: totalY - 72,
    size: 10,
    font: bold,
    color: black,
  })

  page.drawText(money(amountTTC), {
    x: valueX,
    y: totalY - 72,
    size: 10,
    font: bold,
    color: black,
  })

  if (!isVatApplicable) {
    page.drawText("TVA non applicable, article 293B du Code Général des Impôts", {
      x: 50,
      y: 115,
      size: 9,
      font,
      color: gray,
    })
  }

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
      "Content-Disposition": `attachment; filename="F-${invoiceNumber}${profile?.company_name ? `-${profile.company_name.replace(/[^a-zA-Z0-9\-_.]/g, "_")}` : ''}.pdf"`,
    },
  })
}