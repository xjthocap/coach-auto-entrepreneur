// Squelette de chargement générique pour toutes les pages app
// S'affiche instantanément au clic, remplacé par la vraie page dès qu'elle est prête

export default function PageSkeleton() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--cream-100)",
        display: "flex",
      }}
    >
      {/* Sidebar placeholder (desktop) */}
      <div
        className="hidden lg:block"
        style={{ width: 240, flexShrink: 0, background: "var(--cream-50)", borderRight: "1px solid var(--cream-300)" }}
      />

      {/* Contenu principal */}
      <div style={{ flex: 1, padding: "0 0 80px" }}>
        {/* Topbar */}
        <div
          style={{
            height: 56,
            borderBottom: "1px solid var(--cream-300)",
            background: "var(--cream-50)",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Bone style={{ width: 120, height: 18, borderRadius: 8 }} />
          <div style={{ flex: 1 }} />
          <Bone style={{ width: 80, height: 32, borderRadius: 10 }} />
        </div>

        {/* Corps */}
        <div style={{ padding: "24px 16px", maxWidth: 900, margin: "0 auto" }}>
          {/* Cartes de stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 12,
              marginBottom: 20,
            }}
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  background: "var(--cream-50)",
                  borderRadius: "var(--r-lg, 16px)",
                  padding: 20,
                  border: "1px solid var(--cream-300)",
                }}
              >
                <Bone style={{ width: 80, height: 12, borderRadius: 6, marginBottom: 12 }} />
                <Bone style={{ width: "60%", height: 28, borderRadius: 8 }} />
              </div>
            ))}
          </div>

          {/* Bloc principal */}
          <div
            style={{
              background: "var(--cream-50)",
              borderRadius: "var(--r-lg, 16px)",
              padding: 20,
              border: "1px solid var(--cream-300)",
            }}
          >
            <Bone style={{ width: 140, height: 16, borderRadius: 6, marginBottom: 20 }} />
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  paddingBlock: 12,
                  borderBottom: i < 5 ? "1px solid var(--cream-300)" : "none",
                }}
              >
                <Bone style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <Bone style={{ width: "50%", height: 12, borderRadius: 6, marginBottom: 6 }} />
                  <Bone style={{ width: "30%", height: 10, borderRadius: 6 }} />
                </div>
                <Bone style={{ width: 70, height: 16, borderRadius: 6 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Composant d'os de squelette avec animation pulse
function Bone({ style }: { style: React.CSSProperties }) {
  return (
    <div
      style={{
        background: "var(--cream-300, #E5E4EB)",
        animation: "pulse 1.5s ease-in-out infinite",
        ...style,
      }}
    />
  )
}
