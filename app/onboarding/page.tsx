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
  const [declarationFrequency, setDeclarationFrequency] = useState<
    "monthly" | "quarterly"
  >("monthly")

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
      declaration_frequency: declarationFrequency,
    })

    router.push("/dashboard")
  }

  return (
    <main className="min-h-screen bg-[#f5f6fb] px-4 py-6 text-slate-800 md:px-8 md:py-8">
      <div className="mx-auto flex min-h-screen max-w-4xl items-center">
        <div className="w-full rounded-[32px] border border-white/80 bg-white/80 p-8 shadow-[0_20px_40px_rgba(15,23,42,0.06)]">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
            Configure ton profil
          </h1>
          <p className="mt-3 text-slate-500">
            Ces informations serviront à calculer tes charges, ton impôt et ta période de déclaration.
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Type d’activité
              </label>

              <select
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-[#f8f9fd] px-4 py-3 text-slate-900 outline-none transition focus:border-blue-300"
              >
                <option value="service">Service</option>
                <option value="vente">Vente</option>
                <option value="liberal">Libéral</option>
              </select>
            </div>

            <div>
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
                className="w-full rounded-2xl border border-slate-200 bg-[#f8f9fd] px-4 py-3 text-slate-900 outline-none transition focus:border-blue-300"
              >
                <option value="monthly">Mensuelle</option>
                <option value="quarterly">Trimestrielle</option>
              </select>
            </div>

            <label className="flex items-center gap-3 rounded-2xl bg-[#f8f9fd] px-4 py-4">
              <input
                type="checkbox"
                checked={acre}
                onChange={() => setAcre(!acre)}
                className="h-4 w-4"
              />
              <span className="font-medium text-slate-700">ACRE</span>
            </label>

            <label className="flex items-center gap-3 rounded-2xl bg-[#f8f9fd] px-4 py-4">
              <input
                type="checkbox"
                checked={versement}
                onChange={() => setVersement(!versement)}
                className="h-4 w-4"
              />
              <span className="font-medium text-slate-700">
                Versement libératoire
              </span>
            </label>

            <button
              onClick={handleSubmit}
              style={{ cursor: "pointer" }}
              className="rounded-2xl bg-[#4f7df3] px-5 py-3 font-semibold text-white shadow-[0_10px_20px_rgba(79,125,243,0.25)] transition hover:bg-[#3e6eea]"
            >
              Continuer
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}