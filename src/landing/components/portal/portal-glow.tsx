/**
 * PortalGlow
 *
 * Viewport-responsive ambient glow with breathing pulse,
 * lens flare, and dramatic flash during portal expansion.
 */

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ANIMATION_EASINGS } from "@/animation/constants";
import { useReducedMotion } from "../../hooks";

function useViewportGlowSize() {
  const [size, setSize] = useState(() =>
    typeof window !== "undefined"
      ? Math.min(window.innerWidth * 0.8, window.innerHeight * 0.8, 720)
      : 560,
  );
  useEffect(() => {
    const onResize = () =>
      setSize(Math.min(window.innerWidth * 0.8, window.innerHeight * 0.8, 720));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return size;
}

export function PortalGlow({ phase }: { phase: string }) {
  const reducedMotion = useReducedMotion();
  const glowSize = useViewportGlowSize();

  const glowRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const flareRef = useRef<HTMLDivElement>(null);
  const flare2Ref = useRef<HTMLDivElement>(null);

  const active = phase !== "idle" && phase !== "cancelled" && phase !== "exiting";

  useEffect(() => {
    if (!glowRef.current) return;

    if (phase === "glowing") {
      gsap.to(glowRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: ANIMATION_EASINGS.expoOut,
      });
      if (innerRef.current && !reducedMotion) {
        gsap.to(innerRef.current, {
          opacity: 0.85,
          scale: 1.08,
          duration: 2.0,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }
      // Lens flare appears during glowing
      if (flareRef.current && !reducedMotion) {
        gsap.fromTo(
          flareRef.current,
          { opacity: 0, scale: 0.5, x: -30 },
          { opacity: 0.6, scale: 1, x: 0, duration: 1.2, ease: ANIMATION_EASINGS.expoOut },
        );
        gsap.to(flareRef.current, {
          opacity: 0.3,
          scale: 1.05,
          duration: 2.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 1.2,
        });
      }
      if (flare2Ref.current && !reducedMotion) {
        gsap.fromTo(
          flare2Ref.current,
          { opacity: 0, scale: 0.4, x: 20 },
          {
            opacity: 0.4,
            scale: 1,
            x: 0,
            duration: 1.4,
            ease: ANIMATION_EASINGS.expoOut,
            delay: 0.3,
          },
        );
      }
    }

    if (phase === "portal-expand") {
      if (innerRef.current) gsap.killTweensOf(innerRef.current);
      if (flareRef.current) gsap.killTweensOf(flareRef.current);
      if (flare2Ref.current) gsap.killTweensOf(flare2Ref.current);
      gsap.to(glowRef.current, {
        scale: 2.0,
        opacity: 0.4,
        duration: 0.6,
        ease: ANIMATION_EASINGS.expoOut,
      });
      if (flashRef.current) {
        gsap.fromTo(
          flashRef.current,
          { opacity: 0, scale: 0.3 },
          { opacity: 1, scale: 3.0, duration: 0.25, ease: ANIMATION_EASINGS.expoOut },
        );
        gsap.to(flashRef.current, {
          opacity: 0,
          duration: 0.45,
          ease: ANIMATION_EASINGS.expoIn,
          delay: 0.2,
        });
      }
      if (flareRef.current) {
        gsap.to(flareRef.current, {
          scale: 4,
          opacity: 0,
          duration: 0.4,
          ease: ANIMATION_EASINGS.expoIn,
        });
      }
      if (flare2Ref.current) {
        gsap.to(flare2Ref.current, {
          scale: 3,
          opacity: 0,
          duration: 0.35,
          ease: ANIMATION_EASINGS.expoIn,
        });
      }
    }

    if (phase === "cancelled" || phase === "exiting") {
      gsap.to(glowRef.current, {
        opacity: 0,
        scale: 0.3,
        duration: 0.4,
        ease: ANIMATION_EASINGS.expoIn,
      });
    }
  }, [phase, reducedMotion]);

  useEffect(() => {
    return () => {
      [glowRef, innerRef, flashRef, flareRef, flare2Ref].forEach((r) => {
        if (r.current) gsap.killTweensOf(r.current);
      });
    };
  }, []);

  if (!active) return null;

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%) scale(0.5)",
        width: glowSize,
        height: glowSize,
        borderRadius: "50%",
        opacity: 0,
        zIndex: 101,
        pointerEvents: "none",
        willChange: "transform, opacity",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(201, 169, 110, 0.16) 0%, rgba(201, 169, 110, 0.06) 25%, rgba(180, 140, 80, 0.03) 50%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />
      <div
        ref={innerRef}
        style={{
          position: "absolute",
          inset: "10%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(212, 184, 122, 0.25) 0%, rgba(201, 169, 110, 0.08) 40%, transparent 65%)",
          filter: "blur(25px)",
          opacity: 0,
        }}
      />
      {/* Lens flare — horizontal streak */}
      <div
        ref={flareRef}
        style={{
          position: "absolute",
          top: "45%",
          left: "-20%",
          width: "140%",
          height: "10%",
          borderRadius: "50%",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(201, 169, 110, 0.12) 20%, rgba(220, 200, 160, 0.2) 50%, rgba(201, 169, 110, 0.12) 80%, transparent 100%)",
          filter: "blur(6px)",
          opacity: 0,
          willChange: "transform, opacity",
        }}
      />
      {/* Lens flare — diagonal accent */}
      <div
        ref={flare2Ref}
        style={{
          position: "absolute",
          top: "30%",
          left: "25%",
          width: "50%",
          height: "40%",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(220, 200, 160, 0.15) 0%, transparent 60%)",
          filter: "blur(12px)",
          opacity: 0,
          willChange: "transform, opacity",
        }}
      />
      <div
        ref={flashRef}
        style={{
          position: "absolute",
          top: "-40%",
          left: "-40%",
          width: "180%",
          height: "180%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(220, 200, 160, 0.3) 0%, rgba(212, 184, 122, 0.12) 25%, transparent 55%)",
          filter: "blur(30px)",
          opacity: 0,
        }}
      />
    </div>
  );
}
