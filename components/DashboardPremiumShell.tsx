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

function PremiumTeaser({ onUpgradeClick }: { onUpgradeClick: () => void }) {
  return (
    <div
      style={{
        borderRadius: "var(--r-xl)",
        border: "1px solid var(--cream-200)",
        background: "var(--cream-50)",
        padding: 28,
        boxShadow: "var(--shadow-md)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle violet glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 60% 50% at 100% 0%, rgba(196, 181, 253, 0.12) 0%, transparent 70%)",
        }}
      />

      <div style={{ position: "relative" }}>
        {/* Header row */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            alignItems: "flex-start",
          }}
          className="xl:flex-row xl:items-start xl:justify-between"
        >
          <div style={{ maxWidth: 480 }}>
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
              Premium
            </p>
            <h2
              style={{
                fontSize: "clamp(22px, 3vw, 30px)",
                fontWeight: 600,
                letterSpacing: "-0.03em",
                color: "var(--ink-900)",
                marginBottom: 10,
                lineHeight: 1.2,
              }}
            >
              Débloque le vrai copilote financier
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--ink-500)", marginBottom: 16 }}>
              Passe en Premium pour obtenir une analyse IA de ta situation,
              des projections de fin de période et des recommandations actionnables.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["Score de santé", "Conseils IA", "Projection fin de période", "Export Excel"].map((tag) => (
                <span
                  key={tag}
                  style={{
                    borderRadius: 999,
                    border: "1px solid var(--cream-300)",
                    background: "var(--cream-100)",
                    padding: "4px 12px",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--ink-700)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* CTA card */}
          <div
            style={{
              borderRadius: "var(--r-md)",
              border: "1px solid var(--cream-200)",
              background: "var(--ink-900)",
              padding: 20,
              minWidth: 240,
              width: "100%",
              maxWidth: 300,
            }}
          >
            <p style={{ fontSize: 13, color: "var(--ink-300)", marginBottom: 6 }}>KeskiReste Premium</p>
            <p
              style={{
                fontFamily: "monospace",
                fontSize: 36,
                fontWeight: 300,
                letterSpacing: "-0.04em",
                color: "var(--cream-50)",
                lineHeight: 1,
                marginBottom: 4,
              }}
            >
              19,90€
              <span style={{ fontSize: 14, fontWeight: 400, color: "var(--ink-300)" }}> / mois</span>
            </p>
            <p style={{ fontSize: 13, color: "var(--ink-400)", marginBottom: 18 }}>
              Pour piloter ton activité avec plus de clarté.
            </p>
            <button
              onClick={onUpgradeClick}
              style={{
                width: "100%",
                borderRadius: "var(--r-sm)",
                border: "none",
                background: "var(--violet-500)",
                color: "var(--ink-900)",
                padding: "12px 16px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Voir les offres →
            </button>
          </div>
        </div>

        {/* Blurred previews */}
        <div
          style={{
            marginTop: 24,
            display: "grid",
            gap: 16,
          }}
          className="xl:grid-cols-2"
        >
          <div style={{ opacity: 0.65, filter: "blur(2px)", pointerEvents: "none", userSelect: "none" }}>
            <LockedPreviewCard
              eyebrow="Coach IA"
              title="Analyse intelligente"
              subtitle="Une lecture simple et utile de ta situation avec des conseils concrets."
              features={[
                "Score de santé financier",
                "Conseils intelligents personnalisés",
                "Alertes si tu dépasses les seuils",
              ]}
            />
          </div>
          <div style={{ opacity: 0.65, filter: "blur(2px)", pointerEvents: "none", userSelect: "none" }}>
            <LockedPreviewCard
              eyebrow="Projection"
              title="Fin de période"
              subtitle="Anticipe ton atterrissage avant la fin du mois."
              features={[
                "Projection du chiffre d'affaires",
                "Projection charges et impôts",
                "Solde disponible estimé",
              ]}
            />
          </div>
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
