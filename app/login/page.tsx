"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

function getErrorMessage(error: string) {
  if (error.includes("Invalid login credentials")) return "Email ou mot de passe incorrect"
  if (error.includes("Email not confirmed")) return "Ton email n'est pas encore confirmé."
  if (error.includes("Email rate limit exceeded")) return "Trop de tentatives. Réessaie dans quelques minutes."
  return error || "Une erreur est survenue"
}

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

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setMessage("")
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setMessage(getErrorMessage(error.message)); return }
      router.push("/dashboard")
      router.refresh()
    } catch {
      setMessage("Une erreur est survenue lors de la connexion.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--cream-100)", display: "flex" }}>
      {/* ── LEFT PANEL (desktop only) ── */}
      <aside
        className="hidden lg:flex"
        style={{
          width: 480,
          flexShrink: 0,
          background: "var(--ink-900)",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px 52px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: "radial-gradient(ellipse 70% 50% at 80% 15%, rgba(196,181,253,0.18) 0%, transparent 70%)",
          }}
        />

        <div style={{ position: "relative" }}>
          {/* Logo */}
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.04em", color: "var(--cream-50)" }}>
            KeskiReste<span style={{ color: "var(--violet-500)" }}>.</span>
          </div>

          <div style={{ marginTop: 64 }}>
            <span
              style={{
                display: "inline-block",
                borderRadius: 999,
                border: "1px solid rgba(196,181,253,0.3)",
                padding: "4px 14px",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--violet-500)",
                marginBottom: 20,
              }}
            >
              Pour les auto-entrepreneurs
            </span>

            <h1
              style={{
                fontSize: "clamp(36px, 4vw, 52px)",
                fontWeight: 800,
                letterSpacing: "-0.05em",
                color: "var(--cream-50)",
                lineHeight: 1.05,
                marginBottom: 20,
              }}
            >
              Ton vrai solde.
              <br />
              <span style={{ color: "var(--violet-500)" }}>Sans prise de tête.</span>
            </h1>

            <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--ink-300)", maxWidth: 340 }}>
              Connecte-toi pour voir ce qu'il te reste vraiment — après charges, impôts et dépenses.
            </p>
          </div>

          {/* Features */}
          <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { icon: "→", text: "Disponible réel calculé automatiquement" },
              { icon: "→", text: "Charges URSSAF estimées en temps réel" },
              { icon: "→", text: "Alertes seuil auto-entrepreneur" },
            ].map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "var(--r-sm)",
                    background: "rgba(196,181,253,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    color: "var(--violet-500)",
                    flexShrink: 0,
                  }}
                >
                  {f.icon}
                </span>
                <span style={{ fontSize: 14, color: "var(--ink-300)" }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom preview card */}
        <div
          style={{
            position: "relative",
            borderRadius: "var(--r-md)",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            padding: "20px 24px",
          }}
        >
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-400)", marginBottom: 6 }}>
            Disponible réel · Mai 2026
          </p>
          <p
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: 36,
              fontWeight: 300,
              letterSpacing: "-0.05em",
              color: "var(--violet-500)",
              lineHeight: 1,
            }}
          >
            1&nbsp;847,32&nbsp;€
          </p>
          <p style={{ fontSize: 12, color: "var(--ink-400)", marginTop: 6 }}>
            Après URSSAF, impôt et dépenses
          </p>
        </div>
      </aside>

      {/* ── RIGHT PANEL (form) ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 24px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 440 }}>
          {/* Mobile logo */}
          <div className="lg:hidden" style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.04em", color: "var(--ink-900)" }}>
              KeskiReste<span style={{ color: "var(--violet-500)" }}>.</span>
            </div>
          </div>

          <div
            style={{
              background: "var(--cream-50)",
              borderRadius: "var(--r-xl)",
              border: "1px solid var(--cream-200)",
              boxShadow: "var(--shadow-lg)",
              padding: "36px 36px",
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--violet-700)",
                marginBottom: 8,
              }}
            >
              Connexion
            </p>
            <h2
              style={{
                fontSize: "clamp(26px, 4vw, 34px)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                color: "var(--ink-900)",
                marginBottom: 6,
              }}
            >
              Bon retour 👋
            </h2>
            <p style={{ fontSize: 14, color: "var(--ink-400)", marginBottom: 32 }}>
              Accède à ton dashboard en quelques secondes.
            </p>

            <form onSubmit={handleSignIn} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
                  style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = "var(--violet-500)"}
                  onBlur={e => e.currentTarget.style.borderColor = "var(--cream-300)"}
                />
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-700)" }}>
                    Mot de passe
                  </label>
                  <Link
                    href="/forgot-password"
                    style={{ fontSize: 13, color: "var(--violet-700)", textDecoration: "none" }}
                  >
                    Oublié ?
                  </Link>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = "var(--violet-500)"}
                  onBlur={e => e.currentTarget.style.borderColor = "var(--cream-300)"}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
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
                  marginTop: 4,
                }}
              >
                {loading ? "Connexion…" : "Se connecter →"}
              </button>

              {message && (
                <div
                  style={{
                    borderRadius: "var(--r-sm)",
                    background: "rgba(251,113,133,0.1)",
                    border: "1px solid rgba(251,113,133,0.3)",
                    padding: "10px 14px",
                  }}
                >
                  <p style={{ fontSize: 13, color: "var(--rose-500)" }}>{message}</p>
                </div>
              )}
            </form>

            <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid var(--cream-200)", textAlign: "center" }}>
              <p style={{ fontSize: 14, color: "var(--ink-400)" }}>
                Pas encore de compte ?{" "}
                <Link href="/signup" style={{ fontWeight: 700, color: "var(--ink-900)", textDecoration: "none" }}>
                  Créer un compte
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
