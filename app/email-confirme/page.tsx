import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Email confirmé — keskireste",
}

export default function EmailConfirmePage() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "var(--cream-100)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "var(--font-geist-sans), sans-serif",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 440,
        background: "white",
        borderRadius: "var(--r-xl, 28px)",
        padding: "48px 40px",
        boxShadow: "var(--shadow-lg)",
        textAlign: "center",
      }}>

        {/* Icône succès */}
        <div style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
          display: "grid",
          placeItems: "center",
          margin: "0 auto 28px",
          boxShadow: "0 12px 32px rgba(124,58,237,0.3)",
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>

        {/* Logo */}
        <div style={{
          fontWeight: 700,
          fontSize: 15,
          letterSpacing: "-0.02em",
          color: "var(--ink-900)",
          marginBottom: 24,
        }}>
          keski<span style={{ color: "#7C3AED" }}>reste</span>.
        </div>

        {/* Titre */}
        <h1 style={{
          fontSize: 26,
          fontWeight: 600,
          letterSpacing: "-0.025em",
          color: "var(--ink-900)",
          marginBottom: 12,
          lineHeight: 1.2,
        }}>
          Votre adresse e-mail<br />a bien été confirmée !
        </h1>

        {/* Sous-titre */}
        <p style={{
          fontSize: 15,
          color: "var(--ink-500, #6B489A)",
          lineHeight: 1.6,
          marginBottom: 36,
          maxWidth: 320,
          marginLeft: "auto",
          marginRight: "auto",
        }}>
          Votre compte est actif. Connectez-vous pour accéder à votre tableau de bord et commencer à piloter votre activité.
        </p>

        {/* CTA */}
        <Link
          href="/login"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            width: "100%",
            padding: "14px 24px",
            background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
            color: "white",
            borderRadius: "var(--r-md, 14px)",
            fontWeight: 600,
            fontSize: 15,
            textDecoration: "none",
            transition: "opacity 0.15s, transform 0.15s",
            boxShadow: "0 8px 24px rgba(124,58,237,0.25)",
          }}
        >
          Se connecter
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>

        {/* Lien secondaire */}
        <p style={{
          marginTop: 20,
          fontSize: 13,
          color: "var(--ink-400, #7550A8)",
        }}>
          Pas encore de compte ?{" "}
          <Link href="/signup" style={{ color: "#7C3AED", fontWeight: 500, textDecoration: "none" }}>
            S&apos;inscrire
          </Link>
        </p>

      </div>
    </main>
  )
}
