"use client"

import { useState, useMemo } from "react"
import Link from "next/link"

type ActivityType = "service" | "vente" | "liberal"

const ACTIVITIES: { value: ActivityType; label: string; urssaf: number; abattement: number }[] = [
  { value: "service",  label: "Prestation de services (BIC)",          urssaf: 0.212, abattement: 0.50 },
  { value: "vente",    label: "Vente de marchandises",                  urssaf: 0.123, abattement: 0.71 },
  { value: "liberal",  label: "Profession libérale non réglementée",   urssaf: 0.256, abattement: 0.34 },
]

const BAREME_IR = [
  { min: 0,       max: 11_497,  rate: 0    },
  { min: 11_497,  max: 29_315,  rate: 0.11 },
  { min: 29_315,  max: 83_823,  rate: 0.30 },
  { min: 83_823,  max: 180_294, rate: 0.41 },
  { min: 180_294, max: Infinity, rate: 0.45 },
]

function computeIR(annual: number, abattement: number) {
  const taxable = Math.max(0, annual * (1 - abattement))
  let tax = 0
  for (const { min, max, rate } of BAREME_IR) {
    if (taxable <= min) break
    tax += (Math.min(taxable, max) - min) * rate
  }
  return tax / 12
}

function fmt(n: number) {
  return Math.round(n).toLocaleString("fr-FR")
}

