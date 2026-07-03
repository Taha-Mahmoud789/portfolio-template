/**
 * PortalWaves
 *
 * Concentric energy waves that emanate outward from the portal center.
 * Phase-aware: dormant → pulse → expand → dissipate.
 * GPU-accelerated. 60 FPS. Transform + opacity only.
 */

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ANIMATION_EASINGS } from "@/animation/constants";
import { useReducedMotion } from "../../hooks";

const WAVE_COUNT = 6;

function useViewportWaveSize() {
  const sizeRef = useRef(
    Math.min(window.innerWidth, window.innerHeight) * 0.42,
  );
  useEffect(() => {
    const update = () => {
      sizeRef.current = Math.min(window.innerWidth, window.innerHeight) * 0.42;
    };
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return sizeRef;
}

export function PortalWaves({ phase }: { phase: string }) {
  const reducedMotion = useReducedMotion();
  const sizeRef = useViewportWaveSize();
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesRef = useRef<HTMLDivElement[]>([]);

  const active =
    phase !== "idle" &&
    phase !== "cancelled" &&
    phase !== "darkening" &&
    phase !== "exiting" &&
    phase !== "world-selection";

  const animateEntrance = useCallback(() => {
    if (!containerRef.current) return;

    const size = sizeRef.current;
    const tl = gsap.timeline();

    wavesRef.current.forEach((wave, i) => {
      const delay = i * 0.12;
      const targetScale = 1 + i * 0.45;

      tl.fromTo(
        wave,
        {
          scale: 0,
          opacity: 0.7,
          width: size,
          height: size,
        },
        {
          scale: targetScale,
          opacity: 0,
          duration: 1.6,
          ease: ANIMATION_EASINGS.expoOut,
          delay,
        },
        0,
      );
    });

    return tl;
  }, [sizeRef]);

  const animatePulse = useCallback(() => {
    if (!containerRef.current || reducedMotion) return;

    wavesRef.current.forEach((wave, i) => {
      gsap.to(wave, {
        scale: `+=${String(0.06 + i * 0.015)}`,
        opacity: 0.2,
        duration: 1.8 + i * 0.25,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: i * 0.18,
        overwrite: "auto",
      });
    });
  }, [reducedMotion]);

  useEffect(() => {
    if (!active) return;

    if (phase === "ring-forming") {
      const tl = animateEntrance();
      return () => {
        tl?.kill();
      };
    }

    if (phase === "glowing") {
      animatePulse();
    }

    if (phase === "camera-push" || phase === "portal-expand") {
      wavesRef.current.forEach((wave) => {
        gsap.to(wave, {
          scale: 5,
          opacity: 0,
          duration: 0.7,
          ease: ANIMATION_EASINGS.expoIn,
          overwrite: "auto",
        });
      });
    }
  }, [active, phase, animateEntrance, animatePulse]);

  useEffect(() => {
    const waves = wavesRef.current;
    return () => {
      waves.forEach((wave) => {
        gsap.killTweensOf(wave);
      });
    };
  }, []);

  if (!active) return null;

  const size = sizeRef.current;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 0,
        height: 0,
        zIndex: 101,
        pointerEvents: "none",
      }}
    >
      {Array.from({ length: WAVE_COUNT }, (_, i) => (
        <div
          key={`wave-${String(i)}`}
          ref={(el) => {
            if (el) wavesRef.current[i] = el;
          }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: size,
            height: size,
            borderRadius: "50%",
            border: `${String(2 - i * 0.25)}px solid rgba(99, 102, 241, ${String(0.2 - i * 0.025)})`,
            boxShadow: `0 0 ${String(25 + i * 10)}px rgba(99, 102, 241, ${String(0.08 - i * 0.01)})`,
            opacity: 0,
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
}
