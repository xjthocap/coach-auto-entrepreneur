"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

function getErrorMessage(error: string) {
  if (error.includes("Invalid login credentials")) {
    return "Email ou mot de passe incorrect"
  }

  if (error.includes("User already registered")) {
    return "Cet email est déjà utilisé"
  }

  if (error.includes("Password should be")) {
    return "Mot de passe trop faible"
  }

  return "Une erreur est survenue"
}

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage(getErrorMessage(error.message))
    } else {
      setMessage("Compte créé. Vérifie tes emails si une confirmation est demandée.")
    }

    setLoading(false)
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(getErrorMessage(error.message))
    } else {
      setMessage("Connexion réussie.")
      router.push("/dashboard")
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#f5f6fb] px-4 py-6 text-slate-800 md:px-8 md:py-8">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center">
        <div className="grid w-full gap-8 md:grid-cols-2">
          <div className="flex flex-col justify-center">
            <Link
              href="/"
              className="mb-8 inline-flex w-fit items-center gap-3 rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-slate-700 shadow-sm transition hover:bg-white"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4f7df3] font-bold text-white">
                AE
              </div>
              <span className="font-semibold">Coach Auto-Entrepreneur</span>
            </Link>

            <h1 className="text-5xl font-semibold leading-tight tracking-tight text-slate-900">
              Connecte-toi à ton espace.
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-500">
              Retrouve tes revenus, tes charges estimées et ton tableau de bord
              dans une interface claire et agréable.
            </p>
          </div>

          <div className="rounded-[32px] border border-white/80 bg-white/80 p-8 shadow-[0_20px_40px_rgba(15,23,42,0.06)]">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
              Connexion
            </h2>
            <p className="mt-2 text-slate-500">
              Crée un compte ou connecte-toi pour accéder à ton dashboard.
            </p>

            <form className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-[#f8f9fd] px-4 py-3 text-slate-900 outline-none transition focus:border-blue-300"
                  placeholder="ton@email.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-[#f8f9fd] px-4 py-3 text-slate-900 outline-none transition focus:border-blue-300"
                  placeholder="••••••••"
                />
              </div>

              <div className="grid gap-3 pt-2">
                <button
                  onClick={handleSignIn}
                  disabled={loading}
                  className="rounded-2xl bg-[#4f7df3] px-5 py-3 font-semibold text-white shadow-[0_10px_20px_rgba(79,125,243,0.25)] transition hover:bg-[#3e6eea] disabled:opacity-50"
                >
                  {loading ? "Chargement..." : "Se connecter"}
                </button>

                <button
                  onClick={handleSignUp}
                  disabled={loading}
                  type="button"
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
                >
                  {loading ? "Chargement..." : "Créer un compte"}
                </button>
              </div>
            </form>

            {message && (
              <p className="mt-5 rounded-2xl bg-[#f8f9fd] px-4 py-3 text-sm text-slate-600">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}