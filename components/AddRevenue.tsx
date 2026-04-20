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
      label,
      amount: parseFloat(amount),
      date,
    })

    if (error) {
      console.error("Erreur ajout revenu :", error.message)
      setLoading(false)
      return
    }

    setLabel("")
    setAmount("")
    setDate(today)
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="mt-6 flex flex-col gap-3">
      <input
        type="text"
        placeholder="Libellé"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className="rounded-xl border border-white/20 bg-black px-4 py-2 text-white"
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="number"
          placeholder="Montant €"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="rounded-xl border border-white/20 bg-black px-4 py-2 text-white"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-xl border border-white/20 bg-black px-4 py-2 text-white"
        />

        <button
          onClick={handleAdd}
          style={{ cursor: "pointer" }}
          className="rounded-xl bg-white px-4 py-2 font-semibold text-black transition hover:bg-gray-200"
        >
          {loading ? "..." : "Ajouter"}
        </button>
      </div>
    </div>
  )
}