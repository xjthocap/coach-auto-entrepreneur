"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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

export default function ResetPasswordPage() {
  const supabase = createClient()
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")
  const [ready, setReady] = useState(false)

  // Supabase injects the session from the email link via URL hash
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    if (password.length < 8) { setError("Le mot de passe doit faire au moins 8 caractères."); return }
    if (password !== confirm) { setError("Les mots de passe ne correspondent pas."); return }

    setLoading(true)
    setError("")

    const { error: err } = await supabase.auth.updateUser({ password })
    if (err) {
      setError(err.message)
      setLoading(false)
      return
    }

    setDone(true)
    setTimeout(() => router.push("/dashboard"), 2500)
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--cream-100)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.04em", color: "var(--ink-900)" }}>
              KeskiReste<span style={{ color: "var(--violet-500)" }}>.</span>
            </span>
          </Link>
        </div>

        <div style={{ background: "var(--cream-50)", borderRadius: "var(--r-xl)", border: "1px solid var(--cream-200)", boxShadow: "var(--shadow-lg)", padding: "36px 36px" }}>

          {done ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "var(--r-md)", background: "rgba(132,204,22,0.1)", border: "1px solid rgba(132,204,22,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--lime-500, #84cc16)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--ink-900)", marginBottom: 10 }}>
                Mot de passe mis à jour !
              </h2>
              <p style={{ fontSize: 14, color: "var(--ink-400)", lineHeight: 1.7 }}>
                Redirection vers le dashboard…
              </p>
            </div>
          ) : (
            <>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--violet-700)", marginBottom: 8 }}>
                Nouveau mot de passe
              </p>
              <h2 style={{ fontSize: "clamp(24px, 4vw, 30px)", fontWeight: 700, letterSpacing: "-0.04em", color: "var(--ink-900)", marginBottom: 8 }}>
                Choisir un mot de passe
              </h2>
              <p style={{ fontSize: 14, color: "var(--ink-400)", marginBottom: 28, lineHeight: 1.6 }}>
                Minimum 8 caractères.
              </p>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink-700)", marginBottom: 6 }}>
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    style={inputStyle}
                    onFocus={e => e.currentTarget.style.borderColor = "var(--violet-500)"}
                    onBlur={e => e.currentTarget.style.borderColor = "var(--cream-300)"}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink-700)", marginBottom: 6 }}>
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    style={inputStyle}
                    onFocus={e => e.currentTarget.style.borderColor = "var(--violet-500)"}
                    onBlur={e => e.currentTarget.style.borderColor = "var(--cream-300)"}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !password || !confirm}
                  style={{
                    width: "100%",
                    borderRadius: "var(--r-md)",
                    border: "none",
                    background: "var(--ink-900)",
                    color: "var(--lime-500)",
                    padding: "14px 20px",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: loading || !password || !confirm ? "default" : "pointer",
                    opacity: loading || !password || !confirm ? 0.6 : 1,
                    letterSpacing: "-0.01em",
                    marginTop: 4,
                  }}
                >
                  {loading ? "Mise à jour…" : "Enregistrer →"}
                </button>

                {error && (
                  <div style={{ borderRadius: "var(--r-sm)", background: "rgba(251,113,133,0.1)", border: "1px solid rgba(251,113,133,0.3)", padding: "10px 14px" }}>
                    <p style={{ fontSize: 13, color: "var(--rose-500)" }}>{error}</p>
                  </div>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
