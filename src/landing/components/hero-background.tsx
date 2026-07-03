/**
 * HeroBackground — TRIONN-inspired minimal dark background
 *
 * Ultra-clean: subtle gradient + single ambient glow + noise texture.
 * No aurora blobs, no cursor light, no multi-layer complexity.
 */

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import "gsap/ScrollTrigger";
import { useReducedMotion } from "../hooks";

// ============================================================================
// Constants
// ============================================================================

const AMBIENT_GLOW = {
  x: 50,
  y: 35,
  size: 700,
  color: "rgba(255, 255, 255, 0.025)",
  breathDur: 20,
} as const;

// ============================================================================
// Ambient Glow — single soft radial, breathing gently
// ============================================================================

function AmbientGlow({ reducedMotion }: { reducedMotion: boolean }) {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion || !glowRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(glowRef.current, {
        opacity: "random(0.3, 0.7)",
        scale: "random(0.9, 1.1)",
        duration: AMBIENT_GLOW.breathDur,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    });

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        left: `${String(AMBIENT_GLOW.x)}%`,
        top: `${String(AMBIENT_GLOW.y)}%`,
        width: AMBIENT_GLOW.size,
        height: AMBIENT_GLOW.size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${AMBIENT_GLOW.color} 0%, transparent 70%)`,
        filter: "blur(80px)",
        transform: "translate(-50%, -50%)",
        opacity: reducedMotion ? 0.4 : 0.6,
        willChange: "transform, opacity",
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
}

// ============================================================================
// Noise Layer — CSS-only grain, very subtle
// ============================================================================

function NoiseLayer() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 3,
        opacity: 0.025,
        pointerEvents: "none",
        mixBlendMode: "overlay",
        backgroundImage:
          "repeating-conic-gradient(rgba(255,255,255,0.06) 0% 25%, transparent 0% 50%)",
        backgroundSize: "4px 4px",
        animation: "hero-noise-shift 8s steps(4) infinite",
      }}
    />
  );
}

// ============================================================================
// Bottom Fade — smooth transition to next section
// ============================================================================

function BottomFade() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "20%",
        zIndex: 4,
        pointerEvents: "none",
        background:
          "linear-gradient(to top, #040508 0%, rgba(4, 5, 8, 0.5) 40%, transparent 100%)",
      }}
    />
  );
}

// ============================================================================
// Export
// ============================================================================

export function HeroBackground() {
  const reducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        background: "#040508",
      }}
    >
      <AmbientGlow reducedMotion={reducedMotion} />
      <NoiseLayer />
      <BottomFade />
    </div>
  );
}
