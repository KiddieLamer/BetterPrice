"use client";

import { ArrowUp, Paperclip, Microphone, SearchIcon, Sparkle } from "@/components/ui/icons";

export default function SearchInput() {
  return (
    <div
      className="w-full max-w-[728px] rounded-[18px] p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.24)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className="text-[12px] text-white"
            style={{
              fontFamily: "var(--font-schibsted-grotesk)",
              fontWeight: 500,
            }}
          >
            60/450 credits
          </span>
          <button
            className="px-2 py-0.5 rounded text-[11px] text-white"
            style={{ backgroundColor: "rgba(90,225,76,0.89)" }}
          >
            Upgrade
          </button>
        </div>
        <div className="flex items-center gap-1.5">
          <Sparkle className="w-3.5 h-3.5 text-white" />
          <span
            className="text-[12px] text-white"
            style={{
              fontFamily: "var(--font-schibsted-grotesk)",
              fontWeight: 500,
            }}
          >
            Powered by GPT-4o
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white rounded-[12px] p-2 shadow-sm">
        <div className="flex-1 flex items-center gap-2 px-2">
          <input
            type="text"
            placeholder="Type question..."
            className="w-full border-none outline-none bg-transparent text-[16px] placeholder:text-[rgba(0,0,0,0.6)]"
            style={{ fontFamily: "var(--font-inter)" }}
          />
        </div>
        <button
          className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1 px-3 py-1 rounded-[6px] text-[12px] text-black"
            style={{ backgroundColor: "#f8f8f8", fontFamily: "var(--font-inter)", fontWeight: 400 }}
          >
            <Paperclip className="w-3.5 h-3.5" />
            Attach
          </button>
          <button
            className="flex items-center gap-1 px-3 py-1 rounded-[6px] text-[12px] text-black"
            style={{ backgroundColor: "#f8f8f8", fontFamily: "var(--font-inter)", fontWeight: 400 }}
          >
            <Microphone className="w-3.5 h-3.5" />
            Voice
          </button>
          <button
            className="flex items-center gap-1 px-3 py-1 rounded-[6px] text-[12px] text-black"
            style={{ backgroundColor: "#f8f8f8", fontFamily: "var(--font-inter)", fontWeight: 400 }}
          >
            <SearchIcon className="w-3.5 h-3.5" />
            Prompts
          </button>
        </div>
        <span
          className="text-[12px]"
          style={{ color: "#9CA3AF", fontFamily: "var(--font-inter)", fontWeight: 400 }}
        >
          0/3,000
        </span>
      </div>
    </div>
  );
}
