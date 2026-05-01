"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

export default function CheckoutBanner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [status, setStatus] = useState<"success" | "cancel" | null>(null)

  useEffect(() => {
    const checkout = searchParams.get("checkout")
    if (checkout === "success") setStatus("success")
    else if (checkout === "cancel") setStatus("cancel")
  }, [searchParams])

  function dismiss() {
    setStatus(null)
    // Clean URL
    router.replace(pathname, { scroll: false })
  }

  if (!status) return null

  const isSuccess = status === "success"

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100,
        minWidth: 320,
        maxWidth: 480,
        width: "calc(100% - 32px)",
        borderRadius: "var(--r-md)",
        border: isSuccess ? "1px solid rgba(196, 181, 253, 0.4)" : "1px solid var(--cream-300)",
        background: isSuccess ? "var(--ink-900)" : "var(--cream-50)",
        boxShadow: "var(--shadow-lg)",
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        animation: "fade-up 0.3s ease-out both",
      }}
    >
      {/* Icon */}
      <div
        style={{
          flexShrink: 0,
          width: 36,
          height: 36,
          borderRadius: "var(--r-sm)",
          background: isSuccess ? "rgba(196, 181, 253, 0.15)" : "var(--cream-100)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isSuccess ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--violet-500)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4M12 16h.01"/>
          </svg>
        )}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: isSuccess ? "var(--cream-50)" : "var(--ink-900)",
            marginBottom: 2,
          }}
        >
          {isSuccess ? "Bienvenue en Premium 🎉" : "Paiement annulé"}
        </p>
        <p
          style={{
            fontSize: 12,
            color: isSuccess ? "var(--ink-300)" : "var(--ink-500)",
            lineHeight: 1.5,
          }}
        >
          {isSuccess
            ? "Ton accès est activé. Rafraîchis si certaines fonctionnalités n'apparaissent pas encore."
            : "Ton abonnement n'a pas été activé. Tu peux réessayer depuis les paramètres."}
        </p>
      </div>

      {/* Close */}
      <button
        onClick={dismiss}
        style={{
          flexShrink: 0,
          width: 28,
          height: 28,
          borderRadius: "var(--r-sm)",
          border: "none",
          background: isSuccess ? "rgba(255,255,255,0.08)" : "var(--cream-200)",
          color: isSuccess ? "var(--ink-300)" : "var(--ink-500)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
  )
}
