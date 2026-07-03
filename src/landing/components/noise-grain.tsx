/**
 * NoiseGrain
 *
 * Subtle film grain overlay for cinematic feel.
 * Pauses animation when reduced motion is preferred.
 */

import { useReducedMotion } from "../hooks";

export function NoiseGrain({ opacity = 0.03 }: { opacity?: number }) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 20,
        pointerEvents: "none",
        opacity,
        mixBlendMode: "overlay",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
        animation: reducedMotion ? "none" : "landing-grain 1s steps(1) infinite",
        willChange: "transform",
      }}
    />
  );
}
