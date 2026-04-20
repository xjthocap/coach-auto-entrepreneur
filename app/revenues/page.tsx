import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AddRevenue from "@/components/AddRevenue"
import RevenueList from "@/components/RevenueList"
import LogoutButton from "@/components/LogoutButton"

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
    <main className="min-h-screen bg-[#f5f6fb] text-slate-800">
      <div className="flex min-h-screen">
        <aside className="hidden w-20 flex-col justify-between border-r border-slate-200 bg-[#eef1f8] px-3 py-6 md:flex">
          <div className="space-y-4 fixed">
            <Link
              href="/dashboard"
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl shadow-sm transition hover:bg-slate-50"
            >
              🏠
            </Link>

            <Link
              href="/revenues"
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#dfe7ff] shadow-sm"
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
          <div className="mx-auto max-w-7xl">
            <header className="mb-8 rounded-[28px] border border-white/70 bg-white/70 px-6 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4f7df3] text-2xl font-bold text-white shadow-md">
                    AE
                  </div>

                  <div>
                    <p className="text-3xl font-semibold tracking-tight">
                      Mes revenus
                    </p>
                    <p className="text-sm text-slate-500">
                      Gère tous tes encaissements dans un seul espace
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                    href="/revenues"
                    className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                    Revenues
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
                  <Link
                    href="/dashboard"
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                     >
                    Retour au dashboard
                  </Link>

                </div>
              </div>
            </header>

            <section className="mb-8">
              <h1 className="text-5xl font-semibold tracking-tight text-slate-900">
                Revenus
              </h1>
              <p className="mt-2 text-lg text-slate-500">
                Ajoute, consulte et supprime tes revenus simplement.
              </p>
            </section>

            <section className="mb-8">
              <AddRevenue />
            </section>

            <section>
              <RevenueList revenues={revenues || []} />
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}