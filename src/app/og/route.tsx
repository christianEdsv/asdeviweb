import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const contentType = "image/png";

/** Imagen Open Graph por defecto (1200 × 630). */
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "radial-gradient(circle at 20% 0%, rgba(0,0,128,0.85), transparent 60%), radial-gradient(circle at 85% 20%, rgba(255,213,0,0.25), transparent 55%), #000053",
          color: "#f5f8fc",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "28px",
            fontWeight: 700,
            color: "#ffd500",
          }}
        >
          {siteConfig.name} · {siteConfig.legalName}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: "64px",
              lineHeight: 1.08,
              fontWeight: 800,
              maxWidth: "960px",
            }}
          >
            {siteConfig.tagline}
          </div>
          <div
            style={{
              fontSize: "26px",
              color: "#c4d2ec",
              maxWidth: "860px",
            }}
          >
            Estudios Indie · Desarrolladores Independientes · Aliados Académicos
          </div>
        </div>

        <div style={{ fontSize: "22px", color: "#fdc500" }}>
          {siteConfig.url.replace(/^https?:\/\//, "")}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
