/**
 * Spatial Object System — Object Events
 *
 * Typed event bus for spatial object lifecycle events.
 * Supports event priority for ordering critical vs non-critical listeners.
 * Objects communicate only through ObjectManager — events are the notification layer.
 */

import type { SpatialObjectType, ObjectEvent, ObjectEventType, ObjectEventHandler } from "./types";

// ============================================================================
// Priority Levels
// ============================================================================

export const EVENT_PRIORITY = {
  CRITICAL: 0,
  HIGH: 1,
  NORMAL: 2,
  LOW: 3,
} as const;

export type EventPriority = (typeof EVENT_PRIORITY)[keyof typeof EVENT_PRIORITY];

interface PrioritizedHandler {
  readonly handler: ObjectEventHandler;
  readonly priority: EventPriority;
}

// ============================================================================
// Object Events
// ============================================================================

export class ObjectEvents {
  private listeners: Map<ObjectEventType, PrioritizedHandler[]>;

  constructor() {
    this.listeners = new Map();
  }

  // --------------------------------------------------------------------------
  // Subscribe / Unsubscribe
  // --------------------------------------------------------------------------

  on(
    type: ObjectEventType,
    handler: ObjectEventHandler,
    priority: EventPriority = EVENT_PRIORITY.NORMAL,
  ): () => void {
    let handlers = this.listeners.get(type);
    if (!handlers) {
      handlers = [];
      this.listeners.set(type, handlers);
    }

    // Insert in priority order (lower number = higher priority)
    const entry: PrioritizedHandler = { handler, priority };
    let inserted = false;
    for (let i = 0; i < handlers.length; i++) {
      const existing = handlers[i];
      if (existing && priority < existing.priority) {
        handlers.splice(i, 0, entry);
        inserted = true;
        break;
      }
    }
    if (!inserted) {
      handlers.push(entry);
    }

    return () => {
      const idx = handlers.indexOf(entry);
      if (idx >= 0) handlers.splice(idx, 1);
    };
  }

  off(type: ObjectEventType, handler: ObjectEventHandler): void {
    const handlers = this.listeners.get(type);
    if (!handlers) return;
    const idx = handlers.findIndex((h) => h.handler === handler);
    if (idx >= 0) handlers.splice(idx, 1);
  }

  // --------------------------------------------------------------------------
  // Emit
  // --------------------------------------------------------------------------

  emit(
    type: ObjectEventType,
    objectId: string,
    objectType: SpatialObjectType,
    timestamp?: number,
  ): void {
    const handlers = this.listeners.get(type);
    if (!handlers || handlers.length === 0) return;

    const event: ObjectEvent = {
      type,
      objectId,
      objectType,
      timestamp: timestamp ?? performance.now(),
    };

    // Execute in priority order (already sorted from on())
    for (const entry of handlers) {
      entry.handler(event);
    }
  }

  // --------------------------------------------------------------------------
  // Cleanup
  // --------------------------------------------------------------------------

  dispose(): void {
    this.listeners.clear();
  }
}
