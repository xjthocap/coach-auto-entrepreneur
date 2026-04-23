import DeleteRevenueButton from "@/components/DeleteRevenueButton"

type Revenue = {
  id: string
  amount: number
  date: string
  label: string | null
}

export default function RevenueList({ revenues }: { revenues: Revenue[] }) {
  return (
    <div className="rounded-[28px] border border-white/80 bg-white/80 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <h2 className="mb-6 text-3xl font-semibold tracking-tight text-slate-900">
  Mes revenus
  <p className="mt-2 text-sm text-slate-500">
    Cette liste affiche uniquement les revenus pris en compte dans la période actuelle.
  </p>
</h2>

      <div className="space-y-3">
        {revenues.length === 0 ? (
          <div className="rounded-2xl bg-[#f8f9fd] p-4 text-slate-500">
            Aucun revenu ajouté pour le moment.
          </div>
        ) : (
          revenues.map((rev) => (
            <div
              key={rev.id}
              className="flex items-center justify-between rounded-2xl border border-slate-100 bg-[#fbfcff] px-4 py-4"
            >
              <div className="min-w-0">
                <p className="truncate text-xl font-medium text-slate-900">
                  {rev.label?.trim() ? rev.label : "Sans libellé"}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                {new Date(rev.date).toLocaleDateString("fr-FR")} —{" "}
                <span className="font-semibold text-green-600">
                    + {Number(rev.amount).toFixed(2)} €
                </span>
                </p>
              </div>

              <DeleteRevenueButton revenueId={rev.id} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}