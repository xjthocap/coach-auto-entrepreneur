"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function AddExpense() {
  const supabase = createClient()
  const router = useRouter()

  const today = new Date().toISOString().split("T")[0]

  const [label, setLabel] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(today)
  const [type, setType] = useState<"one_time" | "recurring">("one_time")
  const [loading, setLoading] = useState(false)

  async function handleAdd() {
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setLoading(false)
      return
    }

    const { error } = await supabase.from("expenses").insert({
      user_id: user.id,
      label,
      amount: parseFloat(amount),
      date,
      type,
      active: true,
    })

    if (error) {
      console.error("Erreur ajout dépense :", error.message)
      setLoading(false)
      return
    }

    setLabel("")
    setAmount("")
    setDate(today)
    setType("one_time")
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="rounded-[28px] border border-red-200 bg-gradient-to-br from-red-50 to-white p-5 shadow-[0_10px_30px_rgba(239,68,68,0.08)]">
  <div className="mb-4">
    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-600">
      Sortie d’argent
    </p>
    <h2 className="text-xl font-semibold text-slate-900">Ajouter une dépense</h2>
    <p className="text-sm text-slate-500">
      Ajoute une dépense ponctuelle ou récurrente.
    </p>
  </div>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Libellé"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
        />

        <div className="grid gap-3 md:grid-cols-3">
          <input
            type="number"
            placeholder="Montant €"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value as "one_time" | "recurring")}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
          >
            <option value="one_time">Ponctuelle</option>
            <option value="recurring">Récurrente</option>
          </select>
        </div>

        <button
          onClick={handleAdd}
          style={{ cursor: "pointer" }}
className="w-full rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white shadow-[0_10px_20px_rgba(239,68,68,0.18)] transition hover:bg-red-500"        >
          {loading ? "..." : "Ajouter"}
        </button>
      </div>
    </div>
  )
}