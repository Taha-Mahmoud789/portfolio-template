/**
 * usePortalState
 *
 * Minimal state machine for the Portal Experience.
 * Manages phase transitions and provides a GSAP timeline reference.
 */

import { useState, useCallback, useRef } from "react";

export type PortalPhase =
  | "idle"
  | "darkening"
  | "glowing"
  | "ring-forming"
  | "particles"
  | "camera-push"
  | "portal-expand"
  | "world-selection"
  | "exiting"
  | "cancelled";

interface UsePortalStateReturn {
  phase: PortalPhase;
  isOpen: boolean;
  isTransitioning: boolean;
  activate: () => void;
  setPhase: (phase: PortalPhase) => void;
  cancel: () => void;
  exit: () => void;
  reset: () => void;
}

export function usePortalState(): UsePortalStateReturn {
  const [phase, setPhaseState] = useState<PortalPhase>("idle");
  const phaseRef = useRef<PortalPhase>("idle");

  const isOpen = phase === "world-selection";
  const isTransitioning =
    phase !== "idle" &&
    phase !== "world-selection" &&
    phase !== "exiting" &&
    phase !== "cancelled";

  const setPhase = useCallback((next: PortalPhase) => {
    phaseRef.current = next;
    setPhaseState(next);
  }, []);

  const activate = useCallback(() => {
    if (phaseRef.current !== "idle" && phaseRef.current !== "cancelled") return;
    phaseRef.current = "darkening";
    setPhaseState("darkening");
  }, []);

  const cancel = useCallback(() => {
    phaseRef.current = "cancelled";
    setPhaseState("cancelled");
  }, []);

  const exit = useCallback(() => {
    phaseRef.current = "exiting";
    setPhaseState("exiting");
  }, []);

  const reset = useCallback(() => {
    phaseRef.current = "idle";
    setPhaseState("idle");
  }, []);

  return {
    phase,
    isOpen,
    isTransitioning,
    activate,
    setPhase,
    cancel,
    exit,
    reset,
  };
}
