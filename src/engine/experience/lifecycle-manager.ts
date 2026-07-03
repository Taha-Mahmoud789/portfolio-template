/**
 * Lifecycle Manager
 *
 * Manages the Experience Engine lifecycle phases.
 * Provides hooks for phase transitions and cleanup.
 */

import type { LifecyclePhase, LifecycleEvent, LifecycleCallback } from "./types";
import { useExperienceStore } from "./store";
import { experienceEvents } from "./events";

// ============================================================================
// Lifecycle Manager
// ============================================================================

class LifecycleManagerImpl {
  private callbacks = new Map<LifecyclePhase, LifecycleCallback[]>();
  private isInitialized = false;

  init(): void {
    if (this.isInitialized) return;
    this.setPhase("initializing");
    this.isInitialized = true;
  }

  destroy(): void {
    this.setPhase("destroying");
    this.callbacks.clear();
    this.isInitialized = false;
    this.setPhase("destroyed");
  }

  // --- Phase Management ---

  setPhase(phase: LifecyclePhase): void {
    const store = useExperienceStore.getState();
    const previousPhase = store.lifecyclePhase;

    if (previousPhase === phase) return;

    store.setLifecyclePhase(phase);

    const event: LifecycleEvent = {
      phase,
      timestamp: Date.now(),
      previousPhase,
    };

    // Notify phase-specific callbacks
    const callbacks = this.callbacks.get(phase) ?? [];
    for (const callback of callbacks) {
      callback(event);
    }

    experienceEvents.emit("lifecycle:phase-change", event);

    if (phase === "ready") {
      experienceEvents.emit("lifecycle:ready", event);
    }
  }

  getPhase(): LifecyclePhase {
    return useExperienceStore.getState().lifecyclePhase;
  }

  // --- Callbacks ---

  onPhase(phase: LifecyclePhase, callback: LifecycleCallback): () => void {
    const existing = this.callbacks.get(phase) ?? [];
    existing.push(callback);
    this.callbacks.set(phase, existing);

    return () => {
      const current = this.callbacks.get(phase) ?? [];
      this.callbacks.set(phase, current.filter((cb) => cb !== callback));
    };
  }

  onReady(callback: LifecycleCallback): () => void {
    return this.onPhase("ready", callback);
  }

  onDestroy(callback: LifecycleCallback): () => void {
    return this.onPhase("destroying", callback);
  }

  // --- Transitions ---

  ready(): void {
    this.setPhase("ready");
  }

  pause(): void {
    this.setPhase("pausing");
    this.setPhase("paused");
  }

  resume(): void {
    this.setPhase("resuming");
    this.setPhase("running");
  }
}

export const LifecycleManager = new LifecycleManagerImpl();

export function createLifecycleManager(): LifecycleManagerImpl {
  return new LifecycleManagerImpl();
}
