"use client"

import { useState } from "react"

export default function ExportMonthButton({ monthKey }: { monthKey: string }) {
  const [loading, setLoading] = useState(false)

  async function handleExport() {
    setLoading(true)
    try {
      // monthKey is YYYY-MM, create a date for that month
      const date = `${monthKey}-01`
      const res = await fetch(`/api/export/period?date=${date}`)
      if (!res.ok) {
        const data = await res.json()
        alert(data.error || "Erreur lors de l'export")
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `keskireste-${monthKey}.xlsx`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error(e)
      alert("Erreur lors de l'export")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="hidden items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition hover:opacity-70 disabled:opacity-50 md:flex"
      style={{ borderColor: "var(--cream-200)", background: "var(--cream-50)", color: "var(--ink-500)" }}
    >
      {loading ? (
        <span>…</span>
      ) : (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
        </svg>
      )}
      Exporter livre de recettes
    </button>
  )
}
