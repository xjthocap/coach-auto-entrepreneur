"use client"

import { useEffect, useState } from "react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export default function PWARegister() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Enregistrer le service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {})
    }

    // Capturer le prompt d'installation (Android Chrome)
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)

      // Ne pas montrer si déjà installé ou déjà refusé dans les 30 derniers jours
      const dismissed = localStorage.getItem("pwa-install-dismissed")
      if (dismissed) {
        const dismissedAt = parseInt(dismissed, 10)
        if (Date.now() - dismissedAt < 30 * 24 * 60 * 60 * 1000) return
      }

      // Attendre 30s avant d'afficher pour ne pas interrompre l'onboarding
      setTimeout(() => setShowBanner(true), 30000)
    }

    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  async function handleInstall() {
    if (!installPrompt) return
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === "accepted") {
      setShowBanner(false)
    }
    setInstallPrompt(null)
  }

  function handleDismiss() {
    localStorage.setItem("pwa-install-dismissed", Date.now().toString())
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div
      style={{
        position: "fixed",
        bottom: "80px", // au-dessus de la MobileNav
        left: "16px",
        right: "16px",
        zIndex: 200,
        background: "var(--ink-900)",
        borderRadius: "16px",
        padding: "16px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        border: "1px solid rgba(124,92,255,0.3)",
      }}
    >
      {/* Icône */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: "linear-gradient(135deg, #6D28D9, #4C1D95)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontSize: 22,
        }}
      >
        📊
      </div>

      {/* Texte */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>
          Installer keskireste.
        </p>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: "2px 0 0" }}>
          Accès rapide depuis ton écran d'accueil
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <button
          onClick={handleDismiss}
          style={{
            background: "transparent",
            border: "none",
            color: "rgba(255,255,255,0.4)",
            fontSize: 20,
            cursor: "pointer",
            padding: "4px 6px",
            lineHeight: 1,
          }}
          aria-label="Fermer"
        >
          ✕
        </button>
        <button
          onClick={handleInstall}
          style={{
            background: "var(--violet-500, #6D28D9)",
            border: "none",
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            padding: "8px 14px",
            borderRadius: 10,
            whiteSpace: "nowrap",
          }}
        >
          Installer
        </button>
      </div>
    </div>
  )
}
