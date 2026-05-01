"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts"

type Revenue = {
  amount: number
  date: string
}

const MONTHS_FR = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"]

function groupByMonth(revenues: Revenue[]) {
  const map: Record<string, number> = {}

  revenues.forEach((rev) => {
    // Parse date parts directly to avoid timezone issues
    const [y, m] = rev.date.split("-").map(Number)
    const key = `${y}-${String(m).padStart(2, "0")}`
    map[key] = (map[key] || 0) + Number(rev.amount)
  })

  const sorted = Object.entries(map).sort()

  return sorted.map(([key, value]) => {
    const [, month] = key.split("-").map(Number)
    return {
      name: MONTHS_FR[month - 1],
      value,
      key,
    }
  })
}

// Custom tooltip
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        borderRadius: "var(--r-md)",
        border: "1px solid var(--cream-200)",
        background: "var(--ink-900)",
        boxShadow: "var(--shadow-lg)",
        padding: "10px 16px",
      }}
    >
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-400)", marginBottom: 4 }}>
        {label}
      </p>
      <p style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 18, fontWeight: 400, color: "var(--lime-500)", letterSpacing: "-0.03em" }}>
        {payload[0].value.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
      </p>
    </div>
  )
}

export default function RevenueChart({ revenues }: { revenues: Revenue[] }) {
  const data = groupByMonth(revenues)
  const currentYear = new Date().getFullYear()
  const maxValue = Math.max(...data.map(d => d.value), 0)
  const currentMonthKey = `${currentYear}-${String(new Date().getMonth() + 1).padStart(2, "0")}`

  if (data.length === 0) {
    return (
      <div
        style={{
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 200,
          gap: 8,
        }}
      >
        <p style={{ fontSize: 13, color: "var(--ink-400)" }}>Aucun revenu enregistré pour {currentYear}</p>
      </div>
    )
  }

  return (
    <div style={{ padding: "24px 24px 16px" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
          <div>
            <p
              style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-400)", marginBottom: 4 }}
            >
              Évolution du chiffre d'affaires
            </p>
            <h2
              style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--ink-900)", lineHeight: 1 }}
            >
              Année {currentYear}
            </h2>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 11, color: "var(--ink-400)", letterSpacing: "0.04em" }}>Total</p>
            <p
              style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 18, fontWeight: 400, color: "var(--ink-900)", letterSpacing: "-0.03em" }}
            >
              {revenues.reduce((s, r) => s + Number(r.amount), 0).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="28%" barGap={4}>
            <CartesianGrid stroke="var(--cream-200)" vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fill: "var(--ink-400)", fontSize: 12, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--ink-400)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) =>
                v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`
              }
              width={40}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(0,0,0,0.03)", radius: 6 } as object}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={52}>
              {data.map((entry) => {
                const isCurrent = entry.key === currentMonthKey
                const isMax = entry.value === maxValue && maxValue > 0
                return (
                  <Cell
                    key={entry.key}
                    fill={
                      isCurrent
                        ? "var(--violet-500)"
                        : isMax
                        ? "var(--ink-900)"
                        : "var(--cream-300)"
                    }
                  />
                )
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--cream-200)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, background: "var(--violet-500)", display: "inline-block" }} />
          <span style={{ fontSize: 11, color: "var(--ink-400)" }}>Mois en cours</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, background: "var(--ink-900)", display: "inline-block" }} />
          <span style={{ fontSize: 11, color: "var(--ink-400)" }}>Meilleur mois</span>
        </div>
      </div>
    </div>
  )
}
