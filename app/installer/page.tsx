import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Installer l'app — keskireste.",
  description: "Ajoute keskireste. sur ton écran d'accueil en 3 secondes. Fonctionne comme une vraie app, sans passer par l'App Store.",
  robots: { index: false },
}

const styles = `
  .install-page {
    min-height: 100vh;
    background: #F8F7FC;
    font-family: var(--font-geist-sans), system-ui, sans-serif;
    color: #1A0F2E;
  }
  .install-nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 24px;
    background: rgba(248,247,252,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(26,15,46,0.08);
    position: sticky; top: 0; z-index: 10;
  }
  .install-logo {
    display: flex; align-items: center; gap: 10px;
    font-weight: 700; font-size: 18px; letter-spacing: -0.03em;
    text-decoration: none; color: #1A0F2E;
  }
  .install-logo-icon {
    width: 32px; height: 32px; border-radius: 8px;
    background: #1A0F2E;
    display: flex; align-items: center; justify-content: center;
  }
  .install-hero {
    text-align: center; padding: 48px 24px 24px;
    max-width: 600px; margin: 0 auto;
  }
  .install-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(109,40,217,0.08); color: #6D28D9;
    font-size: 12px; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase;
    padding: 6px 14px; border-radius: 100px; margin-bottom: 20px;
    border: 1px solid rgba(109,40,217,0.18);
  }
  .install-title {
    font-size: clamp(28px, 7vw, 42px); font-weight: 800;
    line-height: 1.1; letter-spacing: -0.04em; margin-bottom: 14px;
  }
  .install-title em { font-style: normal; color: #6D28D9; }
  .install-subtitle {
    font-size: 16px; color: #6B489A; line-height: 1.6;
    max-width: 460px; margin: 0 auto;
  }

  /* ── CSS-only tabs ── */
  .tab-radio { display: none; }

  .tabs-wrap {
    max-width: 440px; margin: 32px auto 0;
    padding: 0 16px;
  }
  .os-tabs {
    display: flex; background: white; border-radius: 16px;
    padding: 4px; box-shadow: 0 2px 12px rgba(26,15,46,0.08);
    border: 1px solid rgba(26,15,46,0.06);
  }
  .os-tab-label {
    flex: 1; padding: 10px 16px; border-radius: 12px;
    font-size: 14px; font-weight: 600; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all 0.2s; color: #6B489A; user-select: none;
  }
  #tab-ios:checked  ~ .tabs-wrap .os-tab-label[for="tab-ios"],
  #tab-android:checked ~ .tabs-wrap .os-tab-label[for="tab-android"] {
    background: #1A0F2E; color: white;
    box-shadow: 0 2px 8px rgba(26,15,46,0.2);
  }

  /* Steps sections */
  .steps-container { max-width: 480px; margin: 0 auto; padding: 28px 16px 40px; }
  .os-section { display: none; }
  #tab-ios:checked     ~ .steps-container #section-ios    { display: block; }
  #tab-android:checked ~ .steps-container #section-android { display: block; }

  .step {
    display: flex; gap: 16px; margin-bottom: 16px;
    background: white; border-radius: 16px; padding: 18px;
    border: 1px solid rgba(26,15,46,0.06);
    box-shadow: 0 1px 4px rgba(26,15,46,0.05);
    align-items: flex-start;
  }
  .step-num {
    width: 32px; height: 32px; border-radius: 10px;
    background: #1A0F2E; color: white;
    font-weight: 800; font-size: 14px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .step-content { flex: 1; }
  .step-title { font-weight: 700; font-size: 15px; margin-bottom: 4px; }
  .step-desc { font-size: 13px; color: #6B489A; line-height: 1.5; }
  .step-visual {
    margin-top: 12px; background: #F8F7FC; border-radius: 10px;
    padding: 10px 14px; font-size: 13px;
    display: flex; align-items: center; gap: 10px;
    border: 1px solid rgba(26,15,46,0.06);
  }
  .step-visual .icon { font-size: 18px; flex-shrink: 0; }

  /* Why card */
  .why-section { max-width: 440px; margin: 0 auto 28px; padding: 0 16px; }
  .why-card {
    background: rgba(109,40,217,0.05);
    border: 1px solid rgba(109,40,217,0.12);
    border-radius: 14px; padding: 16px 18px;
    font-size: 13px; color: #6B489A; line-height: 1.65;
  }
  .why-card strong { color: #1A0F2E; }

  /* CTA */
  .install-cta { text-align: center; padding: 0 24px 64px; }
  .cta-card {
    max-width: 440px; margin: 0 auto;
    background: #1A0F2E; border-radius: 20px; padding: 28px 24px; color: white;
  }
  .cta-title { font-size: 20px; font-weight: 800; margin-bottom: 8px; }
  .cta-sub { font-size: 14px; color: rgba(255,255,255,0.55); margin-bottom: 20px; }
  .cta-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: #6D28D9; color: white; font-weight: 700; font-size: 15px;
    padding: 14px 28px; border-radius: 14px; text-decoration: none;
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .cta-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(109,40,217,0.4); }
`

