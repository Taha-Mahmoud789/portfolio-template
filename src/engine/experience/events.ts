/**
 * Experience Event System
 *
 * Typed, scalable event bus for the Experience Engine.
 * Replaces prop drilling and duplicated listeners.
 * Supports cleanup via returned unsubscribe functions.
 */

import type {
  ExperienceEventType,
  ExperienceEventCallback,
  ExperienceEventUnsubscribe,
} from "./types";
import { PERFORMANCE } from "./constants";

// ============================================================================
// Event Emitter
// ============================================================================

interface ListenerEntry {
  callback: ExperienceEventCallback;
  once: boolean;
}

class ExperienceEventEmitter {
  private listeners = new Map<ExperienceEventType, ListenerEntry[]>();
  private listenerCount = 0;

  on(
    event: ExperienceEventType,
    callback: ExperienceEventCallback
  ): ExperienceEventUnsubscribe {
    if (this.listenerCount >= PERFORMANCE.maxListeners) {
      console.warn(`[ExperienceEngine] Max listeners (${String(PERFORMANCE.maxListeners)}) reached for "${event}"`);
    }

    const entry: ListenerEntry = { callback, once: false };

    const existing = this.listeners.get(event) ?? [];
    existing.push(entry);
    this.listeners.set(event, existing);
    this.listenerCount++;

    return () => {
      this.off(event, callback);
    };
  }

  once(
    event: ExperienceEventType,
    callback: ExperienceEventCallback
  ): ExperienceEventUnsubscribe {
    const entry: ListenerEntry = { callback, once: true };

    const existing = this.listeners.get(event) ?? [];
    existing.push(entry);
    this.listeners.set(event, existing);
    this.listenerCount++;

    return () => {
      this.off(event, callback);
    };
  }

  off(event: ExperienceEventType, callback: ExperienceEventCallback): void {
    const existing = this.listeners.get(event);
    if (!existing) return;

    const filtered = existing.filter((entry) => entry.callback !== callback);
    if (filtered.length === 0) {
      this.listeners.delete(event);
    } else {
      this.listeners.set(event, filtered);
    }
    this.listenerCount--;
  }

  emit(event: ExperienceEventType, data: unknown): void {
    const existing = this.listeners.get(event);
    if (!existing) return;

    const toRemove: ListenerEntry[] = [];

    for (const entry of existing) {
      entry.callback(data);
      if (entry.once) {
        toRemove.push(entry);
      }
    }

    if (toRemove.length > 0) {
      const remaining = existing.filter((entry) => !toRemove.includes(entry));
      if (remaining.length === 0) {
        this.listeners.delete(event);
      } else {
        this.listeners.set(event, remaining);
      }
      this.listenerCount -= toRemove.length;
    }
  }

  removeAllListeners(event?: ExperienceEventType): void {
    if (event) {
      const count = this.listeners.get(event)?.length ?? 0;
      this.listeners.delete(event);
      this.listenerCount -= count;
    } else {
      this.listeners.clear();
      this.listenerCount = 0;
    }
  }

  listenerCountFor(event: ExperienceEventType): number {
    return this.listeners.get(event)?.length ?? 0;
  }

  get totalListenerCount(): number {
    return this.listenerCount;
  }
}

// ============================================================================
// Singleton
// ============================================================================

export const experienceEvents = new ExperienceEventEmitter();

// ============================================================================
// Convenience Helpers
// ============================================================================

export function onExperienceEvent(
  event: ExperienceEventType,
  callback: ExperienceEventCallback
): ExperienceEventUnsubscribe {
  return experienceEvents.on(event, callback);
}

export function emitExperienceEvent(
  event: ExperienceEventType,
  data: unknown
): void {
  experienceEvents.emit(event, data);
}

export function createEventGroup(): {
  on: typeof experienceEvents.on;
  off: typeof experienceEvents.off;
  cleanup: () => void;
} {
  const unsubscribes: ExperienceEventUnsubscribe[] = [];

  return {
    on: (
      event: ExperienceEventType,
      callback: ExperienceEventCallback
    ) => {
      const unsub = experienceEvents.on(event, callback);
      unsubscribes.push(unsub);
      return unsub;
    },
    off: (event: ExperienceEventType, callback: ExperienceEventCallback) => {
      experienceEvents.off(event, callback);
    },
    cleanup: () => {
      for (const unsub of unsubscribes) {
        unsub();
      }
      unsubscribes.length = 0;
    },
  };
}
