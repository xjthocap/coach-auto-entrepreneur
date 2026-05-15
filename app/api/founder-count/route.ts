import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/admin"

// Route publique — jamais mise en cache pour que le compteur soit toujours frais
export const dynamic = "force-dynamic"

export async function GET() {
  const supabase = getSupabaseAdmin()

  const { count } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .not("founder_number", "is", null)

  return NextResponse.json(
    { count: count ?? 0 },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  )
}
