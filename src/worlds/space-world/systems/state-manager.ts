/**
 * State Manager
 *
 * Manages world phase transitions.
 * Phases: intro → exploring → focused → transitioning
 *
 * Uses ref for callback to avoid re-creating state machine on every render.
 */

import { useCallback, useRef, useState } from "react";
import type { WorldPhase } from "../data/types";

interface StateManager {
  readonly phase: WorldPhase;
  readonly previousPhase: WorldPhase | null;
  setPhase: (phase: WorldPhase) => void;
  canTransition: (to: WorldPhase) => boolean;
}

const VALID_TRANSITIONS: Record<WorldPhase, readonly WorldPhase[]> = {
  intro: ["exploring"],
  exploring: ["focused", "transitioning"],
  focused: ["exploring", "transitioning"],
  transitioning: ["intro", "exploring", "focused"],
} as const;

export function createStateManager(): StateManager {
  let phase: WorldPhase = "intro";
  let previousPhase: WorldPhase | null = null;

  const canTransition = (to: WorldPhase): boolean => {
    return VALID_TRANSITIONS[phase].includes(to);
  };

  const setPhase = (next: WorldPhase) => {
    if (!canTransition(next)) return;
    previousPhase = phase;
    phase = next;
  };

  return {
    get phase() {
      return phase;
    },
    get previousPhase() {
      return previousPhase;
    },
    setPhase,
    canTransition,
  };
}

// ============================================================================
// React Hook
// ============================================================================

export function useSpaceState(onChange?: (from: WorldPhase, to: WorldPhase) => void) {
  const managerRef = useRef<StateManager | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const [phase, setPhaseState] = useState<WorldPhase>("intro");

  managerRef.current ??= createStateManager();

  const setPhase = useCallback((next: WorldPhase) => {
    const mgr = managerRef.current;
    if (!mgr) return;
    const prev = mgr.phase;
    mgr.setPhase(next);
    if (mgr.phase !== prev) {
      setPhaseState(mgr.phase);
      onChangeRef.current?.(prev, mgr.phase);
    }
  }, []);

  return {
    phase,
    previousPhase: managerRef.current.previousPhase,
    setPhase,
    canTransition: managerRef.current.canTransition,
  };
}
