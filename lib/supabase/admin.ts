import { createClient, SupabaseClient } from "@supabase/supabase-js"

let _admin: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
  if (!_admin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      throw new Error("Supabase admin env vars not configured")
    }
    _admin = createClient(url, key)
  }
  return _admin
}

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const instance = getSupabaseAdmin()
    const value = (instance as unknown as Record<string, unknown>)[prop as string]
    return typeof value === "function" ? (value as Function).bind(instance) : value
  },
})
