import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AppSidebar from "@/components/AppSidebar"
import MobileNav from "@/components/MobileNav"
import SettingsForm from "@/components/SettingsForm"
import ManageSubscriptionButton from "@/components/ManageSubscriptionButton"
import UpgradeButton from "@/components/UpgradeButton"
import DeleteAccountButton from "@/components/DeleteAccountButton"
import LogoUpload from "@/components/LogoUpload"
import Link from "next/link"

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

  const isPremium = profile.plan === "premium"
  const isPatron = !!(profile as { is_patron?: boolean }).is_patron
  const isActiveFounder = !isPatron && !!(profile.founder_number) && isPremium && profile.subscription_type === "founder"
  const isFormerFounderPremium = !isPatron && !!(profile.founder_number) && isPremium && profile.subscription_type !== "founder"
  const isFormerFounder = !isPatron && !!(profile.founder_number) && !isPremium

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
                {/* Logo */}
                <div className="rounded-[14px] p-4 mb-4" style={{ background: "var(--cream-100)" }}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-3" style={{ color: "var(--ink-400)" }}>
                    Logo entreprise
                  </p>
                  <p className="text-xs mb-4" style={{ color: "var(--ink-400)", lineHeight: 1.6 }}>
                    Il apparaîtra en haut de tes factures PDF. Recommandé : fond transparent, ratio carré ou paysage.
                  </p>
                  <LogoUpload
                    userId={user.id}
                    initialLogoUrl={(profile as { logo_url?: string | null }).logo_url}
                  />
                </div>

                <div className="rounded-[14px] p-3" style={{ background: "var(--cream-100)" }}>
                  <SettingsForm profile={profile} />
                </div>
              </div>

              {/* INFO COLUMN */}
              <div className="space-y-3">

                {/* ── PLAN CARD ── */}

                {/* El Patron */}
                {isPatron && (
                  <div
                    className="p-5 relative overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, #1a0f2e 0%, #2d1657 100%)",
                      borderRadius: "var(--r-md)",
                      border: "1px solid rgba(124,58,237,0.3)",
                      boxShadow: "0 0 32px rgba(124,58,237,0.12), var(--shadow-md)",
                    }}
                  >
                    <div style={{
                      position: "absolute", inset: 0, pointerEvents: "none",
                      background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(236,72,153,0.08) 0%, transparent 70%)",
                    }} />
                    <div style={{ position: "relative" }}>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--ink-300)" }}>
                          Ton plan
                        </p>
                        <span
                          className="text-xs px-2.5 py-1 rounded-full font-bold"
                          style={{
                            background: "linear-gradient(90deg, #7C3AED, #ec4899, #f59e0b)",
                            color: "white",
                            letterSpacing: "0.01em",
                          }}
                        >
                          ⚡ El Patron
                        </span>
                      </div>
                      <p className="text-sm mb-4" style={{ color: "var(--ink-300)", lineHeight: 1.6 }}>
                        C&apos;est toi qui as construit tout ça. Respect. 🫡
                      </p>
                      <ManageSubscriptionButton />
                    </div>
                  </div>
                )}

                {/* Founder actif — thème gold */}
                {isActiveFounder && (
                  <div
                    className="p-5 relative overflow-hidden"
                    style={{
                      background: "linear-gradient(145deg, #1c1008, #2a1a06, #1a0f2e)",
                      borderRadius: "var(--r-md)",
                      border: "2px solid #F59E0B",
                      boxShadow: "0 0 24px rgba(245,158,11,0.15), var(--shadow-md)",
                    }}
                  >
                    {/* Glow décoratif */}
                    <div style={{
                      position: "absolute", inset: 0, pointerEvents: "none",
                      background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(245,158,11,0.12) 0%, transparent 70%)",
                    }} />
                    <div style={{ position: "relative" }}>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: "#92400E" }}>
                          Ton plan
                        </p>
                        <span
                          className="text-xs px-2.5 py-1 rounded-full font-bold"
                          style={{ background: "rgba(245,158,11,0.15)", color: "#FBBF24", border: "1px solid rgba(245,158,11,0.4)" }}
                        >
                          ⭐ Founder #{profile.founder_number}
                        </span>
                      </div>
                      <p className="text-sm mb-4" style={{ color: "#D97706", lineHeight: 1.6 }}>
                        Founder · 99€/an · toutes les fonctionnalités Premium incluses. Prix garanti à vie.
                      </p>
                      <ManageSubscriptionButton />
                    </div>
                  </div>
                )}

                {/* Premium classique */}
                {isPremium && !isActiveFounder && !isFormerFounderPremium && (
                  <div
                    className="p-5"
                    style={{ background: "var(--ink-900)", borderRadius: "var(--r-md)", boxShadow: "var(--shadow-md)" }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--ink-300)" }}>
                        Ton plan
                      </p>
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-semibold"
                        style={{ background: "var(--violet-500)", color: "var(--ink-900)" }}
                      >
                        Premium
                      </span>
                    </div>
                    <p className="text-sm mb-4" style={{ color: "var(--ink-300)", lineHeight: 1.6 }}>
                      Tu as accès au coach IA, à l'historique complet et aux exports.
                    </p>
                    <ManageSubscriptionButton />
                  </div>
                )}

                {/* Ancien Founder — maintenant sur Premium mensuel */}
                {isFormerFounderPremium && (
                  <div
                    className="p-5"
                    style={{ background: "var(--ink-900)", borderRadius: "var(--r-md)", boxShadow: "var(--shadow-md)" }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--ink-300)" }}>
                        Ton plan
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs px-2.5 py-1 rounded-full font-semibold"
                          style={{ background: "var(--violet-500)", color: "var(--ink-900)" }}
                        >
                          Premium
                        </span>
                        <span
                          className="text-xs px-2 py-1 rounded-full font-medium"
                          style={{ background: "rgba(245,158,11,0.12)", color: "#FBBF24", border: "1px solid rgba(245,158,11,0.3)" }}
                        >
                          ex-Founder #{profile.founder_number}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm mb-4" style={{ color: "var(--ink-300)", lineHeight: 1.6 }}>
                      Tu as accès à toutes les fonctionnalités Premium.
                    </p>
                    <ManageSubscriptionButton />
                  </div>
                )}

                {/* Ancien Founder — plan gratuit */}
                {isFormerFounder && (
                  <div
                    className="p-5 relative overflow-hidden"
                    style={{ background: "var(--cream-50)", borderRadius: "var(--r-md)", boxShadow: "var(--shadow-md)", border: "1px solid rgba(245,158,11,0.25)" }}
                  >
                    <div style={{
                      position: "absolute", inset: 0, pointerEvents: "none",
                      background: "radial-gradient(ellipse 80% 50% at 100% 0%, rgba(245,158,11,0.06) 0%, transparent 70%)",
                    }} />
                    <div style={{ position: "relative" }}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--ink-400)" }}>
                          Ton plan
                        </p>
                        <span
                          className="text-xs px-2 py-1 rounded-full font-medium"
                          style={{ background: "rgba(245,158,11,0.1)", color: "#D97706", border: "1px solid rgba(245,158,11,0.25)" }}
                        >
                          ex-Founder #{profile.founder_number}
                        </span>
                      </div>
                      <p className="text-sm mb-4" style={{ color: "var(--ink-500)", lineHeight: 1.6 }}>
                        Reprends un abonnement Premium pour retrouver toutes tes fonctionnalités.
                      </p>
                      <UpgradeButton label="Reprendre Premium · 19,90€/mois" />
                    </div>
                  </div>
                )}

                {/* Gratuit — jamais été Founder */}
                {!isPremium && !isFormerFounder && (
                  <div
                    className="p-5 relative overflow-hidden"
                    style={{ background: "var(--cream-50)", borderRadius: "var(--r-md)", boxShadow: "var(--shadow-md)", border: "1px solid var(--cream-200)" }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        background: "radial-gradient(ellipse 80% 60% at 100% 0%, rgba(196, 181, 253, 0.1) 0%, transparent 70%)",
                      }}
                    />
                    <div style={{ position: "relative" }}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--ink-400)" }}>
                          Ton plan
                        </p>
                        <span
                          className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{ background: "var(--cream-200)", color: "var(--ink-500)" }}
                        >
                          Gratuit
                        </span>
                      </div>
                      <p className="text-sm mb-4" style={{ color: "var(--ink-500)", lineHeight: 1.6 }}>
                        Passe en Premium pour débloquer le coach IA, l'historique complet et les exports Excel.
                      </p>
                      <UpgradeButton label="Passer en Premium · 19,90€/mois" />
                    </div>
                  </div>
                )}
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

            {/* ── ZONE DANGER + LEGAL ── */}
            <section className="grid gap-4 sm:grid-cols-2">

              {/* Suppression compte */}
              <div
                className="p-5"
                style={{ background: "var(--cream-50)", borderRadius: "var(--r-md)", boxShadow: "var(--shadow-md)", border: "1px solid rgba(251,113,133,0.15)" }}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--rose-500)" }}>
                  Zone danger
                </p>
                <h3 className="mt-2 text-sm font-semibold" style={{ color: "var(--ink-900)" }}>
                  Supprimer le compte
                </h3>
                <p className="mt-1.5 text-xs leading-5" style={{ color: "var(--ink-400)" }}>
                  Efface définitivement ton compte et toutes tes données. Action irréversible.
                </p>
                <div className="mt-4">
                  <DeleteAccountButton />
                </div>
              </div>

              {/* Liens légaux */}
              <div
                className="p-5"
                style={{ background: "var(--cream-50)", borderRadius: "var(--r-md)", boxShadow: "var(--shadow-md)" }}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--ink-400)" }}>
                  Informations légales
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  {[
                    { label: "Politique de confidentialité", href: "/legal/privacy" },
                    { label: "Conditions Générales d'Utilisation", href: "/legal/terms" },
                    { label: "contact@keskireste.fr", href: "mailto:contact@keskireste.fr" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      style={{ fontSize: 13, color: "var(--violet-700)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <span style={{ fontSize: 10 }}>→</span> {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>

      <MobileNav />
    </main>
  )
}
