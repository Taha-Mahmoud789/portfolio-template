/**
 * World Lifecycle
 *
 * State machine that manages world lifecycle transitions.
 * Enforces valid transitions and emits events on phase changes.
 */

import type { WorldId, WorldLifecyclePhase } from "./types";
import { VALID_LIFECYCLE_TRANSITIONS } from "./constants";

type LifecycleCallback = (worldId: WorldId, phase: WorldLifecyclePhase) => void;

export class WorldLifecycle {
  private phases = new Map<WorldId, WorldLifecyclePhase>();
  private listeners: LifecycleCallback[] = [];

  getPhase(worldId: WorldId): WorldLifecyclePhase {
    return this.phases.get(worldId) ?? "unregistered";
  }

  canTransition(worldId: WorldId, targetPhase: WorldLifecyclePhase): boolean {
    const currentPhase = this.getPhase(worldId);
    const validTargets = VALID_LIFECYCLE_TRANSITIONS[currentPhase];
    return validTargets.includes(targetPhase);
  }

  transition(worldId: WorldId, targetPhase: WorldLifecyclePhase): boolean {
    if (!this.canTransition(worldId, targetPhase)) {
      return false;
    }

    this.phases.set(worldId, targetPhase);
    this.notifyListeners(worldId, targetPhase);
    return true;
  }

  setPhase(worldId: WorldId, phase: WorldLifecyclePhase): void {
    this.phases.set(worldId, phase);
    this.notifyListeners(worldId, phase);
  }

  remove(worldId: WorldId): void {
    this.phases.delete(worldId);
  }

  clear(): void {
    this.phases.clear();
  }

  getAllPhases(): Map<WorldId, WorldLifecyclePhase> {
    return new Map(this.phases);
  }

  onPhaseChange(callback: LifecycleCallback): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notifyListeners(worldId: WorldId, phase: WorldLifecyclePhase): void {
    for (const listener of this.listeners) {
      try {
        listener(worldId, phase);
      } catch {
        // Listener errors should not break the lifecycle
      }
    }
  }
}
