"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { createClient } from "@/lib/supabase/client"

export default function DeleteAccountButton() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); setConfirm("") } }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open])

  async function handleDelete() {
    if (confirm !== "SUPPRIMER") return
    setLoading(true)
    setError("")
    try {
      const supabase = createClient()
      const res = await fetch("/api/account/delete", { method: "DELETE" })
      if (!res.ok) throw new Error("Erreur lors de la suppression")
      await supabase.auth.signOut()
      window.location.href = "/"
    } catch {
      setError("Une erreur est survenue. Réessaie ou contacte le support.")
      setLoading(false)
    }
  }

  const modal = open && mounted ? createPortal(
    <div
      onClick={() => { setOpen(false); setConfirm("") }}
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(15,23,42,0.65)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(3px)" }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: "var(--cream-50)", borderRadius: "var(--r-xl)", width: "100%", maxWidth: 420, boxShadow: "0 24px 64px rgba(15,23,42,0.3)", overflow: "hidden" }}
      >
        {/* Header */}
        <div style={{ background: "#FFF1F2", borderBottom: "1px solid rgba(251,113,133,0.2)", padding: "18px 24px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: "var(--r-sm)", background: "var(--rose-500)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--rose-500)" }}>Action irréversible</p>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--ink-900)", marginTop: 1 }}>Supprimer mon compte</h2>
          </div>
        </div>

        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ fontSize: 14, color: "var(--ink-600, #475569)", lineHeight: 1.7 }}>
            Cette action est <strong>définitive et irréversible</strong>. Toutes tes données seront effacées : revenus, dépenses, factures, paramètres.
          </p>

          <div style={{ borderRadius: "var(--r-sm)", background: "rgba(251,113,133,0.07)", border: "1px solid rgba(251,113,133,0.2)", padding: "10px 14px" }}>
            <p style={{ fontSize: 13, color: "var(--rose-600, #e11d48)", lineHeight: 1.6 }}>
              Pour confirmer, tape <strong>SUPPRIMER</strong> ci-dessous.
            </p>
          </div>

          <input
            type="text"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="SUPPRIMER"
            style={{
              width: "100%",
              borderRadius: "var(--r-sm)",
              border: `1px solid ${confirm === "SUPPRIMER" ? "var(--rose-500)" : "var(--cream-300)"}`,
              background: "var(--cream-100)",
              padding: "11px 14px",
              fontSize: 14,
              color: "var(--ink-900)",
              outline: "none",
              fontFamily: "var(--font-mono, monospace)",
              letterSpacing: "0.05em",
              boxSizing: "border-box",
            }}
          />

          {error && (
            <p style={{ fontSize: 13, color: "var(--rose-500)" }}>{error}</p>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => { setOpen(false); setConfirm("") }}
              style={{ flex: 1, borderRadius: "var(--r-sm)", border: "1px solid var(--cream-300)", background: "var(--cream-50)", color: "var(--ink-700)", padding: "11px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
            >
              Annuler
            </button>
            <button
              onClick={handleDelete}
              disabled={confirm !== "SUPPRIMER" || loading}
              style={{
                flex: 1,
                borderRadius: "var(--r-sm)",
                border: "none",
                background: confirm === "SUPPRIMER" ? "var(--rose-500)" : "var(--cream-200)",
                color: confirm === "SUPPRIMER" ? "white" : "var(--ink-400)",
                padding: "11px 16px",
                fontSize: 14,
                fontWeight: 700,
                cursor: confirm === "SUPPRIMER" && !loading ? "pointer" : "default",
                transition: "background 0.15s",
              }}
            >
              {loading ? "Suppression…" : "Supprimer définitivement"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  ) : null

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          borderRadius: "var(--r-sm)",
          border: "1px solid rgba(251,113,133,0.3)",
          background: "rgba(251,113,133,0.06)",
          color: "var(--rose-600, #e11d48)",
          padding: "10px 16px",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          transition: "background 0.15s",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(251,113,133,0.12)" }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(251,113,133,0.06)" }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M9 6V4h6v2"/>
        </svg>
        Supprimer mon compte
      </button>
      {modal}
    </>
  )
}
