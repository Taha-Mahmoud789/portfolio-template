/**
 * PortalExperience
 *
 * Orchestrates the immersive portal transition from Landing to World Selection.
 * A single GSAP timeline drives every phase in perfect sync.
 * Responsive, accessible, 60 FPS.
 */

import { useEffect, useRef, useCallback, createContext, useContext } from "react";
import { gsap } from "gsap";
import { ANIMATION_EASINGS } from "@/animation/constants";
import { PortalOverlay } from "./portal-overlay";
import { PortalGlow } from "./portal-glow";
import { PortalRing } from "./portal-ring";
import { PortalParticles } from "./portal-particles";
import { PortalWaves } from "./portal-waves";
import { WorldSelection } from "./world-selection";
import { usePortalState } from "./use-portal-state";
import { useReducedMotion } from "../../hooks";

// ============================================================================
// Context
// ============================================================================

interface PortalContextValue {
  phase: ReturnType<typeof usePortalState>["phase"];
  activate: () => void;
  exit: () => void;
}

const PortalContext = createContext<PortalContextValue | null>(null);

export function usePortal(): PortalContextValue {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error("usePortal must be used within PortalExperience");
  return ctx;
}

// ============================================================================
// Focus management
// ============================================================================

function useSavedFocus() {
  const ref = useRef<Element | null>(null);
  const save = useCallback(() => {
    ref.current = document.activeElement;
  }, []);
  const restore = useCallback(() => {
    const el = ref.current;
    if (el && "focus" in el) {
      requestAnimationFrame(() => {
        (el as HTMLElement).focus();
      });
    }
  }, []);
  return { save, restore };
}

// ============================================================================
// Timeline — refined cinematic pacing
// ============================================================================
//
// 0.00  darkening         overlay begins fade
// 0.10  glowing           ambient glow appears
// 0.35  ring-forming      portal ring materializes
// 0.85  particles         orbiting particles emerge
// 1.30  camera-push       landing rushes forward (1.1s)
// 2.30  portal-expand     ring fills screen (0.9s)
// 3.10  world-selection   cards appear
//
// Total: ~3.1s  (reduced motion: instant)
// ============================================================================

const TIMINGS = {
  darkening: 0.0,
  glowing: 0.1,
  ringForming: 0.35,
  particles: 0.85,
  cameraPush: 1.3,
  portalExpand: 2.3,
  worldSelection: 3.1,
} as const;

const CAMERA_DURATION = 1.1;
const EXPAND_DURATION = 0.9;

// ============================================================================
// PortalExperience
// ============================================================================

interface PortalExperienceProps {
  children: React.ReactNode;
}

