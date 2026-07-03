/**
 * State Synchronization
 *
 * Synchronizes Experience Engine state with external systems:
 * - Document visibility
 * - Reduced motion preference
 * - Window resize
 * - System events
 */

import { useExperienceStore } from "./store";
import { experienceEvents } from "./events";
import { A11Y, PERFORMANCE } from "./constants";

// ============================================================================
// State Synchronization
// ============================================================================

class StateSynchronizationImpl {
  private isInitialized = false;
  private cleanupFns: (() => void)[] = [];
  private resizeTimeout: ReturnType<typeof setTimeout> | null = null;

  init(): void {
    if (this.isInitialized) return;
    if (typeof window === "undefined") return;

    this.syncVisibility();
    this.syncReducedMotion();
    this.syncResize();
    this.isInitialized = true;
  }

  destroy(): void {
    for (const cleanup of this.cleanupFns) {
      cleanup();
    }
    this.cleanupFns = [];
    if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
    this.isInitialized = false;
  }

  // --- Visibility ---

  private syncVisibility(): void {
    const onChange = () => {
      const isVisible = document.visibilityState === "visible";
      useExperienceStore.getState().setIsVisible(isVisible);
      experienceEvents.emit("system:visibility-change", { isVisible, timestamp: Date.now() });
    };

    document.addEventListener("visibilitychange", onChange, { passive: true });
    this.cleanupFns.push(() => document.removeEventListener("visibilitychange", onChange));

    // Sync initial state
    useExperienceStore.getState().setIsVisible(document.visibilityState === "visible");
  }

  // --- Reduced Motion ---

  private syncReducedMotion(): void {
    const mediaQuery = window.matchMedia(A11Y.REDUCED_MOTION_QUERY);

    const onChange = (e: MediaQueryListEvent) => {
      useExperienceStore.getState().setReducedMotion(e.matches);
      experienceEvents.emit("system:motion-preference-change", {
        reducedMotion: e.matches,
        timestamp: Date.now(),
      });
    };

    mediaQuery.addEventListener("change", onChange, { passive: true });
    this.cleanupFns.push(() => mediaQuery.removeEventListener("change", onChange));

    // Sync initial state
    useExperienceStore.getState().setReducedMotion(mediaQuery.matches);
  }

  // --- Resize ---

  private syncResize(): void {
    const onResize = () => {
      if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        experienceEvents.emit("system:resize", {
          width: window.innerWidth,
          height: window.innerHeight,
          timestamp: Date.now(),
        });
      }, PERFORMANCE.resizeDebounce);
    };

    window.addEventListener("resize", onResize, { passive: true });
    this.cleanupFns.push(() => window.removeEventListener("resize", onResize));
  }
}

export const StateSynchronization = new StateSynchronizationImpl();

export function createStateSynchronization(): StateSynchronizationImpl {
  return new StateSynchronizationImpl();
}
