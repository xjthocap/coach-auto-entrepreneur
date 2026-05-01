import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

function generateInvoiceNumber() {
  const ts = Date.now()
  return `FAC-${new Date().getFullYear()}-${ts}`
}

export async function POST(req: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { revenueId } = body

  if (!revenueId) {
    return NextResponse.json({ error: "revenueId requis" }, { status: 400 })
  }

  // Vérifier que le revenu appartient à l'utilisateur
  const { data: revenue, error: revError } = await supabase
    .from("revenues")
    .select("*")
    .eq("id", revenueId)
    .eq("user_id", user.id)
    .single()

  if (revError || !revenue) {
    return NextResponse.json({ error: "Revenu introuvable" }, { status: 404 })
  }

  // Vérifier qu'il n'y a pas déjà une facture pour ce revenu
  const { data: existing } = await supabase
    .from("invoices")
    .select("id")
    .eq("revenue_id", revenueId)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ invoiceId: existing.id })
  }

  const invoiceNumber = generateInvoiceNumber()

  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .insert({
      user_id: user.id,
      revenue_id: revenueId,
      invoice_number: invoiceNumber,
      client_name: revenue.client_name || "",
      client_company: revenue.client_company || "",
      client_email: "",
      client_address: "",
      description: revenue.label || "Prestation",
      amount: Number(revenue.amount),
      items: [
        {
          description: revenue.label || "Prestation",
          quantity: 1,
          unit_price: Number(revenue.amount),
          total: Number(revenue.amount),
        },
      ],
      issued_at: revenue.date,
      due_at: null,
      status: "draft",
    })
    .select("id")
    .single()

  if (invoiceError || !invoice) {
    console.error("Erreur création facture :", invoiceError?.message)
    return NextResponse.json({ error: "Erreur création facture" }, { status: 500 })
  }

  return NextResponse.json({ invoiceId: invoice.id })
}
