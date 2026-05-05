"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

export default function DeleteRevenueButton({ revenueId }: { revenueId: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm("Supprimer ce revenu ?")) return
    setLoading(true)
    const { error } = await supabase.from("revenues").delete().eq("id", revenueId)
    if (error) { console.error(error.message); setLoading(false); return }
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      title="Supprimer"
      className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:opacity-70 disabled:opacity-30"
      style={{ color: "var(--ink-300)" }}
    >
      {loading ? (
        <span className="text-xs">…</span>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
      )}
    </button>
  )
}
