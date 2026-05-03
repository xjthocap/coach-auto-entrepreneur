"use client"

import { useState } from "react"

type ActivityType = "vente" | "service" | "liberal"

type Props = {
  periodRevenue: number
  activityType: ActivityType
  periodsPerYear: number
  irEstimate: number
}

const BAREME = [
  { min: 0,       max: 11_497,  rate: 0    },
  { min: 11_497,  max: 29_315,  rate: 0.11 },
  { min: 29_315,  max: 83_823,  rate: 0.30 },
  { min: 83_823,  max: 180_294, rate: 0.41 },
  { min: 180_294, max: Infinity, rate: 0.45 },
]

const ABATTEMENT: Record<ActivityType, number> = {
  vente:   0.71,
  service: 0.50,
  liberal: 0.34,
}

const LABEL_ACTIVITE: Record<ActivityType, string> = {
  vente:   "Vente (71%)",
  service: "Services (50%)",
  liberal: "Libéral (34%)",
}

function fmt(n: number) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function buildSteps(periodRevenue: number, activityType: ActivityType, periodsPerYear: number) {
  const annualRevenue   = periodRevenue * periodsPerYear
  const abattement      = ABATTEMENT[activityType]
  const deduction       = annualRevenue * abattement
  const taxableIncome   = Math.max(0, annualRevenue - deduction)

  const brackets: { label: string; amount: number; tax: number }[] = []
  let annualIR = 0
  for (const { min, max, rate } of BAREME) {
    if (taxableIncome <= min) break
    const slice = (Math.min(taxableIncome, max) - min) * rate
    annualIR += slice
    if (rate > 0) {
      brackets.push({
        label: `${(rate * 100).toFixed(0)}% · de ${min.toLocaleString("fr-FR")} à ${max === Infinity ? "∞" : max.toLocaleString("fr-FR")} €`,
        amount: Math.min(taxableIncome, max) - min,
        tax: slice,
      })
    }
  }

  return { annualRevenue, deduction, taxableIncome, annualIR, brackets }
}

export default function IRDetailButton({ periodRevenue, activityType, periodsPerYear, irEstimate }: Props) {
  const [open, setOpen] = useState(false)
  const { annualRevenue, deduction, taxableIncome, annualIR, brackets } = buildSteps(periodRevenue, activityType, periodsPerYear)
  const periodLabel = periodsPerYear === 12 ? "mois" : "trimestre"

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        title="Voir le détail du calcul IR"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          borderRadius: 999,
          border: "1px solid rgba(245,158,11,0.35)",
          background: "rgba(245,158,11,0.1)",
          color: "#F59E0B",
          padding: "2px 8px",
          fontSize: 11,
          fontWeight: 600,
          cursor: "pointer",
          lineHeight: 1.4,
        }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        Détail
      </button>

      {/* Backdrop + Modal */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(15,23,42,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            backdropFilter: "blur(2px)",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "var(--cream-50)",
              borderRadius: "var(--r-xl)",
              width: "100%",
              maxWidth: 460,
              boxShadow: "0 24px 64px rgba(15,23,42,0.25)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div style={{ background: "var(--ink-900)", padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-400)" }}>
                  Estimation IR
                </p>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--cream-50)", marginTop: 2 }}>
                  Détail du calcul
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{ border: "none", background: "transparent", color: "var(--ink-400)", cursor: "pointer", fontSize: 20, lineHeight: 1, padding: 4 }}
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Steps */}
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>

                {/* CA période */}
                <Row label={`CA de la période`} value={`${fmt(periodRevenue)} €`} />
                <Row
                  label={`× ${periodsPerYear} ${periodLabel}s → CA annualisé`}
                  value={`${fmt(annualRevenue)} €`}
                  highlight
                />

                <Spacer />

                {/* Abattement */}
                <Row
                  label={`Abattement micro · ${LABEL_ACTIVITE[activityType]}`}
                  value={`− ${fmt(deduction)} €`}
                  sub="Déduction forfaitaire sur charges"
                />
                <Row
                  label="Revenu net imposable"
                  value={`${fmt(taxableIncome)} €`}
                  highlight
                />

                <Spacer />

                {/* Barème */}
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-400)", paddingTop: 4 }}>
                  Barème 2025 appliqué
                </p>
                {brackets.length === 0 ? (
                  <Row label="0% · en dessous du seuil imposable" value="0,00 €" />
                ) : (
                  brackets.map((b, i) => (
                    <Row
                      key={i}
                      label={b.label}
                      sub={`sur ${fmt(b.amount)} €`}
                      value={`${fmt(b.tax)} €`}
                    />
                  ))
                )}

                <Spacer />

                {/* Totaux */}
                <Row label="Total IR annuel estimé" value={`${fmt(annualIR)} €`} bold />
                <Row
                  label={`÷ ${periodsPerYear} → provision / ${periodLabel}`}
                  value={`${fmt(irEstimate)} €`}
                  bold
                  highlight
                  accent
                />
              </div>

              {/* Disclaimer */}
              <div style={{
                borderRadius: "var(--r-sm)",
                background: "rgba(245,158,11,0.07)",
                border: "1px solid rgba(245,158,11,0.25)",
                padding: "10px 14px",
              }}>
                <p style={{ fontSize: 12, color: "#92400E", lineHeight: 1.6 }}>
                  <strong>Hypothèses :</strong> foyer fiscal d&apos;1 part, aucun autre revenu, abattement forfaitaire micro sans autres charges réelles. Cette estimation peut différer de votre impôt final — consultez un comptable pour votre situation précise.
                </p>
              </div>

              {/* CTA fermer */}
              <button
                onClick={() => setOpen(false)}
                style={{
                  borderRadius: "var(--r-sm)",
                  border: "none",
                  background: "var(--ink-900)",
                  color: "var(--cream-200)",
                  padding: "11px 20px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                Compris
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ─── Sub-components ────────────────────────────────────────────────────────

function Row({ label, sub, value, highlight, bold, accent }: {
  label: string
  sub?: string
  value: string
  highlight?: boolean
  bold?: boolean
  accent?: boolean
}) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      padding: "7px 10px",
      borderRadius: "var(--r-sm)",
      background: highlight ? (accent ? "rgba(132,204,22,0.08)" : "var(--cream-100)") : "transparent",
    }}>
      <div>
        <p style={{ fontSize: 13, color: bold ? "var(--ink-900)" : "var(--ink-600)", fontWeight: bold ? 700 : 400 }}>
          {label}
        </p>
        {sub && <p style={{ fontSize: 11, color: "var(--ink-400)", marginTop: 1 }}>{sub}</p>}
      </div>
      <span style={{
        fontSize: 13,
        fontFamily: "var(--font-mono, monospace)",
        fontWeight: bold ? 700 : 500,
        color: accent ? "var(--lime-700, #4d7c0f)" : bold ? "var(--ink-900)" : "var(--ink-700)",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}>
        {value}
      </span>
    </div>
  )
}

function Spacer() {
  return <div style={{ height: 1, background: "var(--cream-200)", margin: "4px 0" }} />
}
