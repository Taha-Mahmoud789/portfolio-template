/**
 * Experience Provider
 *
 * Wires up the Experience Engine: initializes all managers,
 * provides split contexts (actions + state), and cleans up on unmount.
 * Creates aria-live region for screen reader announcements.
 */

import { useCallback, useEffect, useMemo, useRef, type ReactNode } from "react";
import {
  ExperienceActionsContext,
  ExperienceStateContext,
} from "./context";
import { useExperienceStore, selectInteractionState, selectCursorState, selectIsInitialized, selectReducedMotion, selectLifecyclePhase, selectActiveSceneId, selectIsVisible } from "./store";
import { InteractionManager } from "./interaction-manager";
import { experienceEvents } from "./events";
import type { ExperienceActions, ExperienceState } from "./types";
import { A11Y } from "./constants";

// ============================================================================
// Provider
// ============================================================================

interface ExperienceProviderProps {
  children: ReactNode;
}

export function ExperienceProvider({ children }: ExperienceProviderProps) {
  const isInitialized = useRef(false);

  // --- Store selectors (only low-frequency state) ---
  const interactionState = useExperienceStore(selectInteractionState);
  const cursorState = useExperienceStore(selectCursorState);
  const isEngineInitialized = useExperienceStore(selectIsInitialized);
  const reducedMotion = useExperienceStore(selectReducedMotion);
  const lifecyclePhase = useExperienceStore(selectLifecyclePhase);
  const activeSceneId = useExperienceStore(selectActiveSceneId);
  const isVisible = useExperienceStore(selectIsVisible);

  // --- Store actions ---
  const setInteractionState = useExperienceStore((s) => s.setInteractionState);
  const setCursorState = useExperienceStore((s) => s.setCursorState);
  const setActiveScene = useExperienceStore((s) => s.setActiveScene);

  // --- Initialize once ---
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    InteractionManager.init();

    // Create aria-live region for announcements
    createLiveRegion();

    return () => {
      InteractionManager.destroy();
      removeLiveRegion();
    };
  }, []);

  // --- Apply cursor to body ---
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.cursor = cursorState === "default" ? "" : cursorState;
    }
  }, [cursorState]);

  // --- Actions (stable) ---
  const on = useCallback(
    (event: string, callback: (data: unknown) => void) => {
      return experienceEvents.on(event as never, callback);
    },
    []
  );

  const emit = useCallback(
    (event: string, data: unknown) => {
      experienceEvents.emit(event as never, data);
    },
    []
  );

  // --- Actions value (stable) ---
  const actionsValue = useMemo<ExperienceActions>(
    () => ({
      setInteractionState,
      setCursorState,
      setActiveScene,
      on: on,
      emit: emit,
    }),
    [setInteractionState, setCursorState, setActiveScene, on, emit]
  );

  // --- State value (reactive, low-frequency only) ---
  const stateValue = useMemo<ExperienceState>(
    () => ({
      interactionState,
      cursorState,
      isInitialized: isEngineInitialized,
      reducedMotion,
      lifecyclePhase,
      activeSceneId,
      isVisible,
    }),
    [
      interactionState,
      cursorState,
      isEngineInitialized,
      reducedMotion,
      lifecyclePhase,
      activeSceneId,
      isVisible,
    ]
  );

  return (
    <ExperienceActionsContext.Provider value={actionsValue}>
      <ExperienceStateContext.Provider value={stateValue}>
        {children}
      </ExperienceStateContext.Provider>
    </ExperienceActionsContext.Provider>
  );
}

// ============================================================================
// Aria-live Region
// ============================================================================

function createLiveRegion(): void {
  if (typeof document === "undefined") return;

  const existing = document.getElementById(A11Y.LIVE_REGION_ID);
  if (existing) return;

  const region = document.createElement("div");
  region.id = A11Y.LIVE_REGION_ID;
  region.setAttribute("role", "status");
  region.setAttribute("aria-live", "polite");
  region.setAttribute("aria-atomic", "true");
  region.className = A11Y.SR_ONLY_CLASS;
  document.body.appendChild(region);
}

function removeLiveRegion(): void {
  if (typeof document === "undefined") return;

  const region = document.getElementById(A11Y.LIVE_REGION_ID);
  if (region && document.body.contains(region)) {
    document.body.removeChild(region);
  }
}
