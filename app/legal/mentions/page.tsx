import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mentions légales — keskireste.",
  robots: { index: false },
}

const LAST_UPDATED = "1er mai 2025"

export default function MentionsPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--cream-100)", color: "var(--ink-900)" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--violet-700)", marginBottom: 12 }}>
          Légal
        </p>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--ink-900)", marginBottom: 8 }}>
          Mentions légales
        </h1>
        <p style={{ fontSize: 14, color: "var(--ink-400)", marginBottom: 48 }}>
          Dernière mise à jour : {LAST_UPDATED}
        </p>

        <LegalSection title="1. Éditeur du site">
          <p><strong>Nom :</strong> Thomas Capron</p>
          <p style={{ marginTop: 8 }}><strong>Statut :</strong> Micro-entrepreneur</p>
          <p style={{ marginTop: 8 }}><strong>Adresse :</strong> Montpellier (34), France</p>
          <p style={{ marginTop: 8 }}><strong>SIRET :</strong> [À compléter]</p>
          <p style={{ marginTop: 8 }}><strong>Email :</strong>{" "}
            <a href="mailto:contact@keskireste.fr" style={{ color: "var(--violet-700)" }}>contact@keskireste.fr</a>
          </p>
          <p style={{ marginTop: 8 }}><strong>Site :</strong>{" "}
            <a href="https://keskireste.fr" style={{ color: "var(--violet-700)" }}>https://keskireste.fr</a>
          </p>
        </LegalSection>

        <LegalSection title="2. Hébergement">
          <p><strong>Vercel Inc.</strong></p>
          <p style={{ marginTop: 8 }}>440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
          <p style={{ marginTop: 8 }}>
            <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--violet-700)" }}>vercel.com</a>
          </p>
          <p style={{ marginTop: 12 }}>Base de données : <strong>Supabase</strong> — hébergée sur AWS eu-west-1 (Irlande)</p>
        </LegalSection>

        <LegalSection title="3. Propriété intellectuelle">
          <p>
            L&apos;ensemble du contenu de ce site (textes, graphismes, logos, icônes, images, code source) est la propriété exclusive de Thomas Capron et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle.
          </p>
          <p style={{ marginTop: 12 }}>
            Toute reproduction, distribution, modification ou utilisation de ce contenu, en tout ou partie, sans autorisation écrite préalable est strictement interdite.
          </p>
        </LegalSection>

        <LegalSection title="4. Limitation de responsabilité">
          <p>
            keskireste. est un outil d&apos;aide à la gestion financière. Les calculs proposés (URSSAF, impôt, provisions) sont des estimations basées sur les paramètres saisis par l&apos;utilisateur. Ils ne constituent pas un conseil fiscal ou comptable professionnel.
          </p>
          <p style={{ marginTop: 12 }}>
            L&apos;éditeur ne saurait être tenu responsable d&apos;erreurs dans les calculs résultant d&apos;informations erronées fournies par l&apos;utilisateur, ni des décisions prises sur la base des estimations affichées.
          </p>
        </LegalSection>

        <LegalSection title="5. Données personnelles">
          <p>
            Le traitement des données personnelles est détaillé dans notre{" "}
            <Link href="/legal/confidentialite" style={{ color: "var(--violet-700)" }}>
              Politique de confidentialité
            </Link>.
          </p>
        </LegalSection>

        <LegalSection title="6. Contact">
          <p>
            Pour toute question relative au site :{" "}
            <a href="mailto:contact@keskireste.fr" style={{ color: "var(--violet-700)" }}>contact@keskireste.fr</a>
          </p>
        </LegalSection>
      </div>
    </main>
  )
}

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 36, paddingBottom: 36, borderBottom: "1px solid var(--cream-200)" }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--ink-900)", marginBottom: 14 }}>
        {title}
      </h2>
      <div style={{ fontSize: 14, lineHeight: 1.75, color: "var(--ink-600, #475569)" }}>
        {children}
      </div>
    </section>
  )
}
