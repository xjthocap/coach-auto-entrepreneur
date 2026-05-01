"use client"

import { useState } from "react"

type UpgradeButtonProps = {
  fullWidth?: boolean
  label?: string
  variant?: "primary" | "ghost"
}

export default function UpgradeButton({
  fullWidth = true,
  label = "Passer en Premium",
  variant = "primary",
}: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleUpgrade() {
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" })
      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || "Impossible de démarrer le paiement. Réessaie.")
        setLoading(false)
      }
    } catch {
      setError("Une erreur est survenue. Réessaie.")
      setLoading(false)
    }
  }

  return (
    <div className={fullWidth ? "w-full" : "inline-block"}>
      <button
        onClick={handleUpgrade}
        disabled={loading}
        className={`rounded-xl px-5 py-3 text-sm font-semibold transition hover:opacity-90 disabled:opacity-50 ${fullWidth ? "w-full" : ""}`}
        style={
          variant === "primary"
            ? { background: "var(--lime-500)", color: "var(--ink-900)" }
            : { background: "var(--cream-200)", color: "var(--ink-700)" }
        }
      >
        {loading ? "Redirection vers le paiement…" : label}
      </button>
      {error && (
        <p className="mt-2 text-center text-xs" style={{ color: "var(--rose-500)" }}>
          {error}
        </p>
      )}
    </div>
  )
}
