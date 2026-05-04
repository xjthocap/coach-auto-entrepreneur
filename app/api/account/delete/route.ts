import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { stripe } from "@/lib/stripe"

export async function DELETE() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const admin = getSupabaseAdmin()

  // 0. Récupérer le stripe_customer_id avant suppression
  const { data: profile } = await admin
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single()

  // 1. Annuler les abonnements Stripe actifs (évite de continuer à facturer)
  if (profile?.stripe_customer_id) {
    try {
      const subs = await stripe.subscriptions.list({
        customer: profile.stripe_customer_id,
        status: "active",
      })
      for (const sub of subs.data) {
        await stripe.subscriptions.cancel(sub.id)
      }
    } catch (err) {
      console.error("[delete account] Erreur annulation Stripe :", err)
      // On continue même si Stripe échoue (ne pas bloquer la suppression)
    }
  }

  // 2. Supprimer toutes les données utilisateur (dans l'ordre des FK)
  await admin.from("invoices").delete().eq("user_id", user.id)
  await admin.from("revenues").delete().eq("user_id", user.id)
  await admin.from("expenses").delete().eq("user_id", user.id)
  await admin.from("profiles").delete().eq("id", user.id)

  // 3. Supprimer le compte auth
  const { error } = await admin.auth.admin.deleteUser(user.id)
  if (error) {
    console.error("[delete account]", error.message)
    return NextResponse.json({ error: "Erreur lors de la suppression du compte" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
