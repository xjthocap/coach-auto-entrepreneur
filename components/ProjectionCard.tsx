type ProjectionCardProps = {
  periodLabel: string
  projectedRevenue: number
  projectedCharges: number
  projectedTax: number
  projectedExpenses: number
  projectedRealNet: number
}

export default function ProjectionCard({
  periodLabel,
  projectedRevenue,
  projectedCharges,
  projectedTax,
  projectedExpenses,
  projectedRealNet,
}: ProjectionCardProps) {
  return (
    <div className="rounded-[28px] border border-blue-200 bg-gradient-to-br from-[#e8f0ff] to-white p-6 shadow-[0_12px_30px_rgba(79,125,243,0.15)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-blue-700">Projection</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
            Fin de période
          </h2>
        </div>

        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
          {periodLabel}
        </span>
      </div>

      <p className="mb-6 max-w-2xl text-sm leading-6 text-slate-600">
        Si tu continues au même rythme jusqu’à la fin de la période, voici ton estimation.
      </p>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
          <p className="text-sm text-slate-500">CA projeté</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {projectedRevenue.toFixed(2)} €
          </p>
        </div>

        <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
          <p className="text-sm text-slate-500">Charges projetées</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {projectedCharges.toFixed(2)} €
          </p>
        </div>

        <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
          <p className="text-sm text-slate-500">Impôt projeté</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {projectedTax.toFixed(2)} €
          </p>
        </div>

        <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
          <p className="text-sm text-slate-500">Dépenses projetées</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {projectedExpenses.toFixed(2)} €
          </p>
        </div>

        <div className="rounded-2xl bg-[#4f7df3] p-4 text-white shadow-sm">
          <p className="text-sm text-blue-100">Reste réel projeté</p>
          <p className="mt-2 text-2xl font-semibold">
            {projectedRealNet.toFixed(2)} €
          </p>
        </div>
      </div>
    </div>
  )
}