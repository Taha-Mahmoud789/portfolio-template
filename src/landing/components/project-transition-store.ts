/**
 * Project Transition System
 *
 * Cinematic shared-element transition between:
 * Project Showcase → Project Detail
 *
 * Inspired by TRIONN/Cuberto/Locomotive.
 * Uses GSAP for 60FPS transform-only animations.
 *
 * Architecture:
 * - Zustand store for shared state (card → overlay → project page)
 * - Overlay portal renders cloned preview, animates scale/position
 * - Project page reads transition state for entry animation
 * - Back transition reverses the feeling
 *
 * No-JS: navigation still works (falls back to direct route change).
 */

import { create } from "zustand";

// ============================================================================
// Types
// ============================================================================

export type TransitionPhase =
  | "idle" // No transition
  | "capturing" // Card clicked, capturing preview rect
  | "expanding" // Clone is expanding to fill viewport
  | "entering" // Route changed, project page loading
  | "revealing" // Project page content revealing
  | "returning"; // Back transition: project → landing

interface TransitionData {
  phase: TransitionPhase;
  /** Bounding rect of the clicked project preview */
  fromRect: { top: number; left: number; width: number; height: number } | null;
  /** Project slug for route navigation */
  projectId: string | null;
  /** Project accent color for overlay tint */
  accentRgb: string | null;
  /** Project number for visual continuity */
  projectNumber: string | null;
  /** Scroll position when transition started */
  scrollY: number;
}

interface TransitionActions {
  /** Capture preview rect and start transition */
  startTransition: (data: {
    fromRect: DOMRect;
    projectId: string;
    accentRgb: string;
    projectNumber: string;
  }) => void;
  /** Route changed, ready for project page entry */
  setEntering: () => void;
  /** Project page content revealed, transition complete */
  setIdle: () => void;
  /** Start back transition (project → landing) */
  startReturn: () => void;
  /** Back transition complete */
  completeReturn: () => void;
}

export const useTransitionStore = create<TransitionData & TransitionActions>((set) => ({
  phase: "idle",
  fromRect: null,
  projectId: null,
  accentRgb: null,
  projectNumber: null,
  scrollY: 0,

  startTransition: (data) =>
    set({
      phase: "expanding",
      fromRect: {
        top: data.fromRect.top,
        left: data.fromRect.left,
        width: data.fromRect.width,
        height: data.fromRect.height,
      },
      projectId: data.projectId,
      accentRgb: data.accentRgb,
      projectNumber: data.projectNumber,
      scrollY: window.scrollY,
    }),

  setEntering: () => set({ phase: "entering" }),

  setIdle: () =>
    set({
      phase: "idle",
      fromRect: null,
      projectId: null,
      accentRgb: null,
      projectNumber: null,
    }),

  startReturn: () =>
    set((state) => ({
      phase: "returning",
      scrollY: state.scrollY || window.scrollY,
    })),

  completeReturn: () =>
    set({
      phase: "idle",
      fromRect: null,
      projectId: null,
      accentRgb: null,
      projectNumber: null,
    }),
}));
