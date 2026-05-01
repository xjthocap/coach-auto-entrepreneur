"use client"

import { useState } from "react"
import PricingModal from "@/components/PricingModal"

export default function HistoryPaywall() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        style={{
          borderRadius: "var(--r-lg)",
          border: "1px solid var(--cream-200)",
          background: "var(--cream-50)",
          boxShadow: "var(--shadow-md)",
          padding: "40px 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 0,
        }}
      >
        {/* Icône */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "var(--r-sm)",
            background: "var(--ink-900)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--violet-500)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>

        {/* Label */}
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--violet-700)", marginBottom: 10 }}>
          Premium
        </p>

        {/* Titre */}
        <h3 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--ink-900)", marginBottom: 10, lineHeight: 1.2 }}>
          Historique complet
        </h3>

        {/* Description */}
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--ink-500)", maxWidth: 400, marginBottom: 24 }}>
          Accède à l'intégralité de ton historique mensuel,
          compare tes périodes et exporte tes données en Excel.
        </p>

        {/* Features */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: 28 }}>
          {[
            "Grille mensuelle",
            "Mini-graphiques",
            "Détail par mois",
            "Export Excel",
          ].map((item) => (
            <span
              key={item}
              style={{
                borderRadius: 999,
                border: "1px solid var(--cream-300)",
                background: "var(--cream-100)",
                padding: "5px 14px",
                fontSize: 13,
                fontWeight: 500,
                color: "var(--ink-600)",
              }}
            >
              {item}
            </span>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => setOpen(true)}
          style={{
            borderRadius: 999,
            border: "none",
            background: "var(--ink-900)",
            color: "var(--violet-500)",
            padding: "12px 28px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "var(--shadow-md)",
          }}
        >
          Voir les offres Premium →
        </button>

        <p style={{ marginTop: 10, fontSize: 12, color: "var(--ink-400)" }}>
          19,90€ / mois · sans engagement
        </p>
      </div>

      <PricingModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
