import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import LogoutButton from "@/components/LogoutButton"
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
import PlanBadge from "@/components/PlanBadge"
import DevPlanSwitcher from "@/components/DevPlanSwitcher"
import { calculateMicro } from "@/lib/calculations"
import { getPeriodRange } from "@/lib/period"
import { calculateProjection } from "@/lib/projection"
import { getThreshold, getThresholdStatus } from "@/lib/threshold"
import ExportPeriodButton from "@/components/ExportPeriodButton"
import UpgradeButton from "@/components/UpgradeButton"

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

      return {
        ...exp,
        isInPeriod,
      }
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
    <main className="min-h-screen bg-[#f7f8f4] text-[#0f172a]">
      <div className="flex min-h-screen">
        {/* SIDEBAR DESKTOP */}
        <aside className="hidden w-[280px] shrink-0 border-r border-black/5 bg-white/70 px-5 py-6 backdrop-blur lg:block">
          <div className="sticky top-6 flex h-[calc(100vh-3rem)] flex-col">
            <div>
              <Link href="/dashboard" className="inline-block">
                <div className="text-3xl font-extrabold tracking-tight text-slate-950">
                  KeskiReste<span className="text-[#22c55e]">.</span>
                </div>
              </Link>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Ton vrai solde, sans prise de tête.
              </p>
            </div>

            <nav className="mt-8 space-y-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-2xl bg-[#0f172a] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              >
                <span className="text-base">🏠</span>
                <span>Tableau de bord</span>
              </Link>

              <Link
                href="/revenues"
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                <span className="text-base">💰</span>
                <span>Revenus</span>
              </Link>

              <Link
                href="/Expenses"
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                <span className="text-base">💸</span>
                <span>Dépenses</span>
              </Link>

              <Link
                href="/settings"
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                <span className="text-base">⚙️</span>
                <span>Paramètres</span>
              </Link>
            </nav>

            <div className="mt-8 rounded-[28px] border border-[#dcfce7] bg-[#f0fdf4] p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">Ton plan</p>
                <PlanBadge plan={profile.plan} />
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {isPremium
                  ? "Tu as accès aux outils avancés de pilotage et aux insights IA."
                  : "Passe en premium pour débloquer les projections et les insights IA."}
              </p>

              {!isPremium && (
                <Link
                  href="/settings"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#22c55e] px-4 py-3 text-sm font-bold text-[#0f172a] transition hover:opacity-90"
                >
                  Passer en premium
                </Link>
              )}
            </div>

            <div className="mt-auto pt-6">
              <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">
                  Session active
                </p>
                <p className="mt-2 truncate text-sm text-slate-500">
                  {profile.first_name || user.email}
                </p>
                <div className="mt-4">
                  <LogoutButton />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* CONTENT */}
        <section className="min-w-0 flex-1">
          {/* TOPBAR */}
          <header className="sticky top-0 z-20 border-b border-black/5 bg-[#f7f8f4]/80 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
              <div className="min-w-0">
                <p className="text-sm text-slate-500">Dashboard</p>
                <h1 className="truncate text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
                  Bonjour {profile.first_name || user.email || "à toi"} 👋
                </h1>
              </div>

              <div className="hidden items-center gap-3 md:flex">
                <Link
                  href="/revenues"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Revenus
                </Link>

                <Link
                  href="/Expenses"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Dépenses
                </Link>

                <Link
                  href="/settings"
                  className="rounded-xl bg-[#0f172a] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Paramètres
                </Link>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-8 md:py-8">
            {/* HERO RESUME */}
            <section className="rounded-[32px] border border-[#dcfce7] bg-gradient-to-r from-[#f0fdf4] to-white p-6 shadow-sm md:p-8">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-[#dcfce7] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#15803d]">
                      Période active
                    </span>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                      {period.label}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {frequency === "monthly" ? "Déclaration mensuelle" : "Déclaration trimestrielle"}
                    </span>
                  </div>

                  <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
                    Voici ce qu’il te reste vraiment sur la période.
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                    Tu visualises ici ton chiffre d’affaires, tes charges estimées,
                    tes dépenses et ton disponible réel, pour piloter ton activité
                    sans te perdre dans les calculs.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/dashboard?date=${formatLocalDate(prevDate)}`}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    ← Période précédente
                  </Link>

                  <Link
                    href={`/dashboard?date=${formatLocalDate(nextDate)}`}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Période suivante →
                  </Link>

                  {isPremium && (
                    <ExportPeriodButton date={formatLocalDate(baseDate)} />
                    )}
                </div>
              </div>
            </section>

            {/* THRESHOLD ALERT */}
            <section>
              <ThresholdAlert
                totalRevenue={yearRevenue}
                threshold={threshold}
                ratio={ratio}
                status={thresholdInfo.status as "safe" | "warning" | "exceeded"}
                message={thresholdInfo.message}
              />
            </section>

            {/* QUICK KPIS */}
            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Chiffre d’affaires</p>
                <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                  {totalRevenue.toFixed(2)} €
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Période {period.label.toLowerCase()}
                </p>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Charges + impôt</p>
                <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                  {reserveAmount.toFixed(2)} €
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  À mettre de côté
                </p>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Dépenses période</p>
                <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                  {totalExpenses.toFixed(2)} €
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Fixes + ponctuelles
                </p>
              </div>

              <div className="rounded-[28px] bg-[#0f172a] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.15)]">
                <p className="text-sm text-slate-300">Disponible réel</p>
                <p className="mt-3 text-3xl font-black tracking-tight text-[#4ade80]">
                  {realNet.toFixed(2)} €
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  Après charges, impôt et dépenses
                </p>
              </div>
            </section>

            {/* PREMIUM BLOCK */}
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

            {/* DECLARATION STATS */}
            <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-black tracking-tight text-slate-950">
                  À déclarer sur cette période
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-500">
                  Les montants estimés pour t’aider à anticiper simplement ta déclaration actuelle.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <StatCard
                  title="Chiffre d'affaires"
                  value={`${totalRevenue.toFixed(2)} €`}
                  accent="blue"
                />

                <StatCard
                  title="Charges"
                  value={`${result.charges.toFixed(2)} €`}
                  subtitle={`${(result.socialRate * 100)
                    .toFixed(2)
                    .replace(".", ",")} %`}
                />

                <StatCard
                  title="Impôt"
                  value={`${result.tax.toFixed(2)} €`}
                  subtitle={`${(result.taxRate * 100)
                    .toFixed(2)
                    .replace(".", ",")} %`}
                />
              </div>
            </section>

            {/* CASH PILOTING */}
            <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-black tracking-tight text-slate-950">
                  Pilotage de ta trésorerie
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-500">
                  Ce que tu dois sécuriser, ce que tu dépenses et ce qu’il te reste réellement.
                </p>
              </div>

              <div className="grid gap-5 lg:grid-cols-3">
                <StatCard
                  title="Dépenses période"
                  value={`${totalExpenses.toFixed(2)} €`}
                  accent="red"
                />

                <div className="rounded-[28px] border border-[#fed7aa] bg-gradient-to-br from-orange-50 to-white p-6 shadow-[0_12px_30px_rgba(249,115,22,0.08)]">
                  <p className="text-sm font-semibold text-orange-700">
                    À mettre de côté
                  </p>
                  <p className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                    {reserveAmount.toFixed(2)} €
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Pour couvrir tes charges sociales et ton impôt.
                  </p>
                </div>

                <div className="rounded-[28px] bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-6 shadow-[0_20px_40px_rgba(15,23,42,0.18)]">
                  <p className="text-sm font-semibold text-slate-300">
                    Disponible maintenant
                  </p>
                  <p className="mt-3 text-4xl font-black tracking-tight text-[#4ade80]">
                    {realNet.toFixed(2)} €
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    Ce que tu peux considérer comme réellement disponible.
                  </p>
                </div>
              </div>
            </section>

            {/* QUICK ACTIONS */}
            <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-black tracking-tight text-slate-950">
                  Actions rapides
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-500">
                  Ajoute rapidement une entrée ou une sortie pour garder tes chiffres à jour.
                </p>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-[28px] bg-[#f8fafc] p-2">
                  <AddRevenue />
                </div>

                <div className="rounded-[28px] bg-[#f8fafc] p-2">
                  <AddExpense />
                </div>
              </div>
            </section>

            {/* LISTS */}
            <section className="grid gap-6 xl:grid-cols-2">
              <div className="rounded-[32px] border border-slate-200 bg-white p-2 shadow-sm">
                <RevenueList revenues={revenues || []} />
              </div>

              <div className="rounded-[32px] border border-slate-200 bg-white p-2 shadow-sm">
                <ExpenseList expenses={expensesWithPeriodInfo} showPeriodInfo />
              </div>
            </section>

            {/* CHART */}
            <section className="rounded-[32px] border border-slate-200 bg-white p-2 shadow-sm">
              <RevenueChart revenues={yearRevenues || []} />
            </section>

            {/* DEV SWITCHER */}
            <section className="rounded-[32px] border border-dashed border-slate-300 bg-white/70 p-4">
              <DevPlanSwitcher
                currentPlan={profile.plan}
                profileId={profile.id}
              />
            </section>
          </div>
        </section>
      </div>
    </main>
  )
}