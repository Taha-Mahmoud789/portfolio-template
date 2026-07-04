/**
 * BackToTop — Simple, functional
 * Progress ring + scroll to top. No magnetic cursor, no haptic press.
 */

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useScrollTo } from "@/providers/lenis-provider";

const SIZE = 48;
const STROKE = 2;
const RADIUS = (SIZE - STROKE * 2) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function BackToTop() {
  const scrollTo = useScrollTo();
  const btnRef = useRef<HTMLButtonElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const el = btnRef.current;
    const circle = circleRef.current;
    if (!el || !circle) return;

    gsap.set(circle, { strokeDasharray: CIRCUMFERENCE, strokeDashoffset: CIRCUMFERENCE });

    const onScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;
      const offset = CIRCUMFERENCE * (1 - progress);
      gsap.set(circle, { strokeDashoffset: offset });

      if (scrollY > 400) {
        gsap.to(el, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out", overwrite: "auto" });
      } else {
        gsap.to(el, {
          opacity: 0,
          scale: 0.8,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

    gsap.set(el, { opacity: 0, scale: 0.8 });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      ref={btnRef}
      onClick={() => scrollTo("#hero")}
      aria-label="Back to top"
      style={{
        position: "fixed",
        bottom: "clamp(1.5rem, 4vh, 2.5rem)",
        right: "clamp(1.5rem, 4vw, 2.5rem)",
        width: SIZE,
        height: SIZE,
        borderRadius: "50%",
        background: "rgba(8, 7, 6, 0.8)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(245, 240, 232, 0.06)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        zIndex: 50,
        outline: "none",
      }}
    >
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${String(SIZE)} ${String(SIZE)}`}
        style={{ position: "absolute", transform: "rotate(-90deg)" }}
      >
        <circle
          ref={circleRef}
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="#C9A96E"
          strokeWidth={STROKE}
          strokeLinecap="round"
        />
      </svg>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="rgba(245, 240, 232, 0.7)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 12V4M4 7l4-4 4 4" />
      </svg>
    </button>
  );
}
