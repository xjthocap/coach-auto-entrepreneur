import Link from "next/link"
import LogoutButton from "@/components/LogoutButton"
import PricingTrigger from "@/components/PricingTrigger"

type AppSidebarProps = {
  activePage: "dashboard" | "revenues" | "expenses" | "history" | "settings"
  profile: {
    plan: string | null
    first_name: string | null
    id: string
    founder_number?: number | null
    subscription_type?: string | null
    is_beta_pioneer?: boolean | null
  }
  userEmail: string | undefined | null
}

function NavIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </>
    ),
    revenus: (
      <>
        <path d="M12 2v20M5 7l7-5 7 5M5 17l7 5 7-5" />
      </>
    ),
    depenses: (
      <>
        <path d="M3 12h18M3 7h18M3 17h18" />
        <circle cx="7" cy="7" r="1.5" fill="currentColor" />
        <circle cx="14" cy="12" r="1.5" fill="currentColor" />
        <circle cx="9" cy="17" r="1.5" fill="currentColor" />
      </>
    ),
    historique: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9z" />
      </>
    ),
    sparkle: (
      <>
        <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z" />
        <path d="M5 3l.5 1.5L7 5l-1.5.5L5 7l-.5-1.5L3 5l1.5-.5L5 3z" />
      </>
    ),
    lock: (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    ),
  }
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name] ?? null}
    </svg>
  )
}

const navLinks = [
  { href: "/dashboard", icon: "dashboard", label: "Tableau de bord", key: "dashboard" },
  { href: "/revenues",  icon: "revenus",   label: "Revenus",         key: "revenues" },
  { href: "/Expenses",  icon: "depenses",  label: "Dépenses",        key: "expenses" },
  { href: "/history",   icon: "historique",label: "Historique",      key: "history",  premium: true },
  { href: "/settings",  icon: "settings",  label: "Paramètres",      key: "settings" },
] as const

export default function AppSidebar({ activePage, profile, userEmail }: AppSidebarProps) {
  const isPremium = profile.plan === "premium"
  const isFounder = !!(profile.founder_number)
  const isBetaPioneer = !!(profile.is_beta_pioneer)

  return (
    <aside
      className="hidden lg:flex flex-col shrink-0"
      style={{
        width: 248,
        background: "var(--cream-50)",
        borderRight: "1px solid var(--cream-200)",
        height: "100vh",
        position: "sticky",
        top: 0,
        overflowY: "auto",
      }}
    >
      <div className="flex flex-col h-full px-5 py-6">

        {/* ── Logo ── */}
        <Link href="/dashboard" className="flex items-center gap-3 mb-1">
          <div
            className="relative shrink-0 rounded-lg flex items-center justify-center"
            style={{ width: 32, height: 32, background: "var(--ink-900)" }}
          >
            <span
              className="absolute rounded-full border-2"
              style={{
                width: 14,
                height: 14,
                background: "var(--lime-500)",
                borderColor: "var(--cream-50)",
                bottom: -4,
                right: -4,
              }}
            />
          </div>
          <span
            className="text-xl font-semibold tracking-tight"
            style={{ color: "var(--ink-900)" }}
          >
            keskireste
            <span style={{ color: "var(--lime-700)" }}>.</span>
          </span>
        </Link>

        <p
          className="text-xs mb-7 mt-1 leading-relaxed"
          style={{ color: "var(--ink-400)" }}
        >
          Ton vrai solde,
          <br />
          sans prise de tête.
        </p>

        {/* ── Nav ── */}
        <nav className="flex-1 space-y-0.5">
          {navLinks.map((link) => {
            const isActive = activePage === link.key
            const isLocked = "premium" in link && link.premium && !isPremium
            return (
              <Link
                key={link.key}
                href={link.href}
                className="flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-150"
                style={{
                  borderRadius: "var(--r-sm)",
                  background: isActive ? "var(--ink-900)" : "transparent",
                  color: isActive
                    ? "var(--cream-50)"
                    : isLocked
                    ? "var(--ink-300)"
                    : "var(--ink-500)",
                }}
              >
                <span style={{ color: isActive ? "var(--lime-500)" : "currentColor" }}>
                  <NavIcon name={link.icon} />
                </span>
                <span className="flex-1">{link.label}</span>
                {isLocked && (
                  <span style={{ color: "var(--ink-300)", opacity: 0.6 }}>
                    <NavIcon name="lock" />
                  </span>
                )}
              </Link>
            )
          })}

          {!isPremium && (
            <PricingTrigger
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-150 w-full border-none bg-transparent cursor-pointer"
              style={{ borderRadius: "var(--r-sm)", color: "var(--lime-700)" }}
            >
              <NavIcon name="sparkle" />
              <span>Passer Premium</span>
            </PricingTrigger>
          )}

        </nav>

        {/* ── Plan card ── */}
        <div
          className="mt-6 p-4"
          style={{
            borderRadius: "var(--r-md)",
            background: isPremium ? "var(--ink-900)" : "var(--cream-200)",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium" style={{ color: isPremium ? "var(--ink-300)" : "var(--ink-500)" }}>
              Ton plan
            </span>
            {isBetaPioneer ? (
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{
                background: "linear-gradient(135deg, rgba(251,191,36,0.25), rgba(245,158,11,0.2))",
                color: "#B45309",
                border: "1px solid rgba(245,158,11,0.3)",
              }}>
                🧪 OG Bêta
              </span>
            ) : (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{
                  background: isFounder
                    ? "rgba(196, 181, 253, 0.25)"
                    : isPremium
                    ? "var(--violet-500)"
                    : "var(--cream-300)",
                  color: isFounder
                    ? "var(--violet-700)"
                    : isPremium
                    ? "var(--ink-900)"
                    : "var(--ink-500)",
                }}
              >
                {isFounder ? `⭐ Founder #${profile.founder_number}` : isPremium ? "Premium" : "Gratuit"}
              </span>
            )}
          </div>
          <p className="text-xs leading-5 mb-3" style={{ color: isPremium ? "var(--ink-300)" : "var(--ink-500)" }}>
            {isBetaPioneer
              ? "Premier bêta-testeur — merci d'avoir cru au projet dès le début 🙏"
              : isFounder
              ? "Founder · 99€/an · toutes les fonctionnalités Premium."
              : isPremium
              ? "Tu as accès au coach IA, à l'historique complet et aux exports."
              : "Débloque le coach IA, l'historique et la génération de factures."}
          </p>
          {!isPremium && (
            <PricingTrigger
              className="block w-full text-center text-xs font-semibold py-2 transition hover:opacity-90 border-none cursor-pointer"
              style={{ borderRadius: "var(--r-sm)", background: "var(--ink-900)", color: "var(--violet-500)" }}
            >
              Passer en Premium →
            </PricingTrigger>
          )}
        </div>

        {/* ── User / Logout ── */}
        <div
          className="mt-4 pt-4"
          style={{ borderTop: "1px solid var(--cream-200)" }}
        >
          <p className="text-xs truncate mb-3" style={{ color: "var(--ink-400)" }}>
            {profile.first_name || userEmail}
          </p>
          <LogoutButton />
        </div>
      </div>
    </aside>
  )
}
