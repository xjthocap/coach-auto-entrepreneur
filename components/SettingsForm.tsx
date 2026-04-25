"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

type Profile = {
  id: string
  first_name: string | null
  activity_type: "vente" | "service" | "liberal"
  acre: boolean
  versement_liberatoire: boolean
  declaration_frequency: "monthly" | "quarterly"
  company_name?: string | null
  address?: string | null
  postal_city?: string | null
  phone?: string | null
  siret?: string | null
  bank_holder?: string | null
  iban?: string | null
  bic?: string | null
}

export default function SettingsForm({ profile }: { profile: Profile }) {
  const supabase = createClient()
  const router = useRouter()

  const [firstName, setFirstName] = useState(profile?.first_name || "")
  const [activityType, setActivityType] = useState(profile?.activity_type || "service")
  const [acre, setAcre] = useState(profile?.acre || false)
  const [versement, setVersement] = useState(profile?.versement_liberatoire || false)
  const [declarationFrequency, setDeclarationFrequency] = useState<"monthly" | "quarterly">(
    profile?.declaration_frequency || "monthly"
  )

  const [companyName, setCompanyName] = useState(profile?.company_name || "")
  const [address, setAddress] = useState(profile?.address || "")
  const [postalCity, setPostalCity] = useState(profile?.postal_city || "")
  const [phone, setPhone] = useState(profile?.phone || "")
  const [siret, setSiret] = useState(profile?.siret || "")
  const [bankHolder, setBankHolder] = useState(profile?.bank_holder || "")
  const [iban, setIban] = useState(profile?.iban || "")
  const [bic, setBic] = useState(profile?.bic || "")

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  async function handleSave() {
    setLoading(true)
    setMessage("")

    const { error } = await supabase
      .from("profiles")
      .update({
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
      .eq("id", profile.id)

    if (error) {
      console.error("Erreur settings :", error.message)
      setMessage("Erreur lors de la sauvegarde")
      setLoading(false)
      return
    }

    setMessage("Profil mis à jour ✅")
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Informations principales
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Ces informations servent au dashboard et aux calculs.
        </p>
      </div>

      <input
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="Prénom"
        className="w-full rounded-2xl border border-slate-200 bg-[#f8f9fd] px-4 py-3 text-slate-900 outline-none transition focus:border-blue-300"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <select
          value={activityType}
          onChange={(e) =>
            setActivityType(e.target.value as "vente" | "service" | "liberal")
          }
          className="w-full rounded-2xl border border-slate-200 bg-[#f8f9fd] px-4 py-3 text-slate-900 outline-none transition focus:border-blue-300"
        >
          <option value="vente">Vente</option>
          <option value="service">Service</option>
          <option value="liberal">Libéral</option>
        </select>

        <select
          value={declarationFrequency}
          onChange={(e) =>
            setDeclarationFrequency(e.target.value as "monthly" | "quarterly")
          }
          className="w-full rounded-2xl border border-slate-200 bg-[#f8f9fd] px-4 py-3 text-slate-900 outline-none transition focus:border-blue-300"
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
        <span className="font-medium text-slate-700">Versement libératoire</span>
      </label>

      <div className="border-t border-slate-200 pt-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Informations de facturation
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Ces informations apparaîtront sur tes factures PDF.
        </p>
      </div>

      <input
        type="text"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        placeholder="Nom entreprise"
        className="w-full rounded-2xl border border-slate-200 bg-[#f8f9fd] px-4 py-3 text-slate-900 outline-none transition focus:border-blue-300"
      />

      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Adresse"
        className="w-full rounded-2xl border border-slate-200 bg-[#f8f9fd] px-4 py-3 text-slate-900 outline-none transition focus:border-blue-300"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <input
          type="text"
          value={postalCity}
          onChange={(e) => setPostalCity(e.target.value)}
          placeholder="Code postal + ville"
          className="w-full rounded-2xl border border-slate-200 bg-[#f8f9fd] px-4 py-3 text-slate-900 outline-none transition focus:border-blue-300"
        />

        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Téléphone"
          className="w-full rounded-2xl border border-slate-200 bg-[#f8f9fd] px-4 py-3 text-slate-900 outline-none transition focus:border-blue-300"
        />
      </div>

      <input
        type="text"
        value={siret}
        onChange={(e) => setSiret(e.target.value)}
        placeholder="SIRET"
        className="w-full rounded-2xl border border-slate-200 bg-[#f8f9fd] px-4 py-3 text-slate-900 outline-none transition focus:border-blue-300"
      />

      <div className="border-t border-slate-200 pt-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Informations bancaires
        </h3>
      </div>

      <input
        type="text"
        value={bankHolder}
        onChange={(e) => setBankHolder(e.target.value)}
        placeholder="Titulaire du compte"
        className="w-full rounded-2xl border border-slate-200 bg-[#f8f9fd] px-4 py-3 text-slate-900 outline-none transition focus:border-blue-300"
      />

      <input
        type="text"
        value={iban}
        onChange={(e) => setIban(e.target.value)}
        placeholder="IBAN"
        className="w-full rounded-2xl border border-slate-200 bg-[#f8f9fd] px-4 py-3 text-slate-900 outline-none transition focus:border-blue-300"
      />

      <input
        type="text"
        value={bic}
        onChange={(e) => setBic(e.target.value)}
        placeholder="BIC"
        className="w-full rounded-2xl border border-slate-200 bg-[#f8f9fd] px-4 py-3 text-slate-900 outline-none transition focus:border-blue-300"
      />

      <button
        onClick={handleSave}
        disabled={loading}
        style={{ cursor: "pointer" }}
        className="w-full rounded-2xl bg-[#4f7df3] px-5 py-3 font-semibold text-white shadow-[0_10px_20px_rgba(79,125,243,0.25)] transition hover:bg-[#3e6eea] disabled:opacity-50"
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