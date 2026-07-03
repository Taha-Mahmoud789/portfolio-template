/**
 * Transition Layer
 *
 * Manages enter/exit transitions for the world.
 * Integrates with the Animation Engine for choreographed transitions.
 * All timeouts are cleaned up on unmount.
 */

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import type {
  BaseTransitionLayerProps,
  BaseTransitionContextValue,
  BaseTransitionPhase,
} from "../../types";
import { BASE_TRANSITION_TIMING } from "../../constants";

// ============================================================================
// Context
// ============================================================================

const BaseTransitionContext = createContext<BaseTransitionContextValue>({
  phase: "none",
  enter: () => {
    // no-op default — overridden by provider
  },
  exit: () => Promise.resolve(),
});

function useBaseTransitionContextInternal(): BaseTransitionContextValue {
  return useContext(BaseTransitionContext);
}

// ============================================================================
// Component
// ============================================================================

export function BaseTransitionLayer({ children, className = "" }: BaseTransitionLayerProps) {
  const [phase, setPhaseState] = useState<BaseTransitionPhase>("none");
  const timeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const clearTimeouts = useCallback(() => {
    for (const t of timeoutsRef.current) {
      clearTimeout(t);
    }
    timeoutsRef.current.clear();
  }, []);

  useEffect(() => () => clearTimeouts(), [clearTimeouts]);

  const setPhase = useCallback((newPhase: BaseTransitionPhase) => {
    setPhaseState(newPhase);
  }, []);

  const enter = useCallback(() => {
    setPhase("entering");
    const t = setTimeout(() => {
      setPhase("entered");
      timeoutsRef.current.delete(t);
    }, BASE_TRANSITION_TIMING.enterDuration);
    timeoutsRef.current.add(t);
  }, [setPhase]);

  const exit = useCallback(async () => {
    setPhase("exiting");
    await new Promise<void>((resolve) => {
      const t = setTimeout(() => {
        setPhase("exited");
        timeoutsRef.current.delete(t);
        resolve();
      }, BASE_TRANSITION_TIMING.exitDuration);
      timeoutsRef.current.add(t);
    });
  }, [setPhase]);

  const value = useMemo<BaseTransitionContextValue>(
    () => ({
      phase,
      enter,
      exit,
    }),
    [phase, enter, exit],
  );

  const isVisible = phase !== "exited" && phase !== "none";

  return (
    <BaseTransitionContext.Provider value={value}>
      <div
        className={`base-world__transition ${className}`}
        data-transition-phase={phase}
        style={{
          opacity: phase === "exiting" ? 0 : 1,
          transition: `opacity ${String(BASE_TRANSITION_TIMING.exitDuration)}ms ${BASE_TRANSITION_TIMING.exitEasing}`,
        }}
        aria-hidden={!isVisible ? "true" : undefined}
      >
        {isVisible && children}
      </div>
    </BaseTransitionContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useBaseTransition(): BaseTransitionContextValue {
  return useBaseTransitionContextInternal();
}
