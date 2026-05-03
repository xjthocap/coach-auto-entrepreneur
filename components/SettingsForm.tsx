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
  vat_applicable?: boolean | null
  vat_rate?: number | null
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: "var(--r-sm)",
  border: "1px solid var(--cream-300)",
  background: "var(--cream-100)",
  color: "var(--ink-900)",
  padding: "11px 14px",
  outline: "none",
  fontSize: 14,
  transition: "border-color 0.15s",
}

const sectionTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--ink-400)",
  marginBottom: 14,
  marginTop: 4,
}

const dividerStyle: React.CSSProperties = {
  borderTop: "1px solid var(--cream-300)",
  marginTop: 20,
  marginBottom: 20,
}

function onFocus(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = "var(--violet-400)"
  e.currentTarget.style.background = "var(--cream-50)"
}
function onBlur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = "var(--cream-300)"
  e.currentTarget.style.background = "var(--cream-100)"
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

  const [vatApplicable, setVatApplicable] = useState(profile?.vat_applicable || false)
  const [vatRate, setVatRate] = useState(profile?.vat_rate || 20)

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
        vat_applicable: vatApplicable,
        vat_rate: vatRate,
      })
      .eq("id", profile.id)

    if (error) {
      console.error("Erreur settings :", error.message)
      setMessage("Erreur lors de la sauvegarde")
      setLoading(false)
      return
    }

    setMessage("✅ Profil mis à jour")
    setLoading(false)
    router.refresh()
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

      {/* ── Informations principales ── */}
      <p style={sectionTitle}>Informations principales</p>

      <input
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="Prénom"
        style={inputStyle}
        onFocus={onFocus}
        onBlur={onBlur}
      />

      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
        <select
          value={activityType}
          onChange={(e) => setActivityType(e.target.value as "vente" | "service" | "liberal")}
          style={inputStyle}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <option value="vente">Vente</option>
          <option value="service">Service</option>
          <option value="liberal">Libéral</option>
        </select>

        <select
          value={declarationFrequency}
          onChange={(e) => setDeclarationFrequency(e.target.value as "monthly" | "quarterly")}
          style={inputStyle}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <option value="monthly">Mensuelle</option>
          <option value="quarterly">Trimestrielle</option>
        </select>
      </div>

      {/* Toggle ACRE */}
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderRadius: "var(--r-sm)",
          background: "var(--cream-100)",
          border: "1px solid var(--cream-300)",
          padding: "12px 14px",
          cursor: "pointer",
          transition: "background 0.15s",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--cream-200)" }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--cream-100)" }}
      >
        <input
          type="checkbox"
          checked={acre}
          onChange={() => setAcre(!acre)}
          style={{ width: 16, height: 16, accentColor: "var(--violet-500)", cursor: "pointer", flexShrink: 0 }}
        />
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-900)" }}>ACRE</p>
          <p style={{ fontSize: 12, color: "var(--ink-400)", marginTop: 1 }}>Réduction des cotisations sociales la 1ère année</p>
        </div>
      </label>

      {/* Toggle Versement libératoire */}
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderRadius: "var(--r-sm)",
          background: "var(--cream-100)",
          border: "1px solid var(--cream-300)",
          padding: "12px 14px",
          cursor: "pointer",
          transition: "background 0.15s",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--cream-200)" }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--cream-100)" }}
      >
        <input
          type="checkbox"
          checked={versement}
          onChange={() => setVersement(!versement)}
          style={{ width: 16, height: 16, accentColor: "var(--violet-500)", cursor: "pointer", flexShrink: 0 }}
        />
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-900)" }}>Versement libératoire</p>
          <p style={{ fontSize: 12, color: "var(--ink-400)", marginTop: 1 }}>L&apos;impôt est prélevé directement sur ton CA déclaré</p>
        </div>
      </label>

      {/* ── Informations de facturation ── */}
      <div style={dividerStyle} />
      <p style={sectionTitle}>Informations de facturation</p>

      <input
        type="text"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        placeholder="Nom entreprise / Raison sociale"
        style={inputStyle}
        onFocus={onFocus}
        onBlur={onBlur}
      />

      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Adresse"
        style={inputStyle}
        onFocus={onFocus}
        onBlur={onBlur}
      />

      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
        <input
          type="text"
          value={postalCity}
          onChange={(e) => setPostalCity(e.target.value)}
          placeholder="Code postal + ville"
          style={inputStyle}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Téléphone"
          style={inputStyle}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>

      <input
        type="text"
        value={siret}
        onChange={(e) => setSiret(e.target.value)}
        placeholder="SIRET"
        style={inputStyle}
        onFocus={onFocus}
        onBlur={onBlur}
      />

      {/* Toggle TVA */}
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderRadius: "var(--r-sm)",
          background: "var(--cream-100)",
          border: "1px solid var(--cream-300)",
          padding: "12px 14px",
          cursor: "pointer",
          transition: "background 0.15s",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--cream-200)" }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--cream-100)" }}
      >
        <input
          type="checkbox"
          checked={vatApplicable}
          onChange={(e) => setVatApplicable(e.target.checked)}
          style={{ width: 16, height: 16, accentColor: "var(--violet-500)", cursor: "pointer", flexShrink: 0 }}
        />
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-900)" }}>TVA applicable</p>
          <p style={{ fontSize: 12, color: "var(--ink-400)", marginTop: 1 }}>Active uniquement si tu es assujetti à la TVA</p>
        </div>
      </label>

      {vatApplicable && (
        <input
          type="number"
          value={vatRate}
          onChange={(e) => setVatRate(Number(e.target.value))}
          placeholder="Taux de TVA (%)"
          style={inputStyle}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      )}

      {/* ── Informations bancaires ── */}
      <div style={dividerStyle} />
      <p style={sectionTitle}>Informations bancaires</p>

      <input
        type="text"
        value={bankHolder}
        onChange={(e) => setBankHolder(e.target.value)}
        placeholder="Titulaire du compte"
        style={inputStyle}
        onFocus={onFocus}
        onBlur={onBlur}
      />

      <input
        type="text"
        value={iban}
        onChange={(e) => setIban(e.target.value)}
        placeholder="IBAN"
        style={{ ...inputStyle, fontFamily: "var(--font-mono, monospace)", letterSpacing: "0.05em" }}
        onFocus={onFocus}
        onBlur={onBlur}
      />

      <input
        type="text"
        value={bic}
        onChange={(e) => setBic(e.target.value)}
        placeholder="BIC"
        style={{ ...inputStyle, fontFamily: "var(--font-mono, monospace)", letterSpacing: "0.05em" }}
        onFocus={onFocus}
        onBlur={onBlur}
      />

      {/* ── Save ── */}
      <div style={{ marginTop: 6 }}>
        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            width: "100%",
            borderRadius: "var(--r-sm)",
            border: "none",
            background: loading ? "var(--ink-700)" : "var(--ink-900)",
            color: "var(--violet-400)",
            padding: "13px 20px",
            fontSize: 14,
            fontWeight: 700,
            cursor: loading ? "default" : "pointer",
            transition: "background 0.15s",
            letterSpacing: "0.02em",
          }}
          onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "var(--ink-800, #1e293b)" }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = loading ? "var(--ink-700)" : "var(--ink-900)" }}
        >
          {loading ? "Sauvegarde en cours…" : "Enregistrer les modifications"}
        </button>

        {message && (
          <div
            style={{
              marginTop: 10,
              borderRadius: "var(--r-sm)",
              background: message.startsWith("✅") ? "rgba(132,204,22,0.08)" : "rgba(251,113,133,0.08)",
              border: `1px solid ${message.startsWith("✅") ? "rgba(132,204,22,0.25)" : "rgba(251,113,133,0.25)"}`,
              padding: "10px 14px",
              fontSize: 13,
              color: message.startsWith("✅") ? "var(--lime-700, #4d7c0f)" : "var(--rose-600, #e11d48)",
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
