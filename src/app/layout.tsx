import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://betterprice.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BetterPrice — Cek Harga Termurah dari Semua Toko Shopee",
    template: "%s | BetterPrice",
  },
  description:
    "Paste link Shopee, lihat harga termurah dari semua toko dalam satu klik. Bandingkan harga produk secara instan dan hemat lebih banyak.",
  keywords: [
    "cek harga shopee",
    "bandingkan harga",
    "harga termurah",
    "price comparison indonesia",
    "cek harga produk",
    "belanja hemat",
  ],
  authors: [{ name: "BetterPrice" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "BetterPrice",
    title: "BetterPrice — Cek Harga Termurah dari Semua Toko Shopee",
    description:
      "Paste link Shopee, lihat harga termurah dari semua toko dalam satu klik. Bandingkan harga produk secara instan.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BetterPrice — Cek Harga Termurah",
    description:
      "Paste link Shopee, lihat harga termurah dari semua toko dalam satu klik.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable}`}>
      <body className="font-inter min-h-screen antialiased">{children}</body>
    </html>
  );
}
