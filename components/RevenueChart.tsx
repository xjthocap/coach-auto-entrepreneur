"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

type Revenue = {
  amount: number
  date: string
}

function groupByMonth(revenues: Revenue[]) {
  const map: Record<string, number> = {}

  revenues.forEach((rev) => {
    const date = new Date(rev.date)
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`

    if (!map[key]) {
      map[key] = 0
    }

    map[key] += Number(rev.amount)
  })

  const sorted = Object.entries(map).sort()

  return sorted.map(([key, value]) => {
    const [year, month] = key.split("-")

    const label = new Date(
      Number(year),
      Number(month) - 1
    ).toLocaleDateString("fr-FR", {
      month: "short",
      year: "numeric",
    })

    return {
      name: label,
      value,
    }
  })
}

export default function RevenueChart({ revenues }: { revenues: Revenue[] }) {
  const data = groupByMonth(revenues)
  const currentYear = new Date().getFullYear()

  return (
    <div className="rounded-[28px] border border-white/80 bg-white/80 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
          Évolution de ton chiffre d'affaires
        </h2>
        <span className="text-xs text-slate-500">Année {currentYear}</span>
      </div>

      <div className="h-[360px] rounded-2xl border border-slate-100 bg-[#fbfcff] p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#e7ebf3" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "#64748b", fontSize: 13 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 13 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "18px",
                border: "1px solid #dbe4f3",
                background: "#ffffff",
                boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#4f7df3"
              strokeWidth={3}
              dot={{ r: 5, fill: "#ffffff", stroke: "#4f7df3", strokeWidth: 2 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}