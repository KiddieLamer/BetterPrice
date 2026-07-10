import { ImageResponse } from "next/og";

export const alt = "BetterPrice — Cek Harga Termurah dari Semua Toko Shopee";
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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #166534 100%)",
          color: "white",
          fontFamily: "sans-serif",
          padding: "80px",
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 700, marginBottom: 24, opacity: 0.85 }}>
          BetterPrice
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: "-2px",
          }}
        >
          Temukan Harga Termurah
        </div>
        <div style={{ fontSize: 34, marginTop: 28, opacity: 0.75, textAlign: "center" }}>
          Paste link Shopee, cek harga dari semua toko dalam satu klik
        </div>
        <div
          style={{
            display: "flex",
            gap: 40,
            marginTop: 52,
            fontSize: 28,
            opacity: 0.85,
          }}
        >
          <span>01 — Paste link</span>
          <span>02 — Cari harga</span>
          <span>03 — Beli hemat</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
