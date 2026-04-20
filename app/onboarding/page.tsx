"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function OnboardingPage() {
  const supabase = createClient()
  const router = useRouter()

  const [activityType, setActivityType] = useState("service")
  const [acre, setAcre] = useState(false)
  const [versement, setVersement] = useState(false)

  async function handleSubmit() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    await supabase.from("profiles").upsert({
      id: user.id,
      activity_type: activityType,
      acre,
      versement_liberatoire: versement,
    })

    router.push("/dashboard")
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold">Ton profil</h1>

        <div>
          <label>Type d’activité</label>
          <select
            value={activityType}
            onChange={(e) => setActivityType(e.target.value)}
            className="w-full mt-2 p-3 bg-black border border-white/20 rounded"
          >
            <option value="service">Service</option>
            <option value="vente">Vente</option>
            <option value="liberal">Libéral</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={acre}
            onChange={() => setAcre(!acre)}
          />
          <label>ACRE</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={versement}
            onChange={() => setVersement(!versement)}
          />
          <label>Versement libératoire</label>
        </div>

        <button
          onClick={handleSubmit}
          style={{ cursor: "pointer"}}
          className="w-full rounded-xl bg-white px-4 py-2 font-semibold text-black transition hover:bg-gray-200"
        >
          Continuer
        </button>
      </div>
    </main>
  )
}