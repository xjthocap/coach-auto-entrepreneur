"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

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
      setMessage(error.message)
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
  setMessage("Email ou mot de passe incorrect")
} else {
  setMessage("Connexion réussie.")
  router.push("/dashboard")
}

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-3xl font-bold mb-2">Connexion</h1>
        <p className="text-gray-400 mb-6">
          Crée un compte ou connecte-toi à ton espace.
        </p>

        <form className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
              placeholder="ton@email.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
              placeholder="••••••••"
            />
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="rounded-xl bg-white px-4 py-3 font-semibold text-black hover:bg-gray-200 disabled:opacity-50"
            >
              {loading ? "Chargement..." : "Se connecter"}
            </button>

            <button
              onClick={handleSignUp}
              disabled={loading}
              type="button"
              className="rounded-xl border border-white/15 px-4 py-3 font-semibold text-white hover:bg-white/5 disabled:opacity-50"
            >
              {loading ? "Chargement..." : "Créer un compte"}
            </button>
          </div>
        </form>

        {message && (
          <p className="mt-4 text-sm text-gray-300">{message}</p>
        )}
      </div>
    </main>
  )
}