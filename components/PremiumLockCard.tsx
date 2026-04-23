"use client"

type PremiumLockCardProps = {
  title: string
  description: string
  bullets?: string[]
  children: React.ReactNode
  onUpgradeClick?: () => void
}

export default function PremiumLockCard({
  title,
  description,
  bullets = [],
  children,
  onUpgradeClick,
}: PremiumLockCardProps) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-violet-200 bg-white shadow-[0_12px_30px_rgba(139,92,246,0.08)]">
      <div className="pointer-events-none select-none blur-[5px] opacity-60">
        <div className="p-6">{children}</div>
      </div>

      <div className="absolute inset-0 bg-white/55 backdrop-blur-[2px]" />

      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-[24px] border border-white/80 bg-white/90 p-6 text-center shadow-[0_16px_35px_rgba(15,23,42,0.12)]">
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
                  className="rounded-2xl bg-[#f8f9fd] px-4 py-3 text-sm text-slate-700"
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
            Débloque les projections, l’IA complète et les fonctionnalités avancées.
          </p>
        </div>
      </div>
    </div>
  )
}