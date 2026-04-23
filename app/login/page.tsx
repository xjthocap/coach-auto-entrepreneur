"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

function getErrorMessage(error: string) {
  if (error.includes("Invalid login credentials")) {
    return "Email ou mot de passe incorrect"
  }

  if (error.includes("Email not confirmed")) {
    return "Ton email n’est pas encore confirmé."
  }

  if (error.includes("Email rate limit exceeded")) {
    return "Trop de tentatives. Réessaie dans quelques minutes."
  }

  return error || "Une erreur est survenue"
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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setMessage(getErrorMessage(error.message))
        return
      }

      router.push("/dashboard")
      router.refresh()
    } catch {
      setMessage("Une erreur est survenue lors de la connexion.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f7f3] text-[#0f172a]">
      <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 py-10 md:grid-cols-2 lg:grid-cols-[1.05fr_520px] lg:px-10">
        {/* LEFT */}
        <section className="md:pr-8">
          <Link href="/" className="inline-block">
            <div className="text-[42px] font-extrabold tracking-[-0.04em] text-[#0b132d]">
              KeskiReste<span className="text-[#22c55e]">.</span>
            </div>
          </Link>

          <div className="mt-6 inline-flex rounded-full bg-[#eaf7ea] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#15803d]">
            Connexion à ton espace
          </div>

          <h1 className="mt-8 text-5xl font-black leading-[0.92] tracking-[-0.05em] text-[#0b132d] md:text-6xl lg:text-[80px]">
            Retrouve enfin
            <br />
            ton <span className="text-[#22c55e]">vrai solde.</span>
          </h1>

          <p className="mt-8 max-w-[720px] text-lg leading-8 text-slate-600">
            Connecte-toi pour suivre tes revenus, tes dépenses, tes charges
            estimées et ce qu’il te reste vraiment, dans une interface simple et
            claire.
          </p>

          <div className="mt-12 flex flex-wrap gap-6">
            <div className="min-w-[92px]">
              <div className="flex h-20 w-20 items-center justify-center rounded-[24px] border border-slate-200 bg-white text-3xl shadow-sm">
                👁️
              </div>
              <p className="mt-4 text-sm text-slate-500">Vision</p>
              <p className="text-[22px] font-bold tracking-[-0.03em] text-[#0b132d]">
                Claire
              </p>
            </div>

            <div className="min-w-[92px]">
              <div className="flex h-20 w-20 items-center justify-center rounded-[24px] border border-slate-200 bg-white text-3xl shadow-sm">
                ⚡
              </div>
              <p className="mt-4 text-sm text-slate-500">Pilotage</p>
              <p className="text-[22px] font-bold tracking-[-0.03em] text-[#0b132d]">
                Simple
              </p>
            </div>

            <div className="min-w-[92px]">
              <div className="flex h-20 w-20 items-center justify-center rounded-[24px] border border-slate-200 bg-white text-3xl shadow-sm">
                🛡️
              </div>
              <p className="mt-4 text-sm text-slate-500">Objectif</p>
              <p className="text-[22px] font-bold tracking-[-0.03em] text-[#0b132d]">
                Sérénité
              </p>
            </div>
          </div>

          <div className="mt-14 max-w-[760px] rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#eef8ef] text-2xl">
                📊
              </div>

              <div>
                <p className="text-[26px] font-bold tracking-[-0.03em] text-[#0b132d]">
                  Pourquoi KeskiReste ?
                </p>
                <p className="mt-3 text-[17px] leading-8 text-slate-600">
                  Parce que ton chiffre d’affaires ne dit pas toute la vérité.
                  On t’aide à comprendre ce que tu peux vraiment considérer comme
                  disponible.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT */}
        <section className="md:pl-8">
          <div className="relative">
            <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-[36px] bg-[#e6eee5]" />

            <div className="relative rounded-[36px] border border-slate-200 bg-white px-8 py-10 shadow-[0_24px_70px_rgba(15,23,42,0.08)] md:px-10">
              <div className="mb-8 flex h-[68px] w-[68px] items-center justify-center rounded-full bg-[#eef8ef] text-3xl">
                👤
              </div>

              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#16a34a]">
                Espace utilisateur
              </p>

              <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-[#0b132d] md:text-[54px]">
                Connexion
              </h2>

              <p className="mt-4 text-[18px] leading-8 text-slate-500">
                Accède à ton dashboard en quelques secondes.
              </p>

              <form onSubmit={handleSignIn} className="mt-10 space-y-6">
                <div>
                  <label className="mb-3 block text-[15px] font-semibold text-[#0b132d]">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ton@email.com"
                    autoComplete="email"
                    className="w-full rounded-2xl border border-slate-200 bg-[#fbfcfa] px-4 py-4 text-[18px] text-[#0b132d] outline-none transition focus:border-[#86efac]"
                  />
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <label className="block text-[15px] font-semibold text-[#0b132d]">
                      Mot de passe
                    </label>

                    <Link
                      href="/forgot-password"
                      className="text-[15px] font-medium text-[#22c55e] transition hover:opacity-80"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full rounded-2xl border border-slate-200 bg-[#fbfcfa] px-4 py-4 text-[18px] text-[#0b132d] outline-none transition focus:border-[#86efac]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-[#07122f] px-6 py-4 text-[18px] font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? "Chargement..." : "Se connecter"}
                </button>

                <Link
                  href="/signup"
                  className="block w-full rounded-2xl border border-[#dce9dc] bg-[#f4faf3] px-6 py-4 text-center text-[18px] font-semibold text-[#15803d] transition hover:bg-[#ebf7ea]"
                >
                  Créer un compte
                </Link>

                {message && (
                  <div className="rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-4">
                    <p className="text-sm text-slate-600">{message}</p>
                  </div>
                )}
              </form>

              <div className="mt-8 border-t border-slate-200 pt-8 text-center">
                <p className="text-[16px] text-slate-500">
                  Pas encore de compte ?{" "}
                  <Link
                    href="/signup"
                    className="font-semibold text-[#22c55e] transition hover:opacity-80"
                  >
                    Créer un compte
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}