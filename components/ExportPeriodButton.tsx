"use client"

type Props = {
  date?: string
  iconOnly?: boolean
}

export default function ExportPeriodButton({ date, iconOnly = false }: Props) {
  function handleExport() {
    const url = date
      ? `/api/export/period?date=${date}`
      : "/api/export/period"
    window.location.href = url
  }

  return (
    <button
      onClick={handleExport}
      title="Exporter la période en Excel"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: iconOnly ? 0 : 6,
        borderRadius: iconOnly ? "var(--r-sm)" : 999,
        border: "1px solid var(--cream-300)",
        background: "var(--cream-50)",
        padding: iconOnly ? "7px" : "7px 14px",
        width: iconOnly ? 34 : undefined,
        height: iconOnly ? 34 : undefined,
        fontSize: 13,
        fontWeight: 500,
        color: "var(--ink-700)",
        cursor: "pointer",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = "var(--cream-100)" }}
      onMouseLeave={e => { e.currentTarget.style.background = "var(--cream-50)" }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--ink-500)", flexShrink: 0 }}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="12" y1="11" x2="12" y2="17"/>
        <polyline points="9 14 12 17 15 14"/>
      </svg>
      {!iconOnly && "Exporter"}
    </button>
  )
}
