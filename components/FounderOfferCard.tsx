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
      className="relative rounded-[20px] p-6"
      style={{
        background: "linear-gradient(145deg, #1c1008 0%, #2a1a06 60%, #1a0f2e 100%)",
        border: "2px solid #F59E0B",
        boxShadow: "0 0 32px rgba(245,158,11,0.18), 0 4px 24px rgba(0,0,0,0.3)",
        overflow: "visible",
      }}
    >
      {/* Glow ambiant */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[18px]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 80% 10%, rgba(251,191,36,0.15) 0%, transparent 65%)",
        }}
      />

      <div className="relative">
        {/* Badge */}
        <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
            style={{
              background: "linear-gradient(135deg, rgba(251,191,36,0.25), rgba(245,158,11,0.15))",
              color: "#F59E0B",
              border: "1px solid rgba(245,158,11,0.35)",
            }}
          >
            ⭐ Offre Founder — Accès limité
          </span>
          {!isFull && (
            <span className="font-mono text-[11px]" style={{ color: "rgba(251,191,36,0.6)" }}>
              {founderCount}/{MAX_FOUNDERS} places prises
            </span>
          )}
        </div>

        {isFull ? (
          <div>
            <h3 className="text-xl font-semibold tracking-tight" style={{ color: "#FEF3C7" }}>
              Offre Founder complète
            </h3>
            <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              Les 50 places Founder sont prises. Passe à Premium mensuel pour accéder à toutes les fonctionnalités.
            </p>
          </div>
        ) : (
          <div>
            <h3 className="text-2xl font-semibold tracking-tight" style={{ color: "#FEF3C7" }}>
              Deviens Founder
            </h3>
            <p className="mt-1.5 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              Rejoins les{" "}
              <span className="font-semibold" style={{ color: "#F59E0B" }}>
                {remaining} premiers
              </span>{" "}
              — prix figé à vie.
            </p>

            {/* Progress bar */}
            <div className="mt-4 h-1.5 overflow-hidden rounded-full" style={{ background: "rgba(245,158,11,0.15)" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(founderCount / MAX_FOUNDERS) * 100}%`,
                  background: "linear-gradient(90deg, #F59E0B, #FBBF24)",
                }}
              />
            </div>

            {/* Prix */}
            <div className="mt-5 flex items-end justify-between">
              <div>
                <p className="font-mono text-4xl font-light" style={{ color: "#FBBF24", letterSpacing: "-0.04em" }}>
                  99€
                </p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                  / an · prix figé à vie
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs line-through" style={{ color: "rgba(255,255,255,0.3)" }}>
                  19,90€/mois
                </p>
                <p className="text-xs font-semibold" style={{ color: "#F59E0B" }}>
                  Économise ~140€/an
                </p>
              </div>
            </div>

            {/* Features */}
            <ul className="mt-5 space-y-2.5">
              {[
                "Toutes les fonctionnalités Premium",
                "Badge Founder numéroté · à vie",
                "Prix 99€/an figé pour toujours",
                "Mises à jour incluses",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button
              onClick={handleFounder}
              disabled={loading}
              className="mt-6 w-full rounded-xl py-3 text-sm font-bold transition-all hover:brightness-110 disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #F59E0B, #D97706)",
                color: "#1C1008",
                boxShadow: "0 4px 16px rgba(245,158,11,0.35)",
                letterSpacing: "0.01em",
              }}
            >
              {loading ? "Redirection…" : "Rejoindre les Founders — 99€/an"}
            </button>

            {error && (
              <p className="mt-2 text-center text-xs" style={{ color: "#FCA5A5" }}>
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
