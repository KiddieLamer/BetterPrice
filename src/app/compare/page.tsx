"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import ProductCard from "@/components/ProductCard";
import OfferCard from "@/components/OfferCard";
import PriceSummary from "@/components/PriceSummary";
import Footer from "@/components/Footer";
import Skeleton from "@/components/ui/Skeleton";
import type { CompareResponse } from "@/types/api";
import { formatDistanceToNow } from "date-fns";

type PageState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: CompareResponse; fetchedAt: Date };

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get("url");
  const [state, setState] = useState<PageState>({ status: "loading" });

  useEffect(() => {
    if (!url) {
      router.replace("/");
      return;
    }

    const controller = new AbortController();

    async function fetchCompare() {
      setState({ status: "loading" });
      const fetchedAt = new Date();
      try {
        const res = await fetch("/api/compare", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
          signal: controller.signal,
        });

        const json = await res.json();

        if (!res.ok) {
          const msg = json?.error?.message || "Terjadi kesalahan";
          setState({ status: "error", message: msg });
          return;
        }

        setState({ status: "success", data: json as CompareResponse, fetchedAt });
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setState({ status: "error", message: "Gagal terhubung ke server. Coba lagi." });
      }
    }

    fetchCompare();
    return () => controller.abort();
  }, [url, router]);

  function handleSearch(newUrl: string) {
    router.push(`/compare?url=${encodeURIComponent(newUrl)}`);
  }

  async function handleShare() {
    if (!state.status || state.status !== "success") return;
    const shareUrl = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: state.data.product.name, url: shareUrl });
    } else {
      await navigator.clipboard.writeText(shareUrl);
    }
  }

  return (
    <main className="flex-1 px-4 py-6">
      <div className="max-w-[900px] mx-auto space-y-4">
        <SearchBar onSearch={handleSearch} isLoading={state.status === "loading"} />

        {state.status === "loading" && (
          <div className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Skeleton className="h-28 w-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          </div>
        )}

        {state.status === "error" && (
          <div className="mt-6 p-4 rounded-xl border border-red-100 bg-red-50 text-center">
            <p className="text-red-600 text-[15px] font-medium">{state.message}</p>
            <button
              onClick={() => handleSearch(url || "")}
              className="mt-3 h-10 px-5 rounded-lg bg-black text-white text-[14px] font-medium hover:bg-gray-800 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {state.status === "success" && (
          <div className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <ProductCard product={state.data.product} />
                <PriceSummary
                  lowestPrice={state.data.product.priceMin}
                  highestPrice={state.data.product.priceMax}
                />
                <p className="text-[12px] text-muted text-center">
                  Terakhir update: {formatDistanceToNow(state.fetchedAt, { addSuffix: true, locale: undefined })}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[14px] font-semibold text-muted">
                    Penawaran Shopee ({state.data.offers.length})
                  </p>
                  <button
                    onClick={handleShare}
                    className="text-[13px] font-medium text-muted hover:text-foreground transition-colors underline underline-offset-2 decoration-gray-300"
                  >
                    Bagikan
                  </button>
                </div>

                {state.data.offers.length === 0 ? (
                  <div className="p-4 rounded-xl border border-gray-100 text-center text-muted text-[14px]">
                    Produk tidak ditemukan di toko lain.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {state.data.offers.map((offer, i) => (
                      <OfferCard key={i} offer={offer} />
                    ))}
                  </div>
                )}

                {state.data.lazadaUrl && (
                  <a
                    href={state.data.lazadaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-12 rounded-xl border border-gray-200 bg-white text-foreground text-[15px] font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cek juga di Lazada
                  </a>
                )}
              </div>
            </div>

            <div className="text-center text-[12px] text-muted pt-6 pb-4">
              Harga dapat berubah sewaktu-waktu.
              Kami mendapat komisi dari pembelian melalui link afiliasi.
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ComparePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-4 border-b border-gray-100">
        <div className="max-w-[900px] mx-auto flex items-center gap-3">
          <a href="/" className="text-[14px] text-muted hover:text-foreground transition-colors">
            ← Kembali
          </a>
          <span className="text-[18px] font-bold tracking-tight">BetterPrice</span>
        </div>
      </header>

      <Suspense
        fallback={
          <main className="flex-1 px-4 py-6">
            <div className="max-w-[900px] mx-auto space-y-4">
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="h-28 w-full bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="space-y-3">
                  <div className="h-16 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-16 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-16 w-full bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </main>
        }
      >
        <CompareContent />
      </Suspense>

      <Footer />
    </div>
  );
}
