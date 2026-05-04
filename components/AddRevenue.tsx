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

const inputProps = {
  style: inputStyle,
}

export default function AddRevenue({ isPremium = false }: { isPremium?: boolean }) {
  const supabase = createClient()
  const router = useRouter()

  const today = new Date().toISOString().split("T")[0]

  const [label, setLabel] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(today)
  const [loading, setLoading] = useState(false)

  const [clientName, setClientName] = useState("")
  const [clientCompany, setClientCompany] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [clientAddress, setClientAddress] = useState("")

  const [paymentMethod, setPaymentMethod] = useState("")
  const [reference, setReference] = useState("")

  const [generateInvoice, setGenerateInvoice] = useState(false)
  const [autoInvoiceNumber, setAutoInvoiceNumber] = useState("")
  const [invoiceNumberLoading, setInvoiceNumberLoading] = useState(false)
  const [dueAt, setDueAt] = useState("")
  const [lastInvoiceId, setLastInvoiceId] = useState<string | null>(null)

  const [items, setItems] = useState([
    {
      description: "",
      quantity: "1",
      unitPrice: "",
    },
  ])

  async function fetchNextInvoiceNumber() {
    setInvoiceNumberLoading(true)
    try {
      const res = await fetch("/api/invoices/next-number")
      if (res.ok) {
        const { invoiceNumber } = await res.json()
        setAutoInvoiceNumber(invoiceNumber)
      }
    } finally {
      setInvoiceNumberLoading(false)
    }
  }

  function updateItem(index: number, field: string, value: string) {
    const updatedItems = [...items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setItems(updatedItems)
  }

  function addItem() {
    setItems([...items, { description: "", quantity: "1", unitPrice: "" }])
  }

  function removeItem(index: number) {
    if (items.length === 1) return
    setItems(items.filter((_, i) => i !== index))
  }

  const invoiceTotal = items.reduce((total, item) => {
    return total + Number(item.quantity || 0) * Number(item.unitPrice || 0)
  }, 0)

  async function handleAdd() {
    if (loading) return
    setLoading(true)
    setLastInvoiceId(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const parsedAmount = parseFloat(amount)
    const finalAmount = generateInvoice ? invoiceTotal : parsedAmount

    if (!label.trim() || Number.isNaN(finalAmount) || finalAmount <= 0) {
      setLoading(false)
      return
    }

    const { data: revenue, error: revenueError } = await supabase
      .from("revenues")
      .insert({
        user_id: user.id,
        label: label.trim(),
        amount: finalAmount,
        date,
        client_name: clientName.trim(),
        client_company: clientCompany.trim(),
        payment_method: paymentMethod,
        reference: reference.trim(),
      })
      .select("id")
      .single()

    if (revenueError) {
      console.error("Erreur ajout revenu :", revenueError.message)
      setLoading(false)
      return
    }

    if (generateInvoice) {
      // Utilise le numéro auto-généré (déjà fetchés au toggle) ou en génère un nouveau en fallback
      let invoiceNumber = autoInvoiceNumber
      if (!invoiceNumber) {
        const res = await fetch("/api/invoices/next-number")
        if (res.ok) {
          const data = await res.json()
          invoiceNumber = data.invoiceNumber
        }
      }

      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .insert({
          user_id: user.id,
          revenue_id: revenue.id,
          invoice_number: invoiceNumber,
          client_name: clientName.trim(),
          client_company: clientCompany.trim(),
          client_email: clientEmail.trim(),
          client_address: clientAddress.trim(),
          description: items[0]?.description.trim() || label.trim(),
          amount: invoiceTotal,
          items: items.map((item) => ({
            description: item.description.trim(),
            quantity: Number(item.quantity || 0),
            unit_price: Number(item.unitPrice || 0),
            total: Number(item.quantity || 0) * Number(item.unitPrice || 0),
          })),
          issued_at: date,
          due_at: dueAt || null,
          status: "draft",
        })
        .select("id")
        .single()

      if (invoiceError) {
        console.error("Erreur création facture :", invoiceError.message)
        setLoading(false)
        return
      }

      setLastInvoiceId(invoice.id)
    }

    setClientName("")
    setClientCompany("")
    setClientEmail("")
    setClientAddress("")
    setPaymentMethod("")
    setReference("")
    setAutoInvoiceNumber("")
    setDueAt("")
    setGenerateInvoice(false)
    setLabel("")
    setAmount("")
    setDate(today)
    setItems([{ description: "", quantity: "1", unitPrice: "" }])
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
            color: "var(--violet-700)",
          }}
        >
          Entrée d'argent
        </p>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--ink-900)", marginBottom: 4 }}>
          Ajouter un revenu
        </h2>
        <p style={{ fontSize: 14, color: "var(--ink-500)" }}>
          Renseigne un revenu et génère une facture si besoin.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {/* Libellé */}
        <input
          type="text"
          placeholder="Libellé (ex. Mission UI design - Mairie Montpellier)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          {...inputProps}
        />

        {/* Montant + Date */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <input
            type="number"
            placeholder="Montant €"
            value={generateInvoice ? invoiceTotal.toString() : amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={generateInvoice}
            style={{
              ...inputStyle,
              background: generateInvoice ? "var(--cream-200)" : "var(--cream-50)",
              color: generateInvoice ? "var(--ink-400)" : "var(--ink-900)",
            }}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            {...inputProps}
          />
        </div>

        {/* Client + Paiement */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Nom du client"
            {...inputProps}
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
        </div>

        {/* Toggle facture */}
        {isPremium ? (
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              borderRadius: "var(--r-sm)",
              border: "1px solid var(--cream-200)",
              background: "var(--cream-100)",
              padding: "12px 16px",
              fontSize: 14,
              fontWeight: 500,
              color: "var(--ink-700)",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={generateInvoice}
              onChange={() => {
                const next = !generateInvoice
                setGenerateInvoice(next)
                if (next && !autoInvoiceNumber) fetchNextInvoiceNumber()
              }}
              style={{ width: 16, height: 16, accentColor: "var(--violet-700)" }}
            />
            Générer une facture PDF pour cette entrée
          </label>
        ) : (
          <a
            href="/dashboard#premium"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              borderRadius: "var(--r-sm)",
              border: "1px solid var(--cream-200)",
              background: "var(--cream-100)",
              padding: "12px 16px",
              fontSize: 14,
              fontWeight: 500,
              color: "var(--ink-400)",
              textDecoration: "none",
              cursor: "pointer",
              opacity: 0.75,
            }}
          >
            <span style={{ fontSize: 15 }}>🔒</span>
            Générer une facture PDF pour cette entrée
            <span
              style={{
                marginLeft: "auto",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--violet-700)",
                background: "rgba(196,181,253,0.2)",
                borderRadius: 999,
                padding: "2px 8px",
              }}
            >
              Premium
            </span>
          </a>
        )}

        {/* Détails facture */}
        {generateInvoice && (
          <div
            style={{
              borderRadius: "var(--r-md)",
              border: "1px solid var(--cream-200)",
              background: "var(--cream-100)",
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {/* Société + Email */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <input
                type="text"
                value={clientCompany}
                onChange={(e) => setClientCompany(e.target.value)}
                placeholder="Société du client"
                {...inputProps}
              />
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="Email client"
                {...inputProps}
              />
            </div>

            {/* Adresse + N° facture auto */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <input
                type="text"
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                placeholder="Adresse client"
                {...inputProps}
              />
              {/* Numéro de facture auto-généré — lecture seule */}
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  readOnly
                  value={invoiceNumberLoading ? "Génération…" : autoInvoiceNumber}
                  style={{
                    ...inputStyle,
                    background: "var(--cream-100)",
                    color: autoInvoiceNumber ? "var(--ink-700)" : "var(--ink-400)",
                    fontWeight: autoInvoiceNumber ? 600 : 400,
                    fontFamily: "var(--font-geist-mono, monospace)",
                    cursor: "default",
                    paddingRight: 36,
                  }}
                />
                {/* Icône cadenas */}
                <span style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  color: "var(--ink-400)", pointerEvents: "none",
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
              </div>
            </div>

            {/* Date d'échéance */}
            <input
              type="date"
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
              {...inputProps}
            />

            {/* Lignes */}
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-700)" }}>
              Lignes de facture
            </p>

            {items.map((item, index) => (
              <div
                key={index}
                style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 8 }}
              >
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(index, "description", e.target.value)}
                  placeholder="Description"
                  {...inputProps}
                />
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, "quantity", e.target.value)}
                  placeholder="Qté"
                  {...inputProps}
                />
                <input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
                  placeholder="Prix HT"
                  {...inputProps}
                />
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1}
                  style={{
                    borderRadius: "var(--r-sm)",
                    border: "1px solid var(--cream-300)",
                    background: "var(--cream-50)",
                    color: items.length === 1 ? "var(--ink-300)" : "var(--rose-500)",
                    padding: "12px 14px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: items.length === 1 ? "not-allowed" : "pointer",
                    opacity: items.length === 1 ? 0.4 : 1,
                  }}
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addItem}
              style={{
                borderRadius: "var(--r-sm)",
                border: "1px solid var(--cream-300)",
                background: "var(--cream-200)",
                color: "var(--ink-700)",
                padding: "10px 16px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                alignSelf: "flex-start",
              }}
            >
              + Ajouter une ligne
            </button>

            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--ink-900)",
                borderTop: "1px solid var(--cream-300)",
                paddingTop: 10,
              }}
            >
              Total HT : {invoiceTotal.toFixed(2).replace(".", ",")} €
            </p>
          </div>
        )}

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
          {loading ? "Enregistrement…" : "Ajouter le revenu"}
        </button>

        {/* Lien téléchargement facture */}
        {lastInvoiceId && (
          <a
            href={`/api/invoices/${lastInvoiceId}/pdf`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "block",
              borderRadius: "var(--r-sm)",
              border: "1px solid var(--cream-300)",
              background: "var(--cream-200)",
              color: "var(--violet-700)",
              padding: "12px 16px",
              textAlign: "center",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            ↓ Télécharger la facture PDF
          </a>
        )}
      </div>
    </div>
  )
}
