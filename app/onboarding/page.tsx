"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

const inputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: "var(--r-md)",
  border: "1px solid var(--cream-300)",
  background: "var(--cream-100)",
  padding: "12px 16px",
  fontSize: 14,
  color: "var(--ink-900)",
  outline: "none",
  transition: "border-color 0.15s",
  boxSizing: "border-box",
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
  appearance: "none" as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237550A8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 16px center",
  paddingRight: 40,
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--violet-700)", marginBottom: 12 }}>
      {children}
    </p>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink-700)", marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  )
}

export default function OnboardingPage() {
  const supabase = createClient()
  const router = useRouter()

  const [step, setStep] = useState<1 | 2>(1)
  const [firstName, setFirstName] = useState("")
  const [activityType, setActivityType] = useState("service")
  const [acre, setAcre] = useState(false)
  const [versement, setVersement] = useState(false)
  const [declarationFrequency, setDeclarationFrequency] = useState<"monthly" | "quarterly">("monthly")
  const [companyName, setCompanyName] = useState("")
  const [address, setAddress] = useState("")
  const [postalCity, setPostalCity] = useState("")
  const [phone, setPhone] = useState("")
  const [siret, setSiret] = useState("")
  const [bankHolder, setBankHolder] = useState("")
  const [iban, setIban] = useState("")
  const [bic, setBic] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit() {
    setLoading(true)
    setError("")
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }
    const { error: err } = await supabase.from("profiles").upsert({
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
    if (err) { setError("Erreur lors de la sauvegarde. Réessaie."); setLoading(false); return }
    setLoading(false)
    router.push("/dashboard")
    router.refresh()
  }

  const focusProps = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = "var(--violet-500)"
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = "var(--cream-300)"
    },
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--cream-100)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "32px 16px 80px",
      }}
    >
      {/* Header */}
      <div style={{ width: "100%", maxWidth: 680, marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.04em", color: "var(--ink-900)" }}>
            KeskiReste<span style={{ color: "var(--violet-500)" }}>.</span>
          </div>

          {/* Step indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {[1, 2].map(s => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 999,
                    background: step === s ? "var(--ink-900)" : step > s ? "var(--violet-500)" : "var(--cream-200)",
                    color: step === s ? "var(--lime-500)" : step > s ? "var(--ink-900)" : "var(--ink-400)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {step > s ? "✓" : s}
                </div>
                {s < 2 && <div style={{ width: 32, height: 2, background: step > s ? "var(--violet-500)" : "var(--cream-200)", borderRadius: 1 }} />}
              </div>
            ))}
            <span style={{ fontSize: 12, color: "var(--ink-400)", marginLeft: 4 }}>
              {step === 1 ? "Ton activité" : "Ton entreprise"}
            </span>
          </div>
        </div>

        <div style={{ marginTop: 32 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--violet-700)", marginBottom: 8 }}>
            {step === 1 ? "Étape 1 / 2" : "Étape 2 / 2"}
          </p>
          <h1
            style={{
              fontSize: "clamp(26px, 4vw, 38px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "var(--ink-900)",
              lineHeight: 1.1,
            }}
          >
            {step === 1 ? "Configure ton activité" : "Infos entreprise & facturation"}
          </h1>
          <p style={{ marginTop: 8, fontSize: 15, color: "var(--ink-400)" }}>
            {step === 1
              ? "Ces paramètres déterminent le calcul de tes charges et impôts."
              : "Ces informations apparaîtront sur tes factures PDF."}
          </p>
        </div>
      </div>

      {/* Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 680,
          background: "var(--cream-50)",
          borderRadius: "var(--r-xl)",
          border: "1px solid var(--cream-200)",
          boxShadow: "var(--shadow-lg)",
          padding: "32px 32px",
        }}
      >
        {step === 1 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <SectionTitle>Ton profil</SectionTitle>

            <Field label="Prénom">
              <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                placeholder="Ton prénom" autoComplete="given-name" style={inputStyle} {...focusProps} />
            </Field>

            <Field label="Type d'activité">
              <select value={activityType} onChange={e => setActivityType(e.target.value)} style={selectStyle} {...focusProps}>
                <option value="service">Prestation de service (BIC)</option>
                <option value="vente">Vente de marchandises (BIC)</option>
                <option value="liberal">Profession libérale (BNC)</option>
              </select>
            </Field>

            <Field label="Fréquence de déclaration">
              <select
                value={declarationFrequency}
                onChange={e => setDeclarationFrequency(e.target.value as "monthly" | "quarterly")}
                style={selectStyle}
                {...focusProps}
              >
                <option value="monthly">Mensuelle</option>
                <option value="quarterly">Trimestrielle</option>
              </select>
            </Field>

            <SectionTitle>Options fiscales</SectionTitle>

            {/* ACRE */}
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                borderRadius: "var(--r-md)",
                border: `1px solid ${acre ? "var(--violet-500)" : "var(--cream-300)"}`,
                background: acre ? "rgba(196,181,253,0.08)" : "var(--cream-100)",
                padding: "14px 16px",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <input
                type="checkbox"
                checked={acre}
                onChange={() => setAcre(!acre)}
                style={{ marginTop: 2, accentColor: "var(--violet-500)", width: 16, height: 16, flexShrink: 0 }}
              />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-900)" }}>ACRE</p>
                <p style={{ marginTop: 3, fontSize: 13, lineHeight: 1.6, color: "var(--ink-400)" }}>
                  Exonération partielle de charges la première année. Active si tu en bénéficies.
                </p>
              </div>
            </label>

            {/* Versement libératoire */}
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                borderRadius: "var(--r-md)",
                border: `1px solid ${versement ? "var(--violet-500)" : "var(--cream-300)"}`,
                background: versement ? "rgba(196,181,253,0.08)" : "var(--cream-100)",
                padding: "14px 16px",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <input
                type="checkbox"
                checked={versement}
                onChange={() => setVersement(!versement)}
                style={{ marginTop: 2, accentColor: "var(--violet-500)", width: 16, height: 16, flexShrink: 0 }}
              />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-900)" }}>Versement libératoire de l'impôt</p>
                <p style={{ marginTop: 3, fontSize: 13, lineHeight: 1.6, color: "var(--ink-400)" }}>
                  Paiement de l'impôt en même temps que les cotisations sociales. Active si tu as choisi cette option.
                </p>
              </div>
            </label>

            <button
              onClick={() => setStep(2)}
              style={{
                width: "100%",
                borderRadius: "var(--r-md)",
                border: "none",
                background: "var(--ink-900)",
                color: "var(--lime-500)",
                padding: "14px 20px",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: "-0.01em",
                marginTop: 8,
              }}
            >
              Continuer →
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <SectionTitle>Informations entreprise</SectionTitle>

            <Field label="Nom de l'entreprise">
              <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)}
                placeholder="Mon entreprise" style={inputStyle} {...focusProps} />
            </Field>

            <Field label="Adresse">
              <input type="text" value={address} onChange={e => setAddress(e.target.value)}
                placeholder="12 rue de la Paix" style={inputStyle} {...focusProps} />
            </Field>

            <Field label="Code postal + ville">
              <input type="text" value={postalCity} onChange={e => setPostalCity(e.target.value)}
                placeholder="75001 Paris" style={inputStyle} {...focusProps} />
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Téléphone">
                <input type="text" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="06 12 34 56 78" style={inputStyle} {...focusProps} />
              </Field>
              <Field label="SIRET">
                <input type="text" value={siret} onChange={e => setSiret(e.target.value)}
                  placeholder="123 456 789 00012" style={inputStyle} {...focusProps} />
              </Field>
            </div>

            <SectionTitle>Coordonnées bancaires (pour factures PDF)</SectionTitle>

            <div
              style={{
                borderRadius: "var(--r-md)",
                background: "var(--cream-100)",
                border: "1px solid var(--cream-300)",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <Field label="Titulaire du compte">
                <input type="text" value={bankHolder} onChange={e => setBankHolder(e.target.value)}
                  placeholder="Prénom Nom" style={{ ...inputStyle, background: "var(--cream-50)" }} {...focusProps} />
              </Field>
              <Field label="IBAN">
                <input type="text" value={iban} onChange={e => setIban(e.target.value)}
                  placeholder="FR76 1234 5678 9012 3456 7890 123" style={{ ...inputStyle, background: "var(--cream-50)" }} {...focusProps} />
              </Field>
              <Field label="BIC">
                <input type="text" value={bic} onChange={e => setBic(e.target.value)}
                  placeholder="BNPAFRPP" style={{ ...inputStyle, background: "var(--cream-50)" }} {...focusProps} />
              </Field>
            </div>

            <p style={{ fontSize: 12, color: "var(--ink-400)", textAlign: "center" }}>
              Ces infos ne sont pas obligatoires, tu pourras les renseigner plus tard dans les réglages.
            </p>

            {error && (
              <div style={{ borderRadius: "var(--r-sm)", background: "rgba(251,113,133,0.1)", border: "1px solid rgba(251,113,133,0.3)", padding: "10px 14px" }}>
                <p style={{ fontSize: 13, color: "var(--rose-500)" }}>{error}</p>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 10, marginTop: 8 }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  borderRadius: "var(--r-md)",
                  border: "1px solid var(--cream-300)",
                  background: "var(--cream-100)",
                  color: "var(--ink-700)",
                  padding: "14px 20px",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                ← Retour
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  borderRadius: "var(--r-md)",
                  border: "none",
                  background: "var(--ink-900)",
                  color: "var(--lime-500)",
                  padding: "14px 20px",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: loading ? "default" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  letterSpacing: "-0.01em",
                }}
              >
                {loading ? "Enregistrement…" : "Accéder au dashboard →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
