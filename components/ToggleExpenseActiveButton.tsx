"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

type Props = {
  expenseId: string
  active: boolean
}

export default function ToggleExpenseActiveButton({
  expenseId,
  active,
}: Props) {
  const supabase = createClient()
  const router = useRouter()

  async function handleToggle() {
    const { error } = await supabase
      .from("expenses")
      .update({ active: !active })
      .eq("id", expenseId)

    if (error) {
      console.error("Erreur mise à jour dépense :", error.message)
      return
    }

    router.refresh()
  }

  return (
    <button
      onClick={handleToggle}
      style={{ cursor: "pointer" }}
      className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
    >
      {active ? "Désactiver" : "Réactiver"}
    </button>
  )
}