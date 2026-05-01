"use client"

type PremiumLockCardProps = {
  title: string
  description: string
  bullets?: string[]
  children: React.ReactNode
  onUpgradeClick?: () => void
}

export default function PremiumLockCard({
  title,
  description,
  bullets = [],
  children,
  onUpgradeClick,
}: PremiumLockCardProps) {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "var(--r-xl)",
        border: "1px solid var(--cream-200)",
        background: "var(--cream-50)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      {/* Blurred preview */}
      <div style={{ pointerEvents: "none", userSelect: "none", filter: "blur(5px)", opacity: 0.55 }}>
        <div style={{ padding: 24 }}>{children}</div>
      </div>

      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(248, 247, 252, 0.6)",
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Lock panel */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 400,
            borderRadius: "var(--r-lg)",
            border: "1px solid var(--cream-200)",
            background: "var(--cream-50)",
            padding: 28,
            textAlign: "center",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: "var(--r-sm)",
              background: "var(--ink-900)",
              marginBottom: 14,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--violet-500)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>

          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--violet-700)",
              marginBottom: 8,
            }}
          >
            Premium
          </p>

          <h3
            style={{
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "var(--ink-900)",
              marginBottom: 10,
            }}
          >
            {title}
          </h3>

          <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--ink-500)", marginBottom: 16 }}>
            {description}
          </p>

          {bullets.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20, textAlign: "left" }}>
              {bullets.map((bullet, index) => (
                <div
                  key={index}
                  style={{
                    borderRadius: "var(--r-sm)",
                    background: "var(--cream-100)",
                    padding: "10px 14px",
                    fontSize: 13,
                    color: "var(--ink-700)",
                  }}
                >
                  <span style={{ marginRight: 8, fontWeight: 700, color: "var(--violet-700)" }}>•</span>
                  {bullet}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={onUpgradeClick}
            style={{
              width: "100%",
              borderRadius: "var(--r-sm)",
              border: "none",
              background: "var(--ink-900)",
              color: "var(--violet-500)",
              padding: "12px 16px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "var(--shadow-md)",
            }}
          >
            Passer en Premium
          </button>

          <p style={{ marginTop: 10, fontSize: 12, color: "var(--ink-400)" }}>
            Débloque toutes les fonctionnalités avancées
          </p>
        </div>
      </div>
    </div>
  )
}
