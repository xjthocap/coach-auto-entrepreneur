import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getSupabaseAdmin } from "@/lib/supabase/admin"

export async function DELETE() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const admin = getSupabaseAdmin()

  // 1. Supprimer toutes les données utilisateur (dans l'ordre des FK)
  await admin.from("invoices").delete().eq("user_id", user.id)
  await admin.from("revenues").delete().eq("user_id", user.id)
  await admin.from("expenses").delete().eq("user_id", user.id)
  await admin.from("profiles").delete().eq("id", user.id)

  // 2. Supprimer le compte auth
  const { error } = await admin.auth.admin.deleteUser(user.id)
  if (error) {
    console.error("[delete account]", error.message)
    return NextResponse.json({ error: "Erreur lors de la suppression du compte" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
