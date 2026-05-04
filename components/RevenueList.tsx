import DeleteRevenueButton from "@/components/DeleteRevenueButton"
import GenerateInvoiceButton from "@/components/GenerateInvoiceButton"
import InvoiceStatusBadge from "@/components/InvoiceStatusBadge"

type Invoice = { id: string; status?: string | null; invoice_number?: string | null }

type Revenue = {
  id: string
  amount: number
  date: string
  label: string | null
  client_name?: string | null
  invoices?: Invoice[] | null
}

export default function RevenueList({ revenues, isPremium = false }: { revenues: Revenue[]; isPremium?: boolean }) {
  return (
    <div className="p-5 md:p-6">
      {/* ── Header ── */}
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-tight" style={{ color: "var(--ink-900)" }}>
          Tes revenus
        </h2>
        <p className="mt-0.5 text-sm" style={{ color: "var(--ink-400)" }}>
          Liste des encaissements sur la période active.
        </p>
        
      </div>

      {/* ── Liste ── */}
      {revenues.length === 0 ? (
        <div className="py-10 text-center text-sm" style={{ color: "var(--ink-300)" }}>
          Aucun revenu sur cette période.
        </div>
      ) : (
        <div>
          {revenues.map((rev, i) => {
            const invoiceId = rev.invoices?.[0]?.id ?? null
            const dateStr = new Date(rev.date + "T00:00:00").toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            const name = rev.client_name?.trim() || rev.label?.trim() || "Sans libellé"
            const sublabel = rev.client_name?.trim() && rev.label?.trim() ? rev.label : null

            return (
              <div
                key={rev.id}
                className="flex items-center gap-3 py-3.5"
                style={{
                  borderBottom:
                    i < revenues.length - 1 ? "1px solid var(--cream-200)" : "none",
                }}
              >
                {/* Icône */}
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: "rgba(196, 181, 253, 0.2)" }}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--lime-700)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                </div>

                {/* Texte */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm" style={{ color: "var(--ink-900)" }}>
                    <span className="font-semibold">{name}</span>
                    {sublabel && (
                      <span style={{ color: "var(--ink-400)" }}> · {sublabel}</span>
                    )}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="font-mono text-xs shrink-0" style={{ color: "var(--ink-400)" }}>
                      {dateStr}
                    </p>
                    {/* Badge statut facture — dans la zone texte pour rester responsive */}
                    {invoiceId && (
                      <InvoiceStatusBadge
                        invoiceId={invoiceId}
                        status={(rev.invoices?.[0]?.status ?? "draft") as any}
                        invoiceNumber={rev.invoices?.[0]?.invoice_number}
                      />
                    )}
                  </div>
                </div>

                {/* Montant */}
                <p
                  className="shrink-0 font-mono text-sm font-medium"
                  style={{ color: "var(--lime-700)" }}
                >
                  +{Number(rev.amount).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                </p>

                {/* Actions — icônes uniquement, taille fixe */}
                <div className="flex shrink-0 items-center gap-0.5">
                  {invoiceId ? (
                    <a
                      href={`/api/invoices/${invoiceId}/pdf`}
                      target="_blank"
                      rel="noreferrer"
                      title="Télécharger la facture PDF"
                      className="flex h-7 w-7 items-center justify-center rounded-lg transition hover:opacity-70"
                      style={{ color: "var(--ink-300)" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                      </svg>
                    </a>
                  ) : isPremium ? (
                    <GenerateInvoiceButton revenueId={rev.id} />
                  ) : (
                    <span
                      title="Générer une facture PDF (Premium)"
                      className="flex h-7 w-7 items-center justify-center rounded-lg"
                      style={{ color: "var(--ink-300)", cursor: "default", opacity: 0.5 }}
                    >🔒</span>
                  )}
                  <DeleteRevenueButton revenueId={rev.id} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
