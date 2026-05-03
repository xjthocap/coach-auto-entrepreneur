"use client"

import { useState } from "react"
import PricingModal from "@/components/PricingModal"

type Props = {
  isPremium: boolean
  ai?: React.ReactNode
  projection?: React.ReactNode
}

const PREMIUM_PILLS = ["🧠 Coach IA", "📈 Projection", "🧾 Factures PDF", "📤 Export Excel"]

function UpgradeNudge({ onUpgradeClick }: { onUpgradeClick: () => void }) {
  return (
    <div
      style={{
        borderRadius: "var(--r-md)",
        border: "1px solid rgba(196,181,253,0.3)",
        background: "rgba(196,181,253,0.07)",
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 8,
      }}
    >
      <span style={{ fontSize: 13, flexShrink: 0 }}>🔒</span>
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6, flex: 1 }}>
        {PREMIUM_PILLS.map((pill) => (
          <span
            key={pill}
            style={{
              borderRadius: 999,
              background: "rgba(196,181,253,0.18)",
              border: "1px solid rgba(196,181,253,0.3)",
              padding: "3px 10px",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--violet-700)",
              whiteSpace: "nowrap",
            }}
          >
            {pill}
          </span>
        ))}
        <span style={{ fontSize: 12, color: "var(--ink-400)", whiteSpace: "nowrap" }}>19,90€/mois</span>
      </div>
      <button
        onClick={onUpgradeClick}
        style={{
          borderRadius: "var(--r-sm)",
          border: "none",
          background: "var(--ink-900)",
          color: "var(--violet-500)",
          padding: "7px 16px",
          fontSize: 12,
          fontWeight: 700,
          cursor: "pointer",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        Passer Premium →
      </button>
    </div>
  )
}

function LockedCard({
  onUpgradeClick,
  icon,
  title,
  children,
}: {
  onUpgradeClick: () => void
  icon: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        position: "relative",
        borderRadius: "var(--r-lg)",
        background: "var(--cream-50)",
        boxShadow: "var(--shadow-md)",
        overflow: "hidden",
      }}
    >
      {/* Blurred content */}
      <div style={{ filter: "blur(3px)", userSelect: "none", pointerEvents: "none", opacity: 0.6 }}>
        {children}
      </div>

      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          background: "rgba(248,247,252,0.55)",
          backdropFilter: "blur(1px)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            padding: "20px 24px",
            borderRadius: "var(--r-md)",
            background: "var(--cream-50)",
            border: "1px solid var(--cream-200)",
            boxShadow: "var(--shadow-md)",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: 22 }}>{icon}</span>
          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--ink-900)" }}>{title}</p>
          <button
            onClick={onUpgradeClick}
            style={{
              borderRadius: "var(--r-sm)",
              border: "none",
              background: "var(--ink-900)",
              color: "var(--violet-500)",
              padding: "8px 20px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Débloquer →
          </button>
        </div>
      </div>
    </div>
  )
}

function FakeAICard() {
  return (
    <div style={{ padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <div style={{ width: 8, height: 8, borderRadius: 999, background: "var(--violet-500)" }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-900)" }}>Coach IA</span>
        <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--ink-400)" }}>Score de santé</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: 16, borderRadius: "var(--r-md)", background: "var(--cream-100)" }}>
          <div style={{ fontSize: 32, fontWeight: 700, fontFamily: "monospace", color: "var(--violet-700)" }}>84</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--lime-700)", background: "rgba(132,204,22,0.12)", borderRadius: 999, padding: "2px 10px" }}>Bonne santé</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {["Tes charges sont sous contrôle ce trimestre.", "Ton disponible réel est en hausse vs la période précédente.", "Pense à mettre de côté tes charges sociales."].map((t, i) => (
            <div key={i} style={{ padding: "8px 12px", borderRadius: "var(--r-sm)", background: "var(--cream-100)", fontSize: 12, color: "var(--ink-700)", display: "flex", gap: 8 }}>
              <span style={{ color: "var(--violet-500)", fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FakeProjectionCard() {
  return (
    <div style={{ padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-900)" }}>Projection fin de période</span>
        <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--ink-400)", fontFamily: "monospace" }}>47% de la période écoulée</span>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ height: 6, borderRadius: 999, background: "var(--cream-200)", overflow: "hidden" }}>
          <div style={{ width: "47%", height: "100%", borderRadius: 999, background: "var(--violet-500)" }} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          { label: "CA projeté", value: "3 840 €", sub: "si rythme maintenu" },
          { label: "Disponible réel estimé", value: "1 920 €", sub: "après charges & impôts" },
        ].map((s) => (
          <div key={s.label} style={{ padding: "12px 14px", borderRadius: "var(--r-md)", background: "var(--cream-100)" }}>
            <p style={{ fontSize: 11, color: "var(--ink-400)", marginBottom: 4 }}>{s.label}</p>
            <p style={{ fontSize: 18, fontWeight: 700, fontFamily: "monospace", color: "var(--ink-900)" }}>{s.value}</p>
            <p style={{ fontSize: 11, color: "var(--ink-400)", marginTop: 2 }}>{s.sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DashboardPremiumShell({ isPremium, ai, projection }: Props) {
  const [open, setOpen] = useState(false)

  if (isPremium) {
    return <div className="space-y-6">{ai}{projection}</div>
  }

  return (
    <>
      <UpgradeNudge onUpgradeClick={() => setOpen(true)} />
      <PricingModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
