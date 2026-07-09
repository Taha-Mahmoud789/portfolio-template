/**
 * PortalOverlay
 *
 * Full-screen dark overlay with radial gradient.
 * Fades in/out smoothly. Blocks interaction with landing beneath.
 * Coordinated with master timeline for seamless transitions.
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ANIMATION_EASINGS } from "@/animation/constants";

export function PortalOverlay({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      opacity: active ? 0.96 : 0,
      duration: active ? 0.55 : 0.3,
      ease: active ? ANIMATION_EASINGS.expoOut : ANIMATION_EASINGS.expoIn,
      overwrite: "auto",
    });
  }, [active]);

  useEffect(() => {
    const el = ref.current;
    return () => {
      if (el) gsap.killTweensOf(el);
    };
  }, []);

  return (
    <div
      ref={ref}
      role="presentation"
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background:
          "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(11, 15, 26, 0.94) 0%, rgba(11, 15, 26, 0.98) 100%)",
        opacity: 0,
        pointerEvents: active ? "all" : "none",
        willChange: "opacity",
      }}
    />
  );
}
