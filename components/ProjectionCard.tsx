type ProjectionCardProps = {
  periodLabel: string
  projectedRevenue: number
  projectedCharges: number
  projectedTax: number
  projectedExpenses: number
  projectedRealNet: number
  currentRevenue: number
  currentExpenses: number
  daysElapsed: number
  totalDays: number
}

export default function ProjectionCard({
  periodLabel,
  projectedRevenue,
  projectedCharges,
  projectedTax,
  projectedExpenses,
  projectedRealNet,
  currentRevenue,
  daysElapsed,
  totalDays,
}: ProjectionCardProps) {
  const timePct = Math.min(100, Math.round((daysElapsed / totalDays) * 100))
  const daysLeft = Math.max(0, totalDays - daysElapsed)
  const dailyAvg = daysElapsed > 0 ? currentRevenue / daysElapsed : 0

  // Revenue progress vs time progress → ahead / behind / early
  const revPct = projectedRevenue > 0
    ? Math.min(100, Math.round((currentRevenue / projectedRevenue) * 100))
    : 0
  const gap = revPct - timePct // positive = ahead, negative = behind

  const isTooEarly = daysElapsed <= 3
  const isOnTrack = projectedRealNet > 0

  const paceLabel = isTooEarly
    ? "Trop tôt pour projeter"
    : gap >= 5
    ? `En avance · +${gap}%`
    : gap <= -5
    ? `En retard · ${gap}%`
    : "Dans les temps"

  const paceColor = isTooEarly
    ? "var(--ink-400)"
    : gap >= 5
    ? "var(--lime-700)"
    : gap <= -5
    ? "var(--rose-500)"
    : "var(--violet-700)"

  const paceBg = isTooEarly
    ? "var(--cream-200)"
    : gap >= 5
    ? "rgba(132,204,22,0.12)"
    : gap <= -5
    ? "rgba(251,113,133,0.12)"
    : "rgba(196,181,253,0.18)"

  const fmt = (n: number, decimals = 0) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

  return (
    <div
      style={{
        borderRadius: "var(--r-lg)",
        background: "var(--cream-50)",
        boxShadow: "var(--shadow-md)",
        overflow: "hidden",
      }}
    >
      {/* ── HEADER ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "14px 20px",
          borderBottom: "1px solid var(--cream-200)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--violet-500)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-900)" }}>
            Projection · Fin de période
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 500, color: "var(--ink-400)", background: "var(--cream-100)", border: "1px solid var(--cream-200)", borderRadius: 999, padding: "3px 10px" }}>
            {periodLabel}
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, color: paceColor, background: paceBg, borderRadius: 999, padding: "3px 10px" }}>
            {paceLabel}
          </span>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ padding: "18px 20px 20px" }}>

        {/* Double progress bar : temps vs revenus */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-500)" }}>Période écoulée</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-500)" }}>
              {daysLeft > 0 ? `encore ${daysLeft} jour${daysLeft > 1 ? "s" : ""}` : "période terminée"}
            </span>
          </div>

          {/* Barre temps */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 10, color: "var(--ink-400)", width: 56, flexShrink: 0 }}>Temps</span>
            <div style={{ flex: 1, height: 6, borderRadius: 999, background: "var(--cream-200)", overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 999, background: "var(--ink-400)", width: `${timePct}%`, transition: "width 0.4s ease" }} />
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, color: "var(--ink-600)", width: 32, textAlign: "right" }}>{timePct}%</span>
          </div>

          {/* Barre revenus */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 10, color: "var(--ink-400)", width: 56, flexShrink: 0 }}>Revenus</span>
            <div style={{ flex: 1, height: 6, borderRadius: 999, background: "var(--cream-200)", overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 999, background: "var(--violet-500)", width: `${revPct}%`, transition: "width 0.4s ease" }} />
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, color: "var(--violet-700)", width: 32, textAlign: "right" }}>{revPct}%</span>
          </div>
        </div>

        {/* Hero + rythme */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>

          <div style={{ background: "var(--ink-900)", borderRadius: "var(--r-md)", padding: "14px 16px" }}>
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-400)", marginBottom: 8 }}>
              Disponible projeté
            </p>
            {isTooEarly ? (
              <p style={{ fontSize: 13, color: "var(--ink-400)", lineHeight: 1.4 }}>
                Reviens dans quelques jours pour voir la projection.
              </p>
            ) : (
              <>
                <p style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 24, fontWeight: 300, letterSpacing: "-0.04em", color: isOnTrack ? "var(--lime-500)" : "var(--rose-500)", lineHeight: 1 }}>
                  {fmt(projectedRealNet, 0)}<span style={{ fontSize: 13, marginLeft: 3 }}>€</span>
                </p>
                <p style={{ fontSize: 10, color: "var(--ink-500)", marginTop: 6 }}>si le rythme se maintient</p>
              </>
            )}
          </div>

          <div style={{ background: "var(--cream-100)", borderRadius: "var(--r-md)", padding: "14px 16px" }}>
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-400)", marginBottom: 8 }}>
              Rythme actuel
            </p>
            <p style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 24, fontWeight: 300, letterSpacing: "-0.04em", color: "var(--ink-900)", lineHeight: 1 }}>
              {dailyAvg > 0 ? `${fmt(dailyAvg)} €` : "—"}
            </p>
            <p style={{ fontSize: 10, color: "var(--ink-400)", marginTop: 6 }}>par jour en moyenne</p>
          </div>
        </div>

        {/* Breakdown — 2+2 sur mobile */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }} className="md:grid-cols-4">
          {[
            { label: "CA projeté", value: projectedRevenue, color: "var(--ink-900)" },
            { label: "Charges + impôt", value: projectedCharges + projectedTax, color: "var(--rose-500)" },
            { label: "Dépenses", value: projectedExpenses, color: "var(--rose-500)" },
            { label: "Net projeté", value: projectedRevenue - projectedCharges - projectedTax, color: "var(--violet-700)" },
          ].map((item) => (
            <div
              key={item.label}
              style={{ background: "var(--cream-100)", borderRadius: "var(--r-sm)", padding: "9px 12px" }}
            >
              <p style={{ fontSize: 10, color: "var(--ink-400)", marginBottom: 4, fontWeight: 500 }}>
                {item.label}
              </p>
              <p style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 13, fontWeight: 500, color: item.color, letterSpacing: "-0.02em" }}>
                {fmt(item.value)} €
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
