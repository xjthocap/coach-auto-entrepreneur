"use client"

import { useState } from "react"
import DeleteExpenseButton from "@/components/DeleteExpenseButton"
import ToggleExpenseActiveButton from "@/components/ToggleExpenseActiveButton"

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

type Filter = "all" | "recurring" | "one_time"

const FILTERS: [Filter, string][] = [
  ["all", "Toutes"],
  ["recurring", "Récurrentes"],
  ["one_time", "Ponctuelles"],
]

export default function ExpenseList({
  expenses,
  showPeriodInfo = false,
}: {
  expenses: Expense[]
  showPeriodInfo?: boolean
}) {
  const [filter, setFilter] = useState<Filter>("all")

  const filtered =
    filter === "all" ? expenses : expenses.filter((e) => e.type === filter)

  return (
    <div className="p-5 md:p-6">
      {/* ── Header ── */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight" style={{ color: "var(--ink-900)" }}>
            Tes dépenses
          </h2>
          <p className="mt-0.5 text-sm" style={{ color: "var(--ink-400)" }}>
            Les dépenses récurrentes sont automatiquement reconduites chaque mois.
          </p>
        </div>

        <div className="flex gap-1.5">
          {FILTERS.map(([f, label]) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="rounded-lg border px-3 py-2 text-sm font-medium transition"
              style={{
                background: filter === f ? "var(--ink-900)" : "var(--cream-50)",
                borderColor: filter === f ? "transparent" : "var(--cream-200)",
                color: filter === f ? "var(--cream-50)" : "var(--ink-500)",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Liste ── */}
      {filtered.length === 0 ? (
        <div className="py-10 text-center text-sm" style={{ color: "var(--ink-300)" }}>
          Aucune dépense enregistrée.
        </div>
      ) : (
        <div>
          {filtered.map((exp, i) => {
            const isDimmed = showPeriodInfo && exp.isInPeriod === false
            const dateStr = new Date(exp.date + "T00:00:00").toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            const name = exp.supplier_name?.trim() || exp.label?.trim() || "Sans libellé"
            const sublabel = exp.supplier_name?.trim() && exp.label?.trim() ? exp.label : null

            return (
              <div
                key={exp.id}
                className="flex items-center gap-3 py-3.5"
                style={{
                  borderBottom:
                    i < filtered.length - 1 ? "1px solid var(--cream-200)" : "none",
                  opacity: isDimmed ? 0.45 : 1,
                }}
              >
                {/* Icône */}
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: "var(--rose-100)" }}
                >
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
                    <path d="M5 12h14M13 6l6 6-6 6" />
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
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                    <p className="shrink-0 font-mono text-xs" style={{ color: "var(--ink-400)" }}>
                      {dateStr}
                    </p>
                    <span className="font-mono text-xs" style={{ color: "var(--ink-300)" }}>·</span>
                    <span className="text-xs" style={{ color: "var(--ink-400)" }}>
                      {exp.type === "recurring" ? "récurrente" : "ponctuelle"}
                    </span>
                    {exp.type === "recurring" && !exp.active && (
                      <span
                        className="rounded px-1.5 py-0.5 text-[10px]"
                        style={{ background: "var(--cream-200)", color: "var(--ink-400)" }}
                      >
                        inactive
                      </span>
                    )}
                  </div>
                </div>

                {/* Montant */}
                <p
                  className="shrink-0 font-mono text-sm font-medium"
                  style={{ color: "var(--rose-500)" }}
                >
                  -{Number(exp.amount).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                </p>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-0.5">
                  {exp.type === "recurring" && (
                    <ToggleExpenseActiveButton expenseId={exp.id} active={exp.active} />
                  )}
                  <DeleteExpenseButton expenseId={exp.id} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
