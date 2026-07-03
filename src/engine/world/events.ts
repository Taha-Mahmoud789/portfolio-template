/**
 * World Event Bus
 *
 * Typed event system for world lifecycle events.
 * Supports subscribe, unsubscribe, and one-time listeners.
 */

import type {
  WorldEvent,
  WorldEventType,
  WorldEventCallback,
  WorldEventUnsubscribe,
  WorldId,
} from "./types";

interface ListenerEntry {
  callback: WorldEventCallback;
  once: boolean;
}

export class WorldEventBus {
  private listeners = new Map<WorldEventType, ListenerEntry[]>();
  private history: WorldEvent[] = [];
  private maxHistory = 100;

  on(type: WorldEventType, callback: WorldEventCallback): WorldEventUnsubscribe {
    return this.subscribe(type, callback, false);
  }

  once(type: WorldEventType, callback: WorldEventCallback): WorldEventUnsubscribe {
    return this.subscribe(type, callback, true);
  }

  off(type: WorldEventType, callback: WorldEventCallback): void {
    const entries = this.listeners.get(type);
    if (!entries) return;

    const filtered = entries.filter((entry) => entry.callback !== callback);
    if (filtered.length === 0) {
      this.listeners.delete(type);
    } else {
      this.listeners.set(type, filtered);
    }
  }

  emit(type: WorldEventType, worldId: WorldId, data?: unknown, error?: Error): void {
    const event: WorldEvent = {
      type,
      worldId,
      timestamp: Date.now(),
      data,
      error,
    };

    this.history.push(event);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    const entries = this.listeners.get(type);
    if (!entries) return;

    const toRemove: WorldEventCallback[] = [];

    for (const entry of entries) {
      try {
        entry.callback(event);
      } catch {
        // Listener errors should not break the event bus
      }
      if (entry.once) {
        toRemove.push(entry.callback);
      }
    }

    if (toRemove.length > 0) {
      const remaining = entries.filter((entry) => !toRemove.includes(entry.callback));
      if (remaining.length === 0) {
        this.listeners.delete(type);
      } else {
        this.listeners.set(type, remaining);
      }
    }
  }

  getHistory(worldId?: WorldId, limit?: number): WorldEvent[] {
    let events = worldId ? this.history.filter((e) => e.worldId === worldId) : this.history;

    if (limit) {
      events = events.slice(-limit);
    }

    return events;
  }

  clearHistory(): void {
    this.history = [];
  }

  listenerCount(type: WorldEventType): number {
    return this.listeners.get(type)?.length ?? 0;
  }

  removeAllListeners(type?: WorldEventType): void {
    if (type) {
      this.listeners.delete(type);
    } else {
      this.listeners.clear();
    }
  }

  private subscribe(
    type: WorldEventType,
    callback: WorldEventCallback,
    once: boolean,
  ): WorldEventUnsubscribe {
    const entries = this.listeners.get(type) ?? [];
    entries.push({ callback, once });
    this.listeners.set(type, entries);

    return () => this.off(type, callback);
  }
}
