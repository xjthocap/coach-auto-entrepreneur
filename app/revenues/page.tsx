import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AppSidebar from "@/components/AppSidebar"
import MobileNav from "@/components/MobileNav"
import AddRevenue from "@/components/AddRevenue"
import RevenueList from "@/components/RevenueList"
import ExportPeriodButton from "@/components/ExportPeriodButton"
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
  const revenuesWithInvoice = revenuesWithInvoices.filter((r) => r.invoices.length > 0).length
  const isPremium = profile.plan === "premium"

  return (
    <main className="min-h-screen" style={{ background: "var(--cream-100)", color: "var(--ink-900)" }}>
      <div className="flex min-h-screen">
        <AppSidebar activePage="revenues" profile={profile} userEmail={user.email} />

        <section className="min-w-0 flex-1 pb-20 lg:pb-0 page-enter">

          {/* TOPBAR */}
          <header
            className="sticky top-0 z-20 backdrop-blur"
            style={{ background: "rgba(248, 247, 252, 0.92)", borderBottom: "1px solid var(--cream-300)" }}
          >
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 md:px-8">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.08em]" style={{ color: "var(--ink-400)" }}>
                  Revenus
                </p>
                <h1 className="truncate text-[22px] font-semibold tracking-tight" style={{ color: "var(--ink-900)" }}>
                  Encaissements · {period.label}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="hidden items-center gap-2 rounded-full px-4 py-2 text-sm md:flex"
                  style={{ background: "var(--cream-50)", border: "1px solid var(--cream-300)", color: "var(--ink-500)" }}
                >
                  <span className="pulsing-dot inline-block h-1.5 w-1.5 rounded-full" style={{ background: "var(--violet-500)" }} />
                  {period.label}
                </div>
                <Link
                  href={`/revenues?date=${formatLocalDate(prevDate)}`}
                  className="hidden rounded-lg border px-3 py-2 text-sm font-medium transition hover:opacity-70 md:block"
                  style={{ borderColor: "var(--cream-300)", background: "var(--cream-50)", color: "var(--ink-500)" }}
                >
                  ←
                </Link>
                <Link
                  href={`/revenues?date=${formatLocalDate(nextDate)}`}
                  className="hidden rounded-lg border px-3 py-2 text-sm font-medium transition hover:opacity-70 md:block"
                  style={{ borderColor: "var(--cream-300)", background: "var(--cream-50)", color: "var(--ink-500)" }}
                >
                  →
                </Link>
                {isPremium && <ExportPeriodButton date={formatLocalDate(baseDate)} />}
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-4 px-4 py-6 md:px-8 md:py-8">

            {/* HERO DARK */}
            <section
              className="relative overflow-hidden p-8 md:p-10"
              style={{ background: "var(--ink-900)", borderRadius: "var(--r-xl)" }}
            >
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: "radial-gradient(ellipse 55% 50% at 85% 10%, rgba(196, 181, 253, 0.18) 0%, transparent 70%)" }}
              />
              <div className="relative">
                <div className="mb-3 flex items-center gap-2">
                  <span className="pulsing-dot inline-block h-1.5 w-1.5 rounded-full" style={{ background: "var(--violet-500)" }} />
                  <span className="text-[11px] uppercase tracking-[0.12em]" style={{ color: "var(--ink-300)" }}>
                    Revenus · {period.label}
                  </span>
                </div>
                <div
                  className="font-mono font-light"
                  style={{ fontSize: "clamp(42px, 6vw, 64px)", letterSpacing: "-0.05em", color: "var(--violet-500)", lineHeight: 1.05 }}
                >
                  {totalCA.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}&nbsp;€
                </div>
                <p className="mt-3 text-sm" style={{ color: "var(--ink-400)" }}>
                  {revenues?.length || 0} entrée{(revenues?.length || 0) > 1 ? "s" : ""} · dont {revenuesWithInvoice} avec facture PDF
                </p>
              </div>
            </section>

            {/* STAT GRID */}
            <section className="grid gap-3 grid-cols-2 md:grid-cols-3">
              {[
                { label: "Total encaissé", value: totalCA, sub: `Période ${period.label}` },
                { label: "Revenus enregistrés", count: revenues?.length || 0, sub: `dont ${revenuesWithInvoice} avec facture` },
                { label: "Factures PDF", count: revenuesWithInvoice, sub: "téléchargeables", dark: true },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="rounded-[14px] p-5"
                  style={{ background: stat.dark ? "var(--ink-900)" : "var(--cream-50)", boxShadow: "var(--shadow-md)" }}
                >
                  <p className="text-[11px] uppercase tracking-[0.08em]" style={{ color: stat.dark ? "var(--ink-300)" : "var(--ink-400)" }}>
                    {stat.label}
                  </p>
                  {"value" in stat ? (
                    <p className="mt-3 font-mono font-normal" style={{ fontSize: 22, letterSpacing: "-0.04em", color: stat.dark ? "var(--violet-500)" : "var(--ink-900)" }}>
                      {stat.value.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                    </p>
                  ) : (
                    <p className="mt-3 font-mono font-normal" style={{ fontSize: 26, letterSpacing: "-0.04em", color: stat.dark ? "var(--violet-500)" : "var(--ink-900)" }}>
                      {stat.count}
                    </p>
                  )}
                  <p className="mt-2 text-xs" style={{ color: "var(--ink-400)" }}>{stat.sub}</p>
                </div>
              ))}
            </section>

            {/* AJOUTER */}
            <section
              className="p-6 md:p-8"
              style={{ background: "var(--cream-50)", borderRadius: "var(--r-lg)", boxShadow: "var(--shadow-md)" }}
            >
              <div className="mb-5">
                <h2 className="text-lg font-semibold tracking-tight" style={{ color: "var(--ink-900)" }}>
                  Ajouter un revenu
                </h2>
                <p className="mt-1 text-sm" style={{ color: "var(--ink-400)" }}>
                  Renseigne un nouvel encaissement. Tu peux générer une facture PDF en même temps.
                </p>
              </div>
              <div className="rounded-[14px] p-2" style={{ background: "var(--cream-100)" }}>
                <AddRevenue />
              </div>
            </section>

            {/* LISTE */}
            <section
              className="overflow-hidden"
              style={{ background: "var(--cream-50)", borderRadius: "var(--r-lg)", boxShadow: "var(--shadow-md)" }}
            >
              <RevenueList revenues={revenuesWithInvoices} />
            </section>

          </div>
        </section>
      </div>

      <MobileNav />
    </main>
  )
}
