import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AppSidebar from "@/components/AppSidebar"
import MobileNav from "@/components/MobileNav"
import SettingsForm from "@/components/SettingsForm"

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
    <main className="min-h-screen" style={{ background: "var(--cream-100)", color: "var(--ink-900)" }}>
      <div className="flex min-h-screen">
        <AppSidebar activePage="settings" profile={profile} userEmail={user.email} />

        <section className="min-w-0 flex-1 pb-20 lg:pb-0 page-enter">
          {/* TOPBAR */}
          <header
            className="sticky top-0 z-20 backdrop-blur"
            style={{ background: "rgba(248, 247, 252, 0.92)", borderBottom: "1px solid var(--cream-300)" }}
          >
            <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3.5 md:px-8">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.08em]" style={{ color: "var(--ink-400)" }}>Paramètres</p>
                <h1 className="truncate text-[22px] font-semibold tracking-tight" style={{ color: "var(--ink-900)" }}>
                  Ajuste les bases de ton pilotage
                </h1>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-4 px-4 py-6 md:px-8 md:py-8">

            {/* CONTENT GRID */}
            <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
              {/* FORM CARD */}
              <div
                className="p-6 md:p-8"
                style={{ background: "var(--cream-50)", borderRadius: "var(--r-lg)", boxShadow: "var(--shadow-md)" }}
              >
                <div className="mb-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--lime-700)" }}>
                    Tes paramètres
                  </p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight" style={{ color: "var(--ink-900)" }}>
                    Profil &amp; configuration
                  </h2>
                  <p className="mt-2 text-sm" style={{ color: "var(--ink-400)" }}>
                    Modifie ici les informations utilisées dans tes calculs personnalisés.
                  </p>
                </div>
                <div className="rounded-[14px] p-3" style={{ background: "var(--cream-100)" }}>
                  <SettingsForm profile={profile} />
                </div>
              </div>

              {/* INFO COLUMN */}
              <div className="space-y-3">
                <div
                  className="p-5"
                  style={{ background: "var(--cream-50)", borderRadius: "var(--r-md)", boxShadow: "var(--shadow-md)" }}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--ink-400)" }}>
                    Pourquoi c&apos;est important
                  </p>
                  <h3 className="mt-2 text-base font-semibold tracking-tight" style={{ color: "var(--ink-900)" }}>
                    Chaque réglage change tes estimations
                  </h3>
                  <p className="mt-2 text-sm leading-6" style={{ color: "var(--ink-400)" }}>
                    KeskiReste utilise ces informations pour te donner une lecture plus fiable de ta situation.
                  </p>
                </div>

                {[
                  { title: "Prénom", desc: "Il personnalise ton espace et rend ton dashboard plus clair au quotidien." },
                  { title: "Type d'activité", desc: "Les taux changent selon que tu sois en vente, en service ou en activité libérale." },
                  { title: "ACRE", desc: "L'ACRE peut réduire tes cotisations sociales pendant une période donnée." },
                  { title: "Versement libératoire", desc: "Cette option impacte l'estimation de l'impôt affichée dans ton dashboard." },
                  { title: "Informations de facturation", desc: "SIRET, adresse, IBAN et BIC apparaîtront sur tes factures PDF générées depuis la page Revenus." },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="px-5 py-4"
                    style={{ background: "var(--cream-50)", borderRadius: "var(--r-md)", boxShadow: "var(--shadow-md)" }}
                  >
                    <p className="text-sm font-medium" style={{ color: "var(--ink-900)" }}>{item.title}</p>
                    <p className="mt-1.5 text-xs leading-5" style={{ color: "var(--ink-400)" }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>

      <MobileNav />
    </main>
  )
}
