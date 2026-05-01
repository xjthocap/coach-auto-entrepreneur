"use client"

import { useEffect, useState } from "react"

type InsightData = {
  score: number
  status: "safe" | "warning" | "danger"
  message: string
  insights: string[]
}

type Props = {
  totalRevenue: number
  charges: number
  tax: number
  expenses: number
  realNet: number
  reserveAmount: number
  thresholdRatio: number
  periodLabel: string
  activityType: string
  daysRemaining: number
}

const statusConfig = {
  safe: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    label: "Situation saine",
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    dot: "bg-amber-500",
    label: "Attention requise",
  },
  danger: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    dot: "bg-red-500",
    label: "Situation tendue",
  },
}

export default function AIInsightsCard(props: Props) {
  const [data, setData] = useState<InsightData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadInsights()
  }, [props.totalRevenue, props.expenses])

  async function loadInsights(isManual = false) {
    try {
      if (isManual) setRefreshing(true)
      else setLoading(true)

      const res = await fetch("/api/ai-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(props),
      })

      const json = await res.json()
      setData(json)
    } catch {
      setData({
        score: 50,
        status: "warning",
        message: "Analyse indisponible pour le moment.",
        insights: [
          "Vérifie tes dépenses régulièrement.",
          "Mets de côté une part de chaque encaissement.",
          "Surveille ton seuil annuel.",
        ],
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-[28px] border border-purple-100 bg-white p-6">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 animate-pulse rounded-full bg-purple-400" />
          <p className="text-sm font-medium text-slate-500">
            Analyse IA en cours...
          </p>
        </div>
        <div className="mt-4 space-y-3">
          <div className="h-8 w-24 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-4 w-full animate-pulse rounded-xl bg-slate-100" />
          <div className="h-4 w-3/4 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </div>
    )
  }

  if (!data) return null

  const config = statusConfig[data.status]

  return (
    <div className="rounded-[28px] border border-purple-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-600">
            Coach IA
          </span>
          <span className="text-xs text-slate-400">{props.periodLabel}</span>
        </div>

        <button
          onClick={() => loadInsights(true)}
          disabled={refreshing}
          className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-200 disabled:opacity-50"
        >
          {refreshing ? "Actualisation..." : "Actualiser"}
        </button>
      </div>

      <div className="mt-5 flex items-end gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Score de santé
          </p>
          <p className="mt-1 text-5xl font-black tracking-tight text-slate-950">
            {data.score}
            <span className="text-2xl font-medium text-slate-400">/100</span>
          </p>
        </div>

        <div
          className={`mb-2 flex items-center gap-2 rounded-full border px-3 py-1.5 ${config.bg} ${config.border}`}
        >
          <span className={`h-2 w-2 rounded-full ${config.dot}`} />
          <span className={`text-xs font-semibold ${config.text}`}>
            {config.label}
          </span>
        </div>
      </div>

      <div
        className={`mt-4 rounded-2xl border p-4 ${config.bg} ${config.border}`}
      >
        <p className={`text-sm font-medium ${config.text}`}>{data.message}</p>
      </div>

      <div className="mt-4 space-y-3">
        {data.insights?.map((insight, i) => (
          <div
            key={i}
            className="flex gap-3 rounded-2xl border border-slate-100 bg-[#f8f9fd] p-4"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-600">
              {i + 1}
            </span>
            <p className="text-sm leading-6 text-slate-700">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
