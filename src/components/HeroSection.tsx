"use client";

import VideoBackground from "@/components/VideoBackground";
import NavigationBar from "@/components/NavigationBar";
import Badge from "@/components/Badge";
import SearchInput from "@/components/SearchInput";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <VideoBackground />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <NavigationBar />

        <main className="flex-1 flex flex-col items-center justify-start -mt-[50px] pt-[60px]">
          <div className="flex flex-col items-center gap-[34px]">
            <Badge />

            <h1
              className="text-black text-center text-[80px] tracking-[-4.8px] leading-none max-w-[900px]"
              style={{
                fontFamily: "var(--font-fustat)",
                fontWeight: 700,
              }}
            >
              Transform Data Quickly
            </h1>

            <p
              className="text-center text-[20px] tracking-[-0.4px]"
              style={{
                color: "#505050",
                fontFamily: "var(--font-fustat)",
                fontWeight: 500,
                maxWidth: "736px",
                width: "542px",
              }}
            >
              Upload your information and get powerful insights right away.
              Work smarter and achieve goals effortlessly.
            </p>
          </div>

          <div className="mt-[44px]">
            <SearchInput />
          </div>
        </main>
      </div>
    </section>
  );
}
