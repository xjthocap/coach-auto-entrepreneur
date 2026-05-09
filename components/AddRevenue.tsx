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
  padding: "10px 14px",
  outline: "none",
  fontSize: 14,
}

const inputProps = { style: inputStyle }

export default function AddRevenue({ isPremium = false }: { isPremium?: boolean }) {
  const supabase = createClient()
  const router = useRouter()

  const today = new Date().toISOString().split("T")[0]

  const [label, setLabel] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(today)
  const [loading, setLoading] = useState(false)
  const [celebration, setCelebration] = useState<{ active: boolean; amount: number }>({ active: false, amount: 0 })

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

  const [items, setItems] = useState([{ description: "", quantity: "1", unitPrice: "" }])

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
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    setItems(updated)
  }

  function addItem() {
    setItems([...items, { description: "", quantity: "1", unitPrice: "" }])
  }

  function removeItem(index: number) {
    if (items.length === 1) return
    setItems(items.filter((_, i) => i !== index))
  }

  const invoiceTotal = items.reduce((sum, item) =>
    sum + Number(item.quantity || 0) * Number(item.unitPrice || 0), 0)

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
      let invoiceNumber = autoInvoiceNumber
      if (!invoiceNumber) {
        const res = await fetch("/api/invoices/next-number")
        if (res.ok) invoiceNumber = (await res.json()).invoiceNumber
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

    setClientName(""); setClientCompany(""); setClientEmail(""); setClientAddress("")
    setPaymentMethod(""); setReference(""); setAutoInvoiceNumber(""); setDueAt("")
    setGenerateInvoice(false); setLabel(""); setAmount(""); setDate(today)
    setItems([{ description: "", quantity: "1", unitPrice: "" }])
    setLoading(false)

    // 🎉 Animation pièce
    setCelebration({ active: true, amount: finalAmount })
    setTimeout(() => setCelebration({ active: false, amount: 0 }), 1900)

    router.refresh()
  }

  function formatAmount(n: number) {
    return n % 1 === 0
      ? n.toLocaleString("fr-FR")
      : n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return (
    <div style={{
      borderRadius: "var(--r-xl)",
      border: "1px solid var(--cream-200)",
      background: "var(--cream-50)",
      padding: 20,
      boxShadow: "var(--shadow-md)",
      display: "flex",
      flexDirection: "column",
      height: "100%",
    }}>
      <style>{`
        .ar-grid-2 { display: grid; grid-template-columns: 1fr; gap: 8px; }
        @media (min-width: 400px) {
          .ar-grid-2 { grid-template-columns: 1fr 1fr; }
        }
        /* Lignes de facture : description pleine largeur sur mobile */
        .ar-invoice-line {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          grid-template-areas: "desc desc desc" "qty price rm";
          gap: 8px;
        }
        .ar-line-desc  { grid-area: desc; }
        .ar-line-qty   { grid-area: qty; }
        .ar-line-price { grid-area: price; }
        .ar-line-rm    { grid-area: rm; }
        @media (min-width: 520px) {
          .ar-invoice-line {
            grid-template-columns: 2fr 1fr 1fr auto;
            grid-template-areas: "desc qty price rm";
          }
        }
        @keyframes ar-toast-in {
          0%   { opacity: 0; transform: translateY(6px); }
          20%  { opacity: 1; transform: translateY(0px); }
          75%  { opacity: 1; transform: translateY(0px); }
          100% { opacity: 0; transform: translateY(-4px); }
        }
        .ar-toast { animation: ar-toast-in 1.8s ease-out forwards; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 14 }}>
        <p style={{
          marginBottom: 4, fontSize: 10, fontWeight: 700,
          letterSpacing: "0.16em", textTransform: "uppercase",
          color: "var(--violet-700)",
        }}>Entrée d'argent</p>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "var(--ink-900)", marginBottom: 2 }}>
          Ajouter un revenu
        </h2>
        <p style={{ fontSize: 13, color: "var(--ink-500)" }}>
          Renseigne un revenu et génère une facture si besoin.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

        {/* Libellé */}
        <input
          type="text"
          placeholder="Libellé (ex. Mission UI design)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          {...inputProps}
        />

        {/* Montant + Date */}
        <div className="ar-grid-2">
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
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} {...inputProps} />
        </div>

        {/* Client + Paiement */}
        <div className="ar-grid-2">
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Nom du client"
            {...inputProps}
          />
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={inputStyle}>
            <option value="">Mode de paiement</option>
            <option value="Virement">Virement</option>
            <option value="Carte bancaire">Carte bancaire</option>
            <option value="Espèces">Espèces</option>
            <option value="Chèque">Chèque</option>
          </select>
        </div>

        {/* Toggle facture */}
        {isPremium ? (
          <label style={{
            display: "flex", alignItems: "center", gap: 10,
            borderRadius: "var(--r-sm)", border: "1px solid var(--cream-200)",
            background: "var(--cream-100)", padding: "10px 14px",
            fontSize: 13, fontWeight: 500, color: "var(--ink-700)", cursor: "pointer",
          }}>
            <input
              type="checkbox"
              checked={generateInvoice}
              onChange={() => {
                const next = !generateInvoice
                setGenerateInvoice(next)
                if (next && !autoInvoiceNumber) fetchNextInvoiceNumber()
              }}
              style={{ width: 15, height: 15, accentColor: "var(--violet-700)", flexShrink: 0 }}
            />
            Générer une facture PDF
          </label>
        ) : (
          <a href="/dashboard#premium" style={{
            display: "flex", alignItems: "center", gap: 10,
            borderRadius: "var(--r-sm)", border: "1px solid var(--cream-200)",
            background: "var(--cream-100)", padding: "10px 14px",
            fontSize: 13, fontWeight: 500, color: "var(--ink-400)",
            textDecoration: "none", opacity: 0.75,
          }}>
            <span style={{ flexShrink: 0 }}>🔒</span>
            <span style={{ flex: 1 }}>Générer une facture PDF</span>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "var(--violet-700)",
              background: "rgba(196,181,253,0.2)", borderRadius: 999,
              padding: "2px 7px", whiteSpace: "nowrap", flexShrink: 0,
            }}>Premium</span>
          </a>
        )}

        {/* Détails facture */}
        {generateInvoice && (
          <div style={{
            borderRadius: "var(--r-md)", border: "1px solid var(--cream-200)",
            background: "var(--cream-100)", padding: "12px 14px",
            display: "flex", flexDirection: "column", gap: 8,
          }}>
            <div className="ar-grid-2">
              <input type="text" value={clientCompany} onChange={(e) => setClientCompany(e.target.value)} placeholder="Société du client" {...inputProps} />
              <input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="Email client" {...inputProps} />
            </div>
            <div className="ar-grid-2">
              <input type="text" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} placeholder="Adresse client" {...inputProps} />
              <input
                type="text"
                value={invoiceNumberLoading ? "Génération…" : autoInvoiceNumber}
                onChange={(e) => setAutoInvoiceNumber(e.target.value)}
                placeholder="N° facture (auto)"
                style={{ ...inputStyle, fontFamily: "var(--font-geist-mono, monospace)", fontWeight: 600 }}
              />
            </div>
            <input type="date" value={dueAt} onChange={(e) => setDueAt(e.target.value)} placeholder="Date d'échéance" {...inputProps} />

            <p style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-700)", marginTop: 2 }}>
              Lignes de facture
            </p>

            {items.map((item, index) => (
              <div key={index} className="ar-invoice-line">
                <input className="ar-line-desc" type="text" value={item.description} onChange={(e) => updateItem(index, "description", e.target.value)} placeholder="Description" style={inputStyle} />
                <input className="ar-line-qty" type="number" value={item.quantity} onChange={(e) => updateItem(index, "quantity", e.target.value)} placeholder="Qté" style={inputStyle} />
                <input className="ar-line-price" type="number" value={item.unitPrice} onChange={(e) => updateItem(index, "unitPrice", e.target.value)} placeholder="Prix HT" style={inputStyle} />
                <button
                  className="ar-line-rm"
                  type="button"
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1}
                  style={{
                    borderRadius: "var(--r-sm)", border: "1px solid var(--cream-300)",
                    background: "var(--cream-50)",
                    color: items.length === 1 ? "var(--ink-300)" : "var(--rose-500)",
                    padding: "10px 12px", fontSize: 12, fontWeight: 700,
                    cursor: items.length === 1 ? "not-allowed" : "pointer",
                    opacity: items.length === 1 ? 0.4 : 1,
                    alignSelf: "stretch",
                  }}
                >✕</button>
              </div>
            ))}

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4, flexWrap: "wrap", gap: 8 }}>
              <button
                type="button"
                onClick={addItem}
                style={{
                  borderRadius: "var(--r-sm)", border: "1px solid var(--cream-300)",
                  background: "var(--cream-200)", color: "var(--ink-700)",
                  padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                }}
              >+ Ajouter une ligne</button>
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-900)" }}>
                Total HT : {invoiceTotal.toFixed(2).replace(".", ",")} €
              </p>
            </div>
          </div>
        )}

      </div>{/* fin champs */}

      {/* Spacer + Submit */}
      <div style={{ flex: 1 }} />

      {/* ✓ Toast confirmation */}
      {celebration.active && (
        <div
          aria-hidden="true"
          className="ar-toast"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "var(--ink-900)",
            border: "1px solid rgba(155,123,255,0.25)",
            borderRadius: "var(--r-sm)",
            padding: "10px 16px",
            pointerEvents: "none",
          }}
        >
          {/* Icône check */}
          <div style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "rgba(155,123,255,0.15)",
            border: "1.5px solid var(--violet-500)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
              <path d="M1 3.5L3.5 6L8 1" stroke="#9B7BFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {/* Texte */}
          <span style={{ fontSize: 13, color: "var(--cream-100)", fontWeight: 500, letterSpacing: "-0.01em" }}>
            Revenu ajouté
          </span>
          {/* Montant */}
          <span style={{ fontSize: 13, color: "var(--violet-400, #9B7BFF)", fontWeight: 700, letterSpacing: "-0.02em", marginLeft: "auto", paddingLeft: 12 }}>
            +{formatAmount(celebration.amount)} €
          </span>
        </div>
      )}

      <button
        onClick={handleAdd}
        disabled={loading}
        style={{
          marginTop: 12,
          width: "100%", borderRadius: "var(--r-sm)", border: "none",
          background: "var(--ink-900)", color: "var(--violet-500)",
          padding: "13px 20px", fontSize: 14, fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.5 : 1, boxShadow: "var(--shadow-md)",
        }}
      >
        {loading ? "Enregistrement…" : "Ajouter le revenu"}
      </button>

      {lastInvoiceId && (
        <a
          href={`/api/invoices/${lastInvoiceId}/pdf`}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "block", borderRadius: "var(--r-sm)",
            border: "1px solid var(--cream-300)", background: "var(--cream-200)",
            color: "var(--violet-700)", padding: "11px 16px",
            textAlign: "center", fontSize: 13, fontWeight: 600, textDecoration: "none",
            marginTop: 8,
          }}
        >↓ Télécharger la facture PDF</a>
      )}
    </div>
  )
}
