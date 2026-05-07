"use client"

type Props = {
  year: number
  iconOnly?: boolean
}

export default function ExportYearButton({ year, iconOnly = false }: Props) {
  function handleExport() {
    window.location.href = `/api/export/year?year=${year}`
  }

  return (
    <button
      onClick={handleExport}
      title={`Exporter l'année ${year} en Excel`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: iconOnly ? 0 : 6,
        borderRadius: iconOnly ? "var(--r-sm)" : 999,
        border: "1px solid var(--cream-300)",
        background: "var(--cream-50)",
        padding: iconOnly ? "0" : "0 14px",
        width: iconOnly ? 34 : undefined,
        height: 34,
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
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
      {!iconOnly && `Année ${year}`}
    </button>
  )
}
