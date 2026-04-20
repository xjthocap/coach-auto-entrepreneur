import DeleteRevenueButton from "@/components/DeleteRevenueButton"

type Revenue = {
  id: string
  amount: number
  date: string
  label: string | null
}

export default function RevenueList({ revenues }: { revenues: Revenue[] }) {
  return (
    <div className="mt-10 w-full max-w-md">
      <h2 className="mb-4 text-xl font-bold">Mes revenus</h2>

      <div className="space-y-2">
        {revenues.length === 0 ? (
          <div className="rounded-xl bg-white/5 p-4 text-gray-400">
            Aucun revenu ajouté pour le moment.
          </div>
        ) : (
          revenues.map((rev) => (
            <div
              key={rev.id}
              className="flex items-center justify-between rounded-xl bg-white/5 p-3"
            >
              <div className="text-left">
                <p className="font-medium">
                  {rev.label?.trim() ? rev.label : "Sans libellé"}
                </p>
                <p className="text-sm text-gray-400">
                  {new Date(rev.date).toLocaleDateString("fr-FR")} —{" "}
                  {Number(rev.amount).toFixed(2)} €
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