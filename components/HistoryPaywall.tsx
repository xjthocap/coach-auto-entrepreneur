"use client"

import { useState } from "react"
import PricingModal from "@/components/PricingModal"

export default function HistoryPaywall() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Blur overlay + CTA */}
      <div
        style={{
          borderRadius: "var(--r-xl)",
          border: "1px solid var(--cream-200)",
          background: "var(--cream-50)",
          boxShadow: "var(--shadow-md)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Fake blurred content */}
        <div
          style={{
            filter: "blur(6px)",
            opacity: 0.5,
            pointerEvents: "none",
            userSelect: "none",
            padding: 24,
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
            {["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû"].map((m) => (
              <div
                key={m}
                style={{
                  borderRadius: "var(--r-md)",
                  background: "var(--cream-100)",
                  padding: "18px 20px 16px",
                  height: 110,
                }}
              >
                <p style={{ fontSize: 11, color: "var(--ink-400)", marginBottom: 8 }}>{m}</p>
                <div
                  style={{
                    width: "60%",
                    height: 20,
                    borderRadius: 4,
                    background: "var(--cream-300)",
                  }}
                />
                <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginTop: 24, height: 28 }}>
                  {[60, 40, 70, 50].map((h, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: h * 0.4,
                        borderRadius: 2,
                        background: i === 3 ? "var(--violet-500)" : "var(--cream-300)",
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overlay backdrop */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(248, 247, 252, 0.7)",
            backdropFilter: "blur(2px)",
          }}
        />

        {/* Center card */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 420,
              borderRadius: "var(--r-lg)",
              border: "1px solid var(--cream-200)",
              background: "var(--cream-50)",
              padding: 32,
              textAlign: "center",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            {/* Lock icon */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 44,
                height: 44,
                borderRadius: "var(--r-sm)",
                background: "var(--ink-900)",
                marginBottom: 16,
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--violet-500)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>

            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--violet-700)",
                marginBottom: 10,
              }}
            >
              Premium
            </p>

            <h3
              style={{
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "var(--ink-900)",
                marginBottom: 10,
                lineHeight: 1.2,
              }}
            >
              Historique complet
            </h3>

            <p
              style={{
                fontSize: 13,
                lineHeight: 1.7,
                color: "var(--ink-500)",
                marginBottom: 20,
              }}
            >
              Accède à l'intégralité de ton historique mensuel,
              compare tes périodes et exporte tes données en Excel.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                marginBottom: 22,
                textAlign: "left",
              }}
            >
              {[
                "Grille mensuelle avec mini-graphiques",
                "Détail revenus & dépenses par mois",
                "Export Excel (livre de recettes)",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    borderRadius: "var(--r-sm)",
                    background: "var(--cream-100)",
                    padding: "9px 14px",
                    fontSize: 13,
                    color: "var(--ink-700)",
                  }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--violet-700)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  {item}
                </div>
              ))}
            </div>

            <button
              onClick={() => setOpen(true)}
              style={{
                width: "100%",
                borderRadius: "var(--r-sm)",
                border: "none",
                background: "var(--ink-900)",
                color: "var(--violet-500)",
                padding: "13px 16px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "var(--shadow-md)",
              }}
            >
              Passer en Premium →
            </button>

            <p style={{ marginTop: 10, fontSize: 12, color: "var(--ink-400)" }}>
              19,90€ / mois · sans engagement
            </p>
          </div>
        </div>
      </div>

      <PricingModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
