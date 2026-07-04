/**
 * Multiverse Hub Page
 *
 * The entry point to the Multiverse experience.
 * Dark infinite space with floating world cards.
 *
 * Uses shared worlds.config for all world data.
 * Editorial tone, not game menu.
 *
 * Reduced motion: no floating animations, static layout.
 * No-JS: page renders with no animations.
 */

import { useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router";
import { gsap } from "gsap";
import { ANIMATION_EASINGS } from "@/animation/constants";
import { ROUTES } from "@/constants/routes";
import { useAnalytics } from "@/hooks";
import { useReducedMotion } from "@/landing/hooks";
import { useMultiverseTransition } from "@/landing/components/multiverse-transition-store";
import { WorldCard } from "@/landing/components/world-card";
import { WORLDS, MULTIVERSE_HUB } from "@/content";

// ============================================================================
// Atmospheric background
// ============================================================================

function AtmosphericBackground() {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    const container = containerRef.current;
    const particles: HTMLDivElement[] = [];

    // Inject CSS keyframe once
    const styleId = "mv-particle-keyframes";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        @keyframes mv-float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(var(--dx), var(--dy)); }
        }
      `;
      document.head.appendChild(style);
    }

    const layers: readonly {
      count: number;
      sizeRange: [number, number];
      opacityRange: [number, number];
      speedRange: [number, number];
    }[] = [
      { count: 12, sizeRange: [1.5, 2.5], opacityRange: [0.08, 0.15], speedRange: [6, 10] },
      { count: 20, sizeRange: [1, 1.5], opacityRange: [0.04, 0.08], speedRange: [10, 16] },
      { count: 15, sizeRange: [0.5, 1], opacityRange: [0.02, 0.04], speedRange: [14, 22] },
    ];

    for (const layer of layers) {
      for (let i = 0; i < layer.count; i++) {
        const dot = document.createElement("div");
        const sizeMin = layer.sizeRange[0];
        const sizeMax = layer.sizeRange[1];
        const opacityMin = layer.opacityRange[0];
        const opacityMax = layer.opacityRange[1];
        const speedMin = layer.speedRange[0];
        const speedMax = layer.speedRange[1];
        const size = sizeMin + Math.random() * (sizeMax - sizeMin);
        const opacity = opacityMin + Math.random() * (opacityMax - opacityMin);
        const speed = speedMin + Math.random() * (speedMax - speedMin);
        const dx = -8 + Math.random() * 16;
        const dy = -15 + Math.random() * 30;

        dot.style.cssText = `
          position: absolute;
          width: ${String(size)}px;
          height: ${String(size)}px;
          border-radius: 50%;
          background: rgba(245, 240, 232, ${String(opacity)});
          left: ${String(Math.random() * 100)}%;
          top: ${String(Math.random() * 100)}%;
          pointer-events: none;
          --dx: ${String(dx)}px;
          --dy: ${String(dy)}px;
          animation: mv-float ${String(speed)}s ease-in-out infinite alternate;
          animation-delay: ${String(-Math.random() * speed)}s;
        `;
        container.appendChild(dot);
        particles.push(dot);
      }
    }

    return () => {
      particles.forEach((p) => p.remove());
      const styleEl = document.getElementById(styleId);
      if (styleEl) styleEl.remove();
    };
  }, [reducedMotion]);

  return (
    <>
      <div
        ref={containerRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 80% 50% at 50% 45%, rgba(201, 169, 110, 0.04) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 30% 60%, rgba(201, 169, 110, 0.015) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 70% 35%, rgba(96, 165, 250, 0.01) 0%, transparent 50%)
          `,
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.025,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
          pointerEvents: "none",
        }}
      />
    </>
  );
}

// ============================================================================
// Multiverse Hub
// ============================================================================

