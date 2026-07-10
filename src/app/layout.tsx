import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BetterPrice - Cek Harga Termurah",
  description: "Paste link Shopee, lihat harga dari semua toko. Cari harga termurah dalam satu klik.",
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
