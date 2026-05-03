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

  // ── Alertes déclaration ──
  const realToday = new Date()
  const realCurrentPeriod = getPeriodRange(frequency, realToday)
  const realCurrentEnd = new Date(realCurrentPeriod.end + "T00:00:00")
  const daysUntilCurrentEnd = Math.ceil((realCurrentEnd.getTime() - realToday.getTime()) / (1000 * 60 * 60 * 24))
  const realPrevDateDecl = new Date(realToday)
  realPrevDateDecl.setMonth(realPrevDateDecl.getMonth() - step)
  const realPrevPeriod = getPeriodRange(frequency, realPrevDateDecl)
  const realPrevEnd = new Date(realPrevPeriod.end + "T00:00:00")
  const deadlineDate = new Date(realPrevEnd.getFullYear(), realPrevEnd.getMonth() + 2, 0)
  const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - realToday.getTime()) / (1000 * 60 * 60 * 24))
  const isInDeclarationWindow = realPrevEnd < realToday && daysUntilDeadline >= 0
  const isApproachingEnd = !isInDeclarationWindow && daysUntilCurrentEnd >= 0 && daysUntilCurrentEnd <= 7
  const alertCount = (isInDeclarationWindow ? 1 : 0) + (isApproachingEnd ? 1 : 0)
  function formatDeadline(d: Date) {
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
  }

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
                  alertCount={alertCount}
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
            <div id="declarations" />
            {isInDeclarationWindow && (
              <section className="flex items-start gap-3 px-5 py-4" style={{ background: "var(--rose-100)", borderRadius: "var(--r-md)", border: "1px solid rgba(251,113,133,0.35)" }}>
                <span style={{ flexShrink: 0, width: 32, height: 32, borderRadius: "var(--r-sm)", background: "var(--rose-500)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--rose-500)" }}>
                    Période {realPrevPeriod.label} — déclaration en cours
                  </p>
                  <p className="mt-0.5 text-sm" style={{ color: "var(--rose-500)" }}>
                    Soumets ton CA sur autoentrepreneur.urssaf.fr avant le <strong>{formatDeadline(deadlineDate)}</strong>
                    {daysUntilDeadline <= 5 && <span style={{ marginLeft: 8, borderRadius: 999, background: "var(--rose-500)", padding: "2px 8px", fontSize: 11, fontWeight: 700, color: "white" }}>{daysUntilDeadline === 0 ? "Dernier jour !" : `J-${daysUntilDeadline}`}</span>}.
                  </p>
                </div>
              </section>
            )}
            {isApproachingEnd && (
              <section className="flex items-start gap-3 px-5 py-4" style={{ background: "#FFFBEB", borderRadius: "var(--r-md)", border: "1px solid rgba(245,158,11,0.35)" }}>
                <span style={{ flexShrink: 0, width: 32, height: 32, borderRadius: "var(--r-sm)", background: "#F59E0B", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#92400E" }}>Période {realCurrentPeriod.label} — encore {daysUntilCurrentEnd} jour{daysUntilCurrentEnd > 1 ? "s" : ""}</p>
                  <p className="mt-0.5 text-sm" style={{ color: "#B45309" }}>Vérifie que tous tes encaissements sont bien enregistrés avant la clôture.</p>
                </div>
              </section>
            )}
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