import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AppSidebar from "@/components/AppSidebar"
import MobileNav from "@/components/MobileNav"
import AddExpense from "@/components/AddExpense"
import ExpenseList from "@/components/ExpenseList"
import ExportPeriodButton from "@/components/ExportPeriodButton"
import TopbarPeriod from "@/components/TopbarPeriod"
import { getPeriodRange } from "@/lib/period"

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

function buildPeriodLabel(frequency: "monthly" | "quarterly", period: { label: string; start: string; end: string }) {
  if (frequency === "monthly") return period.label
  const [sy, sm] = period.start.split("-").map(Number)
  const [ey, em] = period.end.split("-").map(Number)
  const startMonth = new Date(sy, sm - 1, 1).toLocaleDateString("fr-FR", { month: "short" }).replace(".", "")
  const endMonth = new Date(ey, em - 1, 1).toLocaleDateString("fr-FR", { month: "short" }).replace(".", "")
  return `${period.label} · ${startMonth}. → ${endMonth}.`
}

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const supabase = await createClient()
  const resolvedSearchParams = await searchParams

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!profile) redirect("/onboarding")

  const frequency =
    profile.declaration_frequency === "quarterly" ? "quarterly" : "monthly"

  const dateParam = resolvedSearchParams?.date ?? null
  const baseDate = dateParam ? parseLocalDate(dateParam) : new Date()
  const period = getPeriodRange(frequency, baseDate)

  const step = frequency === "quarterly" ? 3 : 1
  const prevDate = new Date(baseDate)
  prevDate.setMonth(prevDate.getMonth() - step)
  const nextDate = new Date(baseDate)
  nextDate.setMonth(nextDate.getMonth() + step)

  const { data: expenses } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })

  const expensesWithPeriodInfo = (expenses || []).map((exp) => {
    const isInPeriod =
      exp.type === "one_time"
        ? exp.date >= period.start && exp.date <= period.end
        : exp.type === "recurring" && exp.active

    return { ...exp, isInPeriod }
  })

  const totalRecurring =
    expenses?.filter((e) => e.type === "recurring" && e.active).length || 0

  const totalOneTime =
    expenses?.filter(
      (e) => e.type === "one_time" && e.date >= period.start && e.date <= period.end
    ).length || 0

  const monthlyRecurringTotal =
    expenses
      ?.filter((e) => e.type === "recurring" && e.active)
      .reduce((sum, e) => sum + Number(e.amount), 0) || 0

  const periodOneTimeTotal =
    expenses
      ?.filter(
        (e) => e.type === "one_time" && e.date >= period.start && e.date <= period.end
      )
      .reduce((sum, e) => sum + Number(e.amount), 0) || 0

  const totalPeriod = monthlyRecurringTotal + periodOneTimeTotal
  const isPremium = profile.plan === "premium"

  return (
    <main
      className="min-h-screen"
      style={{ background: "var(--cream-100)", color: "var(--ink-900)" }}
    >
      <div className="flex min-h-screen">
        <AppSidebar activePage="expenses" profile={profile} userEmail={user.email} />

        <section className="min-w-0 flex-1 pb-20 lg:pb-0 page-enter">
          {/* TOPBAR */}
          <header
            className="sticky top-0 z-20 backdrop-blur"
            style={{
              background: "rgba(248, 247, 252, 0.92)",
              borderBottom: "1px solid var(--cream-300)",
            }}
          >
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 md:px-8">
              <div className="min-w-0">
                <p
                  className="text-[11px] uppercase tracking-[0.08em]"
                  style={{ color: "var(--ink-400)" }}
                >
                  Dépenses
                </p>

                <h1
                  className="truncate text-[22px] font-semibold tracking-tight"
                  style={{ color: "var(--ink-900)" }}
                >
                  Sorties · {period.label}
                </h1>
              </div>

              <div className="hidden md:flex items-center gap-2">
                <TopbarPeriod
                  label={buildPeriodLabel(frequency, period)}
                  prevUrl={`/Expenses?date=${formatLocalDate(prevDate)}`}
                  nextUrl={`/Expenses?date=${formatLocalDate(nextDate)}`}
                  addAnchor="add-expense"
                />
                {isPremium && <ExportPeriodButton date={formatLocalDate(baseDate)} />}
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-4 px-4 py-6 md:px-8 md:py-8">
            {/* HERO + FORM */}
            <section className="grid items-stretch gap-6 xl:grid-cols-[420px_1fr]">
              <div className="h-full">
                <section
                  className="relative h-full overflow-hidden p-8 md:p-10"
                  style={{
                    background: "var(--rose-100)",
                    borderRadius: "var(--r-xl)",
                  }}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className="text-[11px] uppercase tracking-[0.12em]"
                      style={{ color: "var(--rose-500)" }}
                    >
                      Sorties · {period.label}
                    </span>
                  </div>

                  <div
                    className="font-mono font-light"
                    style={{
                      fontSize: "clamp(42px, 6vw, 64px)",
                      letterSpacing: "-0.05em",
                      color: "var(--rose-500)",
                      lineHeight: 1.05,
                    }}
                  >
                    {totalPeriod.toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    &nbsp;€
                  </div>

                  <p className="mt-3 text-sm" style={{ color: "var(--ink-500)" }}>
                    {totalRecurring} récurrente{totalRecurring > 1 ? "s" : ""} ·{" "}
                    {totalOneTime} ponctuelle{totalOneTime > 1 ? "s" : ""} sur la
                    période
                  </p>
                </section>
              </div>

              <div id="add-expense" className="h-full min-w-0">
                <AddExpense />
              </div>
            </section>

            {/* STAT GRID */}
            <section className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {[
                { label: "Ponctuelles", count: totalOneTime, sub: `Période ${period.label}` },
                { label: "Récurrentes actives", count: totalRecurring, sub: "comptées chaque période" },
                { label: "Impact / période", value: totalPeriod, sub: "sur ton disponible", dark: true },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="rounded-[14px] p-5"
                  style={{
                    background: stat.dark ? "var(--ink-900)" : "var(--cream-50)",
                    boxShadow: "var(--shadow-md)",
                  }}
                >
                  <p
                    className="text-[11px] uppercase tracking-[0.08em]"
                    style={{ color: stat.dark ? "var(--ink-300)" : "var(--ink-400)" }}
                  >
                    {stat.label}
                  </p>

                  {"value" in stat ? (
                    <p
                      className="mt-3 font-mono font-normal"
                      style={{
                        fontSize: 22,
                        letterSpacing: "-0.04em",
                        color: "var(--rose-500)",
                      }}
                    >
                      {stat.value.toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      €
                    </p>
                  ) : (
                    <p
                      className="mt-3 font-mono font-normal"
                      style={{
                        fontSize: 26,
                        letterSpacing: "-0.04em",
                        color: stat.dark ? "var(--lime-500)" : "var(--ink-900)",
                      }}
                    >
                      {stat.count}
                    </p>
                  )}

                  <p
                    className="mt-2 text-xs"
                    style={{ color: stat.dark ? "var(--ink-400)" : "var(--ink-400)" }}
                  >
                    {stat.sub}
                  </p>
                </div>
              ))}
            </section>

            {/* LISTE */}
            <section
              className="overflow-hidden"
              style={{
                background: "var(--cream-50)",
                borderRadius: "var(--r-lg)",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <ExpenseList expenses={expensesWithPeriodInfo} showPeriodInfo />
            </section>
          </div>
        </section>
      </div>

      <MobileNav />
    </main>
  )
}