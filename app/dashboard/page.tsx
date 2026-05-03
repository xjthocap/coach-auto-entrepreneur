import Link from "next/link"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import AppSidebar from "@/components/AppSidebar"
import MobileNav from "@/components/MobileNav"
import AddRevenue from "@/components/AddRevenue"
import AddExpense from "@/components/AddExpense"
import RevenueChart from "@/components/RevenueChart"
import StatCard from "@/components/StatCard"
import RecentMovements from "@/components/RecentMovements"
import ProjectionCard from "@/components/ProjectionCard"
import ThresholdAlert from "@/components/ThresholdAlert"
import AIInsightsCard from "@/components/AIInsightsCard"
import DashboardPremiumShell from "@/components/DashboardPremiumShell"
import DevPlanSwitcher from "@/components/DevPlanSwitcher"
import CheckoutBanner from "@/components/CheckoutBanner"
import { calculateMicro } from "@/lib/calculations"
import { getPeriodRange } from "@/lib/period"
import { calculateProjection } from "@/lib/projection"
import { getThreshold, getThresholdStatus } from "@/lib/threshold"
import ExportPeriodButton from "@/components/ExportPeriodButton"
import TopbarPeriod from "@/components/TopbarPeriod"

function parseLocalDate(value: string) {
  const [year, month, day] = value.split("-").map(Number)
  return new Date(year, month - 1, day)
}

function formatLocalDate(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function parsePeriodDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number)
  return new Date(y, m - 1, d)
}

