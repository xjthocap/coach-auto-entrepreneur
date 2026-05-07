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
import UpgradeButton from "@/components/UpgradeButton"
import { calculateMicro, estimateIRProvision, buildAnnualProjection } from "@/lib/calculations"
import { getPeriodRange } from "@/lib/period"
import { calculateProjection } from "@/lib/projection"
import { getThreshold, getThresholdStatus, getTVAStatus } from "@/lib/threshold"
import TVAAlert from "@/components/TVAAlert"
import ExportPeriodButton from "@/components/ExportPeriodButton"
import IRDetailButton from "@/components/IRDetailButton"
import ExportYearButton from "@/components/ExportYearButton"
import TopbarPeriod from "@/components/TopbarPeriod"
import WelcomeEmailTrigger from "@/components/WelcomeEmailTrigger"
import URSSAFDeclarationAlert from "@/components/URSSAFDeclarationAlert"
import ChatTriggerButton from "@/components/ChatTriggerButton"

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

// ─── WaterfallRow helper (server component) ──────────────────────────────
function WaterfallRow({
  label,
  tag,
  tagStyle,
  value,
  valueColor,
  action,
}: {
  label: string
  tag?: string
  tagStyle?: React.CSSProperties
  value: string
  valueColor: string
  action?: React.ReactNode
}) {
  return (
    <div
      className="water-row flex items-center justify-between gap-2 py-3"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 text-sm" style={{ color: "var(--ink-300)" }}>
        <span className="shrink-0">{label}</span>
        {tag && (
          <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px]" style={tagStyle}>
            {tag}
          </span>
        )}
        {action}
      </span>
      <span className="shrink-0 font-mono text-sm" style={{ color: valueColor }}>{value}</span>
    </div>
  )
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
          .select("id, revenue_id, status, invoice_number")
          .in("revenue_id", revenueIds)
      : { data: [] }
  const invoiceByRevenueId = new Map(
    (invoices || []).map((inv) => [inv.revenue_id, { id: inv.id, status: inv.status, invoice_number: inv.invoice_number }])
  )
  const revenuesWithInvoices = (revenues || []).map((r) => ({
    ...r,
    invoices: invoiceByRevenueId.has(r.id)
      ? [invoiceByRevenueId.get(r.id)!]
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

  // ===== SEUIL MICRO =====
  const threshold = getThreshold(profile.activity_type)
  const thresholdInfo = getThresholdStatus(yearRevenue, threshold)
  const ratio = yearRevenue / threshold

  // ===== SEUIL TVA =====
  const tvaStatus = getTVAStatus(yearRevenue, profile.activity_type)

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

  // ===== PROVISION IR (barème progressif quand pas de versement libératoire) =====
  const periodsPerYear = frequency === "quarterly" ? 4 : 12
  const useIREstimate  = !profile.versement_liberatoire

  // Nombre de périodes écoulées dans l'année affichée (basé sur la date réelle)
  const currentRealYear = new Date().getFullYear()
  const periodsElapsedYTD = selectedYear < currentRealYear
    ? periodsPerYear // année passée → 12 ou 4 périodes complètes
    : frequency === "quarterly"
      ? Math.max(1, Math.ceil((new Date().getMonth() + 1) / 3))
      : Math.max(1, new Date().getMonth() + 1)

  // Projection annuelle : données réelles YTD si disponibles, sinon simulation période × N
  const { annualRevenue: irAnnualRevenue, isSimulation: irIsSimulation, periodsUsed: irPeriodsUsed } =
    buildAnnualProjection(yearRevenue, periodsElapsedYTD, periodsPerYear, totalRevenue)

  const irEstimate = useIREstimate
    ? estimateIRProvision(totalRevenue, profile.activity_type, periodsPerYear, irAnnualRevenue)
    : 0

  const realNet       = result.net - totalExpenses - irEstimate
  const reserveAmount = result.charges + result.tax + irEstimate

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
  const prevIrEstimate    = useIREstimate
    ? estimateIRProvision(prevTotalRevenue, profile.activity_type, periodsPerYear)
    : 0
  const prevReserveAmount = prevResult.charges + prevResult.tax + prevIrEstimate
  const prevRealNet       = prevResult.net - prevTotalExpenses - prevIrEstimate

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
  const isFormerFounder = profile.founder_number != null && profile.plan !== "premium"

  return (
    <main className="min-h-screen" style={{ background: "var(--cream-100)", color: "var(--ink-900)" }}>
      <WelcomeEmailTrigger />
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
            {/* ── Ligne principale ── */}
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 md:px-8">
              {/* Gauche : prénom + badge plan */}
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.08em]" style={{ color: "var(--ink-400)" }}>
                  Dashboard
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="truncate text-[22px] font-semibold tracking-tight" style={{ color: "var(--ink-900)" }}>
                    Bonjour {profile.first_name || "à toi"}&nbsp;<span className="wave-emoji">👋</span>
                  </h1>
                  {/* Badge plan */}
                  {(() => {
                    const isFounder = !!(profile.founder_number) && isPremium && profile.subscription_type === "founder"
                    const isFormerFounderPremiumBadge = !!(profile.founder_number) && isPremium && profile.subscription_type !== "founder"
                    const isFormerFounderBadge = !!(profile.founder_number) && !isPremium
                    const isBetaPioneer = !!(profile.is_beta_pioneer)
                    const isPatron = !!(profile.is_patron)
                    if (isPatron) return (
                      <>
                        <span style={{
                          fontSize: 11, fontWeight: 800, borderRadius: 999, padding: "3px 10px",
                          whiteSpace: "nowrap", flexShrink: 0,
                          background: "linear-gradient(90deg, #7C3AED, #ec4899, #f59e0b)",
                          color: "white",
                        }}>⚡ El Patron</span>
                      </>
                    )
                    if (isBetaPioneer) return (
                      <span style={{
                        fontSize: 11, fontWeight: 700, borderRadius: 999, padding: "3px 10px",
                        whiteSpace: "nowrap", flexShrink: 0,
                        background: "linear-gradient(135deg, rgba(251,191,36,0.2), rgba(245,158,11,0.15))",
                        color: "#B45309",
                        border: "1px solid rgba(245,158,11,0.25)",
                      }}>🧪 OG Bêta</span>
                    )
                    return (
                      <span style={{
                        fontSize: 11, fontWeight: 700, borderRadius: 999, padding: "3px 10px",
                        whiteSpace: "nowrap", flexShrink: 0,
                        background: isFounder
                          ? "rgba(196,181,253,0.2)"
                          : isFormerFounderPremiumBadge
                          ? "var(--violet-500)"
                          : isFormerFounderBadge
                          ? "rgba(245,158,11,0.12)"
                          : isPremium
                          ? "var(--violet-500)"
                          : "rgba(196,181,253,0.12)",
                        color: isFounder
                          ? "var(--violet-700)"
                          : isFormerFounderPremiumBadge
                          ? "var(--ink-900)"
                          : isFormerFounderBadge
                          ? "#B45309"
                          : isPremium
                          ? "var(--ink-900)"
                          : "var(--violet-700)",
                      }}>
                        {isFounder
                          ? `⭐ Founder #${profile.founder_number}`
                          : isFormerFounderPremiumBadge
                          ? `Premium · ex-Founder #${profile.founder_number}`
                          : isFormerFounderBadge
                          ? `Ancien Founder #${profile.founder_number}`
                          : isPremium ? "Premium" : "Gratuit"}
                      </span>
                    )
                  })()}
                </div>
              </div>

              {/* Droite desktop : période + exports */}
              <div className="hidden md:flex items-center gap-2">
                <TopbarPeriod
                  label={buildPeriodLabel(frequency, period)}
                  frequency={frequency}
                  basePath="/dashboard"
                  currentDate={formatLocalDate(baseDate)}
                  addAnchor="quick-add"
                  alertCount={(isInDeclarationWindow ? 1 : 0) + (isApproachingEnd ? 1 : 0)}
                  declarationPeriodLabel={isInDeclarationWindow ? realPrevPeriod.label : undefined}
                />
                {isPremium && <ExportYearButton year={selectedYear} />}
                {isPremium && <ExportPeriodButton date={formatLocalDate(baseDate)} />}
              </div>

              {/* Droite mobile : bouton chat (premium) */}
              {isPremium && (
                <div className="flex md:hidden items-center gap-2">
                  <ChatTriggerButton />
                </div>
              )}
            </div>

            {/* ── Ligne mobile : période + exports ── */}
            <div
              className="md:hidden flex items-center justify-between px-4 pt-2.5 pb-2.5"
              style={{ borderTop: "1px solid var(--cream-300)" }}
            >
              <TopbarPeriod
                compact
                label={buildPeriodLabel(frequency, period)}
                frequency={frequency}
                basePath="/dashboard"
                currentDate={formatLocalDate(baseDate)}
              />
              {isPremium && (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <ExportYearButton year={selectedYear} iconOnly />
                  <ExportPeriodButton date={formatLocalDate(baseDate)} iconOnly />
                </div>
              )}
            </div>
          </header>



          <div className="mx-auto max-w-7xl space-y-4 px-4 py-6 md:px-8 md:py-8">

            {/* ── ANCIEN FOUNDER ── */}
            {isFormerFounder && (
              <section
                className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"
                style={{
                  background: "linear-gradient(135deg, rgba(251,191,36,0.12), rgba(245,158,11,0.08))",
                  borderRadius: "var(--r-md)",
                  border: "1px solid rgba(245,158,11,0.3)",
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    style={{
                      flexShrink: 0, width: 34, height: 34,
                      borderRadius: "var(--r-sm)",
                      background: "linear-gradient(135deg, #F59E0B, #D97706)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 16,
                    }}
                  >⭐</span>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#92400E" }}>
                      Vous étiez Founder #{profile.founder_number} — votre accès a expiré
                    </p>
                    <p className="mt-0.5 text-xs" style={{ color: "#B45309" }}>
                      Reprenez un abonnement Premium pour retrouver toutes vos fonctionnalités.
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <UpgradeButton fullWidth={false} label="Reprendre Premium →" />
                </div>
              </section>
            )}

            {/* ── HERO DARK CARD ── */}
            <section
              className="relative overflow-hidden p-5 md:p-8 xl:p-10"
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
                    style={{ fontSize: "clamp(32px, 7vw, 76px)", letterSpacing: "-0.05em", color: "var(--violet-500)", lineHeight: 1.05, wordBreak: "break-all" }}
                  >
                    {realNet.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}&nbsp;€
                  </div>
                  <p className="mt-4 max-w-sm text-xs leading-relaxed" style={{ color: "var(--ink-300)" }}>
                    Tu peux dépenser ce montant sans toucher à ce que tu dois à l&apos;URSSAF, aux impôts ou à tes charges fixes.
                  </p>
                </div>

                {/* Right — waterfall */}
                <div className="flex flex-col justify-center">
                  {/* CA brut */}
                  <WaterfallRow
                    label="Chiffre d'affaires"
                    tag="brut"
                    tagStyle={{ background: "rgba(196, 181, 253, 0.15)", color: "var(--violet-500)" }}
                    value={`+${totalRevenue.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`}
                    valueColor="var(--violet-500)"
                  />
                  {/* Charges URSSAF */}
                  <WaterfallRow
                    label="Charges URSSAF"
                    tag={`${(result.socialRate * 100).toFixed(1)}%`}
                    tagStyle={{ background: "rgba(255,255,255,0.07)", color: "var(--ink-300)" }}
                    value={`−${result.charges.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`}
                    valueColor="var(--rose-500)"
                  />
                  {/* Impôt — avec bouton détail si estimation barème */}
                  {useIREstimate ? (
                    <WaterfallRow
                      label="Provision IR"
                      tag="estimée"
                      tagStyle={{ background: "rgba(245,158,11,0.18)", color: "#F59E0B" }}
                      value={`−${irEstimate.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`}
                      valueColor="var(--rose-500)"
                      action={
                        <IRDetailButton
                          periodRevenue={totalRevenue}
                          activityType={profile.activity_type}
                          periodsPerYear={periodsPerYear}
                          irEstimate={irEstimate}
                          yearRevenue={yearRevenue}
                          periodsElapsed={irPeriodsUsed}
                          annualRevenue={irAnnualRevenue}
                          isSimulation={irIsSimulation}
                        />
                      }
                    />
                  ) : (
                    <WaterfallRow
                      label="Impôt libératoire"
                      tag={`${(result.taxRate * 100).toFixed(1)}%`}
                      tagStyle={{ background: "rgba(255,255,255,0.07)", color: "var(--ink-300)" }}
                      value={`−${result.tax.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`}
                      valueColor="var(--rose-500)"
                    />
                  )}
                  {/* Dépenses */}
                  <WaterfallRow
                    label="Dépenses période"
                    value={`−${totalExpenses.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`}
                    valueColor="var(--rose-500)"
                  />
                  <div className="water-row flex items-center justify-between gap-2 py-3">
                    <span className="text-sm font-medium" style={{ color: "var(--cream-50)" }}>= Disponible réel</span>
                    <span className="shrink-0 font-mono font-medium" style={{ fontSize: 17, color: "var(--lime-500)" }}>
                      {realNet.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                    </span>
                  </div>

                  {useIREstimate && (
                    <p className="mt-3 text-[11px] leading-relaxed" style={{ color: "var(--ink-500)", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 10 }}>
                      ⚠️ Provision IR calculée sur le barème 2025 · hypothèse : foyer 1 part, aucun autre revenu. Ajuste en fonction de ta situation réelle.
                    </p>
                  )}
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
                  <p className="mt-2.5 font-mono text-xs leading-relaxed" style={{ color: "var(--ink-400)", wordBreak: "break-word" }}>
                    {yearRevenue.toLocaleString("fr-FR")} € / {threshold.toLocaleString("fr-FR")} € — il te reste{" "}
                    {Math.max(0, threshold - yearRevenue).toLocaleString("fr-FR")} € avant le seuil
                  </p>
                </section>
              )
            })()}

            {/* ── DECLARATION ALERTS ── */}
            <div id="declarations" />
            {isInDeclarationWindow && (
              <URSSAFDeclarationAlert
                periodLabel={realPrevPeriod.label}
                deadlineFormatted={formatDeadline(deadlineDate)}
                daysUntilDeadline={daysUntilDeadline}
              />
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

            {/* ── ALERTE TVA ── */}
            {tvaStatus.status !== "safe" && (
              <TVAAlert
                status={tvaStatus.status}
                franchise={tvaStatus.franchise}
                tolerance={tvaStatus.tolerance}
                yearRevenue={yearRevenue}
                remaining={tvaStatus.remaining}
                ratio={tvaStatus.ratio}
                activityType={profile.activity_type}
              />
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
                    style={{ background: stat.dark ? "var(--ink-900)" : "var(--cream-50)", boxShadow: "var(--shadow-md)" }}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <p className="text-[11px] uppercase tracking-[0.08em]" style={{ color: stat.dark ? "rgba(255,255,255,0.55)" : "var(--ink-400)" }}>
                        {stat.label}
                      </p>
                      {delta !== null && (
                        <span
                          className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                          style={{
                            background: isGood ? (stat.dark ? "rgba(196,181,253,0.18)" : "rgba(196,181,253,0.22)") : isBad ? "rgba(251,113,133,0.22)" : (stat.dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"),
                            color: isGood
                              ? stat.dark ? "#C4B5FD" : "var(--violet-700)"
                              : isBad ? "var(--rose-500)" : (stat.dark ? "rgba(255,255,255,0.6)" : "var(--ink-400)"),
                          }}
                        >
                          {delta >= 0 ? "+" : ""}{delta.toFixed(1).replace(".", ",")}%
                        </span>
                      )}
                    </div>
                    <p
                      className="mt-3 font-mono font-normal"
                      style={{ fontSize: "clamp(18px, 5.5vw, 26px)", letterSpacing: "-0.04em", color: stat.dark ? "#ffffff" : "var(--ink-900)", lineHeight: 1.1 }}
                    >
                      {stat.value.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      <span className="text-base font-light"> €</span>
                    </p>
                    <p className="mt-2 text-xs" style={{ color: stat.dark ? "rgba(255,255,255,0.6)" : "var(--ink-400)" }}>{stat.sub}</p>
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
                      tax={useIREstimate ? irEstimate : result.tax}
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
              <div className="grid gap-6 xl:grid-cols-2 items-start">
                  <AddRevenue isPremium={isPremium} />
                  <AddExpense />
              </div>
            </section>

            {/* ── DERNIERS MOUVEMENTS ── */}
            <RecentMovements
              revenues={revenuesWithInvoices}
              expenses={expensesWithPeriodInfo}
              limit={10}
              isPremium={isPremium}
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
              <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
                {[
                  { label: "Chiffre d'affaires", value: totalRevenue },
                  { label: "Charges sociales",  value: result.charges, sub: `${(result.socialRate * 100).toFixed(2)}%` },
                  useIREstimate
                    ? { label: "Provision IR (estimée)", value: irEstimate, sub: "Barème progressif · 1 part" }
                    : { label: "Impôt libératoire",      value: result.tax, sub: `${(result.taxRate * 100).toFixed(2)}%` },
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
