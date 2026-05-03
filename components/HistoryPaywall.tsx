"use client"

import { useState } from "react"
import PricingModal from "@/components/PricingModal"

const FEATURES = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    label: "Grille mensuelle",
    desc: "Tous tes mois en un coup d'œil",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    label: "Mini-graphiques",
    desc: "Évolution visuelle de ton CA",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    label: "Détail par mois",
    desc: "Rentrées et sorties détaillées",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    ),
    label: "Export Excel",
    desc: "Données prêtes pour ton comptable",
  },
]

export default function HistoryPaywall() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        style={{
          borderRadius: "var(--r-xl)",
          background: "var(--ink-900)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Blob décoratif */}
        <div style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          bottom: -60,
          left: -40,
          width: 240,
          height: 240,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(132,204,22,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", padding: "40px 40px 32px" }}>

          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              borderRadius: 999,
              background: "rgba(167,139,250,0.15)",
              border: "1px solid rgba(167,139,250,0.25)",
              padding: "4px 12px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--violet-400)",
              marginBottom: 16,
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Premium
            </span>

            <h3 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--cream-50)", lineHeight: 1.2, marginBottom: 10 }}>
              Remonte dans le temps.<br />
              <span style={{ color: "var(--violet-400)" }}>Analyse chaque période.</span>
            </h3>

            <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--ink-400)", maxWidth: 460 }}>
              Accède à l'intégralité de ton historique, compare tes périodes et exporte tes données pour ton comptable.
            </p>
          </div>

          {/* Features grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 32 }}>
            {FEATURES.map((f) => (
              <div
                key={f.label}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  borderRadius: "var(--r-md)",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  padding: "14px 16px",
                }}
              >
                <span style={{ color: "var(--violet-400)", marginTop: 1, flexShrink: 0 }}>{f.icon}</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--cream-100)", marginBottom: 2 }}>{f.label}</p>
                  <p style={{ fontSize: 12, color: "var(--ink-400)", lineHeight: 1.5 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <button
              onClick={() => setOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderRadius: "var(--r-sm)",
                border: "none",
                background: "var(--violet-500)",
                color: "#fff",
                padding: "13px 24px",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 20px rgba(139,92,246,0.35)",
                letterSpacing: "-0.01em",
              }}
            >
              Débloquer l'historique
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
            <p style={{ fontSize: 13, color: "var(--ink-500)" }}>
              19,90€ / mois · sans engagement
            </p>
          </div>
        </div>
      </div>

      <PricingModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
