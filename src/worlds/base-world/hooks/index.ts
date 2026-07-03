/**
 * Base World Hooks
 *
 * React hooks for consuming the Base World foundation.
 * All hooks use stable selectors to prevent unnecessary rerenders.
 */

import { useMemo } from "react";
import { useBaseWorldStore } from "../state";
import type {
  UseBaseWorldReturn,
  UseBaseWorldBackgroundReturn,
  UseBaseWorldContentReturn,
  UseBaseWorldOverlayReturn,
  UseBaseWorldTransitionReturn,
} from "../types";
import { useBaseBackground } from "../layers/background";
import { useBaseContent } from "../layers/content";
import { useBaseOverlay } from "../layers/overlay";
import { useBaseTransition } from "../layers/transition";

// ============================================================================
// Stable selectors (identity-stable references)
// ============================================================================

const selectState = (s: ReturnType<typeof useBaseWorldStore.getState>) => ({
  phase: s.phase,
  isMounted: s.isMounted,
  isReady: s.isReady,
  isActive: s.isActive,
  isTransitioning: s.isTransitioning,
  hasError: s.hasError,
  error: s.error,
  theme: s.theme,
  worldId: s.worldId,
});

const selectActions = (s: ReturnType<typeof useBaseWorldStore.getState>) => ({
  setPhase: s.setPhase,
  setError: s.setError,
  setTheme: s.setTheme,
  setWorldId: s.setWorldId,
  reset: s.reset,
});

// ============================================================================
// useBaseWorld — full world state and actions
// ============================================================================

export function useBaseWorld(): UseBaseWorldReturn {
  const state = useBaseWorldStore(selectState);
  const actions = useBaseWorldStore(selectActions);

  return useMemo(() => ({ state, actions }), [state, actions]);
}

// ============================================================================
// useBaseWorldBackground — background layer state
// ============================================================================

export function useBaseWorldBackground(): UseBaseWorldBackgroundReturn {
  const bg = useBaseBackground();
  return useMemo(
    () => ({
      variant: bg.variant,
      config: bg.config,
      isLoaded: bg.isLoaded,
    }),
    [bg.variant, bg.config, bg.isLoaded],
  );
}

// ============================================================================
// useBaseWorldContent — content area management
// ============================================================================

export function useBaseWorldContent(): UseBaseWorldContentReturn {
  const content = useBaseContent();
  return useMemo(
    () => ({
      areas: Array.from(content.registeredAreas),
    }),
    [content.registeredAreas],
  );
}

// ============================================================================
// useBaseWorldOverlay — overlay visibility management
// ============================================================================

export function useBaseWorldOverlay(): UseBaseWorldOverlayReturn {
  const overlay = useBaseOverlay();
  return useMemo(
    () => ({
      visibleOverlays: overlay.visibleOverlays,
      show: overlay.show,
      hide: overlay.hide,
      toggle: overlay.toggle,
    }),
    [overlay.visibleOverlays, overlay.show, overlay.hide, overlay.toggle],
  );
}

// ============================================================================
// useBaseWorldTransition — transition phase control
// ============================================================================

export function useBaseWorldTransition(): UseBaseWorldTransitionReturn {
  const transition = useBaseTransition();

  return useMemo(
    () => ({
      phase: transition.phase,
      enter: transition.enter,
      exit: transition.exit,
    }),
    [transition.phase, transition.enter, transition.exit],
  );
}
