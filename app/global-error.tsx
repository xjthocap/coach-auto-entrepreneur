"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#0F172A", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.04em", color: "#F8F7F2", marginBottom: 40 }}>
            KeskiReste<span style={{ color: "#7C3AED" }}>.</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#F8F7F2", marginBottom: 12 }}>
            Erreur critique
          </h1>
          <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.7, marginBottom: 36 }}>
            L&apos;application a rencontré une erreur inattendue. Tes données sont en sécurité.
          </p>
          {error.digest && (
            <p style={{ fontSize: 11, color: "#475569", marginBottom: 28, fontFamily: "monospace" }}>
              Réf : {error.digest}
            </p>
          )}
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button
              onClick={reset}
              style={{ borderRadius: 999, border: "none", background: "#7C3AED", color: "#F8F7F2", padding: "12px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
            >
              ↻ Réessayer
            </button>
            <a
              href="/"
              style={{ borderRadius: 999, border: "1px solid rgba(255,255,255,0.12)", background: "transparent", color: "#94A3B8", padding: "12px 24px", fontSize: 14, textDecoration: "none" }}
            >
              Accueil
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
