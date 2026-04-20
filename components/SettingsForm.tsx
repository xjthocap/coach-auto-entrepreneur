"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

type Profile = {
  id: string
  activity_type: "vente" | "service" | "liberal"
  acre: boolean
  versement_liberatoire: boolean
  declaration_frequency: "monthly" | "quarterly"
}

export default function SettingsForm({ profile }: { profile: Profile }) {
  const supabase = createClient()
  const router = useRouter()

  const [activityType, setActivityType] = useState(profile.activity_type)
  const [acre, setAcre] = useState(profile.acre)
  const [versement, setVersement] = useState(profile.versement_liberatoire)
  const [declarationFrequency, setDeclarationFrequency] = useState(
    profile.declaration_frequency || "monthly"
  )
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  async function handleSave() {
    setLoading(true)
    setMessage("")

    const { error } = await supabase
      .from("profiles")
      .update({
        activity_type: activityType,
        acre,
        versement_liberatoire: versement,
        declaration_frequency: declarationFrequency,
      })
      .eq("id", profile.id)

    if (error) {
      setMessage("Erreur lors de la sauvegarde")
      setLoading(false)
      return
    }

    setMessage("Profil mis à jour")
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="w-full">
        <label className="mb-2 block text-sm font-medium text-slate-600">
          Type d’activité
        </label>

        <select
          value={activityType}
          onChange={(e) =>
            setActivityType(e.target.value as "vente" | "service" | "liberal")
          }
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
        >
          <option value="vente">Vente</option>
          <option value="service">Service</option>
          <option value="liberal">Libéral</option>
        </select>
      </div>

      <div className="w-full">
        <label className="mb-2 block text-sm font-medium text-slate-600">
          Périodicité de déclaration
        </label>

        <select
          value={declarationFrequency}
          onChange={(e) =>
            setDeclarationFrequency(
              e.target.value as "monthly" | "quarterly"
            )
          }
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
        >
          <option value="monthly">Mensuelle</option>
          <option value="quarterly">Trimestrielle</option>
        </select>
      </div>

      <label className="flex items-center gap-3 rounded-2xl bg-[#f8f9fd] px-4 py-4 transition hover:bg-[#f1f3f9]">
        <input
          type="checkbox"
          checked={acre}
          onChange={() => setAcre(!acre)}
          className="h-4 w-4 accent-blue-500"
        />
        <span className="font-medium text-slate-700">ACRE</span>
      </label>

      <label className="flex items-center gap-3 rounded-2xl bg-[#f8f9fd] px-4 py-4 transition hover:bg-[#f1f3f9]">
        <input
          type="checkbox"
          checked={versement}
          onChange={() => setVersement(!versement)}
          className="h-4 w-4 accent-blue-500"
        />
        <span className="font-medium text-slate-700">
          Versement libératoire
        </span>
      </label>

      <button
        onClick={handleSave}
        style={{ cursor: "pointer" }}
        className="w-full rounded-2xl bg-[#4f7df3] px-5 py-3 font-semibold text-white shadow-[0_10px_20px_rgba(79,125,243,0.25)] transition hover:bg-[#3e6eea]"
      >
        {loading ? "Sauvegarde..." : "Enregistrer"}
      </button>

      {message && (
        <p className="rounded-2xl bg-[#f8f9fd] px-4 py-3 text-sm text-slate-600">
          {message}
        </p>
      )}
    </div>
  )
}