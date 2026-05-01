import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AppSidebar from "@/components/AppSidebar"
import MobileNav from "@/components/MobileNav"
import { calculateMicro } from "@/lib/calculations"
import ExportMonthButton from "@/components/ExportMonthButton"
import HistoryPaywall from "@/components/HistoryPaywall"

type Revenue = {
  id: string
  amount: number
  date: string
  label: string | null
  client_name?: string | null
}

type Expense = {
  id: string
  amount: number
  date: string
  label: string | null
  type: "one_time" | "recurring"
  active: boolean
}

type MonthSummary = {
  key: string
  label: string
  shortLabel: string
  revenues: Revenue[]
  expenses: Expense[]
  totalRevenue: number
  totalExpenses: number
  charges: number
  tax: number
  net: number
}

const MONTHS_SHORT = ["JAN","FÉV","MAR","AVR","MAI","JUN","JUL","AOÛ","SEP","OCT","NOV","DÉC"]

function getMonthShort(key: string): string {
  const [year, month] = key.split("-").map(Number)
  return `${MONTHS_SHORT[month - 1]} ${year}`
}

function getMonthLabel(key: string): string {
  const [year, month] = key.split("-").map(Number)
  const date = new Date(year, month - 1, 1)
  const label = date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>
}) {
  const supabase = await createClient()
  const resolvedParams = await searchParams

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

  // ── Données ──
  const { data: allRevenues } = await supabase
    .from("revenues")
    .select("id, amount, date, label, client_name")
    .eq("user_id", user.id)
    .order("date", { ascending: false })

  const { data: allExpenses } = await supabase
    .from("expenses")
    .select("id, amount, date, label, type, active")
    .eq("user_id", user.id)
    .order("date", { ascending: false })

  // ── Groupement par mois ──
  const monthsMap = new Map<string, { revenues: Revenue[]; expenses: Expense[] }>()

  for (const rev of allRevenues || []) {
    const key = rev.date.substring(0, 7)
    if (!monthsMap.has(key)) monthsMap.set(key, { revenues: [], expenses: [] })
    monthsMap.get(key)!.revenues.push(rev)
  }

  for (const exp of allExpenses || []) {
    if (exp.type === "one_time") {
      const key = exp.date.substring(0, 7)
      if (!monthsMap.has(key)) monthsMap.set(key, { revenues: [], expenses: [] })
      monthsMap.get(key)!.expenses.push(exp)
    }
  }

  // Mois courant
  const now = new Date()
  const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  if (!monthsMap.has(currentKey)) monthsMap.set(currentKey, { revenues: [], expenses: [] })

  const activeRecurring = (allExpenses || []).filter(e => e.type === "recurring" && e.active)

  // ── Calcul mensuel ──
  const monthsDesc: MonthSummary[] = Array.from(monthsMap.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, data]) => {
      const totalRevenue = data.revenues.reduce((s, r) => s + Number(r.amount), 0)
      const monthExpenses = [
        ...data.expenses,
        ...(totalRevenue > 0 || data.expenses.length > 0 ? activeRecurring : []),
      ]
      const totalExpenses = monthExpenses.reduce((s, e) => s + Number(e.amount), 0)
      const result = calculateMicro({
        revenue: totalRevenue,
        activityType: profile.activity_type,
        acre: profile.acre,
        versementLiberatoire: profile.versement_liberatoire,
      })
      return {
        key,
        label: getMonthLabel(key),
        shortLabel: getMonthShort(key),
        revenues: data.revenues,
        expenses: monthExpenses,
        totalRevenue,
        totalExpenses,
        charges: result.charges,
        tax: result.tax,
        net: result.net - totalExpenses,
      }
    })

  // Affichage chronologique (ascendant) pour la grille
  const monthsAsc = [...monthsDesc].reverse()

  // ── Mois sélectionné ──
  const selectedKey = resolvedParams?.month ?? monthsDesc[0]?.key ?? currentKey
  const selectedIdx = monthsDesc.findIndex(m => m.key === selectedKey)
  const selectedMonth = monthsDesc[selectedIdx] ?? monthsDesc[0]
  const prevMonth = selectedIdx < monthsDesc.length - 1 ? monthsDesc[selectedIdx + 1] : null
  const nextMonth = selectedIdx > 0 ? monthsDesc[selectedIdx - 1] : null

  // ── Barres mini chart ──
  // Pour chaque carte, 4 barres = les 4 mois consécutifs se terminant à ce mois (ordre asc)
  const maxCA = Math.max(...monthsDesc.map(m => m.totalRevenue), 1)
  function getBars(key: string): number[] {
    const idxAsc = monthsAsc.findIndex(m => m.key === key)
    const bars: number[] = []
    for (let i = 3; i >= 0; i--) {
      const target = monthsAsc[idxAsc - i]
      bars.push(target ? target.totalRevenue : 0)
    }
    return bars.map(v => Math.max(Math.round((v / maxCA) * 40), 3))
  }

  const totalAllTime = monthsDesc.reduce((s, m) => s + m.totalRevenue, 0)
  const activeMonths = monthsDesc.filter(m => m.totalRevenue > 0).length
  const isPremium = profile.plan === "premium"

  return (
    <main className="min-h-screen" style={{ background: "var(--cream-100)", color: "var(--ink-900)" }}>
      <div className="flex min-h-screen">
        <AppSidebar activePage="history" profile={profile} userEmail={user.email} />

        <section className="min-w-0 flex-1 pb-20 lg:pb-0 page-enter">

          {/* ── TOPBAR ── */}
          <header
            className="sticky top-0 z-20 backdrop-blur"
            style={{ background: "rgba(248, 247, 252, 0.92)", borderBottom: "1px solid var(--cream-300)" }}
          >
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 md:px-8">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.08em]" style={{ color: "var(--ink-400)" }}>Historique</p>
                <h1 className="truncate text-[22px] font-semibold tracking-tight" style={{ color: "var(--ink-900)" }}>
                  Historique mensuel <span className="wave-emoji">👋</span>
                </h1>
              </div>
              <div className="hidden items-center gap-2 md:flex">
                <Link
                  href="/revenues"
                  className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:opacity-70"
                  style={{ borderColor: "var(--cream-200)", background: "var(--cream-50)", color: "var(--ink-500)" }}
                >
                  Revenus
                </Link>
                <Link
                  href="/dashboard"
                  className="rounded-lg px-4 py-2 text-sm font-medium transition hover:opacity-90"
                  style={{ background: "var(--ink-900)", color: "var(--lime-500)" }}
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 md:px-8 md:py-8">

            {/* ── PAYWALL ── */}
            {!isPremium && (
              <HistoryPaywall />
            )}

            {/* ── STAT TOTAUX ── */}
            <section className="grid gap-3 grid-cols-2 md:grid-cols-3">
              {[
                { label: "CA total enregistré", value: totalAllTime, sub: `${activeMonths} mois actifs` },
                { label: "Mois avec activité", count: activeMonths, sub: "avec au moins un revenu" },
                {
                  label: "Moyenne mensuelle",
                  value: activeMonths > 0 ? totalAllTime / activeMonths : 0,
                  sub: "par mois actif",
                  dark: true,
                },
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
                    <p className="mt-3 font-mono font-normal" style={{ fontSize: 22, letterSpacing: "-0.04em", color: stat.dark ? "var(--lime-500)" : "var(--ink-900)" }}>
                      {(stat.value ?? 0).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                    </p>
                  ) : (
                    <p className="mt-3 font-mono font-normal" style={{ fontSize: 26, letterSpacing: "-0.04em", color: "var(--ink-900)" }}>
                      {stat.count}
                    </p>
                  )}
                  <p className="mt-2 text-xs" style={{ color: stat.dark ? "var(--ink-400)" : "var(--ink-400)" }}>{stat.sub}</p>
                </div>
              ))}
            </section>

            {/* ── GRILLE DES MOIS (premium only) ── */}
            {isPremium && <section
              className="p-6"
              style={{ background: "var(--cream-50)", borderRadius: "var(--r-lg)", boxShadow: "var(--shadow-md)" }}
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight" style={{ color: "var(--ink-900)" }}>
                    Historique mensuel
                  </h2>
                  <p className="mt-0.5 text-sm" style={{ color: "var(--ink-400)" }}>
                    Sélectionne un mois pour voir le détail.
                  </p>
                </div>
                {isPremium && <ExportMonthButton monthKey={selectedKey} />}
                {!isPremium && (
                  <div
                    className="hidden items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium opacity-50 cursor-not-allowed md:flex"
                    style={{ borderColor: "var(--cream-200)", background: "var(--cream-50)", color: "var(--ink-500)" }}
                    title="Fonctionnalité Premium"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    Export Excel Premium
                  </div>
                )}
              </div>

              {monthsAsc.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm" style={{ color: "var(--ink-400)" }}>Aucun revenu enregistré pour le moment.</p>
                  <Link
                    href="/revenues"
                    className="mt-4 inline-flex items-center rounded-lg px-5 py-3 text-sm font-semibold transition hover:opacity-90"
                    style={{ background: "var(--lime-500)", color: "var(--ink-900)" }}
                  >
                    Ajouter un premier revenu
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {monthsAsc.slice(-12).map((month) => {
                    const isActive = month.key === selectedKey
                    const bars = getBars(month.key)
                    return (
                      <Link
                        key={month.key}
                        href={`/history?month=${month.key}`}
                        className="block transition hover:-translate-y-0.5"
                        style={{
                          background: isActive ? "var(--ink-900)" : "var(--cream-100)",
                          borderRadius: "var(--r-md)",
                          padding: "18px 20px 16px",
                          boxShadow: isActive ? "var(--shadow-lg)" : "none",
                        }}
                      >
                        {/* Mois */}
                        <p
                          className="text-[11px] uppercase tracking-[0.1em]"
                          style={{ color: isActive ? "var(--ink-300)" : "var(--ink-400)" }}
                        >
                          {month.shortLabel}
                        </p>

                        {/* Solde */}
                        <p
                          className="mt-2 font-mono font-light"
                          style={{
                            fontSize: 20,
                            letterSpacing: "-0.04em",
                            color: isActive ? "var(--lime-500)" : "var(--ink-900)",
                            lineHeight: 1.1,
                          }}
                        >
                          {month.net >= 0 ? "+" : ""}
                          {month.net.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}&nbsp;€
                        </p>

                        {/* CA · Dép */}
                        <p
                          className="mt-1.5 font-mono text-[11px]"
                          style={{ color: isActive ? "var(--ink-400)" : "var(--ink-400)" }}
                        >
                          CA {month.totalRevenue.toLocaleString("fr-FR")} · Dép {month.totalExpenses.toLocaleString("fr-FR")}
                        </p>

                        {/* Mini bar chart */}
                        <div className="mt-4 flex items-end gap-1" style={{ height: 44 }}>
                          {bars.map((h, i) => (
                            <div
                              key={i}
                              className="flex-1 rounded-sm transition-all"
                              style={{
                                height: h,
                                background: i === bars.length - 1
                                  ? "var(--lime-500)"
                                  : isActive
                                  ? "var(--ink-600)"
                                  : "var(--cream-300)",
                              }}
                            />
                          ))}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </section>}

            {/* ── DÉTAIL DU MOIS SÉLECTIONNÉ (premium only) ── */}
            {isPremium && selectedMonth && (
              <section
                className="p-6 md:p-7"
                style={{ background: "var(--cream-50)", borderRadius: "var(--r-lg)", boxShadow: "var(--shadow-md)" }}
              >
                {/* Header détail */}
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.08em]" style={{ color: "var(--ink-400)" }}>
                      Détail
                    </p>
                    <h3 className="mt-1 text-2xl font-semibold tracking-tight" style={{ color: "var(--ink-900)" }}>
                      {selectedMonth.label}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    {prevMonth ? (
                      <Link
                        href={`/history?month=${prevMonth.key}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition hover:opacity-70"
                        style={{ background: "var(--cream-200)", color: "var(--ink-500)" }}
                      >
                        ‹
                      </Link>
                    ) : (
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium opacity-30"
                        style={{ background: "var(--cream-200)", color: "var(--ink-500)" }}
                      >
                        ‹
                      </span>
                    )}
                    {nextMonth ? (
                      <Link
                        href={`/history?month=${nextMonth.key}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition hover:opacity-70"
                        style={{ background: "var(--cream-200)", color: "var(--ink-500)" }}
                      >
                        ›
                      </Link>
                    ) : (
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium opacity-30"
                        style={{ background: "var(--cream-200)", color: "var(--ink-500)" }}
                      >
                        ›
                      </span>
                    )}
                  </div>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                  {[
                    {
                      label: "Chiffre d'affaires",
                      value: selectedMonth.totalRevenue,
                      sub: `${selectedMonth.revenues.length} entrée${selectedMonth.revenues.length > 1 ? "s" : ""}`,
                      icon: (
                        <path d="M12 2v20M5 7l7-5 7 5M5 17l7 5 7-5"/>
                      ),
                    },
                    {
                      label: "Charges + impôt",
                      value: selectedMonth.charges + selectedMonth.tax,
                      sub: "URSSAF + impôt lib.",
                      icon: (
                        <path d="M3 12h18M3 7h18M3 17h18"/>
                      ),
                    },
                    {
                      label: "Dépenses",
                      value: selectedMonth.totalExpenses,
                      sub: `${selectedMonth.expenses.filter(e => e.type === "one_time").length} dépenses ponctuelles`,
                      icon: (
                        <path d="M3 12h18M3 7h18M3 17h18"/>
                      ),
                    },
                    {
                      label: "Solde net",
                      value: selectedMonth.net,
                      sub: selectedMonth.label,
                      icon: (
                        <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>
                      ),
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="rounded-[14px] p-5"
                      style={{ background: "var(--cream-100)" }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm" style={{ color: "var(--ink-500)" }}>{stat.label}</span>
                        <div
                          className="flex items-center justify-center rounded-lg"
                          style={{ width: 28, height: 28, background: "var(--cream-200)", color: "var(--ink-400)" }}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            {stat.icon}
                          </svg>
                        </div>
                      </div>
                      <p
                        className="font-mono font-light"
                        style={{ fontSize: 24, letterSpacing: "-0.04em", color: "var(--ink-900)", lineHeight: 1.1 }}
                      >
                        {stat.value.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}
                      </p>
                      <p className="mt-0.5 font-mono text-sm" style={{ color: "var(--ink-400)" }}>€</p>
                      <p className="mt-3 text-xs" style={{ color: "var(--ink-400)" }}>{stat.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Revenus du mois */}
                {selectedMonth.revenues.length > 0 && (
                  <div className="mt-6">
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--ink-400)" }}>
                      Revenus
                    </p>
                    <div className="space-y-1.5">
                      {selectedMonth.revenues.map((rev) => (
                        <div
                          key={rev.id}
                          className="flex items-center justify-between rounded-[10px] px-4 py-2.5"
                          style={{ background: "var(--cream-100)" }}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                              style={{ background: "rgba(196, 181, 253, 0.2)" }}
                            >
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--lime-700)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 5v14M19 12l-7 7-7-7"/>
                              </svg>
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium" style={{ color: "var(--ink-900)" }}>
                                {rev.label?.trim() || "Sans libellé"}
                              </p>
                              {rev.client_name && (
                                <p className="text-xs" style={{ color: "var(--ink-400)" }}>{rev.client_name}</p>
                              )}
                            </div>
                          </div>
                          <p className="ml-4 shrink-0 font-mono text-sm font-medium" style={{ color: "var(--lime-700)" }}>
                            +{Number(rev.amount).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dépenses ponctuelles du mois */}
                {selectedMonth.expenses.filter(e => e.type === "one_time").length > 0 && (
                  <div className="mt-5">
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--ink-400)" }}>
                      Dépenses ponctuelles
                    </p>
                    <div className="space-y-1.5">
                      {selectedMonth.expenses.filter(e => e.type === "one_time").map((exp) => (
                        <div
                          key={exp.id}
                          className="flex items-center justify-between rounded-[10px] px-4 py-2.5"
                          style={{ background: "var(--cream-100)" }}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                              style={{ background: "rgba(229, 101, 75, 0.12)" }}
                            >
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--rose-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 19V5M5 12l7-7 7 7"/>
                              </svg>
                            </div>
                            <p className="truncate text-sm font-medium" style={{ color: "var(--ink-900)" }}>
                              {exp.label?.trim() || "Sans libellé"}
                            </p>
                          </div>
                          <p className="ml-4 shrink-0 font-mono text-sm font-medium" style={{ color: "var(--rose-500)" }}>
                            -{Number(exp.amount).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedMonth.revenues.length === 0 && selectedMonth.expenses.filter(e => e.type === "one_time").length === 0 && (
                  <p className="mt-6 text-center text-sm" style={{ color: "var(--ink-300)" }}>
                    Aucune entrée ni sortie enregistrée sur ce mois.
                  </p>
                )}
              </section>
            )}
          </div>
        </section>
      </div>

      <MobileNav />
    </main>
  )
}
