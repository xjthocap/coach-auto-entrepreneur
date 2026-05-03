import Link from "next/link"

export const metadata = {
  title: "Politique de confidentialité — KeskiReste",
}

const LAST_UPDATED = "1er mai 2025"

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--cream-100)", color: "var(--ink-900)" }}>
      {/* Header */}
      <header style={{ background: "var(--cream-50)", borderBottom: "1px solid var(--cream-200)", padding: "16px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.04em", color: "var(--ink-900)" }}>
              KeskiReste<span style={{ color: "var(--violet-500)" }}>.</span>
            </span>
          </Link>
          <div style={{ display: "flex", gap: 16, fontSize: 13, color: "var(--ink-400)" }}>
            <Link href="/legal/terms" style={{ color: "var(--ink-400)", textDecoration: "none" }}>CGU</Link>
            <Link href="/login" style={{ color: "var(--violet-700)", textDecoration: "none", fontWeight: 600 }}>Connexion</Link>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--violet-700)", marginBottom: 12 }}>
          Légal
        </p>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--ink-900)", marginBottom: 8 }}>
          Politique de confidentialité
        </h1>
        <p style={{ fontSize: 14, color: "var(--ink-400)", marginBottom: 48 }}>
          Dernière mise à jour : {LAST_UPDATED}
        </p>

        <LegalSection title="1. Qui sommes-nous ?">
          <p>KeskiReste est un service d&apos;aide à la gestion financière destiné aux auto-entrepreneurs français, édité en tant que micro-entreprise individuelle.</p>
          <p style={{ marginTop: 12 }}>Contact : <a href="mailto:contact@keskireste.fr" style={{ color: "var(--violet-700)" }}>contact@keskireste.fr</a></p>
        </LegalSection>

        <LegalSection title="2. Données collectées">
          <p>Nous collectons uniquement les données nécessaires au fonctionnement du service :</p>
          <ul style={{ marginTop: 12, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
            <li><strong>Données de compte :</strong> adresse email, prénom, type d&apos;activité, paramètres fiscaux (ACRE, versement libératoire, fréquence de déclaration).</li>
            <li><strong>Données financières :</strong> revenus saisis, dépenses, informations de facturation (SIRET, adresse, IBAN, BIC) — uniquement si renseignées.</li>
            <li><strong>Données techniques :</strong> logs de connexion, adresse IP, navigateur — à des fins de sécurité uniquement.</li>
          </ul>
          <p style={{ marginTop: 12 }}>Nous ne collectons aucune donnée bancaire réelle (numéros de carte, accès compte bancaire).</p>
        </LegalSection>

        <LegalSection title="3. Comment nous utilisons vos données">
          <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
            <li>Calcul de votre disponible réel, charges et projections</li>
            <li>Génération de factures PDF à votre nom</li>
            <li>Export de votre livre comptable</li>
            <li>Envoi d&apos;alertes de déclaration (si activées)</li>
            <li>Amélioration du service (données agrégées et anonymisées)</li>
          </ul>
          <p style={{ marginTop: 12 }}>Nous ne vendons, ne louons, ni ne partageons vos données personnelles avec des tiers à des fins commerciales.</p>
        </LegalSection>

        <LegalSection title="4. Base légale (RGPD)">
          <p>Le traitement de vos données repose sur :</p>
          <ul style={{ marginTop: 12, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
            <li><strong>Exécution du contrat</strong> : pour fournir le service souscrit</li>
            <li><strong>Consentement</strong> : pour les communications marketing optionnelles</li>
            <li><strong>Intérêt légitime</strong> : pour la sécurité et l&apos;amélioration du service</li>
          </ul>
        </LegalSection>

        <LegalSection title="5. Hébergement et sous-traitants">
          <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
            <li><strong>Supabase</strong> (base de données et authentification) — hébergé sur AWS eu-west-1 (Irlande)</li>
            <li><strong>Vercel</strong> (hébergement web) — infrastructure UE disponible</li>
            <li><strong>Stripe</strong> (paiements) — conforme PCI-DSS</li>
            <li><strong>Anthropic</strong> (coach IA) — données de la période transmises pour l&apos;analyse, sans identifiant personnel</li>
          </ul>
        </LegalSection>

        <LegalSection title="6. Durée de conservation">
          <p>Vos données sont conservées tant que votre compte est actif. En cas de suppression de compte, toutes vos données sont effacées sous 30 jours, sauf obligation légale contraire.</p>
        </LegalSection>

        <LegalSection title="7. Vos droits">
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul style={{ marginTop: 12, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
            <li><strong>Accès</strong> : obtenir une copie de vos données</li>
            <li><strong>Rectification</strong> : corriger vos données via les Paramètres</li>
            <li><strong>Effacement</strong> : supprimer votre compte et toutes vos données depuis les Paramètres</li>
            <li><strong>Portabilité</strong> : exporter vos données via la fonction d&apos;export Excel</li>
            <li><strong>Opposition</strong> : vous opposer à certains traitements</li>
          </ul>
          <p style={{ marginTop: 12 }}>Pour exercer ces droits : <a href="mailto:contact@keskireste.fr" style={{ color: "var(--violet-700)" }}>contact@keskireste.fr</a></p>
        </LegalSection>

        <LegalSection title="8. Cookies">
          <p>KeskiReste utilise uniquement des cookies techniques strictement nécessaires au fonctionnement du service (session d&apos;authentification). Aucun cookie publicitaire ou de tracking tiers n&apos;est utilisé.</p>
        </LegalSection>

        <LegalSection title="9. Contact et réclamations">
          <p>Pour toute question relative à vos données : <a href="mailto:contact@keskireste.fr" style={{ color: "var(--violet-700)" }}>contact@keskireste.fr</a></p>
          <p style={{ marginTop: 8 }}>Vous pouvez également introduire une réclamation auprès de la <strong>CNIL</strong> : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={{ color: "var(--violet-700)" }}>www.cnil.fr</a></p>
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
