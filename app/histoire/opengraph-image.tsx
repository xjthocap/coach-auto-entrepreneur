import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Notre histoire — keskireste."
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
          background: "#1A0F2E",
          position: "relative",
          overflow: "hidden",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Texture grain subtile */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 80% 60% at 60% 30%, rgba(124,92,255,0.15) 0%, transparent 65%)",
            display: "flex",
          }}
        />

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
          {/* Tag + logo */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#9B7BFF",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span style={{ width: 32, height: 1, background: "#9B7BFF", display: "flex" }} />
              Notre histoire
              <span style={{ width: 32, height: 1, background: "#9B7BFF", display: "flex" }} />
            </div>

            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#FBFAF5",
                letterSpacing: "-0.03em",
                display: "flex",
              }}
            >
              keskireste<span style={{ color: "#7C5CFF" }}>.</span>
            </div>
          </div>

          {/* Main headline — italic serif feel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                fontSize: 68,
                fontWeight: 800,
                color: "#FBFAF5",
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span>Sept ans de</span>
              <span style={{ color: "#9B7BFF", fontStyle: "italic" }}>
                &ldquo;combien il me reste ?&rdquo;
              </span>
            </div>
            <div
              style={{
                fontSize: 22,
                color: "#BDA8FF",
                lineHeight: 1.5,
                fontWeight: 400,
                maxWidth: 700,
                display: "flex",
              }}
            >
              Un fichier Excel, des potes freelances, et l&apos;idée un peu folle d&apos;en faire un vrai produit.
            </div>
          </div>

          {/* Bottom */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "#7C5CFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: 6,
                  right: 6,
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#BDA8FF",
                  border: "2px solid #7C5CFF",
                  display: "flex",
                }}
              />
            </div>
            <span style={{ fontSize: 16, color: "#BDA8FF", display: "flex" }}>
              keskireste.fr/histoire
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
