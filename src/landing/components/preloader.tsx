/**
 * Preloader — Premium minimal first-load experience
 *
 * Clean horizontal progress bar + large counter + brand reveal.
 * No clutter, no belt strips, no flying elements.
 * Pure typography + motion + curtain exit.
 */

import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "../hooks";

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    if (reducedMotion) {
      handleComplete();
      return;
    }

    const counter = counterRef.current;
    const progressFill = progressFillRef.current;
    const brand = brandRef.current;
    const tagline = taglineRef.current;
    const overlay = overlayRef.current;
    const container = containerRef.current;
    const progressBar = progressBarRef.current;

    if (!counter || !progressFill || !brand || !tagline || !overlay || !container || !progressBar) return;

    const tl = gsap.timeline({
      onComplete: handleComplete,
    });

    // 1. Progress bar appears + fills
    tl.fromTo(progressBar, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    tl.fromTo(progressFill, { scaleX: 0 }, {
      scaleX: 1,
      duration: 2,
      ease: "power2.inOut",
    }, "-=0.1");

    // 2. Counter counts from 0 to 100
    const counterProxy = { value: 0 };
    tl.to(counterProxy, {
      value: 100,
      duration: 2,
      ease: "power2.inOut",
      onUpdate() {
        counter.textContent = String(Math.round(counterProxy.value)).padStart(3, "0");
      },
    }, "<");

    // 3. Brand name fades in
    tl.fromTo(brand, {
      opacity: 0,
      y: 8,
    }, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power3.out",
    }, "-=0.6");

    // 4. Tagline fades in
    tl.fromTo(tagline, {
      opacity: 0,
      y: 6,
    }, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power3.out",
    }, "-=0.3");

    // 5. Hold for a moment
    tl.to({}, { duration: 0.4 });

    // 6. Everything fades out
    tl.to([counter, brand, tagline, progressBar], {
      opacity: 0,
      y: -8,
      duration: 0.4,
      stagger: 0.04,
      ease: "power2.in",
    });

    // 7. Overlay slides up
    tl.to(overlay, {
      yPercent: -100,
      duration: 0.7,
      ease: "power3.inOut",
    }, "-=0.15");

    // 8. Container fades
    tl.to(container, {
      opacity: 0,
      duration: 0.1,
      ease: "power2.in",
    }, "-=0.3");

    return () => {
      tl.kill();
      hasAnimated.current = false;
    };
  }, [reducedMotion, handleComplete]);

  return (
    <div
      ref={containerRef}
      role="progressbar"
      aria-label="Loading"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-busy="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#040508",
        pointerEvents: "none",
      }}
    >
      {/* Skip button */}
      <button
        type="button"
        onClick={handleComplete}
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[10000] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:bg-white/10 focus:rounded-lg focus:outline-none focus:border focus:border-white/20"
        aria-label="Skip loading animation"
      >
        Skip
      </button>

      <span aria-live="polite" className="sr-only" />

      {/* Overlay */}
      <div
        ref={overlayRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        {/* Progress bar — thin line at top */}
        <div
          ref={progressBarRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: "15%",
            right: "15%",
            height: 1,
            opacity: 0,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "rgba(255, 255, 255, 0.06)",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <div
              ref={progressFillRef}
              style={{
                width: "100%",
                height: "100%",
                background: "rgba(255, 255, 255, 0.25)",
                borderRadius: 1,
                transformOrigin: "left center",
                transform: "scaleX(0)",
              }}
            />
          </div>
        </div>

        {/* Center content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          {/* Counter */}
          <div
            ref={counterRef}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(3rem, 8vw, 5rem)",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              color: "rgba(255, 255, 255, 0.9)",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            000
          </div>

          {/* Brand name */}
          <div
            ref={brandRef}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(0.6875rem, 0.9vw, 0.8125rem)",
              fontWeight: 500,
              letterSpacing: "0.25em",
              textTransform: "uppercase" as const,
              color: "rgba(255, 255, 255, 0.4)",
              opacity: 0,
            }}
          >
            Frontend Multiverse
          </div>

          {/* Tagline */}
          <div
            ref={taglineRef}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(0.75rem, 1vw, 0.875rem)",
              fontWeight: 400,
              color: "rgba(216, 216, 216, 0.3)",
              letterSpacing: "0.02em",
              opacity: 0,
            }}
          >
            Building digital experiences
          </div>
        </div>
      </div>
    </div>
  );
}
