"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

const inputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: "var(--r-sm)",
  border: "1px solid var(--cream-300)",
  background: "var(--cream-50)",
  color: "var(--ink-900)",
  padding: "12px 16px",
  outline: "none",
  fontSize: 14,
}

export default function AddExpense() {
  const supabase = createClient()
  const router = useRouter()

  const today = new Date().toISOString().split("T")[0]

  const [label, setLabel] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(today)
  const [type, setType] = useState<"one_time" | "recurring">("one_time")
  const [loading, setLoading] = useState(false)

  const [supplierName, setSupplierName] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [reference, setReference] = useState("")

  async function handleAdd() {
    if (loading) return
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { error } = await supabase.from("expenses").insert({
      user_id: user.id,
      label: label.trim(),
      amount: parseFloat(amount),
      date,
      type,
      active: true,
      supplier_name: supplierName.trim(),
      payment_method: paymentMethod,
      reference: reference.trim(),
    })

    if (error) {
      console.error("Erreur ajout dépense :", error.message)
      setLoading(false)
      return
    }

    setSupplierName("")
    setPaymentMethod("")
    setReference("")
    setLabel("")
    setAmount("")
    setDate(today)
    setType("one_time")
    setLoading(false)

    router.refresh()
  }

  return (
    <div
      style={{
        borderRadius: "var(--r-xl)",
        border: "1px solid var(--cream-200)",
        background: "var(--cream-50)",
        padding: 20,
        boxShadow: "var(--shadow-md)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <p
          style={{
            marginBottom: 6,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--rose-500)",
          }}
        >
          Sortie d'argent
        </p>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--ink-900)", marginBottom: 4 }}>
          Ajouter une dépense
        </h2>
        <p style={{ fontSize: 14, color: "var(--ink-500)" }}>
          Ajoute une dépense ponctuelle ou récurrente.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {/* Libellé */}
        <input
          type="text"
          placeholder="Libellé"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          style={inputStyle}
        />

        {/* Montant + Date + Type */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <input
            type="number"
            placeholder="Montant €"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={inputStyle}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={inputStyle}
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "one_time" | "recurring")}
            style={inputStyle}
          >
            <option value="one_time">Ponctuelle</option>
            <option value="recurring">Récurrente</option>
          </select>
        </div>

        {/* Fournisseur + Mode + Référence */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <input
            type="text"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            placeholder="Fournisseur"
            style={inputStyle}
          />
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={inputStyle}
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
            placeholder="Référence justificatif"
            style={inputStyle}
          />
        </div>

        {/* Submit */}
        <div style={{ flex: 1 }} />
        <button
          onClick={handleAdd}
          disabled={loading}
          style={{
            width: "100%",
            borderRadius: "var(--r-sm)",
            border: "none",
            background: "var(--ink-900)",
            color: "var(--violet-500)",
            padding: "14px 20px",
            fontSize: 15,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.5 : 1,
            boxShadow: "var(--shadow-md)",
          }}
        >
          {loading ? "Enregistrement…" : "Ajouter la dépense"}
        </button>
      </div>
    </div>
  )
}
