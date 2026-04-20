"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      style={{ cursor: "pointer"}}
      className="rounded-xl bg-white px-4 py-2 font-semibold text-black transition hover:bg-gray-200"
    >
      Se déconnecter
    </button>
  )
}