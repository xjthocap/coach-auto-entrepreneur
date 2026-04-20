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
      className="rounded-2xl border border-blue-200 bg-[#edf3ff] px-4 py-2 font-medium text-[#3f6fe9] transition hover:bg-[#e3ecff]"
    >
      Supprimer
    </button>
  )
}