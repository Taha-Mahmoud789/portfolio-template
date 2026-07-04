/**
 * Multiverse Transition Store
 *
 * Manages the portal transition between portfolio and multiverse.
 * Uses Zustand for shared state across navigation trigger,
 * transition overlay, and multiverse hub.
 *
 * Phases:
 *   idle → portal-open → entering → active → exiting → returning → idle
 *
 * No-JS: navigation still works (falls back to direct route change).
 */

import { create } from "zustand";

// ============================================================================
// Types
// ============================================================================

export type PortalPhase = "idle" | "portal-open" | "entering" | "active" | "exiting";

interface PortalData {
  phase: PortalPhase;
  /** Bounding rect of the trigger element */
  triggerRect: { top: number; left: number; width: number; height: number } | null;
}

interface PortalActions {
  /** Open the portal overlay from trigger element */
  openPortal: (triggerRect: DOMRect) => void;
  /** Portal animation complete, ready to navigate */
  setEntering: () => void;
  /** Multiverse hub is mounted and active */
  setActive: () => void;
  /** Start exit transition back to portfolio */
  startExit: () => void;
  /** Exit transition complete, back to idle */
  completeReturn: () => void;
  /** Force reset to idle (for no-JS fallback) */
  reset: () => void;
}

export const useMultiverseTransition = create<PortalData & PortalActions>((set) => ({
  phase: "idle",
  triggerRect: null,

  openPortal: (triggerRect) =>
    set({
      phase: "portal-open",
      triggerRect: {
        top: triggerRect.top,
        left: triggerRect.left,
        width: triggerRect.width,
        height: triggerRect.height,
      },
    }),

  setEntering: () => set({ phase: "entering" }),

  setActive: () => set({ phase: "active" }),

  startExit: () => set({ phase: "exiting" }),

  completeReturn: () =>
    set({
      phase: "idle",
      triggerRect: null,
    }),

  reset: () =>
    set({
      phase: "idle",
      triggerRect: null,
    }),
}));
