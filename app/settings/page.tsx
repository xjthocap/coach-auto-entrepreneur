import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import SettingsForm from "@/components/SettingsForm"
import LogoutButton from "@/components/LogoutButton"
import PlanBadge from "@/components/PlanBadge"

export default async function SettingsPage() {
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
                className="flex items-center gap-3 rounded-2xl bg-[#0f172a] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
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
                Mets à jour les informations qui influencent tes calculs et
                l’affichage de ton dashboard.
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
                <p className="text-sm text-slate-500">Paramètres</p>
                <h1 className="truncate text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
                  Ajuste les bases de ton pilotage
                </h1>
              </div>

              <div className="hidden items-center gap-3 md:flex">
                <Link
                  href="/dashboard"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Dashboard
                </Link>

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
                      Configuration du profil
                    </span>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                      Calculs personnalisés
                    </span>
                  </div>

                  <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
                    Mets à jour les informations qui pilotent tes estimations.
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                    Ton activité, l’ACRE, le versement libératoire et la
                    périodicité de déclaration influencent directement tes
                    calculs de charges, d’impôts et ton disponible réel.
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

            {/* CONTENT GRID */}
            <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              {/* FORM CARD */}
              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-6">
                  <p className="text-sm font-semibold uppercase tracking-wide text-[#16a34a]">
                    Tes paramètres
                  </p>
                  <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                    Profil & configuration
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                    Modifie ici les informations utilisées dans tes calculs
                    personnalisés.
                  </p>
                </div>

                <div className="rounded-[28px] bg-[#f8fafc] p-3">
                  <SettingsForm profile={profile} />
                </div>
              </div>

              {/* INFO COLUMN */}
              <div className="space-y-6">
                <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Pourquoi c’est important
                  </p>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                    Chaque réglage change tes estimations
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    KeskiReste utilise ces informations pour te donner une lecture
                    plus fiable de ta situation.
                  </p>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="font-semibold text-slate-900">Prénom</p>
                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    Il personnalise ton espace et rend ton dashboard plus clair
                    au quotidien.
                  </p>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="font-semibold text-slate-900">Type d’activité</p>
                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    Les taux changent selon que tu sois en vente, en service ou
                    en activité libérale.
                  </p>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="font-semibold text-slate-900">ACRE</p>
                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    L’ACRE peut réduire tes cotisations sociales pendant une
                    période donnée.
                  </p>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="font-semibold text-slate-900">
                    Versement libératoire
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    Cette option impacte l’estimation de l’impôt affichée dans
                    ton dashboard.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  )
}