"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function OnboardingPage() {
  const supabase = createClient()
  const router = useRouter()

  const [firstName, setFirstName] = useState("")
  const [activityType, setActivityType] = useState("service")
  const [acre, setAcre] = useState(false)
  const [versement, setVersement] = useState(false)
  const [declarationFrequency, setDeclarationFrequency] = useState<
    "monthly" | "quarterly"
  >("monthly")

  const [companyName, setCompanyName] = useState("")
  const [address, setAddress] = useState("")
  const [postalCity, setPostalCity] = useState("")
  const [phone, setPhone] = useState("")
  const [siret, setSiret] = useState("")
  const [bankHolder, setBankHolder] = useState("")
  const [iban, setIban] = useState("")
  const [bic, setBic] = useState("")

  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setLoading(false)
      return
    }

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      first_name: firstName.trim(),
      activity_type: activityType,
      acre,
      versement_liberatoire: versement,
      declaration_frequency: declarationFrequency,
      company_name: companyName.trim(),
      address: address.trim(),
      postal_city: postalCity.trim(),
      phone: phone.trim(),
      siret: siret.trim(),
      bank_holder: bankHolder.trim(),
      iban: iban.trim(),
      bic: bic.trim(),
    })

    if (error) {
      console.error("Erreur onboarding :", error.message)
      setLoading(false)
      return
    }

    setLoading(false)
    router.push("/dashboard")
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-[#f7f8f4] text-[#0f172a]">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-2">
        <section className="flex flex-col justify-between px-6 py-8 md:px-10 lg:px-12 lg:py-10">
          <div>
            <Link href="/" className="inline-block">
              <div className="text-3xl font-extrabold tracking-tight text-slate-950">
                KeskiReste<span className="text-[#22c55e]">.</span>
              </div>
            </Link>

            <div className="mt-16 max-w-xl">
              <div className="inline-flex items-center rounded-full bg-[#dcfce7] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#15803d]">
                Personnalisation du profil
              </div>

              <h1 className="mt-6 text-5xl font-black leading-[0.98] tracking-tight text-slate-950 md:text-6xl">
                Configure ton
                <br />
                espace en quelques
                <br />
                clics.
              </h1>

              <p className="mt-6 text-lg leading-8 text-slate-600">
                Ces informations nous permettent d’adapter ton dashboard, tes
                calculs, tes factures et tes estimations à ton activité.
              </p>
            </div>
          </div>

          <div className="mt-10 hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:block">
            <p className="text-sm text-slate-500">Pourquoi ces infos ?</p>
            <p className="mt-3 text-base leading-7 text-slate-700">
              Ton type d’activité influence tes estimations. Tes informations
              d’entreprise servent à générer des factures propres et complètes.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-8 md:px-10 lg:px-12">
          <div className="w-full max-w-xl rounded-[36px] border border-slate-200 bg-white p-8 shadow-[0_20px_50px_rgba(15,23,42,0.08)] md:p-10">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#16a34a]">
                Configuration
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
                Ton profil
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-500 md:text-base">
                Renseigne quelques informations pour personnaliser ton tableau
                de bord et tes factures.
              </p>
            </div>

            <div className="space-y-5">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Prénom"
                className="w-full rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-3.5"
              />

              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Nom entreprise"
                className="w-full rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-3.5"
              />

              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Adresse"
                className="w-full rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-3.5"
              />

              <input
                type="text"
                value={postalCity}
                onChange={(e) => setPostalCity(e.target.value)}
                placeholder="Code postal + ville"
                className="w-full rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-3.5"
              />

              <div className="grid gap-3 md:grid-cols-2">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Téléphone"
                  className="w-full rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-3.5"
                />

                <input
                  type="text"
                  value={siret}
                  onChange={(e) => setSiret(e.target.value)}
                  placeholder="SIRET"
                  className="w-full rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-3.5"
                />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-4">
                <p className="mb-3 text-sm font-semibold text-slate-700">
                  Informations bancaires pour les factures
                </p>

                <div className="space-y-3">
                  <input
                    type="text"
                    value={bankHolder}
                    onChange={(e) => setBankHolder(e.target.value)}
                    placeholder="Titulaire du compte"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5"
                  />

                  <input
                    type="text"
                    value={iban}
                    onChange={(e) => setIban(e.target.value)}
                    placeholder="IBAN"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5"
                  />

                  <input
                    type="text"
                    value={bic}
                    onChange={(e) => setBic(e.target.value)}
                    placeholder="BIC"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5"
                  />
                </div>
              </div>

              <select
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-3.5"
              >
                <option value="service">Service</option>
                <option value="vente">Vente</option>
                <option value="liberal">Libéral</option>
              </select>

              <select
                value={declarationFrequency}
                onChange={(e) =>
                  setDeclarationFrequency(
                    e.target.value as "monthly" | "quarterly"
                  )
                }
                className="w-full rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-3.5"
              >
                <option value="monthly">Mensuelle</option>
                <option value="quarterly">Trimestrielle</option>
              </select>

              <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-4">
                <input
                  type="checkbox"
                  checked={acre}
                  onChange={() => setAcre(!acre)}
                  className="mt-1 h-4 w-4"
                />
                <div>
                  <p className="font-semibold text-slate-900">ACRE</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Active cette option si tu bénéficies de l’ACRE.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-4">
                <input
                  type="checkbox"
                  checked={versement}
                  onChange={() => setVersement(!versement)}
                  className="mt-1 h-4 w-4"
                />
                <div>
                  <p className="font-semibold text-slate-900">
                    Versement libératoire
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Active cette option si tu as choisi ce mode de paiement de
                    l’impôt.
                  </p>
                </div>
              </label>

              <button
                onClick={handleSubmit}
                disabled={loading}
                type="button"
                className="mt-3 w-full rounded-2xl bg-[#0f172a] px-5 py-3.5 font-semibold text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)] transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Enregistrement..." : "Continuer"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}