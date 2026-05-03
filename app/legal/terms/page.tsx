import Link from "next/link"

export const metadata = {
  title: "Conditions Générales d'Utilisation — KeskiReste",
}

const LAST_UPDATED = "1er mai 2025"

export default function TermsPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--cream-100)", color: "var(--ink-900)" }}>
      <header style={{ background: "var(--cream-50)", borderBottom: "1px solid var(--cream-200)", padding: "16px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.04em", color: "var(--ink-900)" }}>
              KeskiReste<span style={{ color: "var(--violet-500)" }}>.</span>
            </span>
          </Link>
          <div style={{ display: "flex", gap: 16, fontSize: 13, color: "var(--ink-400)" }}>
            <Link href="/legal/privacy" style={{ color: "var(--ink-400)", textDecoration: "none" }}>Confidentialité</Link>
            <Link href="/login" style={{ color: "var(--violet-700)", textDecoration: "none", fontWeight: 600 }}>Connexion</Link>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--violet-700)", marginBottom: 12 }}>
          Légal
        </p>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--ink-900)", marginBottom: 8 }}>
          Conditions Générales d&apos;Utilisation
        </h1>
        <p style={{ fontSize: 14, color: "var(--ink-400)", marginBottom: 48 }}>
          Dernière mise à jour : {LAST_UPDATED}
        </p>

        <LegalSection title="1. Objet">
          <p>Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent l&apos;accès et l&apos;utilisation du service KeskiReste, accessible à l&apos;adresse keskireste.fr.</p>
          <p style={{ marginTop: 12 }}>KeskiReste est un outil d&apos;aide à la gestion financière pour auto-entrepreneurs. Il ne constitue pas un logiciel de comptabilité certifié, ni un conseil fiscal ou juridique.</p>
        </LegalSection>

        <LegalSection title="2. Accès au service">
          <p>L&apos;utilisation du service nécessite la création d&apos;un compte avec une adresse email valide. L&apos;accès est disponible en version gratuite (fonctionnalités limitées) et en version Premium (accès complet, 19,90€/mois).</p>
          <p style={{ marginTop: 12 }}>L&apos;utilisateur s&apos;engage à fournir des informations exactes et à maintenir la confidentialité de ses identifiants de connexion.</p>
        </LegalSection>

        <LegalSection title="3. Description du service">
          <p>KeskiReste propose :</p>
          <ul style={{ marginTop: 12, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
            <li>Le calcul estimatif du disponible réel après charges URSSAF et impôts</li>
            <li>Le suivi des revenus et dépenses</li>
            <li>Des projections et alertes de seuil (version Premium)</li>
            <li>La génération de factures PDF (version Premium)</li>
            <li>L&apos;export du livre comptable Excel (version Premium)</li>
            <li>Un coach IA d&apos;analyse financière (version Premium)</li>
          </ul>
          <p style={{ marginTop: 12 }}>Les calculs sont des <strong>estimations indicatives</strong> basées sur les taux en vigueur. Ils ne remplacent pas les déclarations officielles sur autoentrepreneur.urssaf.fr.</p>
        </LegalSection>

        <LegalSection title="4. Abonnement Premium">
          <p>L&apos;abonnement Premium est facturé 19,90€ TTC/mois via Stripe. L&apos;abonnement se renouvelle automatiquement chaque mois. L&apos;utilisateur peut résilier à tout moment depuis les Paramètres du compte, avec effet à la fin de la période en cours.</p>
          <p style={{ marginTop: 12 }}>Conformément à l&apos;article L.221-18 du Code de la consommation, vous disposez d&apos;un délai de 14 jours pour vous rétracter à compter de la souscription.</p>
        </LegalSection>

        <LegalSection title="5. Responsabilité et limitations">
          <p>KeskiReste fournit des estimations à titre indicatif. L&apos;éditeur ne peut être tenu responsable :</p>
          <ul style={{ marginTop: 12, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
            <li>D&apos;erreurs de calcul liées à des changements de taux non répercutés</li>
            <li>De décisions financières prises sur la base des estimations fournies</li>
            <li>D&apos;interruptions temporaires du service pour maintenance</li>
          </ul>
          <p style={{ marginTop: 12 }}>Pour toute décision fiscale importante, consultez un expert-comptable ou les services de l&apos;URSSAF.</p>
        </LegalSection>

        <LegalSection title="6. Données et confidentialité">
          <p>Le traitement de vos données personnelles est décrit dans notre <Link href="/legal/privacy" style={{ color: "var(--violet-700)" }}>Politique de confidentialité</Link>.</p>
        </LegalSection>

        <LegalSection title="7. Propriété intellectuelle">
          <p>L&apos;ensemble du contenu de KeskiReste (design, code, textes, marque) est protégé par le droit de la propriété intellectuelle. Toute reproduction sans autorisation est interdite.</p>
        </LegalSection>

        <LegalSection title="8. Résiliation et suppression de compte">
          <p>L&apos;utilisateur peut supprimer son compte à tout moment depuis la page Paramètres. Cette action entraîne la suppression définitive de toutes ses données sous 30 jours.</p>
          <p style={{ marginTop: 12 }}>KeskiReste se réserve le droit de suspendre un compte en cas de violation des présentes CGU.</p>
        </LegalSection>

        <LegalSection title="9. Droit applicable">
          <p>Les présentes CGU sont soumises au droit français. En cas de litige, les tribunaux français seront compétents.</p>
        </LegalSection>

        <LegalSection title="10. Contact">
          <p>Pour toute question : <a href="mailto:contact@keskireste.fr" style={{ color: "var(--violet-700)" }}>contact@keskireste.fr</a></p>
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
