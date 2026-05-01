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
      title="Exporter en Excel"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        borderRadius: 999,
        border: "1px solid var(--cream-300)",
        background: "var(--cream-50)",
        padding: "7px 14px",
        fontSize: 13,
        fontWeight: 500,
        color: "var(--ink-700)",
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={e => { e.currentTarget.style.background = "var(--cream-100)" }}
      onMouseLeave={e => { e.currentTarget.style.background = "var(--cream-50)" }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--ink-500)" }}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="12" y1="11" x2="12" y2="17"/>
        <polyline points="9 14 12 17 15 14"/>
      </svg>
      Exporter
    </button>
  )
}
