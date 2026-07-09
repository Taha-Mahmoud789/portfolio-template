/**
 * Intro Section — Cinematic mask reveals
 *
 * Each line reveals via clip-path mask.
 * Staggered entrance with scroll trigger.
 */

import { useRef, useCallback } from "react";
import { useScrollReveal } from "../hooks";
import { INTRO } from "@/content";

export function Intro() {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const line3Ref = useRef<HTMLDivElement>(null);
  const verticalLineRef = useRef<HTMLDivElement>(null);

  const onReveal = useCallback(
    (tl: Parameters<Parameters<typeof useScrollReveal>[1]["onReveal"]>[0], isReduced: boolean) => {
      if (isReduced) {
        [line1Ref, line2Ref, line3Ref].forEach((r) => {
          if (r.current) r.current.style.opacity = "1";
        });
        return;
      }

      if (verticalLineRef.current) {
        tl.fromTo(
          verticalLineRef.current,
          { scaleY: 0, transformOrigin: "top" },
          { scaleY: 1, duration: 1.2 },
          0,
        );
      }

      if (line1Ref.current) {
        tl.fromTo(
          line1Ref.current,
          { clipPath: "inset(0 100% 0 0)", opacity: 1 },
          { clipPath: "inset(0 0% 0 0)", duration: 1 },
          0.3,
        );
      }

      if (line2Ref.current) {
        tl.fromTo(
          line2Ref.current,
          { clipPath: "inset(0 100% 0 0)", opacity: 1 },
          { clipPath: "inset(0 0% 0 0)", duration: 1 },
          0.5,
        );
      }

      if (line3Ref.current) {
        tl.fromTo(
          line3Ref.current,
          { clipPath: "inset(0 100% 0 0)", opacity: 1 },
          { clipPath: "inset(0 0% 0 0)", duration: 1 },
          0.7,
        );
      }
    },
    [],
  );

  useScrollReveal(sectionRef, { threshold: 0.3, onReveal });

  return (
    <section
      ref={sectionRef}
      id="intro"
      aria-label="Introduction"
      style={{
        position: "relative",
        padding: "clamp(6rem, 16vh, 14rem) clamp(1.5rem, 5vw, 6rem)",
        background: "#0B0F1A",
        overflow: "hidden",
      }}
    >
      <div
        ref={verticalLineRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "clamp(1.5rem, 5vw, 6rem)",
          top: "10%",
          bottom: "10%",
          width: 1,
          background:
            "linear-gradient(180deg, transparent 0%, rgba(241, 245, 249, 0.06) 50%, transparent 100%)",
          transformOrigin: "top",
        }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            letterSpacing: "-0.03em",
          }}
        >
          <div
            ref={line1Ref}
            style={{
              fontSize: "clamp(2.25rem, 6vw, 5rem)",
              lineHeight: 1.05,
              color: "rgba(148, 163, 184, 0.5)",
              willChange: "clip-path",
              marginBottom: "clamp(0.25rem, 0.5vw, 0.5rem)",
            }}
          >
            {INTRO.line1}
          </div>

          <div
            ref={line2Ref}
            style={{
              fontSize: "clamp(2.25rem, 6vw, 5rem)",
              lineHeight: 1.05,
              color: "rgba(148, 163, 184, 0.5)",
              willChange: "clip-path",
              marginBottom: "clamp(0.25rem, 0.5vw, 0.5rem)",
            }}
          >
            <span style={{ color: "rgba(241, 245, 249, 0.95)" }}>{INTRO.line2.split(" ")[0]}</span>{" "}
            {INTRO.line2.split(" ").slice(1).join(" ")}
          </div>

          <div
            ref={line3Ref}
            style={{
              fontSize: "clamp(2.25rem, 6vw, 5rem)",
              lineHeight: 1.05,
              color: "rgba(148, 163, 184, 0.5)",
              willChange: "clip-path",
            }}
          >
            {INTRO.line3.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="gradient-text">last</span>.
          </div>
        </div>
      </div>
    </section>
  );
}
