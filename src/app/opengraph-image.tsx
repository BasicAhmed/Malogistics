import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "MA Logistics — Freight Forwarding, Southern Africa";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          backgroundColor: "#3C0008",
          color: "#F4F1EC",
          fontFamily: "Helvetica",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 32, fontWeight: 700, marginBottom: 24 }}>
          <span>M</span>
          <span style={{ color: "#E8A33D", margin: "0 6px" }}>/</span>
          <span>MA Logistics</span>
        </div>
        <div style={{ display: "flex", fontSize: 72, fontWeight: 800, lineHeight: 1.05, maxWidth: 900 }}>
          We arrange it. You forget the hassle.
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#D8C9CC", marginTop: 28 }}>
          Freight Forwarding · South Africa &amp; the SADC corridor
        </div>
      </div>
    ),
    { ...size }
  );
}
