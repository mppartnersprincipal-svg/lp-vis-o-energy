import { ImageResponse } from "next/og";

export const alt = "Visão Energy: economize até 95% na sua conta de luz";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "#07070a",
          color: "#f6f3ec",
          padding: "0 80px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -120,
            top: 60,
            width: 620,
            height: 620,
            borderRadius: 9999,
            background: "linear-gradient(100deg, #ffe01a 0%, #ffc107 28%, #f7931e 62%, #e5332a 100%)",
            boxShadow: "0 0 160px rgba(247,147,30,0.55)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 680 }}>
          <div style={{ fontSize: 26, letterSpacing: 6, color: "#ffc107" }}>VISÃO ENERGY · GOIÂNIA</div>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1, marginTop: 24, letterSpacing: -3 }}>
            Economize até 95% na sua conta de luz.
          </div>
          <div style={{ fontSize: 30, marginTop: 28, color: "#a6a3ae" }}>
            +1.000 usinas · 12 anos de garantia · 90 dias de carência
          </div>
        </div>
      </div>
    ),
    size,
  );
}
