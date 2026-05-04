import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/invoices/next-number
 *
 * Retourne le prochain numéro de facture au format F-YYYY-XXXXX.
 * La séquence est par utilisateur et repart à 00001 chaque année.
 */
export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const year = new Date().getFullYear()
  const prefix = `F-${year}-`

  // Cherche le dernier numéro de l'année pour cet utilisateur
  const { data } = await supabase
    .from("invoices")
    .select("invoice_number")
    .eq("user_id", user.id)
    .like("invoice_number", `${prefix}%`)
    .order("invoice_number", { ascending: false })
    .limit(1)
    .maybeSingle()

  let seq = 1
  if (data?.invoice_number) {
    // "F-2026-00042" → ["F", "2026", "00042"] → 42
    const parts = (data.invoice_number as string).split("-")
    const lastSeq = parseInt(parts[parts.length - 1], 10)
    if (!isNaN(lastSeq)) seq = lastSeq + 1
  }

  const invoiceNumber = `${prefix}${String(seq).padStart(5, "0")}`
  return NextResponse.json({ invoiceNumber })
}
