"use client"

import { useState } from "react"
import PricingModal from "@/components/PricingModal"

type Props = {
  isPremium: boolean
  ai?: React.ReactNode
  projection?: React.ReactNode
}

function LockedPreviewCard({
  eyebrow,
  title,
  subtitle,
  features,
}: {
  eyebrow: string
  title: string
  subtitle: string
  features: string[]
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white/80 p-5 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-600">
        {eyebrow}
      </p>

      <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {subtitle}
      </p>

      <div className="mt-4 space-y-2">
        {features.map((feature, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-100 bg-[#f8f9fd] px-4 py-3 text-sm text-slate-700"
          >
            <span className="mr-2 font-semibold text-violet-600">•</span>
            {feature}
          </div>
        ))}
      </div>
    </div>
  )
}

function PremiumTeaser({
  onUpgradeClick,
}: {
  onUpgradeClick: () => void
}) {
  return (
    <div className="rounded-[28px] border border-violet-200 bg-gradient-to-br from-white via-violet-50/60 to-fuchsia-50/60 p-6 shadow-[0_12px_30px_rgba(139,92,246,0.08)]">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-600">
            Premium
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Débloque le vrai copilote financier
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            Passe en Premium pour obtenir une analyse intelligente de ta situation,
            des projections de fin de période et des recommandations actionnables.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
              Score de santé
            </span>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
              Conseils IA
            </span>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
              Projection de fin de période
            </span>
          </div>
        </div>

        <div className="w-full max-w-sm rounded-[24px] border border-white/80 bg-white/90 p-5 shadow-[0_12px_24px_rgba(15,23,42,0.06)]">
          <p className="text-sm font-medium text-slate-500">Pylot Premium</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">
            19,90€
            <span className="text-base font-medium text-slate-400"> / mois</span>
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Pour piloter ton activité avec plus de clarté et moins de stress.
          </p>

          <button
            onClick={onUpgradeClick}
            className="mt-5 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 font-semibold text-white shadow-[0_12px_24px_rgba(139,92,246,0.22)] transition hover:scale-[1.01] hover:opacity-95"
          >
            Passer en Premium
          </button>

          <p className="mt-3 text-center text-xs text-slate-400">
            Débloque toutes les fonctionnalités avancées
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <div className="opacity-75 blur-[2px]">
          <LockedPreviewCard
            eyebrow="Coach IA"
            title="Analyse intelligente"
            subtitle="Une lecture simple et utile de ta situation avec des conseils concrets."
            features={[
              "Score de santé financier",
              "Conseils intelligents",
              "Alertes personnalisées",
            ]}
          />
        </div>

        <div className="opacity-75 blur-[2px]">
          <LockedPreviewCard
            eyebrow="Projection"
            title="Fin de période"
            subtitle="Anticipe ton atterrissage et visualise ton équilibre avant la fin du mois."
            features={[
              "Projection du chiffre d’affaires",
              "Projection charges et impôts",
              "Vision claire de la fin de période",
            ]}
          />
        </div>
      </div>
    </div>
  )
}

export default function DashboardPremiumShell({
  isPremium,
  ai,
  projection,
}: Props) {
  const [open, setOpen] = useState(false)

  if (isPremium) {
    return <div className="space-y-6">{ai}{projection}</div>
  }

  return (
    <>
      <PremiumTeaser onUpgradeClick={() => setOpen(true)} />
      <PricingModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}