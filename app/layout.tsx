import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react"
import UpgradeBanner from "@/components/UpgradeBanner"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KeskiReste — Pilotez votre micro-entreprise",
  description: "Suivez vos revenus, dépenses et cotisations URSSAF. Le tableau de bord simple pour les auto-entrepreneurs français.",
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
      </body>
    </html>
  );
}
