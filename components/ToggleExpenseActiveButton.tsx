"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

export default function ToggleExpenseActiveButton({ expenseId, active }: { expenseId: string; active: boolean }) {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    setLoading(true)
    const { error } = await supabase.from("expenses").update({ active: !active }).eq("id", expenseId)
    if (error) { console.error(error.message); setLoading(false); return }
    router.refresh()
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      title={active ? "Désactiver" : "Réactiver"}
      className="flex h-7 w-7 items-center justify-center rounded-lg transition hover:opacity-70 disabled:opacity-30"
      style={{ color: active ? "var(--lime-700)" : "var(--ink-300)" }}
    >
      {loading ? (
        <span className="text-xs">…</span>
      ) : active ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9"/><path d="M10 9v6M14 9v6"/>
        </svg>
      )}
    </button>
  )
}
