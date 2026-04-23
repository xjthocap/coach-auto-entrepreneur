"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

type Props = {
  currentPlan: string | null
  profileId: string
}

export default function DevPlanSwitcher({ currentPlan, profileId }: Props) {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function setPlan(plan: "free" | "premium") {
    setLoading(true)

    const { error } = await supabase
      .from("profiles")
      .update({ plan })
      .eq("id", profileId)

    if (error) {
      console.error("Erreur plan:", error.message)
      setLoading(false)
      return
    }

    setLoading(false)
    router.refresh()
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-medium text-slate-700">
        Test plan actuel : <span className="font-semibold">{currentPlan || "free"}</span>
      </p>

      <div className="mt-3 flex gap-3">
        <button
          disabled={loading}
          onClick={() => setPlan("free")}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Passer en Free
        </button>

        <button
          disabled={loading}
          onClick={() => setPlan("premium")}
          className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-500 disabled:opacity-50"
        >
          Passer en Premium
        </button>
      </div>
    </div>
  )
}