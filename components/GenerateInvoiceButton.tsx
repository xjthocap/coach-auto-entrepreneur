"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function GenerateInvoiceButton({ revenueId }: { revenueId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [invoiceId, setInvoiceId] = useState<string | null>(null)

  async function handleGenerate() {
    setLoading(true)
    try {
      const res = await fetch("/api/invoices/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ revenueId }),
      })
      const data = await res.json()
      if (data.invoiceId) {
        setInvoiceId(data.invoiceId)
        router.refresh()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (invoiceId) {
    return (
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
    )
  }

  return (
    <button
      onClick={handleGenerate}
      disabled={loading}
      title="Générer une facture"
      className="flex h-7 w-7 items-center justify-center rounded-lg transition hover:opacity-70 disabled:opacity-30"
      style={{ color: "var(--ink-300)" }}
    >
      {loading ? (
        <span className="text-xs">…</span>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="12" x2="12" y2="17" />
          <line x1="9" y1="14.5" x2="15" y2="14.5" />
        </svg>
      )}
    </button>
  )
}
