"use client";

import { useCallback, useEffect, useRef } from "react";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260329_050842_be71947f-f16e-4a14-810c-06e83d23ddb5.mp4";
const FADE_DURATION = 250;
const FADE_OUT_LEAD = 0.55;

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const opacityRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const fadingOutRef = useRef(false);

  const cancelRAF = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const fadeTo = useCallback(
    (targetOpacity: number, duration: number) => {
      cancelRAF();
      const startOpacity = opacityRef.current;

      function animate(now: number) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const newOpacity =
          startOpacity + (targetOpacity - startOpacity) * progress;
        opacityRef.current = newOpacity;
        if (videoRef.current) {
          videoRef.current.style.opacity = String(newOpacity);
        }
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          rafRef.current = null;
        }
      }

      const startTime = performance.now();
      rafRef.current = requestAnimationFrame(animate);
    },
    [cancelRAF]
  );

  const fadeIn = useCallback(() => {
    fadingOutRef.current = false;
    fadeTo(1, FADE_DURATION);
  }, [fadeTo]);

  const fadeOut = useCallback(() => {
    if (fadingOutRef.current) return;
    fadingOutRef.current = true;
    fadeTo(0, FADE_DURATION);
  }, [fadeTo]);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const remaining = video.duration - video.currentTime;
    if (remaining <= FADE_OUT_LEAD && !fadingOutRef.current) {
      fadeOut();
    }
  }, [fadeOut]);

  const handleEnded = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    cancelRAF();
    video.style.opacity = "0";
    opacityRef.current = 0;
    fadingOutRef.current = false;
    setTimeout(() => {
      video.currentTime = 0;
      video.play().then(fadeIn).catch(() => {});
    }, 100);
  }, [cancelRAF, fadeIn]);

  const handleLoadedMetadata = useCallback(() => {
    fadeIn();
  }, [fadeIn]);

  useEffect(() => {
    return () => cancelRAF();
  }, [cancelRAF]);

  return (
    <video
      ref={videoRef}
      src={VIDEO_URL}
      autoPlay
      muted
      playsInline
      preload="metadata"
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
      onLoadedMetadata={handleLoadedMetadata}
      className="absolute w-[115%] h-[115%] object-cover object-top"
      style={{ opacity: 0 }}
    />
  );
}
