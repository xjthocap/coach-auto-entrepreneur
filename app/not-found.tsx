import Link from "next/link"

export default function NotFound() {
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
      {/* Gradient blob */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: "radial-gradient(ellipse 60% 50% at 80% 20%, rgba(196,181,253,0.12) 0%, transparent 70%)",
        }}
      />

      <div style={{ position: "relative", textAlign: "center", maxWidth: 480 }}>
        {/* Logo */}
        <div style={{ marginBottom: 48 }}>
          <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.04em", color: "var(--cream-50)" }}>
            KeskiReste<span style={{ color: "var(--violet-500)" }}>.</span>
          </span>
        </div>

        {/* 404 */}
        <p
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "clamp(80px, 15vw, 140px)",
            fontWeight: 300,
            letterSpacing: "-0.06em",
            color: "var(--violet-500)",
            lineHeight: 1,
            marginBottom: 0,
          }}
        >
          404
        </p>

        <h1
          style={{
            fontSize: "clamp(22px, 4vw, 30px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--cream-50)",
            marginTop: 16,
            marginBottom: 12,
          }}
        >
          Cette page n&apos;existe pas
        </h1>

        <p style={{ fontSize: 15, color: "var(--ink-300)", lineHeight: 1.7, marginBottom: 40 }}>
          Tu t&apos;es perdu ? Pas de panique — ton solde, lui, est toujours là.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              borderRadius: 999,
              background: "var(--violet-500)",
              color: "var(--ink-900)",
              padding: "12px 24px",
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
              letterSpacing: "-0.01em",
            }}
          >
            → Retour au dashboard
          </Link>
          <Link
            href="/login"
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
            Se connecter
          </Link>
        </div>
      </div>
    </main>
  )
}
