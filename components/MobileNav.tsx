"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/revenues",  label: "Revenus" },
  { href: "/Expenses",  label: "Dépenses" },
  { href: "/history",   label: "Historique" },
  { href: "/settings",  label: "Réglages" },
]

const icons: Record<string, React.ReactNode> = {
  "/dashboard": (
    <>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </>
  ),
  "/revenues": <path d="M12 2v20M5 7l7-5 7 5M5 17l7 5 7-5" />,
  "/Expenses": (
    <>
      <path d="M3 12h18M3 7h18M3 17h18" />
      <circle cx="7" cy="7" r="1.5" fill="currentColor" />
      <circle cx="14" cy="12" r="1.5" fill="currentColor" />
      <circle cx="9" cy="17" r="1.5" fill="currentColor" />
    </>
  ),
  "/history": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  "/settings": (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09" />
    </>
  ),
}

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 backdrop-blur lg:hidden"
      style={{
        background: "rgba(251, 250, 245, 0.95)",
        borderTop: "1px solid var(--cream-200)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navLinks.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/dashboard" && pathname.startsWith(link.href))
          return (
            <Link
              key={link.href}
              href={link.href}
              prefetch={true}
              className="flex flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 text-center transition"
              style={{ color: isActive ? "var(--ink-900)" : "var(--ink-300)" }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {icons[link.href]}
              </svg>
              <span
                className="text-[10px] font-semibold leading-none"
                style={{ color: isActive ? "var(--ink-900)" : "var(--ink-300)" }}
              >
                {link.label}
              </span>
              {isActive && (
                <span
                  className="h-1 w-4 rounded-full"
                  style={{ background: "var(--lime-500)" }}
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
