import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import SettingsForm from "@/components/SettingsForm"
import LogoutButton from "@/components/LogoutButton"

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
    <main className="min-h-screen bg-[#f5f6fb] px-4 py-6 text-slate-800 md:px-8 md:py-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 rounded-[28px] border border-white/70 bg-white/70 px-6 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4f7df3] text-2xl font-bold text-white shadow-md">
                AE
              </div>

              <div>
                <p className="text-3xl font-semibold tracking-tight">
                  Paramètres
                </p>
                <p className="text-sm text-slate-500">
                  Mets à jour les informations utilisées dans tes calculs
                </p>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Retour au dashboard
            </Link>
            <LogoutButton />
          </div>
        </header>

        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] border border-white/80 bg-white/80 p-8 shadow-[0_20px_40px_rgba(15,23,42,0.06)]">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
              Tes paramètres
            </h1>
            <p className="mt-3 max-w-xl text-slate-500">
              Ces informations influencent directement tes estimations de
              charges, d’impôts et ton revenu net.
            </p>

            <div className="mt-8">
              <SettingsForm profile={profile} />
            </div>
          </div>

          <div className="rounded-[32px] border border-white/80 bg-white/80 p-8 shadow-[0_20px_40px_rgba(15,23,42,0.06)]">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              Pourquoi c’est important ?
            </h2>

            <div className="mt-6 space-y-5">
              <div className="rounded-2xl bg-[#f8f9fd] p-5">
                <p className="font-medium text-slate-900">Type d’activité</p>
                <p className="mt-2 text-sm leading-7 text-slate-500">
                  Les taux de charges changent selon que tu sois en vente,
                  service ou activité libérale.
                </p>
              </div>

              <div className="rounded-2xl bg-[#f8f9fd] p-5">
                <p className="font-medium text-slate-900">ACRE</p>
                <p className="mt-2 text-sm leading-7 text-slate-500">
                  L’ACRE peut réduire tes cotisations sociales pendant une
                  période donnée.
                </p>
              </div>

              <div className="rounded-2xl bg-[#f8f9fd] p-5">
                <p className="font-medium text-slate-900">
                  Versement libératoire
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-500">
                  Cette option impacte l’estimation de l’impôt affichée dans ton
                  dashboard.
                </p>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}