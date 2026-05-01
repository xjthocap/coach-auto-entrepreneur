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
  currentExpenses,
  daysElapsed,
  totalDays,
}: ProjectionCardProps) {
  const progressPct = Math.min(100, Math.round((daysElapsed / totalDays) * 100))
  const daysLeft = Math.max(0, totalDays - daysElapsed)
  const dailyAvgRevenue = daysElapsed > 0 ? currentRevenue / daysElapsed : 0
  const isOnTrack = projectedRealNet > 0

  // Velocity label
  const velocityLabel =
    dailyAvgRevenue > 0
      ? dailyAvgRevenue.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " €/j"
      : "—"

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
          padding: "16px 24px",
          borderBottom: "1px solid var(--cream-200)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--violet-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-900)" }}>
            Projection
          </span>
          <span style={{ fontSize: 12, color: "var(--ink-400)" }}>·</span>
          <span style={{ fontSize: 12, color: "var(--ink-400)" }}>Fin de période</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              borderRadius: 999,
              border: "1px solid var(--cream-300)",
              background: "var(--cream-100)",
              padding: "4px 12px",
              fontSize: 12,
              fontWeight: 500,
              color: "var(--ink-600)",
            }}
          >
            {periodLabel}
          </span>
          <span
            style={{
              borderRadius: 999,
              padding: "4px 12px",
              fontSize: 11,
              fontWeight: 700,
              background: isOnTrack ? "rgba(196,181,253,0.18)" : "rgba(251,113,133,0.15)",
              color: isOnTrack ? "var(--violet-700)" : "var(--rose-500)",
            }}
          >
            {isOnTrack ? "En bonne voie" : "Attention"}
          </span>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ padding: "20px 24px 24px" }}>

        {/* Progress bar */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: "var(--ink-400)", fontWeight: 500 }}>
              Avancement de la période
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-700)" }}>
              J{daysElapsed}/{totalDays} · {daysLeft > 0 ? `encore ${daysLeft} j` : "période terminée"}
            </span>
          </div>
          <div style={{ height: 6, borderRadius: 999, background: "var(--cream-200)", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                borderRadius: 999,
                background: "var(--violet-500)",
                width: `${progressPct}%`,
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>

        {/* Main stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>

          {/* Projected net — hero */}
          <div
            style={{
              background: "var(--ink-900)",
              borderRadius: "var(--r-md)",
              padding: "16px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-400)" }}>
              Disponible réel projeté
            </p>
            <p
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: 28,
                fontWeight: 300,
                letterSpacing: "-0.04em",
                color: isOnTrack ? "var(--lime-500)" : "var(--rose-500)",
                lineHeight: 1,
              }}
            >
              {projectedRealNet.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}
              <span style={{ fontSize: 15, marginLeft: 3 }}>€</span>
            </p>
            <p style={{ fontSize: 11, color: "var(--ink-400)" }}>
              si le rythme actuel continue
            </p>
          </div>

          {/* Daily velocity */}
          <div
            style={{
              background: "var(--cream-100)",
              borderRadius: "var(--r-md)",
              padding: "16px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-400)" }}>
              Vélocité actuelle
            </p>
            <p
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: 28,
                fontWeight: 300,
                letterSpacing: "-0.04em",
                color: "var(--ink-900)",
                lineHeight: 1,
              }}
            >
              {velocityLabel}
            </p>
            <p style={{ fontSize: 11, color: "var(--ink-400)" }}>
              moyenne sur {daysElapsed} j encaissés
            </p>
          </div>
        </div>

        {/* Breakdown row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 8,
          }}
        >
          {[
            { label: "CA projeté", value: projectedRevenue, color: "var(--ink-900)" },
            { label: "Charges", value: projectedCharges, color: "var(--rose-500)" },
            { label: "Impôt", value: projectedTax, color: "var(--rose-500)" },
            { label: "Dépenses", value: projectedExpenses, color: "var(--rose-500)" },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: "var(--cream-100)",
                borderRadius: "var(--r-sm)",
                padding: "10px 12px",
              }}
            >
              <p style={{ fontSize: 10, color: "var(--ink-400)", marginBottom: 4, fontWeight: 500, letterSpacing: "0.04em" }}>
                {item.label}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: 13,
                  fontWeight: 500,
                  color: item.color,
                  letterSpacing: "-0.02em",
                }}
              >
                {item.value.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
