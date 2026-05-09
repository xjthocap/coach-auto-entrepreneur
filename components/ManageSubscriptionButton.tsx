"use client"

import { useState } from "react"

export default function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleManage() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || "Impossible d'ouvrir le portail.")
      }
    } catch {
      setError("Une erreur est survenue. Réessaie.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleManage}
        disabled={loading}
        className="w-full rounded-xl border px-4 py-2.5 text-sm font-medium transition hover:opacity-70 disabled:opacity-50"
        style={{ borderColor: "var(--cream-200)", background: "var(--cream-50)", color: "var(--ink-600)" }}
      >
        {loading ? "Redirection…" : "Gérer mon abonnement"}
      </button>
      {error && (
        <p className="mt-2 text-xs leading-5" style={{ color: "var(--rose-500)" }}>
          {error}
        </p>
      )}
    </div>
  )
}
