/**
 * PortalRing
 *
 * Multi-layered portal ring with depth illusion, energy sweep,
 * counter-rotation, vortex background, and dramatic expansion.
 * Responsive via viewport-relative sizing.
 */

import { useEffect, useRef, useCallback, useState } from "react";
import { gsap } from "gsap";
import { ANIMATION_EASINGS } from "@/animation/constants";
import { useReducedMotion } from "../../hooks";

function useViewportSize() {
  const [size, setSize] = useState(() =>
    Math.min(window.innerWidth * 0.55, window.innerHeight * 0.55, 480),
  );
  useEffect(() => {
    const onResize = () =>
      setSize(Math.min(window.innerWidth * 0.55, window.innerHeight * 0.55, 480));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return size;
}

export function PortalRing({ phase }: { phase: string }) {
  const reducedMotion = useReducedMotion();
  const baseSize = useViewportSize();

  const containerRef = useRef<HTMLDivElement>(null);
  const vortexRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const energyRef = useRef<HTMLDivElement>(null);
  const energyReverseRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const corePulseRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);

  const active =
    phase !== "idle" && phase !== "cancelled" && phase !== "darkening" && phase !== "exiting";

  const isReduced = reducedMotion;

  const animateEntrance = useCallback(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      containerRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.75, ease: ANIMATION_EASINGS.expoOut },
    );

    // Vortex: subtle spiral background appears first
    if (vortexRef.current) {
      tl.fromTo(
        vortexRef.current,
        { scale: 0.3, opacity: 0, rotation: 0 },
        { scale: 1, opacity: 0.6, rotation: 90, duration: 1.0, ease: ANIMATION_EASINGS.expoOut },
        0,
      );
    }

    tl.fromTo(
      outerRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: ANIMATION_EASINGS.backOut },
      "-=0.5",
    );

    tl.fromTo(
      midRef.current,
      { scale: 0.25, opacity: 0 },
      { scale: 1, opacity: 0.7, duration: 0.65, ease: ANIMATION_EASINGS.expoOut },
      "-=0.45",
    );

    tl.fromTo(
      innerRef.current,
      { scale: 0.15, opacity: 0 },
      { scale: 1, opacity: 0.9, duration: 0.7, ease: ANIMATION_EASINGS.backOut },
      "-=0.5",
    );

    tl.fromTo(
      shimmerRef.current,
      { scale: 0.4, opacity: 0 },
      { scale: 1, opacity: 0.5, duration: 0.85, ease: ANIMATION_EASINGS.expoOut },
      "-=0.55",
    );

    tl.fromTo(
      energyRef.current,
      { opacity: 0, rotation: 0 },
      { opacity: 1, rotation: 360, duration: 0.9, ease: ANIMATION_EASINGS.expoOut },
      "-=0.45",
    );

    if (energyReverseRef.current) {
      tl.fromTo(
        energyReverseRef.current,
        { opacity: 0, rotation: 0 },
        { opacity: 0.8, rotation: -360, duration: 0.9, ease: ANIMATION_EASINGS.expoOut },
        "-=0.7",
      );
    }

    tl.fromTo(
      coreRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.45, ease: ANIMATION_EASINGS.expoOut },
      "-=0.3",
    );

    // Core pulse: breathing inner light
    if (corePulseRef.current && !isReduced) {
      tl.fromTo(
        corePulseRef.current,
        { scale: 0.8, opacity: 0.3 },
        { scale: 1.1, opacity: 0.7, duration: 1.2, ease: "sine.inOut", repeat: -1, yoyo: true },
        "-=0.2",
      );
    }

    // Continuous loops — GPU compositing only
    if (!isReduced) {
      gsap.to(vortexRef.current, {
        rotation: "+=360",
        duration: 20,
        ease: "none",
        repeat: -1,
        overwrite: "auto",
      });
      gsap.to(energyRef.current, {
        rotation: "+=360",
        duration: 12,
        ease: "none",
        repeat: -1,
        overwrite: "auto",
      });
      if (energyReverseRef.current) {
        gsap.to(energyReverseRef.current, {
          rotation: "-=360",
          duration: 16,
          ease: "none",
          repeat: -1,
          overwrite: "auto",
        });
      }
      gsap.to(shimmerRef.current, {
        rotation: "+=360",
        duration: 22,
        ease: "none",
        repeat: -1,
        overwrite: "auto",
      });
    }

    return tl;
  }, [isReduced]);

  const animateExpand = useCallback(() => {
    const tl = gsap.timeline();

    tl.to(containerRef.current, {
      scale: 12,
      duration: EXPAND_DURATION,
      ease: ANIMATION_EASINGS.expoIn,
    });

    tl.to(
      outerRef.current,
      {
        borderColor: "rgba(59, 130, 246, 0.7)",
        opacity: 1,
        duration: 0.5,
        ease: ANIMATION_EASINGS.expoOut,
      },
      0,
    );

    tl.to(midRef.current, { opacity: 0, duration: 0.25, ease: ANIMATION_EASINGS.expoIn }, 0);
    tl.to(innerRef.current, { opacity: 0, duration: 0.25, ease: ANIMATION_EASINGS.expoIn }, 0);
    tl.to(shimmerRef.current, { opacity: 0, duration: 0.25, ease: ANIMATION_EASINGS.expoIn }, 0);

    if (!isReduced) {
      tl.to(
        energyRef.current,
        { rotation: "+=720", duration: EXPAND_DURATION, ease: ANIMATION_EASINGS.expoIn },
        0,
      );
      if (energyReverseRef.current) {
        tl.to(
          energyReverseRef.current,
          { rotation: "-=720", duration: EXPAND_DURATION, ease: ANIMATION_EASINGS.expoIn },
          0,
        );
      }
    }

    tl.to(
      energyRef.current,
      { opacity: 0.9, scale: 1.5, duration: 0.35, ease: ANIMATION_EASINGS.expoOut },
      0,
    );

    tl.to(
      coreRef.current,
      { scale: 5, opacity: 1, duration: 0.5, ease: ANIMATION_EASINGS.expoOut },
      0,
    );

    if (vortexRef.current) {
      tl.to(
        vortexRef.current,
        { scale: 8, opacity: 0, duration: 0.6, ease: ANIMATION_EASINGS.expoIn },
        0,
      );
    }

    if (burstRef.current) {
      tl.fromTo(
        burstRef.current,
        { scale: 0.15, opacity: 0 },
        { scale: 4, opacity: 1, duration: 0.3, ease: ANIMATION_EASINGS.expoOut },
        "-=0.1",
      );
      tl.to(
        burstRef.current,
        { opacity: 0, duration: 0.4, ease: ANIMATION_EASINGS.expoIn },
        "-=0.05",
      );
    }

    return tl;
  }, [isReduced]);

  useEffect(() => {
    if (!active) return;
    if (phase === "ring-forming") {
      const tl = animateEntrance();
      return () => {
        tl.kill();
      };
    }
    if (phase === "portal-expand") {
      const tl = animateExpand();
      return () => {
        tl.kill();
      };
    }
  }, [active, phase, animateEntrance, animateExpand]);

  useEffect(() => {
    return () => {
      [
        containerRef,
        vortexRef,
        outerRef,
        midRef,
        innerRef,
        shimmerRef,
        energyRef,
        energyReverseRef,
        coreRef,
        corePulseRef,
        burstRef,
      ].forEach((r) => {
        if (r.current) gsap.killTweensOf(r.current);
      });
    };
  }, []);

  if (!active) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%) scale(0)",
        width: baseSize,
        height: baseSize,
        zIndex: 102,
        pointerEvents: "none",
        willChange: "transform, opacity",
      }}
    >
      {/* Vortex background — spiral gradient for depth */}
      <div
        ref={vortexRef}
        style={{
          position: "absolute",
          inset: "-15%",
          borderRadius: "50%",
          background:
            "conic-gradient(from 0deg, transparent 0%, rgba(59, 130, 246, 0.08) 10%, transparent 20%, rgba(96, 165, 250, 0.06) 35%, transparent 45%, rgba(59, 130, 246, 0.04) 60%, transparent 70%, rgba(59, 130, 246, 0.06) 85%, transparent 95%)",
          opacity: 0,
          filter: "blur(8px)",
        }}
      />

      {/* Outer ring */}
      <div
        ref={outerRef}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: "2px solid rgba(59, 130, 246, 0.4)",
          boxShadow:
            "0 0 60px rgba(59, 130, 246, 0.18), 0 0 120px rgba(59, 130, 246, 0.08), inset 0 0 50px rgba(59, 130, 246, 0.06)",
          opacity: 0,
          willChange: "transform, opacity",
        }}
      />

      {/* Mid ring */}
      <div
        ref={midRef}
        style={{
          position: "absolute",
          inset: "12%",
          borderRadius: "50%",
          border: "1.5px solid rgba(96, 165, 250, 0.3)",
          boxShadow: "0 0 30px rgba(96, 165, 250, 0.1), inset 0 0 22px rgba(96, 165, 250, 0.05)",
          opacity: 0,
          willChange: "transform, opacity",
        }}
      />

      {/* Inner ring — cyan accent for contrast */}
      <div
        ref={innerRef}
        style={{
          position: "absolute",
          inset: "23%",
          borderRadius: "50%",
          border: "2.5px solid rgba(59, 130, 246, 0.25)",
          boxShadow: "0 0 40px rgba(59, 130, 246, 0.08), 0 0 80px rgba(59, 130, 246, 0.04)",
          opacity: 0,
          willChange: "transform, opacity",
        }}
      />

      {/* Shimmer ring — rotating gradient for surface light */}
      <div
        ref={shimmerRef}
        style={{
          position: "absolute",
          inset: "5%",
          borderRadius: "50%",
          background:
            "conic-gradient(from 90deg, transparent 0%, rgba(59, 130, 246, 0.12) 10%, transparent 20%, transparent 55%, rgba(147, 197, 253, 0.1) 65%, transparent 75%)",
          opacity: 0,
          willChange: "transform, opacity",
        }}
      />

      {/* Energy sweep — primary rotation */}
      <div
        ref={energyRef}
        style={{
          position: "absolute",
          inset: "-4%",
          borderRadius: "50%",
          background:
            "conic-gradient(from 0deg, transparent 0%, rgba(59, 130, 246, 0.25) 6%, transparent 12%, transparent 48%, rgba(96, 165, 250, 0.18) 54%, transparent 60%)",
          opacity: 0,
          filter: "blur(1px)",
          willChange: "transform, opacity",
        }}
      />

      {/* Energy sweep — counter-rotation for depth */}
      <div
        ref={energyReverseRef}
        style={{
          position: "absolute",
          inset: "4%",
          borderRadius: "50%",
          background:
            "conic-gradient(from 180deg, transparent 0%, rgba(59, 130, 246, 0.12) 12%, transparent 24%, transparent 68%, rgba(59, 130, 246, 0.1) 80%, transparent 92%)",
          opacity: 0,
          filter: "blur(1px)",
          willChange: "transform, opacity",
        }}
      />

      {/* Core glow */}
      <div
        ref={coreRef}
        style={{
          position: "absolute",
          inset: "28%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(147, 197, 253, 0.2) 0%, rgba(59, 130, 246, 0.1) 35%, transparent 65%)",
          filter: "blur(16px)",
          opacity: 0,
          willChange: "transform, opacity",
        }}
      />

      {/* Core pulse — breathing inner light */}
      <div
        ref={corePulseRef}
        style={{
          position: "absolute",
          inset: "35%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(191, 219, 254, 0.25) 0%, rgba(147, 197, 253, 0.1) 40%, transparent 70%)",
          filter: "blur(10px)",
          opacity: 0,
          willChange: "transform, opacity",
        }}
      />

      {/* Light burst */}
      <div
        ref={burstRef}
        style={{
          position: "absolute",
          top: "-35%",
          left: "-35%",
          width: "170%",
          height: "170%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(191, 219, 254, 0.35) 0%, rgba(59, 130, 246, 0.15) 25%, transparent 55%)",
          filter: "blur(10px)",
          opacity: 0,
          willChange: "transform, opacity",
        }}
      />
    </div>
  );
}

const EXPAND_DURATION = 0.9;
