"use client"

import { useState } from "react"
import PricingModal from "@/components/PricingModal"

export default function HistoryPaywall() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        style={{
          borderRadius: "var(--r-xl)",
          border: "1px solid var(--cream-200)",
          background: "var(--ink-900)",
          boxShadow: "var(--shadow-lg)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Glow déco */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse 60% 80% at 100% 50%, rgba(196, 181, 253, 0.14) 0%, transparent 70%)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0,
            padding: "48px 24px",
          }}
          className="md:flex-row md:items-center md:gap-0 md:p-0"
        >
          {/* Left — texte */}
          <div
            style={{ flex: 1, padding: "0 0 0 0" }}
            className="md:p-12"
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                borderRadius: 999,
                background: "rgba(196, 181, 253, 0.12)",
                border: "1px solid rgba(196, 181, 253, 0.2)",
                padding: "4px 12px",
                marginBottom: 20,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--violet-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--violet-500)" }}>
                Premium
              </span>
            </div>

            <h2
              style={{
                fontSize: "clamp(24px, 4vw, 36px)",
                fontWeight: 600,
                letterSpacing: "-0.03em",
                color: "var(--cream-50)",
                lineHeight: 1.15,
                marginBottom: 14,
              }}
            >
              Historique complet
            </h2>

            <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--ink-300)", marginBottom: 24, maxWidth: 380 }}>
              Accède à l'intégralité de ton historique mensuel,
              compare tes périodes et exporte tes données en Excel.
            </p>

            <ul style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
              {[
                "Grille mensuelle avec mini-graphiques",
                "Détail revenus & dépenses par mois",
                "Export Excel (livre de recettes)",
              ].map((item) => (
                <li
                  key={item}
                  style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--cream-50)" }}
                >
                  <div
                    style={{
                      flexShrink: 0,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "rgba(196, 181, 253, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--violet-500)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            <button
              onClick={() => setOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderRadius: 999,
                border: "none",
                background: "var(--violet-500)",
                color: "var(--ink-900)",
                padding: "12px 24px",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(196, 181, 253, 0.3)",
              }}
            >
              Passer en Premium →
            </button>

            <p style={{ marginTop: 12, fontSize: 12, color: "var(--ink-400)" }}>
              19,90€ / mois · sans engagement
            </p>
          </div>

          {/* Right — visual déco */}
          <div
            className="hidden md:flex"
            style={{
              width: 320,
              flexShrink: 0,
              padding: "40px 40px 40px 0",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {/* Fake month cards */}
            {[
              { label: "AVR 2026", value: "+3 200 €", bars: [30, 45, 60, 80] },
              { label: "MAR 2026", value: "+2 790 €", bars: [50, 35, 70, 55] },
              { label: "FÉV 2026", value: "+1 800 €", bars: [20, 40, 35, 45] },
            ].map((card, i) => (
              <div
                key={i}
                style={{
                  borderRadius: "var(--r-md)",
                  background: i === 0 ? "rgba(196, 181, 253, 0.12)" : "rgba(255,255,255,0.04)",
                  border: i === 0 ? "1px solid rgba(196, 181, 253, 0.2)" : "1px solid rgba(255,255,255,0.06)",
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  opacity: i === 0 ? 1 : 0.5 - i * 0.1,
                  filter: i === 0 ? "none" : `blur(${i * 0.8}px)`,
                }}
              >
                <div>
                  <p style={{ fontSize: 10, letterSpacing: "0.1em", color: "var(--ink-300)", marginBottom: 4 }}>
                    {card.label}
                  </p>
                  <p style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 300, color: i === 0 ? "var(--violet-500)" : "var(--ink-300)", letterSpacing: "-0.03em" }}>
                    {card.value}
                  </p>
                </div>
                {/* Mini bar chart */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 32 }}>
                  {card.bars.map((h, j) => (
                    <div
                      key={j}
                      style={{
                        width: 6,
                        height: h * 0.4,
                        borderRadius: 2,
                        background: j === card.bars.length - 1 && i === 0
                          ? "var(--violet-500)"
                          : "rgba(255,255,255,0.15)",
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <PricingModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
