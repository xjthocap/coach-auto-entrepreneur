import Link from "next/link"
import DeleteRevenueButton from "@/components/DeleteRevenueButton"
import DeleteExpenseButton from "@/components/DeleteExpenseButton"
import GenerateInvoiceButton from "@/components/GenerateInvoiceButton"

type Revenue = {
  id: string
  amount: number
  date: string
  label: string | null
  client_name?: string | null
  invoices?: { id: string }[]
}

type Expense = {
  id: string
  amount: number
  date: string
  label: string | null
  supplier_name?: string | null
  type: "one_time" | "recurring"
  active: boolean
  isInPeriod?: boolean
}

type Props = {
  revenues: Revenue[]
  expenses: Expense[]
  limit?: number
}

type Movement =
  | { kind: "revenue"; data: Revenue }
  | { kind: "expense"; data: Expense }

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default function RecentMovements({ revenues, expenses, limit = 10 }: Props) {
  const movements: Movement[] = [
    ...revenues.map((r) => ({ kind: "revenue" as const, data: r })),
    ...expenses
      .filter((e) => e.isInPeriod !== false)
      .map((e) => ({ kind: "expense" as const, data: e })),
  ]
    .sort((a, b) => b.data.date.localeCompare(a.data.date))
    .slice(0, limit)

  return (
    <section
      style={{
        background: "var(--cream-50)",
        borderRadius: "var(--r-lg)",
        boxShadow: "var(--shadow-md)",
        overflow: "hidden",
      }}
    >
      <div className="p-5 md:p-6">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2
              className="text-lg font-semibold tracking-tight"
              style={{ color: "var(--ink-900)" }}
            >
              Tes derniers mouvements
            </h2>
            <p className="mt-0.5 text-sm" style={{ color: "var(--ink-400)" }}>
              Aperçu rapide — voir tout sur les pages dédiées.
            </p>
          </div>
          <Link
            href="/revenues"
            className="shrink-0 text-sm font-medium transition hover:opacity-70"
            style={{ color: "var(--ink-500)" }}
          >
            Voir tout →
          </Link>
        </div>

        {/* List */}
        {movements.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm" style={{ color: "var(--ink-400)" }}>
              Aucun mouvement sur cette période.
            </p>
            <Link
              href="/revenues"
              className="mt-4 inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-semibold transition hover:opacity-90"
              style={{ background: "var(--ink-900)", color: "var(--violet-500)" }}
            >
              Ajouter un revenu
            </Link>
          </div>
        ) : (
          <div>
            {movements.map((m, i) => {
              const isLast = i === movements.length - 1
              const isRevenue = m.kind === "revenue"
              const rev = isRevenue ? (m.data as Revenue) : null
              const exp = !isRevenue ? (m.data as Expense) : null

              const name = isRevenue
                ? (rev!.client_name?.trim() || rev!.label?.trim() || "Sans libellé")
                : (exp!.supplier_name?.trim() || exp!.label?.trim() || "Sans libellé")

              const sublabel = isRevenue
                ? (rev!.client_name?.trim() && rev!.label?.trim() ? rev!.label : null)
                : (exp!.supplier_name?.trim() && exp!.label?.trim() ? exp!.label : null)

              const invoiceId = isRevenue ? (rev!.invoices?.[0]?.id ?? null) : null

              return (
                <div
                  key={`${m.kind}-${m.data.id}`}
                  className="flex items-center gap-3 py-3"
                  style={{
                    borderBottom: isLast ? "none" : "1px solid var(--cream-200)",
                  }}
                >
                  {/* Icon */}
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background: isRevenue
                        ? "rgba(196, 181, 253, 0.18)"
                        : "var(--rose-100)",
                    }}
                  >
                    {isRevenue ? (
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--violet-700)"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 19V5M5 12l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--rose-500)"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 5v14M5 12l7 7 7-7" />
                      </svg>
                    )}
                  </div>

                  {/* Text */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm" style={{ color: "var(--ink-900)" }}>
                      <span className="font-semibold">{name}</span>
                      {sublabel && (
                        <span style={{ color: "var(--ink-400)" }}> · {sublabel}</span>
                      )}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2">
                      <p className="font-mono text-xs" style={{ color: "var(--ink-400)" }}>
                        {formatDate(m.data.date)}
                      </p>
                      {invoiceId && (
                        <span
                          className="rounded px-1.5 py-0.5 text-[10px] font-medium"
                          style={{
                            background: "rgba(196, 181, 253, 0.2)",
                            color: "var(--violet-700)",
                          }}
                        >
                          facture
                        </span>
                      )}
                      {!isRevenue && exp!.type === "recurring" && (
                        <span
                          className="rounded px-1.5 py-0.5 text-[10px] font-medium"
                          style={{
                            background: "var(--cream-200)",
                            color: "var(--ink-500)",
                          }}
                        >
                          récurrente
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Amount */}
                  <p
                    className="shrink-0 font-mono text-sm font-medium"
                    style={{
                      color: isRevenue ? "var(--violet-700)" : "var(--rose-500)",
                    }}
                  >
                    {isRevenue ? "+" : "−"}
                    {Number(m.data.amount).toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    €
                  </p>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-0.5">
                    {isRevenue ? (
                      <>
                        {invoiceId ? (
                          <a
                            href={`/api/invoices/${invoiceId}/pdf`}
                            target="_blank"
                            rel="noreferrer"
                            title="Télécharger la facture PDF"
                            className="flex h-7 w-7 items-center justify-center rounded-lg transition hover:opacity-70"
                            style={{ color: "var(--ink-300)" }}
                          >
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                            </svg>
                          </a>
                        ) : (
                          <GenerateInvoiceButton revenueId={rev!.id} />
                        )}
                        <DeleteRevenueButton revenueId={rev!.id} />
                      </>
                    ) : (
                      <DeleteExpenseButton expenseId={exp!.id} />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
