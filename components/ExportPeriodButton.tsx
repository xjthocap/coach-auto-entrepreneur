"use client"

type Props = {
  date?: string
}

export default function ExportPeriodButton({ date }: Props) {
  function handleExport() {
    const url = date
      ? `/api/export/period?date=${date}`
      : "/api/export/period"

    window.location.href = url
  }

  return (
    <button
      onClick={handleExport}
      className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 font-medium text-emerald-700 shadow-sm transition hover:bg-emerald-100"
    >
      Exporter Excel
    </button>
  )
}