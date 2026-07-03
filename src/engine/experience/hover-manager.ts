/**
 * Hover Manager
 *
 * Tracks hover state with configurable enter/leave delays.
 * Per-target cleanup prevents memory leaks.
 * Properly removes event listeners on unregister.
 */

import type { HoverManagerConfig } from "./types";
import { useExperienceStore } from "./store";
import { experienceEvents } from "./events";
import { HOVER_DEFAULTS } from "./constants";

// ============================================================================
// Hover Manager
// ============================================================================

interface HoverTargetState {
  enterTimeout: ReturnType<typeof setTimeout> | null;
  leaveTimeout: ReturnType<typeof setTimeout> | null;
  onEnter: () => void;
  onLeave: () => void;
}

class HoverManagerImpl {
  private config: HoverManagerConfig = { ...HOVER_DEFAULTS };
  private hoverTargets = new Map<HTMLElement, HoverTargetState>();
  private activeTargetCount = 0;
  private isTracking = false;

  init(config?: Partial<HoverManagerConfig>): void {
    if (this.isTracking) return;
    this.config = { ...this.config, ...config };
    this.isTracking = true;
  }

  destroy(): void {
    if (!this.isTracking) return;
    // Clean up all targets
    for (const [element, state] of this.hoverTargets) {
      this.cleanupTarget(element, state);
    }
    this.hoverTargets.clear();
    this.activeTargetCount = 0;
    this.isTracking = false;
  }

  updateConfig(config: Partial<HoverManagerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // --- Target Registration ---

  registerTarget(element: HTMLElement): void {
    if (this.hoverTargets.has(element)) return;

    const state: HoverTargetState = {
      enterTimeout: null,
      leaveTimeout: null,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onEnter: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onLeave: () => {},
    };

    state.onEnter = () => {
      if (state.leaveTimeout) {
        clearTimeout(state.leaveTimeout);
        state.leaveTimeout = null;
      }

      state.enterTimeout = setTimeout(() => {
        this.activeTargetCount++;
        useExperienceStore.getState().setInteractionState("hover");
        experienceEvents.emit("pointer:hover-enter", {
          element,
          timestamp: Date.now(),
        });
      }, this.config.enterDelay);
    };

    state.onLeave = () => {
      if (state.enterTimeout) {
        clearTimeout(state.enterTimeout);
        state.enterTimeout = null;
      }

      state.leaveTimeout = setTimeout(() => {
        this.activeTargetCount = Math.max(0, this.activeTargetCount - 1);
        // Only set idle if no other targets are hovered
        if (this.activeTargetCount === 0) {
          const store = useExperienceStore.getState();
          if (store.interactionState === "hover") {
            store.setInteractionState("idle");
          }
        }
        experienceEvents.emit("pointer:hover-leave", {
          element,
          timestamp: Date.now(),
        });
      }, this.config.leaveDelay);
    };

    element.addEventListener("mouseenter", state.onEnter, { passive: true });
    element.addEventListener("mouseleave", state.onLeave, { passive: true });

    this.hoverTargets.set(element, state);
  }

  unregisterTarget(element: HTMLElement): void {
    const state = this.hoverTargets.get(element);
    if (state) {
      this.cleanupTarget(element, state);
      this.hoverTargets.delete(element);
    }
  }

  // --- Internal ---

  private cleanupTarget(element: HTMLElement, state: HoverTargetState): void {
    // Clear timeouts
    if (state.enterTimeout) clearTimeout(state.enterTimeout);
    if (state.leaveTimeout) clearTimeout(state.leaveTimeout);

    // Remove event listeners
    element.removeEventListener("mouseenter", state.onEnter);
    element.removeEventListener("mouseleave", state.onLeave);
  }
}

export const HoverManager = new HoverManagerImpl();

export function createHoverManager(): HoverManagerImpl {
  return new HoverManagerImpl();
}
