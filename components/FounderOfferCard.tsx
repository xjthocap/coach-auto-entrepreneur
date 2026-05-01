"use client"

import { useState } from "react"

const MAX_FOUNDERS = 50

type FounderOfferCardProps = {
  founderCount: number
}

export default function FounderOfferCard({ founderCount }: FounderOfferCardProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const remaining = MAX_FOUNDERS - founderCount
  const isFull = remaining <= 0

  async function handleFounder() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/stripe/checkout?type=founder", { method: "POST" })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || "Impossible de démarrer le paiement.")
        setLoading(false)
      }
    } catch {
      setError("Une erreur est survenue.")
      setLoading(false)
    }
  }

  return (
    <div
      className="relative overflow-hidden rounded-[20px] p-6"
      style={{ background: "var(--ink-900)" }}
    >
      {/* Glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 90% 20%, rgba(196, 181, 253, 0.18) 0%, transparent 70%)",
        }}
      />

      <div className="relative">
        {/* Badge */}
        <div className="mb-4 flex items-center justify-between">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
            style={{ background: "rgba(196, 181, 253, 0.15)", color: "var(--lime-500)" }}
          >
            ⭐ Offre Founder
          </span>
          {!isFull && (
            <span className="font-mono text-[11px]" style={{ color: "var(--ink-300)" }}>
              {founderCount}/{MAX_FOUNDERS} places prises
            </span>
          )}
        </div>

        {isFull ? (
          <div>
            <h3 className="text-xl font-semibold tracking-tight" style={{ color: "var(--cream-50)" }}>
              Offre Founder complète
            </h3>
            <p className="mt-2 text-sm" style={{ color: "var(--ink-400)" }}>
              Les 50 places Founder sont prises. Passe à Premium mensuel pour accéder à toutes les fonctionnalités.
            </p>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-semibold tracking-tight" style={{ color: "var(--cream-50)" }}>
              Deviens Founder
            </h3>
            <p className="mt-1.5 text-sm" style={{ color: "var(--ink-400)" }}>
              Accès à vie pour les{" "}
              <span className="font-semibold" style={{ color: "var(--lime-500)" }}>
                {remaining} dernières places
              </span>
              . Plus jamais de frais.
            </p>

            {/* Progress bar */}
            <div className="mt-4 h-1.5 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(founderCount / MAX_FOUNDERS) * 100}%`,
                  background: "var(--lime-500)",
                }}
              />
            </div>

            <div className="mt-5 flex items-end justify-between">
              <div>
                <p className="font-mono text-3xl font-light" style={{ color: "var(--lime-500)" }}>
                  99€
                </p>
                <p className="text-xs" style={{ color: "var(--ink-400)" }}>
                  / an · à vie
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs line-through" style={{ color: "var(--ink-400)" }}>
                  19,90€/mois
                </p>
                <p className="text-xs font-medium" style={{ color: "var(--lime-500)" }}>
                  Économise ~140€/an
                </p>
              </div>
            </div>

            <ul className="mt-5 space-y-2">
              {[
                "Toutes les fonctionnalités Premium",
                "Badge Founder numéroté",
                "Accès à vie garanti",
                "Mises à jour incluses",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm" style={{ color: "var(--ink-300)" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--lime-500)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <button
              onClick={handleFounder}
              disabled={loading}
              className="mt-6 w-full rounded-xl py-3 text-sm font-semibold transition hover:opacity-90 disabled:opacity-50"
              style={{ background: "var(--lime-500)", color: "var(--ink-900)" }}
            >
              {loading ? "Redirection…" : `Rejoindre les Founders — 99€/an`}
            </button>

            {error && (
              <p className="mt-2 text-center text-xs" style={{ color: "var(--rose-500)" }}>
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
