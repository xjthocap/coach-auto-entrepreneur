import Link from "next/link"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import AppSidebar from "@/components/AppSidebar"
import MobileNav from "@/components/MobileNav"
import AddRevenue from "@/components/AddRevenue"
import AddExpense from "@/components/AddExpense"
import RevenueList from "@/components/RevenueList"
import ExpenseList from "@/components/ExpenseList"
import RevenueChart from "@/components/RevenueChart"
import StatCard from "@/components/StatCard"
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

              <div className="flex items-center gap-2">
                <div
                  className="hidden items-center gap-2 rounded-full px-4 py-2 text-sm md:flex"
                  style={{ background: "var(--cream-50)", border: "1px solid var(--cream-200)", color: "var(--ink-500)" }}
                >
                  <span className="pulsing-dot inline-block h-1.5 w-1.5 rounded-full" style={{ background: "var(--lime-500)" }} />
                  {period.label}
                </div>
                <Link
                  href={`/dashboard?date=${formatLocalDate(prevDate)}`}
                  className="hidden rounded-lg border px-3 py-2 text-sm font-medium transition hover:opacity-70 md:block"
                  style={{ borderColor: "var(--cream-200)", background: "var(--cream-50)", color: "var(--ink-500)" }}
                >
                  ←
                </Link>
                <Link
                  href={`/dashboard?date=${formatLocalDate(nextDate)}`}
                  className="hidden rounded-lg border px-3 py-2 text-sm font-medium transition hover:opacity-70 md:block"
                  style={{ borderColor: "var(--cream-200)", background: "var(--cream-50)", color: "var(--ink-500)" }}
                >
                  →
                </Link>
                {isPremium && <ExportPeriodButton date={formatLocalDate(baseDate)} />}
              </div>
            </div>
          </header>

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

            {/* ── STAT GRID ── */}
            <section className="grid gap-3 grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Chiffre d'affaires", value: totalRevenue, sub: `Période ${period.label}` },
                { label: "À mettre de côté",   value: reserveAmount, sub: "Charges + impôt" },
                { label: "Dépenses période",   value: totalExpenses,  sub: "Fixes + ponctuelles" },
                { label: "Disponible réel",    value: realNet,        sub: "Après tout", dark: true },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="rounded-[14px] p-5 transition hover:-translate-y-0.5"
                  style={{ background: stat.dark ? "var(--violet-500)" : "var(--cream-50)", boxShadow: "var(--shadow-md)" }}
                >
                  <p className="text-[11px] uppercase tracking-[0.08em]" style={{ color: stat.dark ? "var(--cream-200)" : "var(--cream-300)" }}>
                    {stat.label}
                  </p>
                  <p
                    className="mt-3 font-mono font-normal"
                    style={{ fontSize: 26, letterSpacing: "-0.04em", color: stat.dark ? "var(--lime-500)" : "var(--ink-900)", lineHeight: 1.1 }}
                  >
                    {stat.value.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}
                    <span className="text-base font-light"> €</span>
                  </p>
                  <p className="mt-2 text-xs" style={{ color: "var(--ink-400)" }}>{stat.sub}</p>
                </div>
              ))}
            </section>

            {/* ── PREMIUM BLOCK ── */}
            <section>
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
                    />
                  ) : null
                }
              />
            </section>

            {/* ── ACTIONS RAPIDES ── */}
            <section
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
                <div className="rounded-[14px] p-2" style={{ background: "var(--cream-100)" }}>
                  <AddRevenue />
                </div>
                <div className="rounded-[14px] p-2" style={{ background: "var(--cream-100)" }}>
                  <AddExpense />
                </div>
              </div>
            </section>

            {/* ── LISTES ── */}
            <section className="grid gap-4 xl:grid-cols-2">
              <div
                className="overflow-hidden"
                style={{ background: "var(--cream-50)", borderRadius: "var(--r-lg)", boxShadow: "var(--shadow-md)" }}
              >
                <RevenueList revenues={revenues || []} />
              </div>
              <div
                className="overflow-hidden"
                style={{ background: "var(--cream-50)", borderRadius: "var(--r-lg)", boxShadow: "var(--shadow-md)" }}
              >
                <ExpenseList expenses={expensesWithPeriodInfo} showPeriodInfo />
              </div>
            </section>

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
