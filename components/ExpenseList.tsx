import ToggleExpenseActiveButton from "@/components/ToggleExpenseActiveButton"
import DeleteExpenseButton from "@/components/DeleteExpenseButton"

type Expense = {
  id: string
  amount: number
  date: string
  label: string | null
  type: "one_time" | "recurring"
  active: boolean
  isInPeriod?: boolean
}

type ExpenseListProps = {
  expenses: Expense[]
  showPeriodInfo?: boolean
}

export default function ExpenseList({
  expenses,
  showPeriodInfo = false,
}: ExpenseListProps) {
  return (
    <div className="rounded-[28px] border border-white/80 bg-white/80 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
          Mes dépenses
        </h2>

        {showPeriodInfo && (
          <p className="mt-2 text-sm text-slate-500">
            Les dépenses grisées ne sont pas comptées dans la période actuelle.
          </p>
        )}
      </div>

      <div className="space-y-3">
        {expenses.length === 0 ? (
          <div className="rounded-2xl bg-[#f8f9fd] p-4 text-slate-500">
            Aucune dépense ajoutée pour le moment.
          </div>
        ) : (
          expenses.map((exp) => {
            const isDimmed = showPeriodInfo && exp.isInPeriod === false

            return (
              <div
                key={exp.id}
                className={`group flex items-center justify-between rounded-2xl border px-5 py-4 shadow-sm transition hover:shadow-md ${
                  isDimmed
                    ? "border-slate-100 bg-slate-50 opacity-70"
                    : "border-slate-100 bg-white"
                }`}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-lg font-semibold text-slate-900">
                      {exp.label?.trim() ? exp.label : "Sans libellé"}
                    </p>

                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      {exp.type === "recurring" ? "Récurrente" : "Ponctuelle"}
                    </span>

                    {exp.type === "recurring" && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          exp.active
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {exp.active ? "Active" : "Inactive"}
                      </span>
                    )}

                    {showPeriodInfo && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          exp.isInPeriod
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {exp.isInPeriod ? "Comptée" : "Hors période"}
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {new Date(exp.date).toLocaleDateString("fr-FR")} —{" "}
                    <span className="font-semibold text-red-600">
                        - {Number(exp.amount).toFixed(2)} €
                    </span>
                    </p>
                </div>

                <div className="flex items-center gap-2">
                  {exp.type === "recurring" && (
                    <ToggleExpenseActiveButton
                      expenseId={exp.id}
                      active={exp.active}
                    />
                  )}

                  <DeleteExpenseButton expenseId={exp.id} />
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}