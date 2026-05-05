"use client"

import { useState, useRef, useEffect, useCallback } from "react"

type Message = {
  role: "user" | "assistant"
  content: string
}

const SUGGESTIONS = [
  "Je peux m'acheter un MacBook Pro ?",
  "Combien puis-je me payer ce mois ?",
  "Est-ce que mon activité est rentable ?",
  "Quand est mon prochain prélèvement URSSAF ?",
  "J'ai besoin d'un nouveau bureau, bonne idée ?",
]

function MarkdownText({ text }: { text: string }) {
  // Render **bold** inline
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**")
          ? <strong key={i}>{part.slice(2, -2)}</strong>
          : <span key={i}>{part}</span>
      )}
    </>
  )
}

function MessageBubble({ msg, isLast }: { msg: Message; isLast: boolean }) {
  const isUser = msg.role === "user"
  return (
    <div style={{
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      gap: 8,
      alignItems: "flex-end",
    }}>
      {!isUser && (
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
          display: "grid", placeItems: "center",
          color: "white", fontSize: 12, fontWeight: 700,
          flexShrink: 0,
        }}>K</div>
      )}
      <div style={{
        maxWidth: "82%",
        padding: "10px 14px",
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        background: isUser ? "var(--ink-900, #25034E)" : "var(--cream-200, #F1F5F1)",
        color: isUser ? "white" : "var(--ink-900, #25034E)",
        fontSize: 14,
        lineHeight: 1.55,
        wordBreak: "break-word",
      }}>
        {msg.content === "…" ? (
          <span style={{ display: "flex", gap: 4, alignItems: "center", padding: "2px 0" }}>
            {[0, 0.2, 0.4].map((delay, i) => (
              <span key={i} style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "var(--ink-400, #7550A8)",
                animation: "chatDot 1.2s infinite",
                animationDelay: `${delay}s`,
              }} />
            ))}
          </span>
        ) : (
          <MarkdownText text={msg.content} />
        )}
      </div>
    </div>
  )
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)")
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  // Écoute le bouton topbar mobile
  useEffect(() => {
    function onOpenChat() { setOpen(true) }
    window.addEventListener("open-chat", onOpenChat)
    return () => window.removeEventListener("open-chat", onOpenChat)
  }, [])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    if (open) {
      scrollToBottom()
      setTimeout(() => inputRef.current?.focus(), 100)
      setHasUnread(false)
    }
  }, [open, messages, scrollToBottom])

  async function sendMessage(content: string) {
    if (!content.trim() || loading) return

    const userMsg: Message = { role: "user", content: content.trim() }
    const newMessages = [...messages, userMsg]
    setMessages([...newMessages, { role: "assistant", content: "…" }])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        setMessages([...newMessages, {
          role: "assistant",
          content: err.error === "Premium requis"
            ? "Cette fonctionnalité est réservée aux membres Premium. 🔒"
            : "Désolé, une erreur s'est produite. Réessaie dans un instant.",
        }])
        return
      }

      // Streaming
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulated = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          accumulated += decoder.decode(value, { stream: true })
          setMessages([...newMessages, { role: "assistant", content: accumulated }])
        }
      }

      if (!open) setHasUnread(true)
    } catch {
      setMessages([...newMessages, {
        role: "assistant",
        content: "Impossible de contacter le Coach IA. Vérifie ta connexion.",
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const showSuggestions = messages.length === 0

  return (
    <>
      <style>{`
        @keyframes chatDot {
          0%, 60%, 100% { transform: translateY(0); opacity: .5; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes chatPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(124,58,237,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(124,58,237,0); }
        }
        .chat-input:focus { outline: none; }
        .chat-suggestion:hover {
          background: var(--cream-300, #E5E4EB) !important;
        }
        .chat-send:hover:not(:disabled) {
          background: #6D28D9 !important;
        }
        .chat-send:disabled { opacity: 0.5; cursor: default; }

        /* Bulle flottante cachée sur mobile — remplacée par le bouton topbar */
        @media (max-width: 768px) {
          .chat-fab { display: none !important; }
        }

      `}</style>

      {/* ── Chat panel — rendu séparé de la bulle pour ne pas être masqué sur mobile ── */}
      {open && (
        <div style={isMobile ? {
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100dvh",
          background: "white",
          borderRadius: 0,
          boxShadow: "none",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 10000,
          animation: "chatSlideUp 0.2s ease",
        } : {
          position: "fixed",
          bottom: 92,
          right: 24,
          width: 380,
          maxWidth: "calc(100vw - 48px)",
          height: 520,
          maxHeight: "calc(100vh - 120px)",
          background: "white",
          borderRadius: 20,
          boxShadow: "0 24px 64px rgba(37,3,78,0.18), 0 0 0 1px rgba(37,3,78,0.06)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 9998,
          animation: "chatSlideUp 0.2s ease",
        }}>
            {/* Header */}
            <div style={{
              padding: "16px 20px",
              background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexShrink: 0,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                display: "grid", placeItems: "center",
                fontSize: 16, fontWeight: 700,
              }}>K</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>Coach IA</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  {loading ? "En train de répondre…" : "Pose-moi une question sur tes finances"}
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  borderRadius: 8,
                  color: "white",
                  width: 36, height: 36,
                  cursor: "pointer",
                  display: "grid", placeItems: "center",
                  fontSize: 18, lineHeight: 1,
                }}
              >×</button>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 16px 8px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}>
              {showSuggestions && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <p style={{
                    fontSize: 13,
                    color: "var(--ink-500, #6B489A)",
                    textAlign: "center",
                    margin: "8px 0 4px",
                  }}>
                    Bonjour 👋 Je connais ta situation financière en temps réel. Pose-moi n&apos;importe quelle question.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 4 }}>
                    {SUGGESTIONS.map(s => (
                      <button
                        key={s}
                        className="chat-suggestion"
                        onClick={() => sendMessage(s)}
                        style={{
                          fontSize: 12,
                          padding: "6px 12px",
                          borderRadius: 999,
                          border: "1px solid var(--cream-300, #E5E4EB)",
                          background: "var(--cream-100, #F8F7FC)",
                          color: "var(--ink-900, #25034E)",
                          cursor: "pointer",
                          transition: "background 0.15s",
                          textAlign: "left",
                          lineHeight: 1.4,
                        }}
                      >{s}</button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} isLast={i === messages.length - 1} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Disclaimer */}
            <div style={{
              padding: "6px 16px",
              background: "var(--cream-100, #F8F7FC)",
              borderTop: "1px solid var(--cream-300, #E5E4EB)",
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexShrink: 0,
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--ink-400, #7550A8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span style={{ fontSize: 10.5, color: "var(--ink-400, #7550A8)", lineHeight: 1.4 }}>
                Réponses indicatives — vérifie toujours par toi-même ou avec un comptable.
              </span>
            </div>

            {/* Input */}
            <div style={{
              padding: "12px 16px",
              borderTop: "1px solid var(--cream-300, #E5E4EB)",
              display: "flex",
              gap: 8,
              flexShrink: 0,
              background: "white",
            }}>
              <input
                ref={inputRef}
                className="chat-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ex : je peux acheter un iPad ?"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "1px solid var(--cream-300, #E5E4EB)",
                  background: "var(--cream-100, #F8F7FC)",
                  fontSize: 14,
                  color: "var(--ink-900, #25034E)",
                  resize: "none",
                }}
              />
              <button
                className="chat-send"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                style={{
                  width: 40, height: 40,
                  borderRadius: 12,
                  background: "#7C3AED",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  display: "grid", placeItems: "center",
                  flexShrink: 0,
                  transition: "background 0.15s",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
        </div>
      )}

      {/* ── Bulle flottante — cachée sur mobile (remplacée par bouton topbar) ── */}
      <div className="chat-fab" style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
      }}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            width: 52, height: 52,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
            border: "none",
            cursor: "pointer",
            display: "grid", placeItems: "center",
            boxShadow: "0 8px 24px rgba(124,58,237,0.35)",
            transition: "transform 0.15s, box-shadow 0.15s",
            animation: hasUnread ? "chatPulse 2s infinite" : "none",
            position: "relative",
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          title="Coach IA — pose une question sur tes finances"
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          )}
          {hasUnread && (
            <span style={{
              position: "absolute", top: 2, right: 2,
              width: 12, height: 12, borderRadius: "50%",
              background: "#EF4444",
              border: "2px solid white",
            }} />
          )}
        </button>
      </div>
    </>
  )
}
