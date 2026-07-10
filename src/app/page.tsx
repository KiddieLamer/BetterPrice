"use client";

import { useRouter } from "next/navigation";
import VideoBackground from "@/components/VideoBackground";
import SearchBar from "@/components/SearchBar";
import Footer from "@/components/Footer";

export default function Home() {
  const router = useRouter();

  function handleSearch(url: string) {
    router.push(`/compare?url=${encodeURIComponent(url)}`);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <VideoBackground />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <header className="px-6 sm:px-[120px] py-4">
            <span
              className="text-[22px] font-bold tracking-tight text-white"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              BetterPrice
            </span>
          </header>

          <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-20">
            <div className="flex flex-col items-center gap-[34px] max-w-[900px]">
              <div className="text-center">
                <h1
                  className="text-white text-center text-[56px] sm:text-[80px] tracking-[-3.2px] leading-none max-w-[900px] font-bold"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Temukan Harga Termurah
                </h1>
                <p
                  className="text-center text-[17px] sm:text-[20px] tracking-[-0.4px] mt-4"
                  style={{ color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-inter)" }}
                >
                  Cukup paste link Shopee, lihat harga dari semua toko dalam satu klik.
                </p>
              </div>

              <SearchBar onSearch={handleSearch} />

              <p
                className="text-center text-[13px]"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Contoh: shopee.co.id/product/123456789/...
              </p>

              <div
                className="flex items-center gap-6 sm:gap-10 mt-2 text-[14px]"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1.5">📋</div>
                  <div>Paste link</div>
                </div>
                <div className="text-white/20 text-xl">→</div>
                <div className="text-center">
                  <div className="text-2xl mb-1.5">🔍</div>
                  <div>Cari harga</div>
                </div>
                <div className="text-white/20 text-xl">→</div>
                <div className="text-center">
                  <div className="text-2xl mb-1.5">🛒</div>
                  <div>Beli termurah</div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </section>

      <Footer />
    </div>
  );
}
