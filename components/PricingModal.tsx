"use client"

import { useState, useEffect } from "react"
import UpgradeButton from "@/components/UpgradeButton"
import FounderOfferCard from "@/components/FounderOfferCard"

type PricingModalProps = {
  open: boolean
  onClose: () => void
}

export default function PricingModal({ open, onClose }: PricingModalProps) {
  const [founderCount, setFounderCount] = useState(0)

  useEffect(() => {
    if (open) {
      fetch("/api/founder-count")
        .then((r) => r.json())
        .then((d) => setFounderCount(d.count ?? 0))
        .catch(() => {})
    }
  }, [open])

  if (!open) return null

  const showFounder = founderCount < 50

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(14, 37, 32, 0.5)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="w-full max-w-2xl overflow-hidden"
        style={{
          background: "var(--cream-50)",
          borderRadius: "var(--r-xl)",
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--cream-200)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-6 pb-0 md:p-8 md:pb-0">
          <div>
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.12em]"
              style={{ color: "var(--lime-700)" }}
            >
              KeskiReste Premium
            </p>
            <h2
              className="mt-2 text-2xl font-semibold tracking-tight"
              style={{ color: "var(--ink-900)" }}
            >
              Passe au niveau supérieur
            </h2>
            <p className="mt-2 text-sm" style={{ color: "var(--ink-400)" }}>
              Débloque le vrai copilote financier pour auto-entrepreneur.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition hover:opacity-70"
            style={{ background: "var(--cream-200)", color: "var(--ink-500)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="p-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Gratuit */}
            <div
              className="rounded-[16px] p-5"
              style={{ background: "var(--cream-100)", border: "1px solid var(--cream-200)" }}
            >
              <p className="text-sm font-medium" style={{ color: "var(--ink-400)" }}>
                Version gratuite
              </p>
              <p
                className="mt-3 font-mono text-3xl font-light"
                style={{ color: "var(--ink-900)" }}
              >
                0€
              </p>
              <div className="mt-5 space-y-2.5">
                {[
                  "CA de la période",
                  "Charges estimées",
                  "Impôt estimé",
                  "Suivi basique des revenus",
                  "Génération de factures PDF",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm" style={{ color: "var(--ink-400)" }}>
                    <div className="h-1 w-1 rounded-full" style={{ background: "var(--ink-300)" }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Premium */}
            <div
              className="rounded-[16px] p-5"
              style={{
                background: "var(--ink-900)",
                border: "1px solid var(--ink-800)",
              }}
            >
              <p className="text-sm font-medium" style={{ color: "var(--lime-500)" }}>
                Version Premium
              </p>
              <div className="mt-3 flex items-end gap-2">
                <p
                  className="font-mono text-3xl font-light"
                  style={{ color: "var(--cream-50)" }}
                >
                  19,90€
                </p>
                <p className="mb-1 text-sm" style={{ color: "var(--ink-400)" }}>
                  / mois
                </p>
              </div>
              <div className="mt-5 space-y-2.5">
                {[
                  "Tout le gratuit, plus :",
                  "Assistant IA complet",
                  "Projection de fin de période",
                  "Historique & export Excel",
                  "Insights intelligents personnalisés",
                  "Navigation de période avancée",
                ].map((item, i) => (
                  <div key={item} className="flex items-center gap-2 text-sm" style={{ color: i === 0 ? "var(--ink-300)" : "var(--cream-100)" }}>
                    {i === 0 ? (
                      <div className="h-1 w-1 rounded-full" style={{ background: "var(--ink-400)" }} />
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--lime-500)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    )}
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <UpgradeButton label="Passer en Premium · 19,90€/mois" />
              </div>
            </div>
          </div>

          {/* Founder offer */}
          {showFounder && (
            <div className="mt-4">
              <FounderOfferCard founderCount={founderCount} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
