"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

export default function DeleteExpenseButton({
  expenseId,
}: {
  expenseId: string
}) {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    const confirmDelete = confirm("Supprimer cette dépense ?")

    if (!confirmDelete) return

    setLoading(true)

    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", expenseId)

    if (error) {
      console.error("Erreur suppression :", error.message)
      setLoading(false)
      return
    }

    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="rounded-xl border border-red-200 bg-red-50 px-3 py-1 text-sm text-red-600 transition hover:bg-red-100 disabled:opacity-50"
      style={{ cursor: "pointer" }}
    >
      {loading ? "..." : "Supprimer"}
    </button>
  )
}