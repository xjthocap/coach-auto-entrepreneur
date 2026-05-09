import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react"
import UpgradeBanner from "@/components/UpgradeBanner"
import ChatBotWrapper from "@/components/ChatBotWrapper"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://app.keskireste.fr"
const SITE_URL = "https://keskireste.fr"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "keskireste. — Le copilote financier des auto-entrepreneurs",
    template: "%s — keskireste.",
  },
  description: "Suivez vos revenus, dépenses et cotisations URSSAF en temps réel. Le tableau de bord simple et honnête pour les auto-entrepreneurs français.",
  keywords: ["auto-entrepreneur", "micro-entreprise", "URSSAF", "cotisations sociales", "tableau de bord", "revenus", "dépenses", "keskireste", "freelance", "impôt"],
  authors: [{ name: "keskireste.", url: SITE_URL }],
  creator: "keskireste.",
  publisher: "keskireste.",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: "keskireste.",
    title: "keskireste. — Le copilote financier des auto-entrepreneurs",
    description: "Suivez vos revenus, dépenses et cotisations URSSAF en temps réel. Simple, honnête, utile.",
    images: [
      {
        url: "/logos/logo-dark-tagline.png",
        width: 1200,
        height: 300,
        alt: "keskireste. — Ton vrai solde, sans prise de tête.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "keskireste. — Le copilote financier des auto-entrepreneurs",
    description: "Suivez vos revenus, dépenses et cotisations URSSAF en temps réel.",
    images: ["/logos/logo-dark-tagline.png"],
    creator: "@keskireste",
  },
  icons: {
    icon: [
      { url: "/logos/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/logos/icon-64.png", sizes: "64x64", type: "image/png" },
    ],
    apple: [
      { url: "/logos/icon-64.png", sizes: "64x64", type: "image/png" },
    ],
    shortcut: "/logos/icon-32.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Suspense>
          <UpgradeBanner />
        </Suspense>
        {children}
        <Suspense>
          <ChatBotWrapper />
        </Suspense>
      </body>
    </html>
  );
}
