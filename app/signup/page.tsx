"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

function getErrorMessage(error: string) {
  if (error.includes("User already registered")) {
    return "Cet email est déjà utilisé"
  }

  if (error.includes("Password should be")) {
    return "Mot de passe trop faible"
  }

  if (error.includes("Email rate limit exceeded")) {
    return "Trop de tentatives. Réessaie dans quelques minutes."
  }

  if (error.includes("Signup is disabled")) {
    return "La création de compte est désactivée."
  }

  return error || "Une erreur est survenue"
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

    if (!email || !password) {
      setMessage("Remplis ton email et ton mot de passe.")
      return
    }

    if (password !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.")
      return
    }

    setLoading(true)

    try {
      const emailRedirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/dashboard`
          : undefined

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo,
          data: {
            first_name: firstName.trim(),
          },
        },
      })

      if (error) {
        console.error("Erreur signup :", error.message)
        setMessage(getErrorMessage(error.message))
        return
      }

      if (data.user && data.session) {
        router.push("/onboarding")
        router.refresh()
        return
      }

      setMessage(
        "Compte créé. Vérifie tes emails si une confirmation est demandée."
      )
    } catch (err) {
      console.error("Erreur inattendue signup :", err)
      setMessage("Une erreur est survenue lors de la création du compte.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f8f4] text-[#0f172a]">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-2">
        {/* LEFT SIDE */}
        <section className="flex flex-col justify-between px-6 py-8 md:px-10 lg:px-12 lg:py-10">
          <div>
            <Link href="/" className="inline-block">
              <div className="text-3xl font-extrabold tracking-tight text-slate-950">
                KeskiReste<span className="text-[#22c55e]">.</span>
              </div>
            </Link>

            <div className="mt-16 max-w-xl">
              <div className="inline-flex items-center rounded-full bg-[#dcfce7] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#15803d]">
                Création de compte
              </div>

              <h1 className="mt-6 text-5xl font-black leading-[0.98] tracking-tight text-slate-950 md:text-6xl">
                Commence à voir
                <br />
                ce qu’il te reste
                <br />
                vraiment.
              </h1>

              <p className="mt-6 text-lg leading-8 text-slate-600">
                Crée ton compte pour suivre tes revenus, tes dépenses, tes
                charges estimées et ton disponible réel dans une interface simple
                et claire.
              </p>
            </div>

            <div className="mt-10 grid max-w-xl gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Installation</p>
                <p className="mt-2 text-xl font-black text-slate-950">Rapide</p>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Lecture</p>
                <p className="mt-2 text-xl font-black text-slate-950">Claire</p>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-[#0f172a] p-5 shadow-sm">
                <p className="text-sm text-slate-300">Objectif</p>
                <p className="mt-2 text-xl font-black text-[#4ade80]">
                  Sérénité
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:block">
            <p className="text-sm text-slate-500">Pourquoi créer un compte ?</p>
            <p className="mt-3 text-base leading-7 text-slate-700">
              Parce que ton chiffre d’affaires seul ne suffit pas. KeskiReste
              t’aide à comprendre ce que tu peux réellement considérer comme
              disponible après charges, impôts et dépenses.
            </p>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="flex items-center justify-center px-6 py-8 md:px-10 lg:px-12">
          <div className="w-full max-w-xl rounded-[36px] border border-slate-200 bg-white p-8 shadow-[0_20px_50px_rgba(15,23,42,0.08)] md:p-10">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#16a34a]">
                Espace utilisateur
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
                Créer un compte
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-500 md:text-base">
                Quelques infos suffisent pour commencer à piloter ton activité.
              </p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Prénom
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-3.5 text-slate-900 outline-none transition focus:border-[#86efac] focus:bg-white"
                  placeholder="Ton prénom"
                  autoComplete="given-name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-3.5 text-slate-900 outline-none transition focus:border-[#86efac] focus:bg-white"
                  placeholder="ton@email.com"
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-3.5 text-slate-900 outline-none transition focus:border-[#86efac] focus:bg-white"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-3.5 text-slate-900 outline-none transition focus:border-[#86efac] focus:bg-white"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full rounded-2xl bg-[#0f172a] px-5 py-3.5 font-semibold text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)] transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Création..." : "Créer mon compte"}
              </button>
            </form>

            {message && (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-3">
                <p className="text-sm text-slate-600">{message}</p>
              </div>
            )}

            <div className="mt-8 border-t border-slate-200 pt-6">
              <p className="text-sm leading-6 text-slate-500">
                Tu as déjà un compte ?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-slate-900 underline underline-offset-4"
                >
                  Connecte-toi
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}