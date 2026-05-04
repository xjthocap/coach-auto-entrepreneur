import {
  Body, Button, Container, Head, Heading, Hr, Html,
  Link, Preview, Section, Text,
} from "@react-email/components"

type Props = {
  confirmUrl: string
}

export default function ConfirmEmail({ confirmUrl }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Confirme ton adresse email pour accéder à KeskiReste</Preview>
      <Body style={body}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <Text style={logo}>keskireste<span style={logoDot}>.</span></Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading style={h1}>Confirme ton adresse email</Heading>

            <Text style={paragraph}>
              Plus qu&apos;une étape — clique sur le bouton ci-dessous pour activer ton
              compte KeskiReste et accéder à ton tableau de bord.
            </Text>

            <Section style={{ textAlign: "center", margin: "32px 0" }}>
              <Button style={button} href={confirmUrl}>
                Confirmer mon adresse email →
              </Button>
            </Section>

            <Text style={smallText}>
              Ce lien est valable 24 heures. Si tu n&apos;as pas créé de compte sur
              KeskiReste, ignore cet email.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footerSection}>
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

const content: React.CSSProperties = {
  padding: "36px 32px 28px",
}

const h1: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 700,
  color: "#0F172A",
  letterSpacing: "-0.02em",
  margin: "0 0 16px",
}

const paragraph: React.CSSProperties = {
  fontSize: 15,
  color: "#475569",
  lineHeight: 1.7,
  margin: "0 0 8px",
}

const button: React.CSSProperties = {
  backgroundColor: "#0F172A",
  color: "#a3e635",
  borderRadius: 8,
  padding: "13px 28px",
  fontSize: 14,
  fontWeight: 700,
  textDecoration: "none",
  display: "inline-block",
}

const smallText: React.CSSProperties = {
  fontSize: 13,
  color: "#94A3B8",
  lineHeight: 1.6,
  margin: "24px 0 0",
}

const hr: React.CSSProperties = {
  borderColor: "#E2E8F0",
  margin: "0 32px",
}

const footerSection: React.CSSProperties = {
  padding: "20px 32px 28px",
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