function buildPeriodLabel(frequency: "monthly" | "quarterly", period: { label: string; start: string; end: string }) {
  if (frequency === "monthly") return period.label
  // quarterly → "T2 2026 · avr. → juin"
  const startDate = parsePeriodDate(period.start)
  const endDate = parsePeriodDate(period.end)
  const startMonth = startDate.toLocaleDateString("fr-FR", { month: "short" }).replace(".", "")
  const endMonth = endDate.toLocaleDateString("fr-FR", { month: "short" }).replace(".", "")
  return `${period.label} · ${startMonth}. → ${endMonth}.`
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const supabase = await createClient()
  const resolvedSearchParams = await searchParams

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!profile) {
    redirect("/onboarding")
  }

  const frequency =
    profile.declaration_frequency === "quarterly"
      ? "quarterly"
      : "monthly"

  const dateParam = resolvedSearchParams?.date ?? null
  const baseDate = dateParam ? parseLocalDate(dateParam) : new Date()

  const period = getPeriodRange(frequency, baseDate)

  const step = frequency === "quarterly" ? 3 : 1

  const prevDate = new Date(baseDate)
  prevDate.setMonth(prevDate.getMonth() - step)

  const nextDate = new Date(baseDate)
  nextDate.setMonth(nextDate.getMonth() + step)

  const today = new Date()
  const endDate = parsePeriodDate(period.end)
  const diffTime = endDate.getTime() - today.getTime()
  const daysRemainingInPeriod = Math.max(
    0,
    Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  )

  // ===== ALERTE DÉCLARATION (basée sur la date réelle) =====
  const realToday = new Date()
  const realCurrentPeriod = getPeriodRange(frequency, realToday)
  const realCurrentEnd = parsePeriodDate(realCurrentPeriod.end)
  const daysUntilCurrentEnd = Math.ceil(
    (realCurrentEnd.getTime() - realToday.getTime()) / (1000 * 60 * 60 * 24)
  )

  // Période précédente pour fenêtre de déclaration
  const realPrevDate = new Date(realToday)
  realPrevDate.setMonth(realPrevDate.getMonth() - step)
  const realPrevPeriod = getPeriodRange(frequency, realPrevDate)
  const realPrevEnd = parsePeriodDate(realPrevPeriod.end)

  // Deadline = dernier jour du mois suivant la fin de période
  const deadlineDate = new Date(realPrevEnd.getFullYear(), realPrevEnd.getMonth() + 2, 0)
  const daysUntilDeadline = Math.ceil(
    (deadlineDate.getTime() - realToday.getTime()) / (1000 * 60 * 60 * 24)
  )
  const isInDeclarationWindow = realPrevEnd < realToday && daysUntilDeadline >= 0
  const isApproachingEnd = !isInDeclarationWindow && daysUntilCurrentEnd >= 0 && daysUntilCurrentEnd <= 7

  function formatDeadline(d: Date) {
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
  }

  // ===== REVENUS DE LA PÉRIODE =====
  const { data: revenues } = await supabase
    .from("revenues")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", period.start)
    .lte("date", period.end)
    .order("date", { ascending: false })

  const totalRevenue =
    revenues?.reduce((sum, r) => sum + Number(r.amount), 0) || 0

  // ===== INVOICES POUR LES REVENUS =====
  const revenueIds = (revenues || []).map((r) => r.id)
  const { data: invoices } =
    revenueIds.length > 0
      ? await supabase
          .from("invoices")
          .select("id, revenue_id")
          .in("revenue_id", revenueIds)
      : { data: [] }
  const invoiceByRevenueId = new Map(
    (invoices || []).map((inv) => [inv.revenue_id, inv.id])
  )
  const revenuesWithInvoices = (revenues || []).map((r) => ({
    ...r,
    invoices: invoiceByRevenueId.has(r.id)
      ? [{ id: invoiceByRevenueId.get(r.id)! }]
      : [],
  }))

  // ===== REVENUS DE L'ANNÉE DE LA PÉRIODE AFFICHÉE =====
  const selectedYear = baseDate.getFullYear()
  const yearStart = `${selectedYear}-01-01`
  const yearEnd = `${selectedYear}-12-31`

  const { data: yearRevenues } = await supabase
    .from("revenues")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", yearStart)
    .lte("date", yearEnd)

  const yearRevenue =
    yearRevenues?.reduce((sum, r) => sum + Number(r.amount), 0) || 0

  // ===== SEUIL =====
  const threshold = getThreshold(profile.activity_type)
  const thresholdInfo = getThresholdStatus(yearRevenue, threshold)
  const ratio = yearRevenue / threshold

  // ===== CALCULS MICRO =====
  const result = calculateMicro({
    revenue: totalRevenue,
    activityType: profile.activity_type,
    acre: profile.acre,
    versementLiberatoire: profile.versement_liberatoire,
  })

  // ===== DÉPENSES =====
  const { data: expenses } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })

  const totalExpenses =
    expenses?.reduce((sum, exp) => {
      if (exp.type === "one_time") {
        if (exp.date >= period.start && exp.date <= period.end) {
          return sum + Number(exp.amount)
        }
        return sum
      }
      if (exp.type === "recurring" && exp.active) {
        return sum + Number(exp.amount)
      }
      return sum
    }, 0) || 0

  const expensesWithPeriodInfo =
    expenses?.map((exp) => {
      const isInPeriod =
        exp.type === "one_time"
          ? exp.date >= period.start && exp.date <= period.end
          : exp.type === "recurring" && exp.active

      return { ...exp, isInPeriod }
    }) || []

  const realNet = result.net - totalExpenses
  const reserveAmount = result.charges + result.tax

  // ===== PÉRIODE PRÉCÉDENTE (pour comparatifs) =====
  const prevPeriod = getPeriodRange(frequency, prevDate)

  const { data: prevRevenues } = await supabase
    .from("revenues")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", prevPeriod.start)
    .lte("date", prevPeriod.end)

  const prevTotalRevenue =
    prevRevenues?.reduce((sum, r) => sum + Number(r.amount), 0) || 0

  const prevTotalExpenses =
    expenses?.reduce((sum, exp) => {
      if (exp.type === "one_time") {
        if (exp.date >= prevPeriod.start && exp.date <= prevPeriod.end) {
          return sum + Number(exp.amount)
        }
        return sum
      }
      if (exp.type === "recurring" && exp.active) {
        return sum + Number(exp.amount)
      }
      return sum
    }, 0) || 0

  const prevResult = calculateMicro({
    revenue: prevTotalRevenue,
    activityType: profile.activity_type,
    acre: profile.acre,
    versementLiberatoire: profile.versement_liberatoire,
  })
  const prevReserveAmount = prevResult.charges + prevResult.tax
  const prevRealNet = prevResult.net - prevTotalExpenses

  // ===== PROJECTION =====
  const projection = calculateProjection({
    currentRevenue: totalRevenue,
    currentExpenses: totalExpenses,
    start: period.start,
    end: period.end,
  })

  const projectedResult = calculateMicro({
    revenue: projection.projectedRevenue,
    activityType: profile.activity_type,
    acre: profile.acre,
    versementLiberatoire: profile.versement_liberatoire,
  })

  const projectedRealNet =
    projectedResult.net - projection.projectedExpenses

  const isPremium = profile.plan === "premium"

  return (
    <main className="min-h-screen" style={{ background: "var(--cream-100)", color: "var(--ink-900)" }}>
      <Suspense fallback={null}>
        <CheckoutBanner />
      </Suspense>
      <div className="flex min-h-screen">
        <AppSidebar activePage="dashboard" profile={profile} userEmail={user.email} />

        {/* CONTENT */}
        <section className="min-w-0 flex-1 pb-20 lg:pb-0 page-enter">

          {/* ── TOPBAR ── */}
          <header
            className="sticky top-0 z-20 backdrop-blur"
            style={{ background: "rgba(248, 247, 252, 0.92)", borderBottom: "1px solid var(--cream-300)" }}
          >
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 md:px-8">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.08em]" style={{ color: "var(--ink-400)" }}>
                  Dashboard
                </p>
                <h1 className="truncate text-[22px] font-semibold tracking-tight" style={{ color: "var(--ink-900)" }}>
                  Bonjour {profile.first_name || "à toi"}&nbsp;<span className="wave-emoji">👋</span>
                </h1>
              </div>

              <div className="hidden md:flex items-center gap-2">
                <TopbarPeriod
                  label={buildPeriodLabel(frequency, period)}
                  frequency={frequency}
                  basePath="/dashboard"
                  currentDate={formatLocalDate(baseDate)}
                  addAnchor="quick-add"
                />
                {isPremium && <ExportPeriodButton date={formatLocalDate(baseDate)} />}
              </div>
            </div>
            {/* Mobile period row */}
            <div
              className="md:hidden flex items-center justify-between px-4 pb-2.5"
              style={{ borderTop: "1px solid var(--cream-300)" }}
            >
              <TopbarPeriod
                compact
                label={buildPeriodLabel(frequency, period)}
                frequency={frequency}
                basePath="/dashboard"
                currentDate={formatLocalDate(baseDate)}
              />
              {!isPremium && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--violet-700)",
                    background: "rgba(196,181,253,0.15)",
                    borderRadius: 999,
                    padding: "3px 10px",
                  }}
                >
                  Version gratuite
                </span>
              )}
            </div>
          </header>

          {/* ── FREE TIER BANNER ── */}
          {!isPremium && (
            <div
              style={{
                background: "var(--ink-900)",
                padding: "10px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    borderRadius: 999,
                    background: "rgba(196,181,253,0.18)",
                    border: "1px solid rgba(196,181,253,0.3)",
                    padding: "3px 10px",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--violet-500)",
                  }}
                >
                  Gratuit
                </span>
                <p style={{ fontSize: 13, color: "var(--ink-300)" }}>
                  Coach IA, projections, historique complet et export Excel sont réservés à la version Premium.
                </p>
              </div>
              <a
                href="#premium"
                style={{
                  borderRadius: 999,
                  border: "none",
                  background: "var(--violet-500)",
                  color: "var(--ink-900)",
                  padding: "7px 16px",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                Passer Premium →
              </a>
            </div>
          )}

          <div className="mx-auto max-w-7xl space-y-4 px-4 py-6 md:px-8 md:py-8">

            {/* ── HERO DARK CARD ── */}
            <section
              className="relative overflow-hidden p-8 md:p-10"
              style={{ background: "var(--ink-900)", borderRadius: "var(--r-xl)" }}
            >
              {/* Radial lime glow */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: "radial-gradient(ellipse 90% 90% at 90% 100%, rgba(245, 96, 51, 0.16) 0%, transparent 70%)" }}
              />

              <div className="relative grid gap-8 lg:grid-cols-[1.2fr_1fr]">
                {/* Left */}
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="pulsing-dot inline-block h-1.5 w-1.5 rounded-full" style={{ background: "var(--violet-500)" }} />
                    <span className="text-[11px] uppercase tracking-[0.12em]" style={{ color: "var(--ink-300)" }}>
                      Disponible réel · {period.label}
                    </span>
                  </div>
                  <p className="mb-4 text-sm" style={{ color: "var(--ink-300)" }}>
                    Voici ce qu'il te reste vraiment, après tout.
                  </p>
                  <div
                    className="font-mono font-light"
                    style={{ fontSize: "clamp(48px, 7vw, 76px)", letterSpacing: "-0.05em", color: "var(--violet-500)", lineHeight: 1.05 }}
                  >
                    {realNet.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}&nbsp;€
                  </div>
                  <p className="mt-4 max-w-sm text-xs leading-relaxed" style={{ color: "var(--ink-300)" }}>
                    Tu peux dépenser ce montant sans toucher à ce que tu dois à l&apos;URSSAF, aux impôts ou à tes charges fixes.
                  </p>
                </div>

                {/* Right — waterfall */}
                <div className="flex flex-col justify-center">
                  {[
                    {
                      label: "Chiffre d'affaires",
                      tag: "brut",
                      tagStyle: { background: "rgba(196, 181, 253, 0.15)", color: "var(--violet-500)" },
                      value: `+${totalRevenue.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`,
                      valueColor: "var(--violet-500)",
                    },
                    {
                      label: "Charges URSSAF",
                      tag: `${(result.socialRate * 100).toFixed(1)}%`,
                      tagStyle: { background: "rgba(255,255,255,0.07)", color: "var(--ink-300)" },
                      value: `−${result.charges.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`,
                      valueColor: "var(--rose-500)",
                    },
                    {
                      label: "Impôt libératoire",
                      tag: `${(result.taxRate * 100).toFixed(1)}%`,
                      tagStyle: { background: "rgba(255,255,255,0.07)", color: "var(--ink-300)" },
                      value: `−${result.tax.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`,
                      valueColor: "var(--rose-500)",
                    },
                    {
                      label: "Dépenses période",
                      value: `−${totalExpenses.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`,
                      valueColor: "var(--rose-500)",
                    },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="water-row flex items-center justify-between py-3"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <span className="flex items-center gap-2 text-sm" style={{ color: "var(--ink-300)" }}>
                        {row.label}
                        {row.tag && (
                          <span className="rounded px-1.5 py-0.5 text-[10px]" style={row.tagStyle}>
                            {row.tag}
                          </span>
                        )}
                      </span>
                      <span className="font-mono text-sm" style={{ color: row.valueColor }}>{row.value}</span>
                    </div>
                  ))}
                  <div className="water-row flex items-center justify-between py-3">
                    <span className="text-sm font-medium" style={{ color: "var(--cream-50)" }}>= Disponible réel</span>
                    <span className="font-mono font-medium" style={{ fontSize: 17, color: "var(--lime-500)" }}>
                      {realNet.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* ── URSSAF QUOTA ── */}
            {(() => {
              const pct = Math.min(100, (yearRevenue / threshold) * 100)
              const fillColor = pct > 90 ? "var(--rose-500)" : pct > 70 ? "var(--amber-500)" : "var(--lime-600)"
              const textColor = pct > 90 ? "var(--rose-500)" : pct > 70 ? "var(--amber-500)" : "var(--lime-700)"
              return (
                <section
                  className="px-5 py-4"
                  style={{ background: "var(--cream-50)", borderRadius: "var(--r-md)", boxShadow: "var(--shadow-md)" }}
                >
                  <div className="mb-2.5 flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: "var(--ink-900)" }}>
                      Plafond micro-entreprise BNC
                    </span>
                    <span className="font-mono text-sm font-medium" style={{ color: textColor }}>
                      {Math.round(pct)}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full" style={{ background: "var(--cream-200)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: fillColor }}
                    />
                  </div>
                  <p className="mt-2.5 font-mono text-xs" style={{ color: "var(--ink-400)" }}>
                    {yearRevenue.toLocaleString("fr-FR")} € / {threshold.toLocaleString("fr-FR")} € — il te reste{" "}
                    {Math.max(0, threshold - yearRevenue).toLocaleString("fr-FR")} € avant le seuil
                  </p>
                </section>
              )
            })()}

            {/* ── DECLARATION ALERTS ── */}
            {isInDeclarationWindow && (
              <section
                className="flex items-start gap-3 px-5 py-4"
                style={{
                  background: "var(--rose-100)",
                  borderRadius: "var(--r-md)",
                  border: "1px solid rgba(251,113,133,0.35)",
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 32,
                    height: 32,
                    borderRadius: "var(--r-sm)",
                    background: "var(--rose-500)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 1,
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold" style={{ color: "var(--rose-500)" }}>
                    Période {realPrevPeriod.label} — déclaration en cours
                  </p>
                  <p className="mt-0.5 text-sm" style={{ color: "var(--rose-500)" }}>
                    Tu es dans la fenêtre de déclaration. Soumets ton chiffre d'affaires sur autoentrepreneur.urssaf.fr avant le{" "}
                    <strong>{formatDeadline(deadlineDate)}</strong>
                    {daysUntilDeadline <= 5 && (
                      <span
                        style={{
                          marginLeft: 8,
                          borderRadius: 999,
                          background: "var(--rose-500)",
                          padding: "2px 8px",
                          fontSize: 11,
                          fontWeight: 700,
                          color: "white",
                        }}
                      >
                        {daysUntilDeadline === 0 ? "Dernier jour !" : `J-${daysUntilDeadline}`}
                      </span>
                    )}
                    .
                  </p>
                </div>
              </section>
            )}

            {isApproachingEnd && (
              <section
                className="flex items-start gap-3 px-5 py-4"
                style={{
                  background: "#FFFBEB",
                  borderRadius: "var(--r-md)",
                  border: "1px solid rgba(245,158,11,0.35)",
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 32,
                    height: 32,
                    borderRadius: "var(--r-sm)",
                    background: "#F59E0B",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 1,
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold" style={{ color: "#92400E" }}>
                    La période {realCurrentPeriod.label} se termine dans {daysUntilCurrentEnd} jour{daysUntilCurrentEnd > 1 ? "s" : ""}
                  </p>
                  <p className="mt-0.5 text-sm" style={{ color: "#B45309" }}>
                    Vérifie que tous tes encaissements et dépenses sont bien enregistrés avant de clôturer cette période.
                  </p>
                </div>
              </section>
            )}

            {/* ── STAT GRID ── */}
            <section className="grid gap-3 grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Chiffre d'affaires", value: totalRevenue,   sub: `Période ${period.label}`, prev: prevTotalRevenue,   positiveUp: true },
                { label: "À mettre de côté",   value: reserveAmount,  sub: "Charges + impôt",         prev: prevReserveAmount,  positiveUp: false },
                { label: "Dépenses période",   value: totalExpenses,  sub: "Fixes + ponctuelles",     prev: prevTotalExpenses,  positiveUp: false },
                { label: "Disponible réel",    value: realNet,        sub: "Après tout",              prev: prevRealNet,        positiveUp: true, dark: true },
              ].map((stat, i) => {
                const delta = stat.prev !== 0
                  ? ((stat.value - stat.prev) / Math.abs(stat.prev)) * 100
                  : null
                const isGood = delta !== null && (stat.positiveUp ? delta > 0 : delta < 0)
                const isBad  = delta !== null && (stat.positiveUp ? delta < 0 : delta > 0)
                return (
                  <div
                    key={i}
                    className="rounded-[14px] p-5 transition hover:-translate-y-0.5"
                    style={{ background: stat.dark ? "var(--violet-500)" : "var(--cream-50)", boxShadow: "var(--shadow-md)" }}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <p className="text-[11px] uppercase tracking-[0.08em]" style={{ color: stat.dark ? "rgba(255,255,255,0.55)" : "var(--ink-400)" }}>
                        {stat.label}
                      </p>
                      {delta !== null && (
                        <span
                          className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                          style={{
                            background: isGood ? "rgba(196,181,253,0.22)" : isBad ? "rgba(251,113,133,0.22)" : "rgba(0,0,0,0.06)",
                            color: isGood
                              ? stat.dark ? "var(--lime-500)" : "var(--violet-700)"
                              : isBad ? "var(--rose-500)" : "var(--ink-400)",
                          }}
                        >
                          {delta >= 0 ? "+" : ""}{delta.toFixed(1).replace(".", ",")}%
                        </span>
                      )}
                    </div>
                    <p
                      className="mt-3 font-mono font-normal"
                      style={{ fontSize: 26, letterSpacing: "-0.04em", color: stat.dark ? "var(--lime-500)" : "var(--ink-900)", lineHeight: 1.1 }}
                    >
                      {stat.value.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}
                      <span className="text-base font-light"> €</span>
                    </p>
                    <p className="mt-2 text-xs" style={{ color: stat.dark ? "rgba(255,255,255,0.4)" : "var(--ink-400)" }}>{stat.sub}</p>
                  </div>
                )
              })}
            </section>

            {/* ── PREMIUM BLOCK ── */}
            <section id="premium">
              <DashboardPremiumShell
                isPremium={isPremium}
                ai={
                  isPremium ? (
                    <AIInsightsCard
                      totalRevenue={totalRevenue}
                      charges={result.charges}
                      tax={result.tax}
                      expenses={totalExpenses}
                      realNet={realNet}
                      reserveAmount={reserveAmount}
                      thresholdRatio={ratio}
                      periodLabel={period.label}
                      activityType={profile.activity_type}
                      daysRemaining={daysRemainingInPeriod}
                      prevRevenue={prevTotalRevenue}
                      prevPeriodLabel={prevPeriod.label}
                    />
                  ) : null
                }
                projection={
                  isPremium ? (
                    <ProjectionCard
                      periodLabel={period.label}
                      projectedRevenue={projection.projectedRevenue}
                      projectedCharges={projectedResult.charges}
                      projectedTax={projectedResult.tax}
                      projectedExpenses={projection.projectedExpenses}
                      projectedRealNet={projectedRealNet}
                      currentRevenue={totalRevenue}
                      currentExpenses={totalExpenses}
                      daysElapsed={projection.elapsedDays}
                      totalDays={projection.totalDays}
                    />
                  ) : null
                }
              />
            </section>

            {/* ── ACTIONS RAPIDES ── */}
            <section
              id="quick-add"
              className="p-6 md:p-8"
              style={{ background: "var(--cream-50)", borderRadius: "var(--r-lg)", boxShadow: "var(--shadow-md)" }}
            >
              <div className="mb-5">
                <h2 className="text-lg font-semibold tracking-tight" style={{ color: "var(--ink-900)" }}>
                  Actions rapides
                </h2>
                <p className="mt-1 text-sm" style={{ color: "var(--ink-400)" }}>
                  Ajoute rapidement une entrée ou une sortie.
                </p>
              </div>
              <div className="grid gap-6 xl:grid-cols-2">
                  <AddRevenue />
                  <AddExpense />
              </div>
            </section>

            {/* ── DERNIERS MOUVEMENTS ── */}
            <RecentMovements
              revenues={revenuesWithInvoices}
              expenses={expensesWithPeriodInfo}
              limit={10}
            />

            {/* ── GRAPHIQUE ── */}
            <section
              className="overflow-hidden"
              style={{ background: "var(--cream-50)", borderRadius: "var(--r-lg)", boxShadow: "var(--shadow-md)" }}
            >
              <RevenueChart revenues={yearRevenues || []} />
            </section>

            {/* ── À DÉCLARER ── */}
            <section
              className="p-6 md:p-8"
              style={{ background: "var(--cream-50)", borderRadius: "var(--r-lg)", boxShadow: "var(--shadow-md)" }}
            >
              <div className="mb-5">
                <h2 className="text-lg font-semibold tracking-tight" style={{ color: "var(--ink-900)" }}>
                  À déclarer sur cette période
                </h2>
                <p className="mt-1 text-sm" style={{ color: "var(--ink-400)" }}>
                  Montants estimés pour anticiper ta déclaration.
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  { label: "Chiffre d'affaires", value: totalRevenue },
                  { label: "Charges sociales", value: result.charges, sub: `${(result.socialRate * 100).toFixed(2)}%` },
                  { label: "Impôt libératoire", value: result.tax, sub: `${(result.taxRate * 100).toFixed(2)}%` },
                ].map((item, i) => (
                  <div key={i} className="rounded-[14px] p-4" style={{ background: "var(--cream-100)" }}>
                    <p className="text-xs uppercase tracking-[0.06em]" style={{ color: "var(--ink-400)" }}>{item.label}</p>
                    <p
                      className="mt-2 font-mono text-xl font-normal"
                      style={{ letterSpacing: "-0.03em", color: "var(--ink-900)" }}
                    >
                      {item.value.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                    </p>
                    {item.sub && <p className="mt-1 text-xs" style={{ color: "var(--ink-400)" }}>{item.sub}</p>}
                  </div>
                ))}
              </div>
            </section>

            {/* ── DEV SWITCHER ── */}
            <section
              className="rounded-[14px] border border-dashed p-4"
              style={{ borderColor: "var(--cream-200)", background: "var(--cream-50)" }}
            >
              <DevPlanSwitcher currentPlan={profile.plan} profileId={profile.id} />
            </section>
          </div>
        </section>
      </div>

      <MobileNav />
    </main>
  )
}
