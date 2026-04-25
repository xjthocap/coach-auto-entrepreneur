"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function AddRevenue() {
  const supabase = createClient()
  const router = useRouter()

  const today = new Date().toISOString().split("T")[0]

  const [label, setLabel] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(today)
  const [loading, setLoading] = useState(false)

  const [clientName, setClientName] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [reference, setReference] = useState("")

  async function handleAdd() {
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setLoading(false)
      return
    }

    const { error } = await supabase.from("revenues").insert({
  user_id: user.id,
  label: label.trim(),
  amount: parseFloat(amount),
  date,
  client_name: clientName.trim(),
  payment_method: paymentMethod,
  reference: reference.trim(),
})

    if (error) {
      console.error("Erreur ajout revenu :", error.message)
      setLoading(false)
      return
    }

    setClientName("")
    setPaymentMethod("")
    setReference("")
    setLabel("")
    setAmount("")
    setDate(today)
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="rounded-[28px] border border-green-200 bg-gradient-to-br from-green-50 to-white p-5 shadow-[0_10px_30px_rgba(34,197,94,0.08)]">
  <div className="mb-4">
    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-green-600">
      Entrée d’argent
    </p>
    <h2 className="text-xl font-semibold text-slate-900">Ajouter un revenu</h2>
    <p className="text-sm text-slate-500">
      Renseigne un libellé, un montant et une date.
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

        <div className="grid gap-3 md:grid-cols-2">
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

          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Client"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
            />

            <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
            >
            <option value="">Mode de paiement</option>
            <option value="Virement">Virement</option>
            <option value="Carte bancaire">Carte bancaire</option>
            <option value="Espèces">Espèces</option>
            <option value="Chèque">Chèque</option>
            </select>

            <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Référence facture"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
            />
        </div>

        <button
          onClick={handleAdd}
          style={{ cursor: "pointer" }}
          className="w-full rounded-2xl bg-green-600 px-5 py-3 font-semibold text-white shadow-[0_10px_20px_rgba(34,197,94,0.18)] transition hover:bg-green-500"        >
          {loading ? "..." : "Ajouter"}
        </button>
      </div>
    </div>
  )
}