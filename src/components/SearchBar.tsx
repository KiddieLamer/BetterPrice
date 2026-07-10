"use client";

import { useState, FormEvent } from "react";

interface SearchBarProps {
  onSearch: (url: string) => void;
  isLoading?: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const trimmed = url.trim();
    if (!trimmed) {
      setError("Masukkan link Shopee");
      return;
    }
    if (!trimmed.includes("shopee.co.id")) {
      setError("Harap gunakan link Shopee");
      return;
    }

    onSearch(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[728px]">
      <div
        className="rounded-[18px] p-4"
        style={{
          backgroundColor: "rgba(0,0,0,0.24)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-2 bg-white rounded-[12px] p-2 shadow-sm">
          <div className="flex-1 flex items-center gap-2 px-2">
            <input
              type="text"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(""); }}
              placeholder="Paste link Shopee..."
              disabled={isLoading}
              className="w-full border-none outline-none bg-transparent text-[16px] placeholder:text-[rgba(0,0,0,0.6)] disabled:opacity-50"
              style={{ fontFamily: "var(--font-inter)" }}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="h-9 px-4 rounded-lg bg-black text-white text-[14px] font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 flex-shrink-0"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Mencari...
              </>
            ) : (
              "Cek Harga"
            )}
          </button>
        </div>
        {error && (
          <p className="text-red-300 text-[13px] mt-2 px-1">{error}</p>
        )}
      </div>
    </form>
  );
}
