"use client"

import { useEffect, useState } from "react"

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

export default function AIInsightsCard(props: Props) {
  const [data, setData] = useState<any>(null)
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
        body: JSON.stringify(props),
      })

      const json = await res.json()
      setData(json)
    } catch (err) {
      console.error("Erreur IA:", err)

      setData({
        score: 50,
        status: "warning",
        message: "Analyse indisponible.",
        insights: [
          "Vérifie tes dépenses.",
          "Mets de côté régulièrement.",
          "Surveille ton activité.",
        ],
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border p-6 bg-white">
        <p className="text-sm text-slate-500">Analyse en cours...</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-purple-200 bg-white p-6 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-purple-500 font-semibold">COACH IA</p>

        <button
          onClick={() => loadInsights(true)}
          disabled={refreshing}
          className="text-xs px-3 py-1.5 rounded-xl bg-purple-100 text-purple-600 hover:bg-purple-200 transition disabled:opacity-50"
        >
          {refreshing ? "Mise à jour..." : "Actualiser"}
        </button>
      </div>

      <h3 className="text-2xl font-semibold">Analyse intelligente</h3>

      <p className="text-sm text-slate-500">
        Lecture de ta situation sur {props.periodLabel}.
      </p>

      <div>
        <p className="text-sm text-slate-500">Score de santé</p>
        <p className="text-4xl font-bold">{data.score}/100</p>
      </div>

      <div
        className={`p-4 rounded-xl text-sm ${
          data.status === "danger"
            ? "bg-red-50 text-red-600"
            : data.status === "warning"
            ? "bg-orange-50 text-orange-600"
            : "bg-green-50 text-green-600"
        }`}
      >
        {data.message}
      </div>

      <div className="space-y-3">
        {data.insights?.map((insight: string, i: number) => (
          <div key={i} className="rounded-xl border p-4 bg-[#f8f9fd]">
            <span className="text-purple-500 font-bold mr-2">
              {i + 1}.
            </span>
            {insight}
          </div>
        ))}
      </div>
    </div>
  )
}