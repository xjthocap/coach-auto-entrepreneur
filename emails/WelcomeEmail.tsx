import {
  Body, Button, Container, Head, Heading, Hr, Html,
  Img, Link, Preview, Section, Text,
} from "@react-email/components"

type Props = {
  firstName?: string | null
}

export default function WelcomeEmail({ firstName }: Props) {
  const name = firstName || "toi"

  return (
    <Html>
      <Head />
      <Preview>Bienvenue sur KeskiReste — ton tableau de bord est prêt 🎉</Preview>
      <Body style={body}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <Text style={logo}>keskireste<span style={logoDot}>.</span></Text>
          </Section>

          {/* Hero */}
          <Section style={heroSection}>
            <Heading style={h1}>
              Bienvenue {name} 👋
            </Heading>
            <Text style={paragraph}>
              Ton compte est prêt. KeskiReste va maintenant calculer automatiquement
              ce qu&apos;il te reste vraiment après charges, impôts et dépenses — sans que
              tu aies besoin de comprendre la fiscalité.
            </Text>

            <Button style={button} href="https://keskireste.fr/dashboard">
              Accéder à mon tableau de bord →
            </Button>
          </Section>

          <Hr style={hr} />

          {/* Features */}
          <Section style={featuresSection}>
            <Text style={featuresTitle}>Ce que tu peux faire dès maintenant :</Text>

            {[
              { emoji: "💰", text: "Ajouter ton premier revenu et voir ton vrai solde" },
              { emoji: "📄", text: "Générer une facture PDF en 30 secondes" },
              { emoji: "📊", text: "Voir le détail de tes charges et impôt estimés" },
              { emoji: "⚠️", text: "Activer les alertes de déclaration URSSAF" },
            ].map((item) => (
              <Section key={item.text} style={featureRow}>
                <Text style={featureEmoji}>{item.emoji}</Text>
                <Text style={featureText}>{item.text}</Text>
              </Section>
            ))}
          </Section>

          <Hr style={hr} />

          {/* Tips */}
          <Section style={tipsSection}>
            <Text style={tipTitle}>💡 Pour bien démarrer</Text>
            <Text style={paragraph}>
              Commence par renseigner tes{" "}
              <Link href="https://keskireste.fr/settings" style={link}>paramètres</Link>
              {" "}(type d&apos;activité, ACRE, versement libératoire) — ils impactent
              directement tes calculs.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footer}>
              Une question ? Réponds directement à cet email ou écris-nous à{" "}
              <Link href="mailto:contact@keskireste.fr" style={link}>
                contact@keskireste.fr
              </Link>
            </Text>
            <Text style={footerSmall}>
              KeskiReste · Ton vrai solde, sans prise de tête.
              <br />
              <Link href="https://keskireste.fr/legal/privacy" style={footerLink}>
                Politique de confidentialité
              </Link>
              {" · "}
              <Link href="https://keskireste.fr/legal/terms" style={footerLink}>
                CGU
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const body: React.CSSProperties = {
  backgroundColor: "#F5F4F9",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  margin: 0,
  padding: "32px 0",
}

const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: 16,
  maxWidth: 520,
  margin: "0 auto",
  overflow: "hidden",
  boxShadow: "0 4px 24px rgba(15,23,42,0.08)",
}

const header: React.CSSProperties = {
  backgroundColor: "#0F172A",
  padding: "20px 32px",
}

const logo: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  color: "#F8F7FC",
  letterSpacing: "-0.03em",
  margin: 0,
}

const logoDot: React.CSSProperties = {
  color: "#84cc16",
}

const heroSection: React.CSSProperties = {
  padding: "32px 32px 24px",
}

const h1: React.CSSProperties = {
  fontSize: 26,
  fontWeight: 700,
  color: "#0F172A",
  letterSpacing: "-0.02em",
  margin: "0 0 12px",
  lineHeight: 1.2,
}

const paragraph: React.CSSProperties = {
  fontSize: 15,
  color: "#475569",
  lineHeight: 1.7,
  margin: "0 0 24px",
}

const button: React.CSSProperties = {
  backgroundColor: "#0F172A",
  color: "#a3e635",
  borderRadius: 8,
  padding: "13px 24px",
  fontSize: 14,
  fontWeight: 700,
  textDecoration: "none",
  display: "inline-block",
}

const hr: React.CSSProperties = {
  borderColor: "#E2E8F0",
  margin: "0 32px",
}

const featuresSection: React.CSSProperties = {
  padding: "24px 32px",
}

const featuresTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#0F172A",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  margin: "0 0 16px",
}

const featureRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginBottom: 10,
}

const featureEmoji: React.CSSProperties = {
  fontSize: 16,
  margin: 0,
  lineHeight: 1,
}

const featureText: React.CSSProperties = {
  fontSize: 14,
  color: "#334155",
  margin: 0,
  lineHeight: 1.5,
}

const tipsSection: React.CSSProperties = {
  padding: "24px 32px",
  backgroundColor: "#F8F7FC",
}

const tipTitle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: "#0F172A",
  margin: "0 0 8px",
}

const link: React.CSSProperties = {
  color: "#7c3aed",
  textDecoration: "underline",
}

const footerSection: React.CSSProperties = {
  padding: "20px 32px 28px",
}

const footer: React.CSSProperties = {
  fontSize: 14,
  color: "#64748B",
  margin: "0 0 12px",
  lineHeight: 1.6,
}

const footerSmall: React.CSSProperties = {
  fontSize: 12,
  color: "#94A3B8",
  lineHeight: 1.6,
  margin: 0,
}

const footerLink: React.CSSProperties = {
  color: "#94A3B8",
  textDecoration: "underline",
}
