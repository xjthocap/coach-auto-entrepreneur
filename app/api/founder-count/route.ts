import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Route publique — utilise le client anon (pas admin) pour ne pas exposer la clé service role
export async function GET() {
  const supabase = await createClient()

  const { count } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .not("founder_number", "is", null)

  return NextResponse.json({ count: count ?? 0 })
}