export function PortalExperience({ children }: PortalExperienceProps) {
  const state = usePortalState();
  const reducedMotion = useReducedMotion();
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const landingRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const shakeRef = useRef<HTMLDivElement>(null);
  const focus = useSavedFocus();

  // ── Build master timeline ──────────────────────────────────────────

  const buildTimeline = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        state.setPhase("world-selection");
      },
    });

    // Phase markers
    tl.call(() => state.setPhase("darkening"), undefined, TIMINGS.darkening);
    tl.call(() => state.setPhase("glowing"), undefined, TIMINGS.glowing);
    tl.call(() => state.setPhase("ring-forming"), undefined, TIMINGS.ringForming);
    tl.call(() => state.setPhase("particles"), undefined, TIMINGS.particles);

    // Camera push: anticipation → forward rush with shake
    tl.call(() => state.setPhase("camera-push"), undefined, TIMINGS.cameraPush);

    // Anticipation: brief pull-back before the push
    if (landingRef.current) {
      tl.to(
        landingRef.current,
        {
          scale: 0.97,
          duration: 0.12,
          ease: ANIMATION_EASINGS.expoIn,
        },
        TIMINGS.cameraPush,
      );

      // Main camera push with stronger depth
      tl.to(
        landingRef.current,
        {
          scale: 1.4,
          rotateX: -8,
          rotateY: 2,
          translateZ: 400,
          filter: "blur(14px)",
          opacity: 0,
          duration: CAMERA_DURATION,
          ease: "power3.in",
        },
        TIMINGS.cameraPush + 0.12,
      );
    }

    // Camera shake during push
    if (shakeRef.current) {
      tl.fromTo(
        shakeRef.current,
        { x: 0, y: 0 },
        {
          x: "random(-3, 3, 1)",
          y: "random(-2, 2, 1)",
          duration: 0.06,
          repeat: 14,
          yoyo: true,
          ease: "none",
        },
        TIMINGS.cameraPush + 0.2,
      );
      tl.to(shakeRef.current, { x: 0, y: 0, duration: 0.1 }, TIMINGS.cameraPush + 1.0);
    }

    // Portal expansion
    tl.call(() => state.setPhase("portal-expand"), undefined, TIMINGS.portalExpand);
    tl.to(
      landingRef.current ?? {},
      {
        opacity: 0,
        duration: 0.15,
        ease: "power4.in",
      },
      TIMINGS.portalExpand,
    );

    // Iris flash: circular white-out bridging expand → world-selection
    if (flashRef.current) {
      tl.fromTo(
        flashRef.current,
        { opacity: 0, scale: 0.15 },
        { opacity: 1, scale: 3.5, duration: 0.45, ease: ANIMATION_EASINGS.expoIn },
        TIMINGS.portalExpand + 0.25,
      );
      tl.to(
        flashRef.current,
        { opacity: 0, duration: 0.7, ease: ANIMATION_EASINGS.expoOut },
        TIMINGS.portalExpand + 0.65,
      );
    }

    tl.to({}, { duration: EXPAND_DURATION + 0.2 }, TIMINGS.portalExpand);

    timelineRef.current = tl;
    return tl;
  }, [state]);

  // ── Activate ──────────────────────────────────────────────────────

  const activate = useCallback(() => {
    if (state.phase !== "idle" && state.phase !== "cancelled") return;

    focus.save();
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    state.activate();

    requestAnimationFrame(() => {
      const tl = buildTimeline();
      if (reducedMotion) {
        tl.progress(1);
      } else {
        tl.play();
      }
    });
  }, [state, buildTimeline, focus, reducedMotion]);

  // ── Cancel mid-transition ─────────────────────────────────────────

  const cancel = useCallback(() => {
    if (
      state.phase === "idle" ||
      state.phase === "world-selection" ||
      state.phase === "cancelled" ||
      state.phase === "exiting"
    )
      return;

    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    state.cancel();

    if (landingRef.current) {
      gsap.to(landingRef.current, {
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        translateZ: 0,
        filter: "blur(0px)",
        opacity: 1,
        duration: 0.6,
        ease: ANIMATION_EASINGS.expoOut,
        onComplete: () => {
          document.body.style.overflow = "";
          document.documentElement.style.overflow = "";
          state.setPhase("idle");
          focus.restore();
        },
      });
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      state.setPhase("idle");
      focus.restore();
    }
  }, [state, focus]);

  // ── Exit world selection ──────────────────────────────────────────

  const exitWorldSelection = useCallback(() => {
    if (state.phase !== "world-selection") return;

    state.exit();

    const worldEl = document.querySelector("[aria-label='World Selection']");
    if (worldEl) {
      gsap.to(worldEl, { opacity: 0, scale: 0.97, duration: 0.4, ease: ANIMATION_EASINGS.expoIn });
    }

    if (landingRef.current) {
      gsap.to(landingRef.current, {
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        translateZ: 0,
        filter: "blur(0px)",
        opacity: 1,
        duration: 0.6,
        ease: ANIMATION_EASINGS.expoOut,
        delay: 0.15,
        onComplete: () => {
          document.body.style.overflow = "";
          document.documentElement.style.overflow = "";
          state.reset();
          focus.restore();
        },
      });
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      state.reset();
      focus.restore();
    }
  }, [state, focus]);

  // ── Keyboard: ESC ─────────────────────────────────────────────────

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (state.phase === "world-selection") {
          exitWorldSelection();
        } else if (
          state.phase !== "idle" &&
          state.phase !== "cancelled" &&
          state.phase !== "exiting"
        ) {
          cancel();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [state.phase, cancel, exitWorldSelection]);

  // ── Focus management ──────────────────────────────────────────────

  useEffect(() => {
    if (state.phase === "world-selection") {
      requestAnimationFrame(() => {
        const card = document.querySelector<HTMLElement>(
          "[aria-label='World Selection'] [role='button']",
        );
        if (card) card.focus();
      });
    }
  }, [state.phase]);

  // ── Cleanup ───────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (timelineRef.current) timelineRef.current.kill();
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  // ── Render ────────────────────────────────────────────────────────

  const portalPhase = state.phase;

  return (
    <PortalContext.Provider value={{ phase: portalPhase, activate, exit: exitWorldSelection }}>
      {/* Landing content — perspective container for 3D camera push */}
      <div
        ref={landingRef}
        style={{
          position: "relative",
          zIndex: 1,
          perspective: 1200,
          transformStyle: "preserve-3d",
          willChange: "transform, filter, opacity",
        }}
      >
        {children}
      </div>

      {/* Camera shake container */}
      <div
        ref={shakeRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          pointerEvents: "none",
          willChange: "transform",
        }}
      />

      {/* Transition live region for screen readers */}
      <div
        role="status"
        aria-live="polite"
        aria-roledescription="portal transition"
        className="sr-only"
      >
        {portalPhase === "darkening" && "Portal opening. Transition in progress."}
        {portalPhase === "glowing" && "Portal energy building."}
        {portalPhase === "ring-forming" && "Portal ring forming."}
        {portalPhase === "particles" && "Portal stabilizing."}
        {portalPhase === "camera-push" && "Entering portal."}
        {portalPhase === "portal-expand" && "Portal expanding. World selection approaching."}
        {portalPhase === "world-selection" &&
          "Portal transition complete. World selection available with 3 worlds. Use arrow keys to navigate, Enter to select, Escape to return."}
      </div>

      {/* Portal layers */}
      <PortalOverlay
        active={
          portalPhase !== "idle" &&
          portalPhase !== "cancelled" &&
          portalPhase !== "world-selection" &&
          portalPhase !== "exiting"
        }
      />
      <PortalGlow phase={portalPhase} />
      <PortalRing phase={portalPhase} />
      <PortalWaves phase={portalPhase} />
      <PortalParticles phase={portalPhase} />

      {/* Destination */}
      <WorldSelection visible={portalPhase === "world-selection"} onExit={exitWorldSelection} />

      {/* Iris flash — bridges portal-expand → world-selection */}
      <div
        ref={flashRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 105,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(191, 219, 254, 0.95) 0%, rgba(147, 197, 253, 0.6) 25%, rgba(59, 130, 246, 0.25) 55%, transparent 75%)",
          opacity: 0,
          pointerEvents: "none",
          willChange: "transform, opacity",
          transform: "scale(0.15)",
        }}
      />
    </PortalContext.Provider>
  );
}
