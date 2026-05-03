"use client"

import { useEffect, useState, useRef } from "react"

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
  prevRevenue?: number
  prevPeriodLabel?: string
}

const statusConfig = {
  safe: {
    label: "Situation saine",
    dot: "var(--lime-500)",
    badge: { background: "rgba(196,181,253,0.18)", color: "var(--violet-700)" },
    msg: { background: "rgba(196,181,253,0.12)", border: "rgba(196,181,253,0.35)", color: "var(--violet-700)" },
  },
  warning: {
    label: "Attention requise",
    dot: "#F59E0B",
    badge: { background: "rgba(245,158,11,0.12)", color: "#92400E" },
    msg: { background: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.3)", color: "#92400E" },
  },
  danger: {
    label: "Situation tendue",
    dot: "var(--rose-500)",
    badge: { background: "rgba(251,113,133,0.12)", color: "var(--rose-600, #E11D48)" },
    msg: { background: "rgba(251,113,133,0.08)", border: "rgba(251,113,133,0.3)", color: "var(--rose-600, #E11D48)" },
  },
}

function parseInsightText(text: string) {
  // Support **bold** markdown in insight text
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} style={{ fontWeight: 700, color: "var(--ink-900)" }}>{part.slice(2, -2)}</strong>
    }
    return <span key={i}>{part}</span>
  })
}

export default function AIInsightsCard(props: Props) {
  const [data, setData] = useState<InsightData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)
  const loadedOnce = useRef(false)

  useEffect(() => {
    if (!loadedOnce.current) {
      loadedOnce.current = true
      loadInsights()
    }
  }, [])

  // Reload when period changes
  useEffect(() => {
    if (loadedOnce.current) {
      loadInsights()
    }
  }, [props.totalRevenue, props.expenses, props.periodLabel])

  const cacheKey = `ai:${props.periodLabel}:${Math.round(props.totalRevenue)}:${Math.round(props.expenses)}`

  async function loadInsights(isManual = false) {
    // Check localStorage cache (2h TTL) unless manual refresh
    if (!isManual) {
      try {
        const cached = localStorage.getItem(cacheKey)
        if (cached) {
          const { data: cachedData, ts } = JSON.parse(cached)
          if (Date.now() - ts < 2 * 60 * 60 * 1000) {
            setData(cachedData)
            setUpdatedAt(new Date(ts))
            setLoading(false)
            return
          }
        }
      } catch { /* ignore localStorage errors */ }
    }

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
      setUpdatedAt(new Date())
      try { localStorage.setItem(cacheKey, JSON.stringify({ data: json, ts: Date.now() })) } catch { /* ignore */ }
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

  function formatUpdatedAt(date: Date) {
    const diff = Math.floor((Date.now() - date.getTime()) / 60000)
    if (diff < 1) return "à l'instant"
    if (diff < 60) return `il y a ${diff} min`
    return `il y a ${Math.floor(diff / 60)}h`
  }

  if (loading) {
    return (
      <div
        style={{
          borderRadius: "var(--r-lg)",
          background: "var(--cream-50)",
          boxShadow: "var(--shadow-md)",
          padding: "28px 28px",
          overflow: "hidden",
        }}
      >
        {/* Header skeleton */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: 999, background: "var(--cream-200)", animation: "pulse 1.5s infinite" }} />
            <div style={{ width: 70, height: 12, borderRadius: 6, background: "var(--cream-200)" }} />
          </div>
          <div style={{ width: 80, height: 28, borderRadius: 999, background: "var(--cream-200)" }} />
        </div>
        {/* Body skeleton */}
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "auto 1fr" }}>
          <div style={{ width: 100, height: 80, borderRadius: "var(--r-sm)", background: "var(--cream-200)" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: 44, borderRadius: "var(--r-sm)", background: "var(--cream-200)", opacity: 1 - i * 0.15 }} />
            ))}
          </div>
        </div>
        <p style={{ marginTop: 16, fontSize: 13, color: "var(--ink-400)" }}>
          Analyse IA en cours…
        </p>
      </div>
    )
  }

  if (!data) return null

  const cfg = statusConfig[data.status]

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
          {/* Animated dot */}
          <span
            className="pulsing-dot"
            style={{ display: "inline-block", width: 7, height: 7, borderRadius: 999, background: cfg.dot, flexShrink: 0 }}
          />
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-900)" }}>
            Coach IA
          </span>
          <span style={{ fontSize: 12, color: "var(--ink-400)" }}>·</span>
          <span style={{ fontSize: 12, color: "var(--ink-400)" }}>{props.periodLabel}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {updatedAt && (
            <span style={{ fontSize: 11, color: "var(--ink-400)" }}>
              Mis à jour {formatUpdatedAt(updatedAt)}
            </span>
          )}
          <button
            onClick={() => loadInsights(true)}
            disabled={refreshing}
            style={{
              borderRadius: 999,
              border: "1px solid var(--cream-300)",
              background: "var(--cream-100)",
              color: "var(--ink-700)",
              padding: "5px 14px",
              fontSize: 12,
              fontWeight: 600,
              cursor: refreshing ? "default" : "pointer",
              opacity: refreshing ? 0.6 : 1,
              whiteSpace: "nowrap",
            }}
          >
            {refreshing ? "…" : "↻ Actualiser"}
          </button>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ padding: "20px 24px 24px", display: "grid", gap: 20 }}>

        {/* Score + insights grid */}
        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 16, alignItems: "start" }}>

          {/* Score column */}
          <div
            style={{
              background: "var(--ink-900)",
              borderRadius: "var(--r-md)",
              padding: "16px 12px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-400)" }}>
              Score
            </p>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 42, fontWeight: 300, letterSpacing: "-0.04em", color: "var(--lime-500)", lineHeight: 1 }}>
                {data.score}
              </span>
              <span style={{ fontSize: 14, color: "var(--ink-400)", marginLeft: 1 }}>/100</span>
            </div>
            <span
              style={{
                borderRadius: 999,
                padding: "4px 10px",
                fontSize: 10,
                fontWeight: 700,
                background: cfg.badge.background,
                color: data.status === "safe" ? "var(--lime-500)" : cfg.badge.color,
                whiteSpace: "nowrap",
              }}
            >
              {cfg.label}
            </span>
          </div>

          {/* Insights column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.insights?.map((insight, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  background: "var(--cream-100)",
                  borderRadius: "var(--r-sm)",
                  padding: "10px 12px",
                  border: "1px solid var(--cream-200)",
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 20,
                    height: 20,
                    borderRadius: 999,
                    background: "var(--ink-900)",
                    color: "var(--lime-500)",
                    fontSize: 10,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 1,
                  }}
                >
                  {i + 1}
                </span>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--ink-700)", margin: 0 }}>
                  {parseInsightText(insight)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Message */}
        <div
          style={{
            borderRadius: "var(--r-sm)",
            border: `1px solid ${cfg.msg.border}`,
            background: cfg.msg.background,
            padding: "12px 16px",
          }}
        >
          <p style={{ fontSize: 13, lineHeight: 1.6, color: cfg.msg.color, margin: 0, fontStyle: "italic" }}>
            « {data.message} »
          </p>
        </div>

      </div>
    </div>
  )
}
