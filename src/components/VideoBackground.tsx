"use client";

import { useEffect, useState } from "react";

export default function VideoBackground() {
  const [isMobile, setIsMobille] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobille(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const src = isMobile ? "/hero-bg-mobile.mp4" : "/hero-bg.mp4";
  const poster = isMobile
    ? "https://assets.mixkit.co/videos/44119/44119-thumb-720-0.jpg"
    : "https://assets.mixkit.co/videos/5914/5914-thumb-720-0.jpg";

  return (
    <video
      key={src}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
}
