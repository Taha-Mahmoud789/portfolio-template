/**
 * Preloader — Ultra Premium (Awwwards-Grade v2)
 *
 * - Counter 00→100 with stepped feel + trail echoes
 * - Circular arc gauge filling around the counter
 * - Concentric rings expanding outward
 * - Radiating lines from center
 * - Outer spinning ring
 * - Pulsing core glow synced with counter
 * - Floating particles
 * - Film grain overlay
 * - Vignette
 * - "LOADING" label
 * - Corner brackets
 * - Clip-path curtain exit
 */

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "../hooks";

interface PreloaderProps {
  onComplete: () => void;
}

const RING_COUNT = 4;
const LINE_COUNT = 12;
const PARTICLE_COUNT = 20;
const ARC_RADIUS = 105;
const ARC_CIRCUMFERENCE = 2 * Math.PI * ARC_RADIUS;

export function Preloader({ onComplete }: PreloaderProps) {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const coreGlowRef = useRef<HTMLDivElement>(null);
  const outerRingRef = useRef<HTMLDivElement>(null);
  const centerGroupRef = useRef<HTMLDivElement>(null);
  const ringsContainerRef = useRef<HTMLDivElement>(null);
  const linesContainerRef = useRef<HTMLDivElement>(null);
  const particlesContainerRef = useRef<HTMLDivElement>(null);
  const progressWrapRef = useRef<HTMLDivElement>(null);
  const loadingLabelRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const handleCompleteRef = useRef(onComplete);
  handleCompleteRef.current = onComplete;

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    if (reducedMotion) {
      handleCompleteRef.current();
      return;
    }

    const container = containerRef.current;
    const counter = counterRef.current;
    const trail = trailRef.current;
    const arc = arcRef.current;
    const progressFill = progressFillRef.current;
    const core = coreRef.current;
    const coreGlow = coreGlowRef.current;
    const outerRing = outerRingRef.current;
    const centerGroup = centerGroupRef.current;
    const ringsContainer = ringsContainerRef.current;
    const linesContainer = linesContainerRef.current;
    const particlesContainer = particlesContainerRef.current;
    const progressWrap = progressWrapRef.current;
    const loadingLabel = loadingLabelRef.current;

    if (
      !container ||
      !counter ||
      !trail ||
      !arc ||
      !progressFill ||
      !core ||
      !coreGlow ||
      !outerRing ||
      !centerGroup ||
      !ringsContainer ||
      !linesContainer ||
      !particlesContainer ||
      !progressWrap ||
      !loadingLabel
    )
      return;

    const rings = ringsContainer.querySelectorAll<HTMLElement>("[data-ring]");
    const lines = linesContainer.querySelectorAll<HTMLElement>("[data-line]");
    const corners = container.querySelectorAll<HTMLElement>("[data-corner]");
    const particles = particlesContainer.querySelectorAll<HTMLElement>("[data-particle]");

    gsap.set(counter, { opacity: 0, y: 40 });
    gsap.set(trail, { opacity: 0 });
    gsap.set(arc, { strokeDashoffset: ARC_CIRCUMFERENCE });
    gsap.set(progressFill, { scaleX: 0 });
    gsap.set(progressWrap, { opacity: 0 });
    gsap.set(core, { scale: 0, opacity: 0 });
    gsap.set(coreGlow, { scale: 0, opacity: 0 });
    gsap.set(outerRing, { scale: 0.3, opacity: 0, rotation: 0 });
    gsap.set(rings, { scale: 0.5, opacity: 0 });
    gsap.set(lines, { scaleY: 0, opacity: 0 });
    gsap.set(corners, { opacity: 0, scale: 0.8 });
    gsap.set(centerGroup, { opacity: 0 });
    gsap.set(particles, { opacity: 0, scale: 0 });
    gsap.set(loadingLabel, { opacity: 0, y: 10 });

    const tl = gsap.timeline();

    // ── Phase 1: Entrance (0 → 1.4s) ───────────────────────
    tl.to(centerGroup, { opacity: 1, duration: 0.3 }, 0);
    tl.to(coreGlow, { scale: 1, opacity: 0.6, duration: 1, ease: "power2.out" }, 0);
    tl.to(core, { scale: 1, opacity: 1, duration: 0.8, ease: "elastic.out(1, 0.5)" }, 0.05);
    tl.to(outerRing, { scale: 1, opacity: 1, duration: 0.8, ease: "power3.out" }, 0.1);
    tl.to(
      rings,
      { scale: 1, opacity: 1, duration: 0.6, stagger: 0.08, ease: "back.out(1.4)" },
      0.15,
    );
    tl.to(
      lines,
      { scaleY: 1, opacity: 1, duration: 0.4, stagger: 0.025, ease: "power2.out" },
      0.25,
    );
    tl.to(
      particles,
      { opacity: 1, scale: 1, duration: 0.6, stagger: 0.03, ease: "back.out(2)" },
      0.3,
    );
    tl.to(counter, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, 0.35);
    tl.to(trail, { opacity: 0.15, duration: 0.4 }, 0.4);
    tl.to(progressWrap, { opacity: 1, duration: 0.4 }, 0.5);
    tl.to(loadingLabel, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.55);
    tl.to(corners, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }, 0.5);

    // ── Phase 2: Counter + arc + progress (1.4 → 4.2s) ─────
    const counterProxy = { value: 0 };
    tl.to(
      counterProxy,
      {
        value: 100,
        duration: 2.8,
        ease: "none",
        onUpdate() {
          const raw = counterProxy.value;
          const stepped = Math.round(raw / 5) * 5;
          const v = Math.min(stepped, 100);
          const display = v < 100 ? String(v).padStart(2, "0") : String(v);
          counter.textContent = display;
          trail.textContent = display;

          // Arc progress
          const progress = raw / 100;
          gsap.set(arc, {
            strokeDashoffset: ARC_CIRCUMFERENCE * (1 - progress),
          });

          // Core pulse on steps
          if (v !== Math.round((raw - 5) / 5) * 5) {
            gsap.fromTo(core, { scale: 1.3 }, { scale: 1, duration: 0.3, ease: "power2.out" });
            gsap.fromTo(
              coreGlow,
              { scale: 1.5, opacity: 0.9 },
              { scale: 1, opacity: 0.6, duration: 0.5, ease: "power2.out" },
            );
          }
        },
      },
      0.9,
    );

    tl.to(
      progressFill,
      {
        scaleX: 1,
        duration: 2.8,
        ease: "power1.inOut",
      },
      0.9,
    );

    tl.to(
      outerRing,
      {
        rotation: 360,
        duration: 3,
        ease: "none",
      },
      0.9,
    );

    // Particle orbits
    particles.forEach((p, i) => {
      const angle = (360 / PARTICLE_COUNT) * i;
      tl.to(
        p,
        {
          rotation: angle + 180,
          duration: 4 + (i % 3) * 0.5,
          ease: "none",
          repeat: -1,
        },
        0.9,
      );
    });

    // ── Phase 3: Rings expand outward while counting ────────
    rings.forEach((ring, i) => {
      tl.to(
        ring,
        {
          scale: 1.8 + i * 0.3,
          opacity: 0,
          duration: 2,
          ease: "power1.out",
        },
        1.2 + i * 0.15,
      );
    });

    tl.to(lines, { opacity: 0, duration: 0.6 }, 3);

    // ── Phase 4: Hold ───────────────────────────────────────
    tl.to({}, { duration: 0.4 });

    // ── Phase 5: Exit — shrink elements ─────────────────────
    tl.to([counter, trail, core, coreGlow, outerRing], {
      scale: 0.6,
      opacity: 0,
      duration: 0.5,
      stagger: 0.03,
      ease: "power2.in",
    });

    tl.to(progressWrap, { opacity: 0, duration: 0.3 }, "<");
    tl.to(loadingLabel, { opacity: 0, y: -10, duration: 0.3 }, "<");
    tl.to(corners, { opacity: 0, scale: 0.8, duration: 0.3, stagger: 0.03 }, "<");
    tl.to(particles, { opacity: 0, scale: 0, duration: 0.3, stagger: 0.01 }, "<");

    // ── Phase 6: Curtain — clip-path wipe up ────────────────
    tl.to(
      container,
      {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.9,
        ease: "power3.inOut",
        onComplete() {
          handleCompleteRef.current();
        },
      },
      "-=0.15",
    );

    return () => {
      tl.kill();
      hasAnimated.current = false;
    };
  }, [reducedMotion]);

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
        background: "#080706",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Skip button */}
      <button
        type="button"
        onClick={() => handleCompleteRef.current()}
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[10000] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:bg-white/10 focus:rounded-lg focus:outline-none focus:border focus:border-white/20"
        aria-label="Skip loading animation"
      >
        Skip
      </button>

      {/* Film grain overlay */}
      <div
        ref={grainRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "-50%",
          width: "200%",
          height: "200%",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
          opacity: 0.5,
          animation: "preloader-grain 0.5s steps(1) infinite",
          pointerEvents: "none",
          zIndex: 100,
        }}
      />

      {/* Vignette */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
          pointerEvents: "none",
          zIndex: 99,
        }}
      />

      {/* Background grid */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(245,240,232,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(245,240,232,0.01) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* ── Center group ──────────────────────────────────── */}
      <div
        ref={centerGroupRef}
        style={{
          position: "relative",
          width: 320,
          height: 320,
        }}
      >
        {/* Radiating lines */}
        <div ref={linesContainerRef} style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: LINE_COUNT }).map((_, i) => {
            const angle = (360 / LINE_COUNT) * i;
            return (
              <div
                key={`line-${String(i)}`}
                data-line
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: 1,
                  height: 145,
                  transformOrigin: "top center",
                  transform: `translate(-50%, 0) rotate(${String(angle)}deg)`,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(180deg, rgba(201,169,110,0.15) 0%, rgba(201,169,110,0) 100%)",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Floating particles — orbit around center */}
        <div
          ref={particlesContainerRef}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          {Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
            const orbitRadius = 80 + (i % 4) * 25;
            const angle = (360 / PARTICLE_COUNT) * i;
            const size = 1.5 + (i % 3);
            return (
              <div
                key={`particle-${String(i)}`}
                data-particle
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: size,
                  height: size,
                  borderRadius: "50%",
                  backgroundColor: `rgba(201,169,110,${String(0.2 + (i % 4) * 0.15)})`,
                  transform: `translate(-50%, -50%) rotate(${String(angle)}deg) translateY(-${String(orbitRadius)}px)`,
                  boxShadow: `0 0 ${String(4 + (i % 3) * 2)}px rgba(201,169,110,${String(0.15 + (i % 3) * 0.1)})`,
                }}
              />
            );
          })}
        </div>

        {/* Concentric rings */}
        <div ref={ringsContainerRef} style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: RING_COUNT }).map((_, i) => {
            const size = 80 + i * 50;
            return (
              <div
                key={`ring-${String(i)}`}
                data-ring
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: size,
                  height: size,
                  borderRadius: "50%",
                  border: "1px solid rgba(201, 169, 110, 0.06)",
                  transform: "translate(-50%, -50%)",
                }}
              />
            );
          })}
        </div>

        {/* Outer spinning ring */}
        <div
          ref={outerRingRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 250,
            height: 250,
            borderRadius: "50%",
            border: "1px solid rgba(245, 240, 232, 0.03)",
            borderTopColor: "rgba(201, 169, 110, 0.35)",
            borderRightColor: "rgba(201, 169, 110, 0.1)",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Circular arc gauge */}
        <svg
          width={320}
          height={320}
          viewBox="0 0 320 320"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            transform: "rotate(-90deg)",
            pointerEvents: "none",
          }}
        >
          {/* Arc track */}
          <circle
            cx={160}
            cy={160}
            r={ARC_RADIUS}
            fill="none"
            stroke="rgba(201,169,110,0.05)"
            strokeWidth={1.5}
          />
          {/* Arc fill */}
          <circle
            ref={arcRef}
            cx={160}
            cy={160}
            r={ARC_RADIUS}
            fill="none"
            stroke="rgba(201,169,110,0.5)"
            strokeWidth={1.5}
            strokeDasharray={ARC_CIRCUMFERENCE}
            strokeDashoffset={ARC_CIRCUMFERENCE}
            strokeLinecap="round"
            style={{
              filter: "drop-shadow(0 0 6px rgba(201,169,110,0.3))",
            }}
          />
        </svg>

        {/* Core glow (large, soft) */}
        <div
          ref={coreGlowRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 60,
            height: 60,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(201,169,110,0.2) 0%, rgba(201,169,110,0) 70%)",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Core dot */}
        <div
          ref={coreRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: "rgba(201,169,110,0.85)",
            boxShadow: "0 0 20px rgba(201,169,110,0.35), 0 0 60px rgba(201,169,110,0.15)",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Trail echo (ghost number behind) */}
        <div
          ref={trailRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(3.5rem, 8vw, 5.5rem)",
            fontWeight: 300,
            letterSpacing: "-0.03em",
            color: "rgba(201,169,110,0.2)",
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
            textAlign: "center",
            width: "4ch",
            pointerEvents: "none",
            filter: "blur(2px)",
          }}
        >
          00
        </div>

        {/* Counter */}
        <div
          ref={counterRef}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(3.5rem, 8vw, 5.5rem)",
            fontWeight: 300,
            letterSpacing: "-0.03em",
            color: "rgba(245, 240, 232, 0.92)",
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
            textAlign: "center",
            width: "4ch",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          00
        </div>
      </div>

      {/* ── "LOADING" label ──────────────────────────────── */}
      <div
        ref={loadingLabelRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 88,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "0.65rem",
          fontWeight: 500,
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: "rgba(180, 170, 155, 0.2)",
          pointerEvents: "none",
        }}
      >
        Loading
      </div>

      {/* ── Progress bar — bottom center ──────────────────── */}
      <div
        ref={progressWrapRef}
        style={{
          position: "absolute",
          bottom: 56,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 160,
            height: 1,
            backgroundColor: "rgba(245, 240, 232, 0.03)",
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <div
            ref={progressFillRef}
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(90deg, rgba(201,169,110,0.15), rgba(201,169,110,0.7))",
              borderRadius: 1,
              transformOrigin: "left center",
              boxShadow: "0 0 16px rgba(201,169,110,0.35)",
            }}
          />
        </div>
      </div>

      {/* ── Corner brackets ───────────────────────────────── */}
      {(["tl", "tr", "bl", "br"] as const).map((pos) => (
        <div
          key={`corner-${pos}`}
          data-corner
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 28,
            height: 28,
            ...(pos === "tl" && {
              top: 40,
              left: 40,
              borderTop: "1px solid rgba(245,240,232,0.06)",
              borderLeft: "1px solid rgba(245,240,232,0.06)",
            }),
            ...(pos === "tr" && {
              top: 40,
              right: 40,
              borderTop: "1px solid rgba(245,240,232,0.06)",
              borderRight: "1px solid rgba(245,240,232,0.06)",
            }),
            ...(pos === "bl" && {
              bottom: 40,
              left: 40,
              borderBottom: "1px solid rgba(245,240,232,0.06)",
              borderLeft: "1px solid rgba(245,240,232,0.06)",
            }),
            ...(pos === "br" && {
              bottom: 40,
              right: 40,
              borderBottom: "1px solid rgba(245,240,232,0.06)",
              borderRight: "1px solid rgba(245,240,232,0.06)",
            }),
          }}
        />
      ))}

      {/* Grain animation keyframes */}
      <style>{`
        @keyframes preloader-grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -10%); }
          20% { transform: translate(-15%, 5%); }
          30% { transform: translate(7%, -25%); }
          40% { transform: translate(-5%, 25%); }
          50% { transform: translate(-15%, 10%); }
          60% { transform: translate(15%, 0%); }
          70% { transform: translate(0%, 15%); }
          80% { transform: translate(3%, 35%); }
          90% { transform: translate(-10%, 10%); }
        }
      `}</style>
    </div>
  );
}
