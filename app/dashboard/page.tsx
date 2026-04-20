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
import { calculateMicro } from "@/lib/calculations"
import { getPeriodRange } from "@/lib/period"
import { calculateProjection } from "@/lib/projection"
import { getThreshold, getThresholdStatus } from "@/lib/threshold"

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

  // ===== REVENUS DE LA PÉRIODE ACTUELLE =====
  const { data: revenues } = await supabase
    .from("revenues")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", period.start)
    .lte("date", period.end)
    .order("date", { ascending: false })

  const totalRevenue =
    revenues?.reduce((sum, r) => sum + Number(r.amount), 0) || 0

  // ===== REVENUS DE L'ANNÉE DE LA PÉRIODE AFFICHÉE (POUR LE SEUIL + CHART) =====
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

  // ===== SEUIL ANNUEL =====
  const threshold = getThreshold(profile.activity_type)
  const thresholdInfo = getThresholdStatus(yearRevenue, threshold)
  const ratio = yearRevenue / threshold

  // ===== CALCULS DE LA PÉRIODE =====
  const result = calculateMicro({
    revenue: totalRevenue,
    activityType: profile.activity_type,
    acre: profile.acre,
    versementLiberatoire: profile.versement_liberatoire,
  })

  // ===== DÉPENSES (LISTE COMPLÈTE POUR AFFICHAGE) =====
  const { data: expenses } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })

  // ===== DÉPENSES COMPTÉES DANS LA PÉRIODE =====
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

  // ===== PROJECTION FIN DE PÉRIODE =====
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

  return (
    <main className="min-h-screen bg-[#f5f6fb] text-slate-800">
      <div className="flex min-h-screen">
        <aside className="hidden w-20 flex-col justify-between border-r border-slate-200 bg-[#eef1f8] px-3 py-6 md:flex">
          <div className="space-y-4 fixed">
            <Link
              href="/dashboard"
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#dfe7ff] shadow-sm"
            >
              <span className="text-lg">🏠</span>
            </Link>

            <Link
              href="/revenues"
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm transition hover:bg-slate-50"
            >
              <span className="text-lg">💰</span>
            </Link>

            <Link
              href="/Expenses"
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm transition hover:bg-slate-50"
            >
              <span className="text-lg">💸</span>
            </Link>

            <Link
              href="/settings"
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm transition hover:bg-slate-50"
            >
              <span className="text-lg">⚙️</span>
            </Link>
          </div>
        </aside>

        <div className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <header className="rounded-[28px] border border-white/70 bg-white/70 px-6 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4f7df3] text-2xl font-bold text-white shadow-md">
                    AE
                  </div>

                  <div>
                    <p className="text-3xl font-semibold tracking-tight">
                      Coach Auto-Entrepreneur
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <p className="text-sm text-slate-500">
                        Ton copilote simple pour piloter tes revenus et tes dépenses
                      </p>

                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                        {frequency === "monthly" ? "Mensuelle" : "Trimestrielle"}
                      </span>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard?date=${formatLocalDate(prevDate)}`}
                          className="rounded-lg px-2 py-1 text-slate-600 hover:bg-slate-100"
                        >
                          ←
                        </Link>

                        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
                          {period.label}
                        </span>

                        <Link
                          href={`/dashboard?date=${formatLocalDate(nextDate)}`}
                          className="rounded-lg px-2 py-1 text-slate-600 hover:bg-slate-100"
                        >
                          →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href="/revenues"
                    className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    Revenus
                  </Link>

                  <Link
                    href="/Expenses"
                    className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    Dépenses
                  </Link>

                  <Link
                    href="/settings"
                    className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    Paramètres
                  </Link>

                  <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSdE6QdvRJIyqqxMTRM3wFCofOSAU-LaH6VVARF9Q_cmcF9sZA/viewform?usp=publish-editor"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                  >
                    Donner un avis
                  </a>
                </div>
              </div>
            </header>

            <section>
              <div>
                <h1 className="text-5xl font-semibold tracking-tight text-slate-900">
                  Dashboard
                </h1>
                <p className="mt-2 text-lg text-slate-500">
                  Bienvenue {profile.first_name || user.email || "à toi"} 👋
                </p>
              </div>
            </section>

            <section>
              <ThresholdAlert
                totalRevenue={yearRevenue}
                threshold={threshold}
                ratio={ratio}
                status={thresholdInfo.status as "safe" | "warning" | "exceeded"}
                message={thresholdInfo.message}
              />
            </section>

            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  À déclarer cette période
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Le chiffre d’affaires et les montants estimés pour ta déclaration actuelle.
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

            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Pilotage de ta trésorerie
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Ce que tu dois sécuriser, ce que tu dépenses, et ce qu’il te reste vraiment.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <StatCard
                  title="Dépenses période"
                  value={`${totalExpenses.toFixed(2)} €`}
                  accent="red"
                />

                <div className="rounded-[26px] border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-6 shadow-[0_12px_30px_rgba(249,115,22,0.10)]">
                  <p className="text-sm font-medium text-orange-700">
                    À mettre de côté
                  </p>
                  <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">
                    {reserveAmount.toFixed(2)} €
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Pour couvrir tes charges et ton impôt.
                  </p>
                </div>

                <div className="rounded-[26px] bg-gradient-to-br from-[#4f7df3] to-[#3e6eea] p-6 shadow-[0_12px_30px_rgba(79,125,243,0.20)]">
                  <p className="text-sm font-medium text-blue-100">
                    Disponible maintenant
                  </p>
                  <p className="mt-3 text-4xl font-semibold tracking-tight text-white">
                    {realNet.toFixed(2)} €
                  </p>
                  <p className="mt-2 text-sm text-blue-100">
                    Après charges, impôt et dépenses.
                  </p>
                </div>
              </div>
            </section>

            <section hidden>
              <ProjectionCard
                periodLabel={period.label}
                projectedRevenue={projection.projectedRevenue}
                projectedCharges={projectedResult.charges}
                projectedTax={projectedResult.tax}
                projectedExpenses={projection.projectedExpenses}
                projectedRealNet={projectedRealNet}
              />
            </section>

            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Actions rapides
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Ajoute rapidement une entrée ou une sortie.
                </p>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <AddRevenue />
                <AddExpense />
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
              <RevenueList revenues={revenues || []} />
              <ExpenseList expenses={expensesWithPeriodInfo} showPeriodInfo />
            </section>

            <section>
              <RevenueChart revenues={yearRevenues || []} />
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}