/**
 * Spatial Object System — Constants
 *
 * Default values and configuration presets.
 */

import type { ObjectManagerConfig, SpatialObjectType, ObjectStatus } from "./types";

// ============================================================================
// Object Manager Defaults
// ============================================================================

export const OBJECT_MANAGER_DEFAULTS: ObjectManagerConfig = {
  maxObjects: 1000,
  autoDispose: true,
  cullingDistance: 500,
};

// ============================================================================
// Object Type Counts (for state tracking)
// ============================================================================

export const EMPTY_TYPE_COUNTS: Record<SpatialObjectType, number> = {
  static: 0,
  dynamic: 0,
  interactive: 0,
  background: 0,
  decoration: 0,
  particle: 0,
  npc: 0,
  physics: 0,
};

// ============================================================================
// Default Spatial Values
// ============================================================================

export const DEFAULT_POSITION = { x: 0, y: 0, z: 0 } as const;
export const DEFAULT_ROTATION = { x: 0, y: 0, z: 0 } as const;
export const DEFAULT_SCALE = { x: 1, y: 1, z: 1 } as const;

// ============================================================================
// Lifecycle Status Sets (for fast lookups)
// ============================================================================

export const ACTIVE_STATUSES: ReadonlySet<ObjectStatus> = new Set([
  "mounted",
  "updating",
  "suspending",
  "resuming",
]);

export const ALIVE_STATUSES: ReadonlySet<ObjectStatus> = new Set([
  "registered",
  "loading",
  "loaded",
  "initializing",
  "initialized",
  "mounting",
  "mounted",
  "updating",
  "suspending",
  "suspended",
  "resuming",
]);

// ============================================================================
// Initialize Sequence
// ============================================================================

export const INITIALIZE_SEQUENCE: readonly ObjectStatus[] = [
  "registered",
  "loaded",
  "initializing",
  "initialized",
  "mounting",
  "mounted",
] as const;
