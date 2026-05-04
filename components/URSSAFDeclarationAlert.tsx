"use client"

import { useState, useEffect } from "react"

type Props = {
  periodLabel: string      // ex : "Avril 2026" — clé de dismissal
  deadlineFormatted: string
  daysUntilDeadline: number
}

export default function URSSAFDeclarationAlert({
  periodLabel,
  deadlineFormatted,
  daysUntilDeadline,
}: Props) {
  const storageKey = `urssaf_declared_${periodLabel}`
  const [dismissed, setDismissed] = useState(true) // true = caché par défaut (évite flash)

  useEffect(() => {
    setDismissed(localStorage.getItem(storageKey) === "1")
  }, [storageKey])

  if (dismissed) return null

  function handleDone() {
    localStorage.setItem(storageKey, "1")
    setDismissed(true)
    // Notify TopbarPeriod (same tab — storage event doesn't fire within same tab)
    window.dispatchEvent(new CustomEvent("urssaf-dismissed", { detail: { key: storageKey } }))
  }

  return (
    <section
      className="flex items-start gap-3 px-5 py-4"
      style={{
        background: "var(--rose-100)",
        borderRadius: "var(--r-md)",
        border: "1px solid rgba(251,113,133,0.35)",
      }}
    >
      {/* Icône calendrier */}
      <span
        style={{
          flexShrink: 0,
          width: 32,
          height: 32,
          borderRadius: "var(--r-sm)",
          background: "var(--rose-500)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 1,
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </span>

      {/* Texte */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold" style={{ color: "var(--rose-500)" }}>
          Période {periodLabel} — déclaration en cours
        </p>
        <p className="mt-0.5 text-sm" style={{ color: "var(--rose-500)" }}>
          Tu es dans la fenêtre de déclaration. Soumets ton chiffre d&apos;affaires sur autoentrepreneur.urssaf.fr avant le{" "}
          <strong>{deadlineFormatted}</strong>
          {daysUntilDeadline <= 5 && (
            <span
              style={{
                marginLeft: 8,
                borderRadius: 999,
                background: "var(--rose-500)",
                padding: "2px 8px",
                fontSize: 11,
                fontWeight: 700,
                color: "white",
              }}
            >
              {daysUntilDeadline === 0 ? "Dernier jour !" : `J-${daysUntilDeadline}`}
            </span>
          )}
          .
        </p>
      </div>

      {/* Bouton C'est fait */}
      <button
        onClick={handleDone}
        style={{
          flexShrink: 0,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 14px",
          borderRadius: "var(--r-sm)",
          border: "1px solid rgba(229,101,75,0.35)",
          background: "white",
          color: "var(--rose-500)",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          transition: "background 0.15s",
          whiteSpace: "nowrap",
          alignSelf: "center",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(229,101,75,0.08)")}
        onMouseLeave={e => (e.currentTarget.style.background = "white")}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        C&apos;est fait
      </button>
    </section>
  )
}
