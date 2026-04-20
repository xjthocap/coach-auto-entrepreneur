"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

type Props = {
  revenueId: string
}

export default function DeleteRevenueButton({ revenueId }: Props) {
  const router = useRouter()
  const supabase = createClient()

  async function handleDelete() {
    const { error } = await supabase
      .from("revenues")
      .delete()
      .eq("id", revenueId)

    if (error) {
      console.error("Erreur suppression revenu :", error.message)
      return
    }

    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      style={{ cursor: "pointer" }}
      className="rounded-lg border border-red-500/30 px-3 py-1 text-sm text-red-400 transition hover:bg-red-500/10"
    >
      Supprimer
    </button>
  )
}