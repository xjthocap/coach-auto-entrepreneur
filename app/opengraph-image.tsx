import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "keskireste. — Ton vrai solde, sans prise de tête."
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          background: "#25034E",
          position: "relative",
          overflow: "hidden",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Glow radial top-right */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(196,181,253,0.18) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        {/* Glow radial bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(196,181,253,0.1) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            padding: "64px 80px",
            position: "relative",
          }}
        >
          {/* Logo mark + name */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {/* Icon */}
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "#C4B5FD",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: 8,
                  right: 8,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "#7C3AED",
                  border: "2.5px solid #C4B5FD",
                  display: "flex",
                }}
              />
            </div>
            {/* Name */}
            <div
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: "#F8F7FC",
                letterSpacing: "-0.03em",
                display: "flex",
              }}
            >
              keskireste
              <span style={{ color: "#C4B5FD" }}>.</span>
            </div>
          </div>

          {/* Main headline */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                fontSize: 72,
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span>Ton vrai solde.</span>
              <span style={{ color: "#C4B5FD" }}>Sans prise de tête.</span>
            </div>

            <div
              style={{
                fontSize: 26,
                color: "#B8A5D5",
                lineHeight: 1.4,
                fontWeight: 400,
                display: "flex",
              }}
            >
              Revenus · URSSAF · Impôt · Dépenses — tout en un.
            </div>
          </div>

          {/* Bottom row : stats + CTA */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* Pills */}
            <div style={{ display: "flex", gap: 12 }}>
              {["Auto-entrepreneur", "Micro-entreprise", "Freelance"].map((label) => (
                <div
                  key={label}
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#C4B5FD",
                    background: "rgba(196,181,253,0.12)",
                    border: "1px solid rgba(196,181,253,0.25)",
                    borderRadius: 999,
                    padding: "8px 18px",
                    display: "flex",
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* CTA pill */}
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#25034E",
                background: "#C4B5FD",
                borderRadius: 999,
                padding: "14px 32px",
                letterSpacing: "-0.01em",
                display: "flex",
              }}
            >
              keskireste.fr →
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
