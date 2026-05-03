"use client"

import { useState } from "react"
import PricingModal from "./PricingModal"

export default function UpgradeBannerClient() {
  const [open, setOpen] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          background: "var(--ink-900)",
          borderBottom: "1px solid rgba(167,139,250,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          padding: "9px 16px",
          flexWrap: "wrap",
        }}
      >
        {/* Puce violet */}
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          borderRadius: 999,
          background: "rgba(167,139,250,0.15)",
          border: "1px solid rgba(167,139,250,0.25)",
          padding: "2px 9px",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--violet-400)",
          flexShrink: 0,
        }}>
          Premium
        </span>

        <p style={{ fontSize: 13, color: "var(--ink-300)", margin: 0 }}>
          Débloquez le coach IA, l'historique complet et les exports Excel.
        </p>

        <button
          onClick={() => setOpen(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            borderRadius: "var(--r-sm)",
            border: "none",
            background: "var(--violet-500)",
            color: "#fff",
            padding: "6px 14px",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            flexShrink: 0,
            letterSpacing: "-0.01em",
          }}
        >
          Passer Premium · 19,90€/mois
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>

        {/* Fermer */}
        <button
          onClick={() => setDismissed(true)}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            width: 24,
            height: 24,
            borderRadius: "var(--r-sm)",
            border: "none",
            background: "rgba(255,255,255,0.06)",
            color: "var(--ink-400)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* Spacer pour pousser le contenu vers le bas */}
      <div style={{ height: 42 }} />

      <PricingModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