function Step({
  num,
  title,
  desc,
  visual,
}: {
  num: number
  title: string
  desc: string
  visual?: { icon: string; text: React.ReactNode }
}) {
  return (
    <div className="step">
      <div className="step-num">{num}</div>
      <div className="step-content">
        <div className="step-title">{title}</div>
        <div className="step-desc">{desc}</div>
        {visual && (
          <div className="step-visual">
            <span className="icon">{visual.icon}</span>
            <span>{visual.text}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function InstallerPage() {
  return (
    <div className="install-page">
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* Nav */}
      <nav className="install-nav">
        <Link href="/" className="install-logo">
          <Image src="/logos/logo-dark.png" alt="keskireste." width={140} height={36} style={{ height: 32, width: "auto" }} priority />
        </Link>
        <Link href="/dashboard" style={{ fontSize: 14, fontWeight: 600, color: "#6D28D9", textDecoration: "none" }}>
          Ouvrir l&apos;app →
        </Link>
      </nav>

      {/* Les radio inputs contrôlent les tabs en CSS-only */}
      <input type="radio" name="os" id="tab-ios" className="tab-radio" defaultChecked />
      <input type="radio" name="os" id="tab-android" className="tab-radio" />

      {/* Hero */}
      <div className="install-hero">
        <div className="install-badge"><span>📱</span> Installation gratuite</div>
        <h1 className="install-title">
          Installe keskireste.<br />
          sur ton <em>écran d&apos;accueil</em>
        </h1>
        <p className="install-subtitle">
          Pas d&apos;App Store, pas d&apos;attente. En 3 secondes,
          l&apos;app s&apos;installe directement depuis ton navigateur.
        </p>
      </div>

      {/* Tabs */}
      <div className="tabs-wrap">
        <div className="os-tabs">
          <label className="os-tab-label" htmlFor="tab-ios">
            <span>🍎</span> iPhone / iPad
          </label>
          <label className="os-tab-label" htmlFor="tab-android">
            <span>🤖</span> Android
          </label>
        </div>
      </div>

      {/* Steps */}
      <div className="steps-container">
        {/* iOS */}
        <div className="os-section" id="section-ios">
          <Step num={1} title="Ouvre Safari" desc="L'installation ne fonctionne qu'avec Safari sur iPhone. Pas Chrome, pas Firefox."
            visual={{ icon: "🧭", text: <span>Va sur <strong>app.keskireste.fr</strong> dans Safari</span> }} />
          <Step num={2} title="Tape le bouton Partager" desc="Le bouton se trouve en bas au centre de Safari — un carré avec une flèche vers le haut."
            visual={{ icon: "⬆️", text: <span><strong>Partager</strong> — barre du bas, au centre</span> }} />
          <Step num={3} title="Sur l'écran d'accueil" desc="Dans la liste, scrolle et tape «Sur l'écran d'accueil» puis «Ajouter» en haut à droite."
            visual={{ icon: "🏠", text: <span><strong>Sur l&apos;écran d&apos;accueil</strong> — Ajouter</span> }} />
          <Step num={4} title="C'est installé !" desc="L'icône keskireste. apparaît sur ton écran d'accueil. L'app s'ouvre en plein écran, sans barre Safari." />
        </div>

        {/* Android */}
        <div className="os-section" id="section-android">
          <Step num={1} title="Ouvre Chrome" desc="Sur Android, l'installation fonctionne avec Chrome et la plupart des navigateurs."
            visual={{ icon: "🌐", text: <span>Va sur <strong>app.keskireste.fr</strong> dans Chrome</span> }} />
          <Step num={2} title="Bannière automatique" desc="Une bannière «Installer keskireste.» apparaît automatiquement en bas de l'écran après quelques secondes."
            visual={{ icon: "🔔", text: <span>Bannière en bas — <strong>Installer</strong></span> }} />
          <Step num={3} title="Ou via le menu Chrome" desc="Si la bannière n'apparaît pas : tape les 3 points en haut à droite — «Ajouter à l'écran d'accueil»."
            visual={{ icon: "⋮", text: <span><strong>3 points</strong> — Ajouter à l&apos;écran d&apos;accueil</span> }} />
          <Step num={4} title="C'est installé !" desc="L'icône keskireste. apparaît sur ton écran d'accueil. Ouvre-la — elle fonctionne comme une vraie app." />
        </div>
      </div>

      {/* Pourquoi pas l'App Store */}
      <div className="why-section">
        <div className="why-card">
          <strong>💡 Pourquoi pas l&apos;App Store ?</strong><br />
          Apple et Google prennent 30% sur chaque abonnement via leurs stores.
          En installant directement depuis le navigateur, tu as exactement la même app —
          mais on évite cette commission, ce qui nous permet de maintenir le prix <strong>Founder à 99€/an</strong>.
        </div>
      </div>

      {/* CTA */}
      <div className="install-cta">
        <div className="cta-card">
          <div className="cta-title">Pas encore inscrit ?</div>
          <div className="cta-sub">Essaie gratuitement, sans carte bancaire.</div>
          <Link href="/signup" className="cta-btn">
            Créer un compte gratuit →
          </Link>
        </div>
      </div>
    </div>
  )
}
