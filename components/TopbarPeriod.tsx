"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"

const MONTHS_SHORT = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"]
const QUARTERS = ["T1", "T2", "T3", "T4"]

type Props = {
  label: string
  frequency: "monthly" | "quarterly"
  /** chemin de base, ex: "/dashboard", "/revenues", "/Expenses" */
  basePath: string
  /** date courante au format "YYYY-MM-DD" */
  currentDate: string
  addAnchor?: string
  /** Mode compact : affiche seulement la pill période, sans cloche ni bouton Ajouter */
  compact?: boolean
}

function pad(n: number) {
  return String(n).padStart(2, "0")
}

export default function TopbarPeriod({
  label,
  frequency,
  basePath,
  currentDate,
  addAnchor = "quick-add",
  compact = false,
}: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Année affichée dans le picker (initialisée sur l'année courante)
  const currentYear = parseInt(currentDate.split("-")[0])
  const currentMonth = parseInt(currentDate.split("-")[1]) - 1 // 0-indexed
  const currentQuarter = Math.floor(currentMonth / 3)
  const [pickerYear, setPickerYear] = useState(currentYear)

  // Close on outside click
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [])

  // Reset picker year quand on ouvre
  useEffect(() => {
    if (open) setPickerYear(currentYear)
  }, [open, currentYear])

  function navigate(year: number, month0: number) {
    const url = `${basePath}?date=${year}-${pad(month0 + 1)}-01`
    router.push(url)
    setOpen(false)
  }

  function scrollToAdd() {
    const el = document.getElementById(addAnchor)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const isCurrentPeriod = (year: number, month0: number) => {
    if (frequency === "monthly") return year === currentYear && month0 === currentMonth
    return year === currentYear && Math.floor(month0 / 3) === currentQuarter
  }

  if (compact) {
    return (
      <div ref={ref} style={{ position: "relative" }}>
        <button
          onClick={() => setOpen(v => !v)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            borderRadius: 999,
            border: "1px solid var(--cream-300)",
            background: "var(--cream-50)",
            padding: "6px 12px",
            fontSize: 13, fontWeight: 500,
            color: "var(--ink-700)",
            cursor: "pointer", whiteSpace: "nowrap",
          }}
        >
          <span className="pulsing-dot inline-block h-1.5 w-1.5 rounded-full shrink-0" style={{ background: "var(--lime-500)" }} />
          {label}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ flexShrink: 0, transition: "transform 0.15s", transform: open ? "rotate(180deg)" : "rotate(0deg)", color: "var(--ink-400)" }}>
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {open && (
          <div style={{
            position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 50,
            borderRadius: "var(--r-md)", border: "1px solid var(--cream-200)",
            background: "var(--cream-50)", boxShadow: "var(--shadow-lg)",
            width: frequency === "monthly" ? 252 : 220, padding: 12,
            animation: "fade-up 0.15s ease-out both",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <button onClick={() => setPickerYear(y => y - 1)} style={{ width: 28, height: 28, borderRadius: "var(--r-sm)", border: "1px solid var(--cream-200)", background: "var(--cream-100)", color: "var(--ink-500)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-900)" }}>{pickerYear}</span>
              <button onClick={() => setPickerYear(y => y + 1)} style={{ width: 28, height: 28, borderRadius: "var(--r-sm)", border: "1px solid var(--cream-200)", background: "var(--cream-100)", color: "var(--ink-500)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
            {frequency === "monthly" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>
                {MONTHS_SHORT.map((m, i) => {
                  const active = isCurrentPeriod(pickerYear, i)
                  return (
                    <button key={m} onClick={() => navigate(pickerYear, i)}
                      style={{ padding: "7px 0", borderRadius: "var(--r-sm)", border: "none", background: active ? "var(--ink-900)" : "transparent", color: active ? "var(--violet-500)" : "var(--ink-600)", fontSize: 12, fontWeight: active ? 600 : 400, cursor: "pointer" }}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.background = "var(--cream-100)" }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent" }}>
                      {m}
                    </button>
                  )
                })}
              </div>
            )}
            {frequency === "quarterly" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>
                {QUARTERS.map((q, i) => {
                  const month0 = i * 3
                  const active = isCurrentPeriod(pickerYear, month0)
                  return (
                    <button key={q} onClick={() => navigate(pickerYear, month0)}
                      style={{ padding: "10px 0", borderRadius: "var(--r-sm)", border: "none", background: active ? "var(--ink-900)" : "transparent", color: active ? "var(--violet-500)" : "var(--ink-600)", fontSize: 13, fontWeight: active ? 600 : 400, cursor: "pointer" }}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.background = "var(--cream-100)" }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent" }}>
                      {q}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    )
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
            width="12" height="12" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
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

        {/* ── Dropdown picker ── */}
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
              width: frequency === "monthly" ? 252 : 220,
              padding: 12,
              animation: "fade-up 0.15s ease-out both",
            }}
          >
            {/* Year nav */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <button
                onClick={() => setPickerYear(y => y - 1)}
                style={{ width: 28, height: 28, borderRadius: "var(--r-sm)", border: "1px solid var(--cream-200)", background: "var(--cream-100)", color: "var(--ink-500)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-900)" }}>{pickerYear}</span>
              <button
                onClick={() => setPickerYear(y => y + 1)}
                style={{ width: 28, height: 28, borderRadius: "var(--r-sm)", border: "1px solid var(--cream-200)", background: "var(--cream-100)", color: "var(--ink-500)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>

            {/* Monthly grid */}
            {frequency === "monthly" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>
                {MONTHS_SHORT.map((m, i) => {
                  const active = isCurrentPeriod(pickerYear, i)
                  return (
                    <button
                      key={m}
                      onClick={() => navigate(pickerYear, i)}
                      style={{
                        padding: "7px 0",
                        borderRadius: "var(--r-sm)",
                        border: "none",
                        background: active ? "var(--ink-900)" : "transparent",
                        color: active ? "var(--violet-500)" : "var(--ink-600)",
                        fontSize: 12,
                        fontWeight: active ? 600 : 400,
                        cursor: "pointer",
                      }}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.background = "var(--cream-100)" }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent" }}
                    >
                      {m}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Quarterly grid */}
            {frequency === "quarterly" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>
                {QUARTERS.map((q, i) => {
                  const month0 = i * 3
                  const active = isCurrentPeriod(pickerYear, month0)
                  return (
                    <button
                      key={q}
                      onClick={() => navigate(pickerYear, month0)}
                      style={{
                        padding: "10px 0",
                        borderRadius: "var(--r-sm)",
                        border: "none",
                        background: active ? "var(--ink-900)" : "transparent",
                        color: active ? "var(--violet-500)" : "var(--ink-600)",
                        fontSize: 13,
                        fontWeight: active ? 600 : 400,
                        cursor: "pointer",
                      }}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.background = "var(--cream-100)" }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent" }}
                    >
                      {q}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Bell ── */}
      <button
        title="Notifications"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 36, height: 36,
          borderRadius: 999,
          border: "1px solid var(--cream-300)",
          background: "var(--cream-50)",
          color: "var(--ink-500)",
          cursor: "pointer", flexShrink: 0,
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </button>

      {/* ── + Ajouter ── */}
      <button
        onClick={scrollToAdd}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          borderRadius: 999, border: "none",
          background: "var(--ink-900)", color: "var(--cream-50)",
          padding: "8px 16px", fontSize: 13, fontWeight: 600,
          cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap",
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
