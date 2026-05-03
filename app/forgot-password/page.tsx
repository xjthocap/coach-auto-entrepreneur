"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

const inputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: "var(--r-md)",
  border: "1px solid var(--cream-300)",
  background: "var(--cream-100)",
  padding: "13px 16px",
  fontSize: 15,
  color: "var(--ink-900)",
  outline: "none",
  transition: "border-color 0.15s",
  boxSizing: "border-box",
}

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading || !email) return
    setLoading(true)
    setError("")

    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (err) {
      setError("Une erreur est survenue. Vérifie l'adresse email.")
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--cream-100)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.04em", color: "var(--ink-900)" }}>
              KeskiReste<span style={{ color: "var(--violet-500)" }}>.</span>
            </span>
          </Link>
        </div>

        <div style={{ background: "var(--cream-50)", borderRadius: "var(--r-xl)", border: "1px solid var(--cream-200)", boxShadow: "var(--shadow-lg)", padding: "36px 36px" }}>

          {sent ? (
            /* ── Success state ── */
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: "var(--r-md)",
                background: "rgba(132,204,22,0.1)",
                border: "1px solid rgba(132,204,22,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--lime-500, #84cc16)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--ink-900)", marginBottom: 10 }}>
                Email envoyé !
              </h2>
              <p style={{ fontSize: 14, color: "var(--ink-400)", lineHeight: 1.7, marginBottom: 28 }}>
                Un lien de réinitialisation a été envoyé à <strong style={{ color: "var(--ink-700)" }}>{email}</strong>. Vérifie tes spams si tu ne le reçois pas dans 2 minutes.
              </p>
              <Link
                href="/login"
                style={{ display: "block", textAlign: "center", fontSize: 14, color: "var(--violet-700)", textDecoration: "none", fontWeight: 600 }}
              >
                ← Retour à la connexion
              </Link>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--violet-700)", marginBottom: 8 }}>
                Mot de passe oublié
              </p>
              <h2 style={{ fontSize: "clamp(24px, 4vw, 30px)", fontWeight: 700, letterSpacing: "-0.04em", color: "var(--ink-900)", marginBottom: 8 }}>
                Réinitialiser
              </h2>
              <p style={{ fontSize: 14, color: "var(--ink-400)", marginBottom: 28, lineHeight: 1.6 }}>
                Saisis ton email et on t&apos;envoie un lien pour choisir un nouveau mot de passe.
              </p>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink-700)", marginBottom: 6 }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="ton@email.com"
                    autoComplete="email"
                    required
                    style={inputStyle}
                    onFocus={e => e.currentTarget.style.borderColor = "var(--violet-500)"}
                    onBlur={e => e.currentTarget.style.borderColor = "var(--cream-300)"}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  style={{
                    width: "100%",
                    borderRadius: "var(--r-md)",
                    border: "none",
                    background: "var(--ink-900)",
                    color: "var(--lime-500)",
                    padding: "14px 20px",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: loading || !email ? "default" : "pointer",
                    opacity: loading || !email ? 0.6 : 1,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {loading ? "Envoi en cours…" : "Envoyer le lien →"}
                </button>

                {error && (
                  <div style={{ borderRadius: "var(--r-sm)", background: "rgba(251,113,133,0.1)", border: "1px solid rgba(251,113,133,0.3)", padding: "10px 14px" }}>
                    <p style={{ fontSize: 13, color: "var(--rose-500)" }}>{error}</p>
                  </div>
                )}
              </form>

              <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--cream-200)", textAlign: "center" }}>
                <Link href="/login" style={{ fontSize: 14, color: "var(--ink-400)", textDecoration: "none" }}>
                  ← Retour à la connexion
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
