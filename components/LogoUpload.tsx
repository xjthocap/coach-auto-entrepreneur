"use client"

import { useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"

type Props = {
  userId: string
  initialLogoUrl?: string | null
  onUpdate?: (url: string | null) => void
}

const MAX_SIZE_MB = 2
const ACCEPTED = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml"]

export default function LogoUpload({ userId, initialLogoUrl, onUpdate }: Props) {
  const supabase = createClient()
  const inputRef = useRef<HTMLInputElement>(null)

  const [logoUrl, setLogoUrl] = useState<string | null>(initialLogoUrl ?? null)
  const [uploading, setUploading] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [error, setError] = useState("")

  async function handleFile(file: File) {
    setError("")

    if (!ACCEPTED.includes(file.type)) {
      setError("Format non supporté. Utilise PNG, JPG, WebP ou SVG.")
      return
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Fichier trop lourd (max ${MAX_SIZE_MB} Mo).`)
      return
    }

    setUploading(true)
    try {
      const ext = file.name.split(".").pop() ?? "png"
      const path = `${userId}/logo.${ext}`

      // Upload (upsert = remplace si déjà existant)
      const { error: uploadErr } = await supabase.storage
        .from("Logos")
        .upload(path, file, { upsert: true, contentType: file.type })

      if (uploadErr) throw uploadErr

      // URL publique
      const { data } = supabase.storage.from("Logos").getPublicUrl(path)
      // Cache-bust pour forcer le rechargement de l'image
      const url = `${data.publicUrl}?t=${Date.now()}`

      // Sauvegarde dans profiles
      const { error: dbErr } = await supabase
        .from("profiles")
        .update({ logo_url: data.publicUrl })
        .eq("id", userId)

      if (dbErr) throw dbErr

      setLogoUrl(url)
      onUpdate?.(data.publicUrl)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur lors de l'upload"
      setError(msg)
    } finally {
      setUploading(false)
    }
  }

  async function handleRemove() {
    setError("")
    setRemoving(true)
    try {
      // On liste les fichiers du dossier utilisateur pour trouver le logo
      const { data: files } = await supabase.storage
        .from("Logos")
        .list(userId)

      if (files && files.length > 0) {
        const paths = files.map((f) => `${userId}/${f.name}`)
        await supabase.storage.from("Logos").remove(paths)
      }

      await supabase
        .from("profiles")
        .update({ logo_url: null })
        .eq("id", userId)

      setLogoUrl(null)
      onUpdate?.(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur lors de la suppression"
      setError(msg)
    } finally {
      setRemoving(false)
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>

        {/* Preview / placeholder */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "var(--r-sm)",
            border: `2px dashed ${logoUrl ? "var(--cream-300)" : "var(--cream-300)"}`,
            background: logoUrl ? "var(--cream-50)" : "var(--cream-100)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt="Logo entreprise"
              style={{ width: "100%", height: "100%", objectFit: "contain", padding: 6 }}
            />
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--ink-400)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                borderRadius: "var(--r-sm)",
                border: "1px solid var(--cream-300)",
                background: "var(--cream-50)",
                color: "var(--ink-700)",
                padding: "8px 14px",
                fontSize: 13,
                fontWeight: 600,
                cursor: uploading ? "default" : "pointer",
                opacity: uploading ? 0.6 : 1,
              }}
            >
              {uploading ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Upload…
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  {logoUrl ? "Remplacer" : "Uploader le logo"}
                </>
              )}
            </button>

            {logoUrl && (
              <button
                onClick={handleRemove}
                disabled={removing}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  borderRadius: "var(--r-sm)",
                  border: "1px solid rgba(251,113,133,0.3)",
                  background: "rgba(251,113,133,0.06)",
                  color: "var(--rose-600, #e11d48)",
                  padding: "8px 14px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: removing ? "default" : "pointer",
                  opacity: removing ? 0.6 : 1,
                }}
              >
                {removing ? "Suppression…" : "Supprimer"}
              </button>
            )}
          </div>

          <p style={{ fontSize: 11, color: "var(--ink-400)" }}>
            PNG, JPG, WebP ou SVG · max {MAX_SIZE_MB} Mo · recommandé : fond transparent
          </p>
        </div>
      </div>

      {error && (
        <p style={{ fontSize: 12, color: "var(--rose-500)", padding: "6px 10px", background: "rgba(251,113,133,0.08)", borderRadius: "var(--r-sm)", border: "1px solid rgba(251,113,133,0.2)" }}>
          {error}
        </p>
      )}

      {/* Input caché */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        style={{ display: "none" }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = "" }}
      />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
