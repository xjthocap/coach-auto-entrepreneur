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

  const [generateInvoice, setGenerateInvoice] = useState(false)
  const [clientEmail, setClientEmail] = useState("")
  const [clientAddress, setClientAddress] = useState("")
  const [invoiceDescription, setInvoiceDescription] = useState("")
  const [dueAt, setDueAt] = useState("")
  const [lastInvoiceId, setLastInvoiceId] = useState<string | null>(null)

  function generateInvoiceNumber() {
    const timestamp = Date.now()
    return `FAC-${new Date().getFullYear()}-${timestamp}`
  }

  async function handleAdd() {
    if (loading) return

    setLoading(true)
    setLastInvoiceId(null)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setLoading(false)
      return
    }

    const parsedAmount = parseFloat(amount)

    if (!label.trim() || !amount || Number.isNaN(parsedAmount)) {
      setLoading(false)
      return
    }

    const { data: revenue, error: revenueError } = await supabase
      .from("revenues")
      .insert({
        user_id: user.id,
        label: label.trim(),
        amount: parsedAmount,
        date,
        client_name: clientName.trim(),
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
      const invoiceNumber = reference.trim() || generateInvoiceNumber()

      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .insert({
          user_id: user.id,
          revenue_id: revenue.id,
          invoice_number: invoiceNumber,
          client_name: clientName.trim(),
          client_email: clientEmail.trim(),
          client_address: clientAddress.trim(),
          description: invoiceDescription.trim() || label.trim(),
          amount: parsedAmount,
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
    setPaymentMethod("")
    setReference("")
    setClientEmail("")
    setClientAddress("")
    setInvoiceDescription("")
    setDueAt("")
    setGenerateInvoice(false)
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

        <h2 className="text-xl font-semibold text-slate-900">
          Ajouter un revenu
        </h2>

        <p className="text-sm text-slate-500">
          Renseigne un revenu et génère une facture si besoin.
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
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition duration-200 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
          />

          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Client"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
          />

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition duration-200 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
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
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100 md:col-span-2"
          />
        </div>

        <label className="flex items-center gap-3 rounded-2xl border border-green-100 bg-white px-4 py-4 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={generateInvoice}
            onChange={() => setGenerateInvoice(!generateInvoice)}
            className="h-4 w-4 accent-green-600"
          />
          Générer une facture PDF pour cette entrée
        </label>

        {generateInvoice && (
          <div className="rounded-2xl border border-green-100 bg-white/80 p-4">
            <p className="mb-3 text-sm font-semibold text-slate-800">
              Informations facture
            </p>

            <div className="grid gap-3 md:grid-cols-2">
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="Email client"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
              />

              <input
                type="date"
                value={dueAt}
                onChange={(e) => setDueAt(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition duration-200 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
              />

              <input
                type="text"
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                placeholder="Adresse client"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100 md:col-span-2"
              />

              <input
                type="text"
                value={invoiceDescription}
                onChange={(e) => setInvoiceDescription(e.target.value)}
                placeholder="Description de la prestation"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100 md:col-span-2"
              />
            </div>
          </div>
        )}

        <button
          onClick={handleAdd}
          disabled={loading}
          style={{ cursor: loading ? "not-allowed" : "pointer" }}
          className="w-full rounded-2xl bg-green-600 px-5 py-3 font-semibold text-white shadow-[0_10px_20px_rgba(34,197,94,0.18)] transition hover:bg-green-500 disabled:opacity-50"
        >
          {loading ? "..." : "Ajouter"}
        </button>

        {lastInvoiceId && (
          <a
            href={`/api/invoices/${lastInvoiceId}/pdf`}
            target="_blank"
            rel="noreferrer"
            className="block rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-semibold text-green-700 transition hover:bg-green-100"
          >
            Télécharger la facture PDF
          </a>
        )}
      </div>
    </div>
  )
}