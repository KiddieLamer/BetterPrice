import type { Metadata } from "next";
import { Schibsted_Grotesk, Inter, Noto_Sans, Fustat } from "next/font/google";
import "./globals.css";

const schibstedGrotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
});

const fustat = Fustat({
  subsets: ["latin"],
  variable: "--font-fustat",
});

export const metadata: Metadata = {
  title: "BetterPrice - Price Comparison Platform",
  description: "Find the best prices across Indonesian marketplaces",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${schibstedGrotesk.variable} ${inter.variable} ${notoSans.variable} ${fustat.variable}`}
    >
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
