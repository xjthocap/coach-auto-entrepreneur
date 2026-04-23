import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AddRevenue from "@/components/AddRevenue"
import RevenueList from "@/components/RevenueList"
import LogoutButton from "@/components/LogoutButton"
import PlanBadge from "@/components/PlanBadge"

export default async function RevenuesPage() {
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

  const { data: revenues } = await supabase
    .from("revenues")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })

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
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                <span className="text-base">🏠</span>
                <span>Tableau de bord</span>
              </Link>

              <Link
                href="/revenues"
                className="flex items-center gap-3 rounded-2xl bg-[#0f172a] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
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

            <div className="mt-8 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">Ton plan</p>
                <PlanBadge plan={profile.plan} />
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Suis tes encaissements pour comprendre ce que tu génères vraiment sur ton activité.
              </p>

              <Link
                href="/dashboard"
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-[#f8fafc] px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Retour au dashboard
              </Link>
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
                <p className="text-sm text-slate-500">Revenus</p>
                <h1 className="truncate text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
                  Gère tous tes encaissements simplement
                </h1>
              </div>

              <div className="hidden items-center gap-3 md:flex">
                <Link
                  href="/Expenses"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Dépenses
                </Link>

                <Link
                  href="/dashboard"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Dashboard
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
            {/* HERO */}
            <section className="rounded-[32px] border border-[#dcfce7] bg-gradient-to-r from-[#f0fdf4] to-white p-6 shadow-sm md:p-8">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-[#dcfce7] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#15803d]">
                      Pilotage des revenus
                    </span>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                      Tous tes encaissements
                    </span>
                  </div>

                  <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
                    Visualise ce que ton activité génère réellement.
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                    Ajoute, consulte et organise tous tes revenus pour suivre ton
                    chiffre d’affaires avec une lecture claire et immédiate.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/dashboard"
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Retour au dashboard
                  </Link>
                </div>
              </div>
            </section>

            {/* SUMMARY CARDS */}
            <section className="grid gap-5 md:grid-cols-3">
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Total enregistré</p>
                <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                  {revenues?.length || 0}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  revenus enregistrés
                </p>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Suivi simplifié</p>
                <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                  Clair
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  pour piloter ton activité
                </p>
              </div>

              <div className="rounded-[28px] bg-[#0f172a] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.15)]">
                <p className="text-sm text-slate-300">Objectif</p>
                <p className="mt-3 text-3xl font-black tracking-tight text-[#4ade80]">
                  Mieux comprendre
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  ce que ton business encaisse vraiment
                </p>
              </div>
            </section>

            {/* ADD REVENUE */}
            <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-black tracking-tight text-slate-950">
                  Ajouter un revenu
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-500">
                  Renseigne un nouvel encaissement pour garder ton suivi à jour.
                </p>
              </div>

              <div className="rounded-[28px] bg-[#f8fafc] p-2">
                <AddRevenue />
              </div>
            </section>

            {/* LIST */}
            <section className="rounded-[32px] border border-slate-200 bg-white p-2 shadow-sm">
              <RevenueList revenues={revenues || []} />
            </section>
          </div>
        </section>
      </div>
    </main>
  )
}