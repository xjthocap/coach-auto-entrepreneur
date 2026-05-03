"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[KeskiReste error]", error)
  }, [error])

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--ink-900)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: "radial-gradient(ellipse 60% 50% at 20% 80%, rgba(251,113,133,0.08) 0%, transparent 70%)",
        }}
      />

      <div style={{ position: "relative", textAlign: "center", maxWidth: 480 }}>
        <div style={{ marginBottom: 40 }}>
          <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.04em", color: "var(--cream-50)" }}>
            KeskiReste<span style={{ color: "var(--violet-500)" }}>.</span>
          </span>
        </div>

        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "var(--r-md)",
            background: "rgba(251,113,133,0.12)",
            border: "1px solid rgba(251,113,133,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--rose-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>

        <h1
          style={{
            fontSize: "clamp(22px, 4vw, 30px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--cream-50)",
            marginBottom: 12,
          }}
        >
          Quelque chose s&apos;est mal passé
        </h1>

        <p style={{ fontSize: 15, color: "var(--ink-300)", lineHeight: 1.7, marginBottom: 40 }}>
          Une erreur inattendue est survenue. Tes données sont en sécurité — réessaie ou reviens au dashboard.
        </p>

        {error.digest && (
          <p style={{ fontSize: 11, color: "var(--ink-500)", marginBottom: 32, fontFamily: "var(--font-mono, monospace)" }}>
            Réf : {error.digest}
          </p>
        )}

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={reset}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              borderRadius: 999,
              border: "none",
              background: "var(--violet-500)",
              color: "var(--ink-900)",
              padding: "12px 24px",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "-0.01em",
            }}
          >
            ↻ Réessayer
          </button>
          <a
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "transparent",
              color: "var(--ink-300)",
              padding: "12px 24px",
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Dashboard
          </a>
        </div>
      </div>
    </main>
  )
}
