"use client";

import { Star } from "@/components/ui/icons";

export default function Badge() {
  return (
    <div className="inline-flex items-center gap-2">
      <span
        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[14px] text-white"
        style={{
          backgroundColor: "#0e1311",
          fontFamily: "var(--font-inter)",
          fontWeight: 400,
        }}
      >
        <Star className="w-3.5 h-3.5" />
        New
      </span>
      <span
        className="inline-flex items-center px-3 py-1 rounded-full text-[14px] text-black"
        style={{
          backgroundColor: "#f8f8f8",
          fontFamily: "var(--font-inter)",
          fontWeight: 400,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        Discover what&apos;s possible
      </span>
    </div>
  );
}
