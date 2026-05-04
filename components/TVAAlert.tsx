import type { TVAStatus } from "@/lib/threshold"

type Props = {
  status: TVAStatus
  franchise: number
  tolerance: number
  yearRevenue: number
  remaining: number
  ratio: number
  activityType: "vente" | "service" | "liberal"
}

function fmt(n: number) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

export default function TVAAlert({ status, franchise, tolerance, yearRevenue, remaining, ratio, activityType }: Props) {
  if (status === "safe") return null

  const pct = Math.min(100, Math.round(ratio * 100))

  const config = {
    watch: {
      bg: "rgba(245,158,11,0.06)",
      border: "rgba(245,158,11,0.2)",
      barColor: "#F59E0B",
      badgeBg: "rgba(245,158,11,0.15)",
      badgeColor: "#B45309",
      icon: "⚠️",
      title: "Attention au seuil TVA",
      badge: "À surveiller",
    },
    warning: {
      bg: "rgba(249,115,22,0.06)",
      border: "rgba(249,115,22,0.25)",
      barColor: "#F97316",
      badgeBg: "rgba(249,115,22,0.15)",
      badgeColor: "#C2410C",
      icon: "🔶",
      title: "Proche du seuil TVA",
      badge: "Alerte seuil",
    },
    exceeded: {
      bg: "rgba(239,68,68,0.06)",
      border: "rgba(239,68,68,0.3)",
      barColor: "#EF4444",
      badgeBg: "rgba(239,68,68,0.15)",
      badgeColor: "#B91C1C",
      icon: "🚨",
      title: "Seuil TVA dépassé",
      badge: "Seuil dépassé",
    },
    critical: {
      bg: "rgba(239,68,68,0.1)",
      border: "rgba(239,68,68,0.4)",
      barColor: "#DC2626",
      badgeBg: "rgba(239,68,68,0.2)",
      badgeColor: "#991B1B",
      icon: "🚨",
      title: "Franchise TVA perdue",
      badge: "Action requise",
    },
  }[status]

  const isExceeded = status === "exceeded" || status === "critical"
  const isCritical = status === "critical"

  return (
    <div
      style={{
        borderRadius: "var(--r-xl)",
        border: `1px solid ${config.border}`,
        background: config.bg,
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>{config.icon}</span>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: config.badgeColor, margin: 0 }}>
              Franchise TVA
            </p>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--ink-900)", margin: 0, marginTop: 1 }}>
              {config.title}
            </h3>
          </div>
        </div>
        <span style={{
          borderRadius: 999,
          background: config.badgeBg,
          color: config.badgeColor,
          padding: "4px 12px",
          fontSize: 11,
          fontWeight: 700,
        }}>
          {config.badge}
        </span>
      </div>

      {/* Barre de progression */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: "var(--ink-500)" }}>
            {fmt(yearRevenue)} € encaissés
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: config.badgeColor }}>
            {pct}% du seuil ({fmt(franchise)} €)
          </span>
        </div>
        <div style={{ height: 6, borderRadius: 999, background: "rgba(0,0,0,0.08)", overflow: "hidden" }}>
          <div style={{
            height: "100%",
            borderRadius: 999,
            background: config.barColor,
            width: `${pct}%`,
            transition: "width 0.5s ease",
          }} />
        </div>
      </div>

      {/* Message contextuel */}
      <div style={{
        borderRadius: "var(--r-sm)",
        background: "rgba(255,255,255,0.6)",
        border: `1px solid ${config.border}`,
        padding: "12px 14px",
        fontSize: 13,
        color: "var(--ink-700)",
        lineHeight: 1.6,
      }}>
        {isCritical ? (
          <>
            <strong>Tu dépasses le seuil de tolérance ({fmt(tolerance)} €).</strong>{" "}
            Tu perds la franchise TVA dès maintenant — tes prochaines factures doivent inclure la TVA.
            Contacte l&apos;administration fiscale ou un comptable sans attendre.
          </>
        ) : isExceeded ? (
          <>
            <strong>Tu dépasses le seuil de franchise ({fmt(franchise)} €).</strong>{" "}
            La tolérance te permet de rester sans TVA jusqu&apos;à {fmt(tolerance)} € <em>si c&apos;est la première fois</em>.
            Au-delà, ou si c&apos;est la 2ème année consécutive, la TVA s&apos;applique immédiatement.
          </>
        ) : status === "warning" ? (
          <>
            Il te reste{" "}
            <strong style={{ color: config.badgeColor }}>{fmt(remaining)} €</strong>{" "}
            avant le seuil de franchise TVA ({fmt(franchise)} €).
            Anticipe dès maintenant : vérifie si tu pourras rester sous le seuil cette année.
          </>
        ) : (
          <>
            Il te reste{" "}
            <strong>{fmt(remaining)} €</strong>{" "}
            avant le seuil de franchise TVA ({fmt(franchise)} €).
            Continue à surveiller ton cumul annuel.
          </>
        )}
      </div>

      {/* Info seuils */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <span style={{
          borderRadius: 999, background: "rgba(255,255,255,0.7)",
          border: "1px solid rgba(0,0,0,0.08)", padding: "4px 12px",
          fontSize: 11, color: "var(--ink-500)",
        }}>
          Franchise {activityType === "vente" ? "vente" : "services"} : {fmt(franchise)} €
        </span>
        <span style={{
          borderRadius: 999, background: "rgba(255,255,255,0.7)",
          border: "1px solid rgba(0,0,0,0.08)", padding: "4px 12px",
          fontSize: 11, color: "var(--ink-500)",
        }}>
          Tolérance : {fmt(tolerance)} €
        </span>
        <span style={{
          borderRadius: 999, background: "rgba(255,255,255,0.7)",
          border: "1px solid rgba(0,0,0,0.08)", padding: "4px 12px",
          fontSize: 11, color: "var(--ink-500)",
        }}>
          Seuils 2025
        </span>
      </div>
    </div>
  )
}