export default function LandingCalculator() {
  const [ca, setCa] = useState(3000)
  const [activity, setActivity] = useState<ActivityType>("service")

  const act = ACTIVITIES.find(a => a.value === activity)!

  const result = useMemo(() => {
    const urssaf = ca * act.urssaf
    const ir = computeIR(ca * 12, act.abattement)
    const net = ca - urssaf - ir
    const pct = ca > 0 ? Math.round((net / ca) * 100) : 0
    return { urssaf, ir, net, pct }
  }, [ca, act])

  return (
    <section className="lc-section">
      <style>{`
        .lc-section {
          background: #F4EFE6;
          padding: 96px 0;
        }
        .lc-inner {
          max-width: 880px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .lc-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #7C5CFF;
          margin-bottom: 14px;
        }
        .lc-eyebrow-num {
          background: rgba(124,92,255,0.1);
          color: #7C5CFF;
          font-size: 10px;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 20px;
        }
        .lc-h2 {
          font-size: clamp(28px, 5vw, 44px);
          font-weight: 800;
          letter-spacing: -0.04em;
          color: #1A0F2E;
          margin-bottom: 10px;
          line-height: 1.1;
        }
        .lc-h2 em {
          font-style: italic;
          color: #7C5CFF;
        }
        .lc-sub {
          font-size: 16px;
          color: #6B5C84;
          margin-bottom: 48px;
          max-width: 480px;
        }
        .lc-card {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 4px 32px rgba(26,15,46,0.09);
          overflow: hidden;
        }
        .lc-inputs {
          padding: 36px 40px 28px;
          border-bottom: 1px solid rgba(26,15,46,0.06);
        }
        .lc-field {
          margin-bottom: 28px;
        }
        .lc-field:last-child {
          margin-bottom: 0;
        }
        .lc-label {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          font-size: 13px;
          font-weight: 600;
          color: #1A0F2E;
          margin-bottom: 12px;
        }
        .lc-label-value {
          font-size: 22px;
          font-weight: 800;
          color: #7C5CFF;
          letter-spacing: -0.03em;
        }
        .lc-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 6px;
          background: linear-gradient(
            to right,
            #7C5CFF 0%,
            #7C5CFF var(--pct),
            #E8E0F5 var(--pct),
            #E8E0F5 100%
          );
          outline: none;
          cursor: pointer;
        }
        .lc-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #7C5CFF;
          box-shadow: 0 2px 8px rgba(124,92,255,0.4);
          cursor: pointer;
          transition: transform 0.1s;
        }
        .lc-slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        .lc-slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #7C5CFF;
          box-shadow: 0 2px 8px rgba(124,92,255,0.4);
          cursor: pointer;
          border: none;
        }
        .lc-select {
          width: 100%;
          padding: 12px 16px;
          font-size: 14px;
          font-weight: 500;
          color: #1A0F2E;
          background: #F7F4FC;
          border: 1.5px solid #E8E0F5;
          border-radius: 10px;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237C5CFF' stroke-width='1.8' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          cursor: pointer;
          outline: none;
          transition: border-color 0.15s;
        }
        .lc-select:focus {
          border-color: #7C5CFF;
        }
        .lc-results {
          padding: 28px 40px 36px;
          background: #FDFBFF;
        }
        .lc-rows {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .lc-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 0;
          border-bottom: 1px solid rgba(26,15,46,0.05);
        }
        .lc-row:last-child {
          border-bottom: none;
        }
        .lc-row-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #6B5C84;
        }
        .lc-row-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .lc-row-amount {
          font-size: 15px;
          font-weight: 700;
          color: #1A0F2E;
        }
        .lc-row-amount.negative {
          color: #E53E3E;
        }
        .lc-net-row {
          margin-top: 16px;
          padding: 20px 24px;
          background: linear-gradient(135deg, #7C5CFF, #9B7BFF);
          border-radius: 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .lc-net-label {
          font-size: 14px;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
        }
        .lc-net-amount {
          font-size: clamp(22px, 4vw, 28px);
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.03em;
        }
        .lc-net-pct {
          font-size: 12px;
          color: rgba(255,255,255,0.7);
          margin-top: 2px;
          text-align: right;
        }
        .lc-disclaimer {
          margin-top: 16px;
          font-size: 12px;
          color: #9B8EC0;
          text-align: center;
        }
        .lc-cta {
          margin-top: 36px;
          text-align: center;
        }
        .lc-cta-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #7C5CFF;
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          padding: 14px 32px;
          border-radius: 100px;
          text-decoration: none;
          transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 8px 24px rgba(124,92,255,0.3);
        }
        .lc-cta-link:hover {
          background: #6A4AE8;
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(124,92,255,0.4);
        }
        .lc-cta-sub {
          font-size: 12px;
          color: #9B8EC0;
          margin-top: 10px;
        }

        @media (max-width: 640px) {
          .lc-inputs { padding: 24px 20px 20px; }
          .lc-results { padding: 20px 20px 28px; }
        }
      `}</style>

      <div className="lc-inner">
        <div className="lc-eyebrow">
          <span className="lc-eyebrow-num">02</span>
          Simulateur
        </div>
        <h2 className="lc-h2">
          Entre ton CA,<br />
          vois ce qu&apos;il te reste <em>vraiment</em>
        </h2>
        <p className="lc-sub">
          URSSAF + provision impôt calculés en direct. Pas d&apos;estimation au doigt mouillé.
        </p>

        <div className="lc-card">
          <div className="lc-inputs">
            {/* CA slider */}
            <div className="lc-field">
              <div className="lc-label">
                <span>CA mensuel</span>
                <span className="lc-label-value">{fmt(ca)} €</span>
              </div>
              <input
                type="range"
                className="lc-slider"
                min={500}
                max={15000}
                step={100}
                value={ca}
                onChange={e => setCa(Number(e.target.value))}
                style={{ "--pct": `${((ca - 500) / (15000 - 500)) * 100}%` } as React.CSSProperties}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9B8EC0", marginTop: 6 }}>
                <span>500 €</span>
                <span>15 000 €</span>
              </div>
            </div>

            {/* Type d'activité */}
            <div className="lc-field">
              <div className="lc-label" style={{ marginBottom: 8 }}>
                <span>Type d&apos;activité</span>
              </div>
              <select
                className="lc-select"
                value={activity}
                onChange={e => setActivity(e.target.value as ActivityType)}
              >
                {ACTIVITIES.map(a => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Résultats */}
          <div className="lc-results">
            <div className="lc-rows">
              <div className="lc-row">
                <div className="lc-row-label">
                  <div className="lc-row-dot" style={{ background: "#7C5CFF" }} />
                  CA facturé
                </div>
                <div className="lc-row-amount">+ {fmt(ca)} €</div>
              </div>
              <div className="lc-row">
                <div className="lc-row-label">
                  <div className="lc-row-dot" style={{ background: "#E53E3E" }} />
                  Cotisations URSSAF ({Math.round(act.urssaf * 100)}%)
                </div>
                <div className="lc-row-amount negative">− {fmt(result.urssaf)} €</div>
              </div>
              <div className="lc-row">
                <div className="lc-row-label">
                  <div className="lc-row-dot" style={{ background: "#F6A623" }} />
                  Provision impôt sur le revenu
                </div>
                <div className="lc-row-amount negative">− {fmt(result.ir)} €</div>
              </div>
            </div>

            <div className="lc-net-row">
              <div>
                <div className="lc-net-label">Disponible réel ce mois</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="lc-net-amount">{fmt(result.net)} €</div>
                <div className="lc-net-pct">soit {result.pct}% de ton CA</div>
              </div>
            </div>

            <p className="lc-disclaimer">
              Simulation indicative · foyer célibataire sans autre revenu · 1 part fiscale · hors dépenses pro · sans ACRE ni versement libératoire · professions libérales réglementées (CIPAV) : taux URSSAF différent (22,8%)
            </p>
          </div>
        </div>

        <div className="lc-cta">
          <Link href="/signup" className="lc-cta-link">
            Suivre mes vrais chiffres
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <p className="lc-cta-sub">Gratuit · sans carte bancaire</p>
        </div>
      </div>
    </section>
  )
}
