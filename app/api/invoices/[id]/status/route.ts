import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const VALID = ["draft", "sent", "paid"] as const

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const { status } = await req.json()

  if (!VALID.includes(status)) return NextResponse.json({ error: "Statut invalide" }, { status: 400 })

  const { error } = await supabase
    .from("invoices")
    .update({ status })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
