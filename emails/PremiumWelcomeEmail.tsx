import {
  Body, Button, Container, Head, Heading, Hr, Html,
  Link, Preview, Section, Text,
} from "@react-email/components"

type Props = {
  firstName?: string | null
  trialEndDate?: string | null
}

export default function PremiumWelcomeEmail({ firstName, trialEndDate }: Props) {
  const name = firstName || "toi"
  const endDate = trialEndDate || "dans 7 jours"

  const features = [
    "Coach IA financier",
    "Projection de fin de période",
    "Historique complet & export Excel",
    "Insights personnalisés",
    "Navigation multi-périodes",
  ]

  return (
    <Html>
      <Head />
      <Preview>Ton essai Premium de 7 jours a démarré ✨</Preview>
      <Body style={body}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <Text style={logo}>keskireste<span style={logoDot}>.</span></Text>
          </Section>

          {/* Hero */}
          <Section style={heroSection}>
            <Heading style={h1}>
              Bienvenue en Premium, {name} 🎉
            </Heading>
            <Text style={paragraph}>
              Ton essai de 7 jours commence maintenant. Aucun prélèvement avant le {endDate}.
            </Text>

            <Button style={button} href="https://app.keskireste.fr/dashboard">
              Explorer mes fonctionnalités Premium →
            </Button>
          </Section>

          <Hr style={hr} />

          {/* Features */}
          <Section style={featuresSection}>
            <Text style={featuresTitle}>Ce que tu débloquas avec Premium :</Text>

            {features.map((feat) => (
              <Section key={feat} style={featureRow}>
                <Text style={featureCheck}>✓</Text>
                <Text style={featureText}>{feat}</Text>
              </Section>
            ))}
          </Section>

          <Hr style={hr} />

          {/* Footer note */}
          <Section style={noteSection}>
            <Text style={noteText}>
              Après 7 jours, 19,90€/mois. Résiliation possible à tout moment depuis les paramètres.
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
  color: "#C4B5FD",
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

const featureCheck: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: "#7C5CFF",
  margin: 0,
  lineHeight: 1,
}

const featureText: React.CSSProperties = {
  fontSize: 14,
  color: "#334155",
  margin: 0,
  lineHeight: 1.5,
}

const noteSection: React.CSSProperties = {
  padding: "20px 32px",
  backgroundColor: "#F8F7FC",
}

const noteText: React.CSSProperties = {
  fontSize: 13,
  color: "#475569",
  margin: 0,
  lineHeight: 1.6,
}

const link: React.CSSProperties = {
  color: "#7C5CFF",
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
