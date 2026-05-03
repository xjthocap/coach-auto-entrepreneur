import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AppSidebar from "@/components/AppSidebar"
import MobileNav from "@/components/MobileNav"
import AddRevenue from "@/components/AddRevenue"
import RevenueList from "@/components/RevenueList"
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

export default async function RevenuesPage({
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

  const { data: revenues } = await supabase
    .from("revenues")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", period.start)
    .lte("date", period.end)
    .order("date", { ascending: false })

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

  const totalCA = revenues?.reduce((sum, r) => sum + Number(r.amount), 0) || 0
  const revenuesWithInvoice = revenuesWithInvoices.filter(
    (r) => r.invoices.length > 0
  ).length
  const isPremium = profile.plan === "premium" || !!profile.founder_number

  return (
    <main
      className="min-h-screen"
      style={{ background: "var(--cream-100)", color: "var(--ink-900)" }}
    >
      <div className="flex min-h-screen">
        <AppSidebar activePage="revenues" profile={profile} userEmail={user.email} />

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
                  Revenus
                </p>
                <h1
                  className="truncate text-[22px] font-semibold tracking-tight"
                  style={{ color: "var(--ink-900)" }}
                >
                  Encaissements · {period.label}
                </h1>
              </div>

              <div className="hidden md:flex items-center gap-2">
                <TopbarPeriod
                  label={buildPeriodLabel(frequency, period)}
                  frequency={frequency}
                  basePath="/revenues"
                  currentDate={formatLocalDate(baseDate)}
                  addAnchor="add-revenue"
                />
                {isPremium && <ExportPeriodButton date={formatLocalDate(baseDate)} />}
              </div>
            </div>
            <div className="md:hidden flex items-center justify-between px-4 pb-2.5" style={{ borderTop: "1px solid var(--cream-300)" }}>
              <TopbarPeriod
                compact
                label={buildPeriodLabel(frequency, period)}
                frequency={frequency}
                basePath="/revenues"
                currentDate={formatLocalDate(baseDate)}
              />
              {isPremium && <ExportPeriodButton date={formatLocalDate(baseDate)} />}
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-4 px-4 py-6 md:px-8 md:py-8">
            {/* HERO + FORM */}
            <section className="grid items-stretch gap-6 xl:grid-cols-[420px_1fr]">
              <div className="h-full">
                <section
                  className="relative h-full overflow-hidden p-8 md:p-10"
                  style={{
                    background: "var(--ink-900)",
                    borderRadius: "var(--r-xl)",
                  }}
                >
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(ellipse 55% 50% at 85% 10%, rgba(243, 155, 32, 0.18) 0%, transparent 70%)",
                    }}
                  />

                  <div className="relative">
                    <div className="mb-3 flex items-center gap-2">
                      <span
                        className="pulsing-dot inline-block h-1.5 w-1.5 rounded-full"
                        style={{ background: "var(--violet-500)" }}
                      />
                      <span
                        className="text-[11px] uppercase tracking-[0.12em]"
                        style={{ color: "var(--cream-200)" }}
                      >
                        Revenus · {period.label}
                      </span>
                    </div>

                    <div
                      className="font-mono font-light"
                      style={{
                        fontSize: "clamp(42px, 6vw, 64px)",
                        letterSpacing: "-0.05em",
                        color: "var(--violet-500)",
                        lineHeight: 1.05,
                      }}
                    >
                      {totalCA.toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      &nbsp;€
                    </div>

                    <p className="mt-3 text-sm" style={{ color: "var(--cream-200)" }}>
                      {revenues?.length || 0} entrée
                      {(revenues?.length || 0) > 1 ? "s" : ""} · dont{" "}
                      {revenuesWithInvoice} avec facture PDF
                    </p>
                  </div>
                </section>
              </div>

              <div id="add-revenue" className="h-full min-w-0">
                <AddRevenue isPremium={isPremium} />
              </div>
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
              <RevenueList revenues={revenuesWithInvoices} isPremium={isPremium} />
            </section>
          </div>
        </section>
      </div>

      <MobileNav />
    </main>
  )
}