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
        fontFamily: "var(--font-geist-sans), sans-serif",
      }}
    >
      {/* Gradient blobs */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 55% 45% at 75% 15%, rgba(196,181,253,0.14) 0%, transparent 65%)",
      }} />
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 40% 35% at 20% 80%, rgba(124,58,237,0.08) 0%, transparent 60%)",
      }} />

      <div style={{ position: "relative", textAlign: "center", maxWidth: 500 }}>

        {/* Logo */}
        <div style={{ marginBottom: 40 }}>
          <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.04em", color: "var(--cream-50)" }}>
            keski<span style={{ color: "var(--violet-500, #7C5CFF)" }}>reste</span>.
          </span>
        </div>

        {/* Big number */}
        <p style={{
          fontFamily: "var(--font-geist-mono, monospace)",
          fontSize: "clamp(72px, 18vw, 144px)",
          fontWeight: 300,
          letterSpacing: "-0.06em",
          color: "transparent",
          backgroundImage: "linear-gradient(135deg, #7C3AED 0%, #a78bfa 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          lineHeight: 1,
          marginBottom: 8,
          userSelect: "none",
        }}>
          404
        </p>

        {/* Tagline principale */}
        <h1 style={{
          fontSize: "clamp(20px, 4vw, 28px)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          color: "var(--cream-50)",
          marginBottom: 12,
          lineHeight: 1.25,
        }}>
          Bon bah… pas cette page finalement.
        </h1>

        {/* Sous-titre */}
        <p style={{
          fontSize: 15,
          color: "rgba(255,255,255,0.45)",
          lineHeight: 1.7,
          marginBottom: 12,
          maxWidth: 380,
          marginLeft: "auto",
          marginRight: "auto",
        }}>
          On a regardé partout — il ne reste rien ici.
          <br />
          Par contre, ton solde, lui, est toujours bien là.
        </p>

        {/* Little joke */}
        <p style={{
          display: "inline-block",
          fontSize: 12,
          color: "rgba(196,181,253,0.6)",
          fontFamily: "var(--font-geist-mono, monospace)",
          marginBottom: 40,
          letterSpacing: "0.02em",
        }}>
          Erreur 404 · page introuvable · ce n&apos;est pas un frais déductible.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              borderRadius: 999,
              background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
              color: "white",
              padding: "12px 24px",
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
              letterSpacing: "-0.01em",
              boxShadow: "0 8px 24px rgba(124,58,237,0.35)",
            }}
          >
            ← Retour au tableau de bord
          </Link>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "transparent",
              color: "rgba(255,255,255,0.45)",
              padding: "12px 24px",
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Accueil
          </Link>
        </div>

      </div>
    </main>
  )
}
