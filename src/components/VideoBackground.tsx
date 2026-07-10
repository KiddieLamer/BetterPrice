"use client";

export default function VideoBackground() {
  return (
    <video
      src="/hero-bg.mp4"
      poster="https://assets.mixkit.co/videos/44119/44119-thumb-720-0.jpg"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
}
