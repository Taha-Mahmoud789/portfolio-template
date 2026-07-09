/**
 * Preloader — Clean & minimal
 * Simple counter with fade-out. No particles, no grain, no rings.
 */

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "../hooks";

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const reducedMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const fadeTweenRef = useRef<gsap.core.Tween | null>(null);
  const [count, setCount] = useState(0);

  // Counter animation
  useEffect(() => {
    const obj = { value: 0 };
    const duration = reducedMotion ? 0.2 : 1.6;

    const tween = gsap.to(obj, {
      value: 100,
      duration,
      ease: "power2.inOut",
      onUpdate: () => {
        setCount(Math.round(obj.value));
      },
    });

    return () => {
      tween.kill();
    };
  }, [reducedMotion]);

  // Fade out and complete
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const delay = reducedMotion ? 300 : 2000;

    const timer = setTimeout(() => {
      fadeTweenRef.current = gsap.to(wrap, {
        opacity: 0,
        duration: reducedMotion ? 0.1 : 0.6,
        ease: "power2.inOut",
        onComplete: () => {
          onComplete();
        },
      });
    }, delay);

    return () => {
      clearTimeout(timer);
      fadeTweenRef.current?.kill();
    };
  }, [onComplete, reducedMotion]);

  return (
    <div
      ref={wrapRef}
      role="status"
      aria-label="Loading"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0B0F1A",
      }}
    >
      <span
        ref={counterRef}
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(3rem, 8vw, 6rem)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          color: "#F1F5F9",
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {String(count).padStart(2, "0")}
      </span>
    </div>
  );
}
