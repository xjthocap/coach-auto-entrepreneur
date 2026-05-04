import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * Calcule le prochain numéro de facture F-YYYY-XXXXX pour un utilisateur donné.
 * Séquence par utilisateur, repart à 00001 chaque année.
 */
async function nextInvoiceNumber(supabase: SupabaseClient, userId: string): Promise<string> {
  const year = new Date().getFullYear()
  const prefix = `F-${year}-`

  const { data } = await supabase
    .from("invoices")
    .select("invoice_number")
    .eq("user_id", userId)
    .like("invoice_number", `${prefix}%`)
    .order("invoice_number", { ascending: false })
    .limit(1)
    .maybeSingle()

  let seq = 1
  if (data?.invoice_number) {
    const parts = (data.invoice_number as string).split("-")
    const lastSeq = parseInt(parts[parts.length - 1], 10)
    if (!isNaN(lastSeq)) seq = lastSeq + 1
  }

  return `${prefix}${String(seq).padStart(5, "0")}`
}

export async function POST(req: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Vérifier que l'utilisateur est premium (la création de facture est une feature premium)
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single()

  if (profile?.plan !== "premium") {
    return NextResponse.json({ error: "Premium requis" }, { status: 403 })
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

  const invoiceNumber = await nextInvoiceNumber(supabase, user.id)

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
