"use client"

type PremiumFeatureProps = {
  isPremium: boolean
  title: string
  description: string
  bullets?: string[]
  onUpgradeClick?: () => void
  children?: React.ReactNode
  preview?: React.ReactNode
}

export default function PremiumFeature({
  isPremium,
  title,
  description,
  bullets = [],
  onUpgradeClick,
  children,
  preview,
}: PremiumFeatureProps) {
  if (isPremium) {
    return <>{children}</>
  }

  return (
    <div className="rounded-[28px] border border-violet-200 bg-white p-6 shadow-[0_12px_30px_rgba(139,92,246,0.08)]">
      <div className="pointer-events-none select-none overflow-hidden rounded-[24px] border border-slate-100 bg-[#fcfcff] opacity-70 blur-[3px]">
        <div className="p-4">{preview}</div>
      </div>

      <div className="mt-5 rounded-[24px] border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-6 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">
          Premium
        </p>

        <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
          {title}
        </h3>

        <p className="mt-3 text-sm leading-7 text-slate-500">
          {description}
        </p>

        {bullets.length > 0 && (
          <div className="mt-5 space-y-2 text-left">
            {bullets.map((bullet, index) => (
              <div
                key={index}
                className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700 shadow-sm"
              >
                <span className="mr-2 font-semibold text-violet-600">•</span>
                {bullet}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onUpgradeClick}
          className="mt-6 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 font-semibold text-white shadow-[0_12px_24px_rgba(139,92,246,0.22)] transition hover:scale-[1.01] hover:opacity-95"
        >
          Passer en Premium
        </button>

        <p className="mt-3 text-xs text-slate-400">
          Débloque l’analyse complète, les projections et les fonctionnalités avancées.
        </p>
      </div>
    </div>
  )
}