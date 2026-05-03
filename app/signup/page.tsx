"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

function getErrorMessage(error: string) {
  if (error.includes("User already registered")) return "Cet email est déjà utilisé"
  if (error.includes("Password should be")) return "Mot de passe trop faible (8 caractères minimum)"
  if (error.includes("Email rate limit exceeded")) return "Trop de tentatives. Réessaie dans quelques minutes."
  if (error.includes("Signup is disabled")) return "La création de compte est désactivée."
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

export default function SignupPage() {
  const supabase = createClient()
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setMessage("")
    if (!email || !password) { setMessage("Remplis ton email et ton mot de passe."); return }
    if (password !== confirmPassword) { setMessage("Les mots de passe ne correspondent pas."); return }
    setLoading(true)
    try {
      const emailRedirectTo = typeof window !== "undefined" ? `${window.location.origin}/dashboard` : undefined
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo, data: { first_name: firstName.trim() } },
      })
      if (error) { setMessage(getErrorMessage(error.message)); return }
      if (data.user && data.session) { router.push("/onboarding"); router.refresh(); return }
      setMessage("Compte créé ! Vérifie tes emails si une confirmation est demandée.")
    } catch {
      setMessage("Une erreur est survenue lors de la création du compte.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--cream-100)", display: "flex" }}>
      {/* ── LEFT PANEL ── */}
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
            background: "radial-gradient(ellipse 70% 50% at 90% 20%, rgba(196,181,253,0.18) 0%, transparent 70%)",
          }}
        />

        <div style={{ position: "relative" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.04em", color: "var(--cream-50)" }}>
              KeskiReste<span style={{ color: "var(--violet-500)" }}>.</span>
            </div>
          </Link>

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
              Gratuit pour commencer
            </span>

            <h1
              style={{
                fontSize: "clamp(32px, 3.5vw, 48px)",
                fontWeight: 800,
                letterSpacing: "-0.05em",
                color: "var(--cream-50)",
                lineHeight: 1.08,
                marginBottom: 20,
              }}
            >
              Commence à voir
              <br />
              ce qu'il te reste
              <br />
              <span style={{ color: "var(--violet-500)" }}>vraiment.</span>
            </h1>

            <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--ink-300)", maxWidth: 340 }}>
              En 2 minutes, configure ton espace et obtiens ton disponible réel automatiquement.
            </p>
          </div>

          {/* 3 stats */}
          <div style={{ marginTop: 48, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "Configuration", value: "2 min" },
              { label: "Interface", value: "Simple" },
              { label: "Seuil URSSAF", value: "Surveillé" },
              { label: "Sérénité", value: "Incluse" },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  borderRadius: "var(--r-sm)",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  padding: "14px 16px",
                }}
              >
                <p style={{ fontSize: 11, color: "var(--ink-400)", marginBottom: 4 }}>{s.label}</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: "var(--cream-50)", letterSpacing: "-0.02em" }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Premium nudge */}
        <div
          style={{
            position: "relative",
            borderRadius: "var(--r-md)",
            background: "rgba(196,181,253,0.12)",
            border: "1px solid rgba(196,181,253,0.2)",
            padding: "18px 22px",
          }}
        >
          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--violet-500)", marginBottom: 4 }}>
            Version Premium disponible
          </p>
          <p style={{ fontSize: 13, color: "var(--ink-300)", lineHeight: 1.6 }}>
            Coach IA, projections de fin de période, historique complet et export Excel — à 19,90€/mois.
          </p>
        </div>
      </aside>

      {/* ── RIGHT PANEL ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 24px",
          overflowY: "auto",
        }}
      >
        <div style={{ width: "100%", maxWidth: 460 }}>
          {/* Mobile logo */}
          <div className="lg:hidden" style={{ textAlign: "center", marginBottom: 36 }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.04em", color: "var(--ink-900)" }}>
                KeskiReste<span style={{ color: "var(--violet-500)" }}>.</span>
              </div>
            </Link>
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
              Créer un compte
            </p>
            <h2
              style={{
                fontSize: "clamp(24px, 3.5vw, 32px)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                color: "var(--ink-900)",
                marginBottom: 6,
              }}
            >
              Bienvenue 🎉
            </h2>
            <p style={{ fontSize: 14, color: "var(--ink-400)", marginBottom: 28 }}>
              Quelques infos suffisent pour commencer.
            </p>

            <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink-700)", marginBottom: 6 }}>Prénom</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="Ton prénom"
                  autoComplete="given-name"
                  style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = "var(--violet-500)"}
                  onBlur={e => e.currentTarget.style.borderColor = "var(--cream-300)"}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink-700)", marginBottom: 6 }}>Email</label>
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
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink-700)", marginBottom: 6 }}>Mot de passe</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = "var(--violet-500)"}
                  onBlur={e => e.currentTarget.style.borderColor = "var(--cream-300)"}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink-700)", marginBottom: 6 }}>Confirmer</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = "var(--violet-500)"}
                  onBlur={e => e.currentTarget.style.borderColor = "var(--cream-300)"}
                />
              </div>

              {message && (
                <div
                  style={{
                    borderRadius: "var(--r-sm)",
                    background: message.includes("créé") ? "rgba(196,181,253,0.12)" : "rgba(251,113,133,0.1)",
                    border: `1px solid ${message.includes("créé") ? "rgba(196,181,253,0.3)" : "rgba(251,113,133,0.3)"}`,
                    padding: "10px 14px",
                  }}
                >
                  <p style={{ fontSize: 13, color: message.includes("créé") ? "var(--violet-700)" : "var(--rose-500)" }}>{message}</p>
                </div>
              )}

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
                {loading ? "Création…" : "Créer mon compte →"}
              </button>
            </form>

            <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--cream-200)", textAlign: "center" }}>
              <p style={{ fontSize: 14, color: "var(--ink-400)" }}>
                Déjà un compte ?{" "}
                <Link href="/login" style={{ fontWeight: 700, color: "var(--ink-900)", textDecoration: "none" }}>
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
