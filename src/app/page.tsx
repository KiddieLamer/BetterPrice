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

              <div className="flex items-stretch gap-8 sm:gap-14 mt-4">
                {[
                  { n: "01", label: "Paste link Shopee" },
                  { n: "02", label: "Cari harga termurah" },
                  { n: "03", label: "Beli & hemat" },
                ].map((step) => (
                  <div key={step.n} className="flex flex-col gap-2">
                    <span
                      className="text-[15px] font-semibold tabular-nums"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      {step.n}
                    </span>
                    <span
                      className="text-[14px] font-medium leading-tight"
                      style={{ color: "rgba(255,255,255,0.9)" }}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </section>

      <Footer />
    </div>
  );
}
