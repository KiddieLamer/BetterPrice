"use client";

import { ChevronDown } from "@/components/ui/icons";

export default function NavigationBar() {
  return (
    <nav className="flex items-center justify-between px-[120px] py-4 relative z-20">
      <div className="flex items-center gap-12">
        <span
          className="text-[24px] tracking-[-1.44px]"
          style={{ fontFamily: "var(--font-schibsted-grotesk)", fontWeight: 600 }}
        >
          Logoipsum
        </span>
        <div className="flex items-center gap-8">
          {["Platform", "Features", "Projects", "Community", "Contact"].map(
            (item) => (
              <button
                key={item}
                className="flex items-center gap-1 text-[16px] tracking-[-0.2px] text-black"
                style={{
                  fontFamily: "var(--font-schibsted-grotesk)",
                  fontWeight: 500,
                }}
              >
                {item}
                {item === "Features" && <ChevronDown className="w-4 h-4" />}
              </button>
            )
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          className="h-10 border border-black/20 rounded-lg text-[14px] tracking-[-0.2px] text-black bg-transparent"
          style={{
            width: "82px",
            fontFamily: "var(--font-schibsted-grotesk)",
            fontWeight: 500,
          }}
        >
          Sign Up
        </button>
        <button
          className="h-10 bg-black text-white rounded-lg text-[14px] tracking-[-0.2px]"
          style={{
            width: "101px",
            fontFamily: "var(--font-schibsted-grotesk)",
            fontWeight: 500,
          }}
        >
          Log In
        </button>
      </div>
    </nav>
  );
}