export default function MultiverseHub() {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const { setActive, startExit } = useMultiverseTransition();
  const returnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const analytics = useAnalytics("MultiverseHub");

  useEffect(() => {
    setActive();
  }, [setActive]);

  useEffect(() => {
    analytics.track("multiverse_entered", { referrer: document.referrer || "direct" });
  }, [analytics]);

  // Cleanup return timer on unmount
  useEffect(() => {
    return () => {
      if (returnTimerRef.current) clearTimeout(returnTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const els = [
        document.getElementById("mv-label"),
        document.getElementById("mv-heading"),
        document.getElementById("mv-subtitle"),
        document.getElementById("mv-grid"),
        document.getElementById("mv-back"),
      ].filter(Boolean) as HTMLElement[];

      els.forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            delay: 0.15 + i * 0.12,
            ease: ANIMATION_EASINGS.expoOut,
          },
        );
      });
    });

    return () => ctx.revert();
  }, [reducedMotion]);

  const handleReturn = useCallback(() => {
    analytics.track("multiverse_exited", { destination: "home", timeSpent: Date.now() });
    startExit();
    if (returnTimerRef.current) clearTimeout(returnTimerRef.current);
    returnTimerRef.current = setTimeout(() => {
      void navigate(ROUTES.HOME);
    }, 400);
  }, [startExit, navigate, analytics]);

  const handleSelectWorld = useCallback(
    (worldId: string) => {
      const world = WORLDS.find((w) => w.id === worldId);
      if (world) {
        analytics.track("multiverse_world_selected", { worldId: world.id, worldName: world.name });
        void navigate(world.route);
      }
    },
    [navigate, analytics],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleReturn();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleReturn]);

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "#050507",
        padding: "clamp(2rem, 5vw, 4rem)",
      }}
    >
      <AtmosphericBackground />

      <div
        className="relative z-10 flex flex-col items-center text-center w-full"
        style={{ maxWidth: 820 }}
      >
        <span
          id="mv-label"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(0.55rem, 0.65vw, 0.65rem)",
            fontWeight: 500,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(201, 169, 110, 0.4)",
            marginBottom: "clamp(1.5rem, 2.5vw, 2rem)",
            opacity: reducedMotion ? 1 : 0,
          }}
        >
          {MULTIVERSE_HUB.label}
        </span>

        <h1
          id="mv-heading"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)",
            fontWeight: 600,
            letterSpacing: "-0.035em",
            lineHeight: 1.05,
            color: "#f5f0e8",
            margin: "0 0 clamp(1rem, 1.5vw, 1.25rem) 0",
            opacity: reducedMotion ? 1 : 0,
          }}
        >
          {MULTIVERSE_HUB.heading.split("\n").map((part, i, arr) => (
            <span key={part}>
              {part}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </h1>

        <p
          id="mv-subtitle"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.9rem, 1vw, 1.05rem)",
            lineHeight: 1.7,
            color: "rgba(245, 240, 232, 0.38)",
            margin: "0 0 clamp(2.5rem, 4vw, 4rem) 0",
            maxWidth: 440,
            opacity: reducedMotion ? 1 : 0,
          }}
        >
          {MULTIVERSE_HUB.subtitle}
        </p>

        <div
          id="mv-grid"
          className="grid gap-3 w-full"
          style={{
            gridTemplateColumns: "repeat(3, 1fr)",
            maxWidth: 720,
            opacity: reducedMotion ? 1 : 0,
          }}
          role="list"
          aria-label="Worlds"
        >
          {WORLDS.map((world, i) => (
            <div role="listitem" key={world.id}>
              <WorldCard
                number={world.number}
                name={world.name}
                description={world.description}
                status={world.status}
                accentColor={world.accentColor}
                index={i}
                onSelect={handleSelectWorld}
              />
            </div>
          ))}
        </div>

        <div
          id="mv-back"
          style={{
            marginTop: "clamp(2.5rem, 4vw, 4rem)",
            opacity: reducedMotion ? 1 : 0,
          }}
        >
          <button
            type="button"
            onClick={handleReturn}
            className="group inline-flex items-center gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:rounded-full"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(0.55rem, 0.65vw, 0.65rem)",
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(245, 240, 232, 0.3)",
              padding: "0.75rem 1.5rem",
              borderRadius: 999,
              border: "1px solid rgba(245, 240, 232, 0.05)",
              background: "transparent",
              transition: "color 0.3s ease, border-color 0.3s ease",
            }}
            aria-label="Return to portfolio"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 ease-out group-hover:-translate-x-1"
              aria-hidden="true"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            {MULTIVERSE_HUB.backLabel}
          </button>
        </div>

        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.55rem",
            letterSpacing: "0.12em",
            color: "rgba(245, 240, 232, 0.12)",
            marginTop: "1.25rem",
          }}
        >
          <kbd
            style={{
              padding: "0.15em 0.4em",
              borderRadius: 3,
              border: "1px solid rgba(245, 240, 232, 0.08)",
              marginRight: "0.3em",
            }}
          >
            Esc
          </kbd>
          {MULTIVERSE_HUB.backHint}
        </p>
      </div>
    </section>
  );
}
