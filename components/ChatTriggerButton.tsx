"use client"

/**
 * Bouton qui ouvre le ChatBot via un événement global.
 * Utilisé dans la topbar mobile pour éviter la bulle flottante.
 */
export default function ChatTriggerButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent("open-chat"))}
      title="Coach IA"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 40,
        borderRadius: 999,
        border: "none",
        background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
        color: "white",
        cursor: "pointer",
        flexShrink: 0,
        boxShadow: "0 4px 12px rgba(124,58,237,0.3)",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    </button>
  )
}
