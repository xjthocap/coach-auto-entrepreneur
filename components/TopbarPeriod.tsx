"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"

type Props = {
  /** Ex: "T2 2026 · avr. → juin"  ou  "Avril 2026" */
  label: string
  prevUrl: string
  nextUrl: string
  /** id de la section à scroller pour le bouton + Ajouter */
  addAnchor?: string
}

export default function TopbarPeriod({
  label,
  prevUrl,
  nextUrl,
  addAnchor = "quick-add",
}: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [])

  function scrollToAdd() {
    const el = document.getElementById(addAnchor)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* ── Period pill ── */}
      <div ref={ref} style={{ position: "relative" }}>
        <button
          onClick={() => setOpen((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
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
        >
          <span
            className="pulsing-dot inline-block h-1.5 w-1.5 rounded-full shrink-0"
            style={{ background: "var(--lime-500)" }}
          />
          {label}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              flexShrink: 0,
              transition: "transform 0.15s",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              color: "var(--ink-400)",
            }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {/* Dropdown */}
        {open && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              zIndex: 50,
              borderRadius: "var(--r-md)",
              border: "1px solid var(--cream-200)",
              background: "var(--cream-50)",
              boxShadow: "var(--shadow-lg)",
              minWidth: 200,
              overflow: "hidden",
              animation: "fade-up 0.15s ease-out both",
            }}
          >
            <button
              onClick={() => { router.push(prevUrl); setOpen(false) }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "11px 16px",
                fontSize: 13,
                fontWeight: 500,
                color: "var(--ink-700)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                borderBottom: "1px solid var(--cream-200)",
                textAlign: "left",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--cream-100)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              Période précédente
            </button>
            <button
              onClick={() => { router.push(nextUrl); setOpen(false) }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "11px 16px",
                fontSize: 13,
                fontWeight: 500,
                color: "var(--ink-700)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--cream-100)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              Période suivante
            </button>
          </div>
        )}
      </div>

      {/* ── Bell ── */}
      <button
        title="Notifications"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          borderRadius: 999,
          border: "1px solid var(--cream-300)",
          background: "var(--cream-50)",
          color: "var(--ink-500)",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </button>

      {/* ── + Ajouter ── */}
      <button
        onClick={scrollToAdd}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          borderRadius: 999,
          border: "none",
          background: "var(--ink-900)",
          color: "var(--cream-50)",
          padding: "8px 16px",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Ajouter
      </button>
    </div>
  )
}
