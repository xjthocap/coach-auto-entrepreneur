"use client"

import { useState } from "react"
import PricingModal from "@/components/PricingModal"

type Props = {
  isPremium: boolean
  ai?: React.ReactNode
  projection?: React.ReactNode
}

function LockedPreviewCard({
  eyebrow,
  title,
  subtitle,
  features,
}: {
  eyebrow: string
  title: string
  subtitle: string
  features: string[]
}) {
  return (
    <div
      style={{
        borderRadius: "var(--r-md)",
        border: "1px solid var(--cream-200)",
        background: "var(--cream-50)",
        padding: 20,
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--violet-700)",
          marginBottom: 8,
        }}
      >
        {eyebrow}
      </p>
      <h3
        style={{
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          color: "var(--ink-900)",
          marginBottom: 6,
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--ink-500)", marginBottom: 12 }}>
        {subtitle}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {features.map((feature, index) => (
          <div
            key={index}
            style={{
              borderRadius: "var(--r-sm)",
              border: "1px solid var(--cream-200)",
              background: "var(--cream-100)",
              padding: "10px 14px",
              fontSize: 13,
              color: "var(--ink-700)",
            }}
          >
            <span style={{ marginRight: 8, fontWeight: 700, color: "var(--violet-700)" }}>•</span>
            {feature}
          </div>
        ))}
      </div>
    </div>
  )
}

const LOCKED_FEATURES = [
  {
    icon: "🧠",
    title: "Coach IA",
    desc: "Score de santé, conseils personnalisés et alertes actionnables sur ta situation financière.",
    preview: "Score : ??/100 · Statut : ???",
  },
  {
    icon: "📈",
    title: "Projection fin de période",
    desc: "Si ton rythme continue, voici ton atterrissage estimé — disponible réel inclus.",
    preview: "Projeté : ?  ???,?? €",
  },
  {
    icon: "📚",
    title: "Historique complet",
    desc: "Compare tes périodes, identifie tes tendances, visualise ta progression mensuelle.",
    preview: "12 mois d'historique bloqués",
  },
  {
    icon: "🧾",
    title: "Factures PDF",
    desc: "Génère des factures PDF pro en un clic depuis tes revenus, avec tes infos société.",
    preview: "FAC-2025-XXXX.pdf · bloqué",
  },
  {
    icon: "📤",
    title: "Export Excel",
    desc: "Exporte tes revenus, dépenses et récapitulatifs en un clic pour ta compta.",
    preview: "Export disponible en Premium",
  },
]

function PremiumTeaser({ onUpgradeClick }: { onUpgradeClick: () => void }) {
  return (
    <div
      style={{
        borderRadius: "var(--r-xl)",
        background: "var(--ink-900)",
        boxShadow: "var(--shadow-md)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 55% 45% at 90% 5%, rgba(196,181,253,0.2) 0%, transparent 65%)" }} />

      <div style={{ position: "relative", padding: "28px 28px 0" }}>
        {/* Header */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 20, marginBottom: 28 }}>
          <div style={{ maxWidth: 420 }}>
            <span style={{ display: "inline-block", borderRadius: 999, background: "rgba(196,181,253,0.18)", border: "1px solid rgba(196,181,253,0.3)", padding: "4px 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--violet-500)", marginBottom: 12 }}>
              Premium · 19,90€/mois
            </span>
            <h2 style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--cream-50)", lineHeight: 1.2, marginBottom: 10 }}>
              Tu pilotes à l'aveugle.<br />
              <span style={{ color: "var(--violet-500)" }}>Premium te donne la vue complète.</span>
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--ink-300)" }}>
              Score IA, projection, factures PDF, historique 12 mois et export Excel — tout ce qu'il te faut pour vraiment piloter.
            </p>
          </div>

          <button
            onClick={onUpgradeClick}
            style={{
              borderRadius: "var(--r-md)",
              border: "none",
              background: "var(--violet-500)",
              color: "var(--ink-900)",
              padding: "13px 24px",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            Passer Premium →
          </button>
        </div>

        {/* Locked feature cards */}
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(2, 1fr)" }} className="md:grid-cols-3 xl:grid-cols-5">
          {LOCKED_FEATURES.map((f) => (
            <div
              key={f.title}
              style={{
                borderRadius: "var(--r-md)",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "16px 16px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Lock badge */}
              <span style={{ position: "absolute", top: 10, right: 10, fontSize: 12 }}>🔒</span>

              <p style={{ fontSize: 18, marginBottom: 8 }}>{f.icon}</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--cream-100)", marginBottom: 6 }}>{f.title}</p>
              <p style={{ fontSize: 12, lineHeight: 1.6, color: "var(--ink-400)", marginBottom: 10 }}>{f.desc}</p>

              {/* Fake preview */}
              <div style={{ borderRadius: "var(--r-sm)", background: "rgba(255,255,255,0.06)", padding: "8px 10px", filter: "blur(4px)", userSelect: "none", pointerEvents: "none" }}>
                <p style={{ fontSize: 12, fontFamily: "var(--font-mono, monospace)", color: "var(--violet-500)" }}>{f.preview}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ marginTop: 20, padding: "16px 0", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <p style={{ fontSize: 13, color: "var(--ink-400)" }}>
            Sans engagement · Résiliable à tout moment · 19,90€/mois
          </p>
          <button
            onClick={onUpgradeClick}
            style={{
              fontSize: 13,
              color: "var(--violet-500)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Voir les offres →
          </button>
        </div>
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
      <PremiumTeaser onUpgradeClick={() => setOpen(true)} />
      <PricingModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
