"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

type Status = "draft" | "sent" | "paid"

const STATUS_CONFIG: Record<Status, { label: string; bg: string; color: string }> = {
  draft: {
    label: "À envoyer",
    bg: "rgba(0,0,0,0.07)",
    color: "var(--ink-500)",
  },
  sent: {
    label: "Envoyée",
    bg: "rgba(99,102,241,0.12)",
    color: "#4f46e5",
  },
  paid: {
    label: "Payée",
    bg: "rgba(101,163,13,0.12)",
    color: "var(--lime-700, #4d7c0f)",
  },
}

export default function InvoiceStatusBadge({
  invoiceId,
  status: initialStatus,
  invoiceNumber,
}: {
  invoiceId: string
  status: Status
  invoiceNumber?: string | null
}) {
  const router = useRouter()
  const [status, setStatus] = useState<Status>(initialStatus)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const config = STATUS_CONFIG[status]

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  async function handleSelect(newStatus: Status) {
    if (newStatus === status) {
      setOpen(false)
      return
    }
    setLoading(true)
    setOpen(false)
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setStatus(newStatus)
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      ref={containerRef}
      style={{ display: "inline-flex", alignItems: "center", gap: 6, position: "relative" }}
    >
      {invoiceNumber && (
        <span
          style={{
            fontSize: 11,
            color: "var(--ink-400)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          #{invoiceNumber}
        </span>
      )}

      <button
        onClick={() => !loading && setOpen((v) => !v)}
        disabled={loading}
        style={{
          fontSize: 11,
          padding: "2px 8px",
          borderRadius: 999,
          background: config.bg,
          color: config.color,
          border: "none",
          cursor: loading ? "default" : "pointer",
          fontWeight: 600,
          lineHeight: 1.6,
          opacity: loading ? 0.6 : 1,
          transition: "opacity 0.15s",
        }}
      >
        {config.label}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            zIndex: 50,
            background: "var(--cream-50, #fff)",
            border: "1px solid var(--cream-200, #e5e7eb)",
            borderRadius: 10,
            boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
            minWidth: 130,
            overflow: "hidden",
          }}
        >
          {(Object.keys(STATUS_CONFIG) as Status[]).map((s) => {
            const c = STATUS_CONFIG[s]
            return (
              <button
                key={s}
                onClick={() => handleSelect(s)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  padding: "7px 12px",
                  border: "none",
                  background: s === status ? "var(--cream-100, #f5f5f5)" : "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: 12,
                  color: "var(--ink-900)",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    padding: "1px 7px",
                    borderRadius: 999,
                    background: c.bg,
                    color: c.color,
                    fontWeight: 600,
                    lineHeight: 1.6,
                  }}
                >
                  {c.label}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
