"use client"
import UpgradeButton from "@/components/UpgradeButton"

type PricingModalProps = {
  open: boolean
  onClose: () => void
}

export default function PricingModal({
  open,
  onClose,
}: PricingModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[32px] border border-white/80 bg-white p-8 shadow-[0_25px_60px_rgba(15,23,42,0.18)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">
              KeskiReste Premium
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              Passe au niveau supérieur
            </h2>
            <p className="mt-3 text-slate-500">
              Débloque le vrai copilote financier pour auto-entrepreneur.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            Fermer
          </button>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-[28px] border border-slate-200 bg-[#f8f9fd] p-6">
            <p className="text-sm font-medium text-slate-500">Version gratuite</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">0€</p>

            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <p>• CA de la période</p>
              <p>• Charges estimées</p>
              <p>• Impôt estimé</p>
              <p>• Suivi basique des revenus</p>
            </div>
          </div>

          <div className="rounded-[28px] border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-6 shadow-[0_12px_30px_rgba(139,92,246,0.08)]">
            <p className="text-sm font-medium text-violet-600">Version Premium</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">19,90€ / mois</p>

            <div className="mt-6 space-y-3 text-sm text-slate-700">
              <p>• Assistant IA complet</p>
              <p>• Projection de fin de période</p>
              <p>• Montant à mettre de côté</p>
              <p>• Historique & export</p>
              <p>• Insights intelligents</p>
            </div>

            <UpgradeButton/>

            <p className="mt-3 text-center text-xs text-slate-400">
              Stripe à brancher ensuite
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}