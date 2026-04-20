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

export default async function DashboardPage() {
  const supabase = await createClient()

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

  const period = getPeriodRange(frequency)

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

  // ===== REVENUS DE L'ANNÉE CIVILE (POUR LE SEUIL) =====
  const currentYear = new Date().getFullYear()
  const yearStart = `${currentYear}-01-01`
  const yearEnd = `${currentYear}-12-31`

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

                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                        {period.label}
                      </span>
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

                  <LogoutButton />
                </div>
              </div>
            </header>

            <section>
              <div>
                <h1 className="text-5xl font-semibold tracking-tight text-slate-900">
                  Dashboard
                </h1>
                <p className="mt-2 text-lg text-slate-500">
                  Bienvenue {user.email}
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
                  Ce qu’il te reste vraiment
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Après charges, impôts et dépenses de la période.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <StatCard
                  title="Dépenses période"
                  value={`${totalExpenses.toFixed(2)} €`}
                />

                <div className="rounded-[26px] bg-[#4f7df3] p-6 shadow-[0_12px_30px_rgba(79,125,243,0.20)]">
                  <p className="text-sm font-medium text-blue-100">
                    Reste disponible
                  </p>
                  <p className="mt-3 text-4xl font-semibold tracking-tight text-white">
                    {realNet.toFixed(2)} €
                  </p>
                  <p className="mt-2 text-sm text-blue-100">
                    Ce que tu peux réellement te verser ou garder disponible.
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