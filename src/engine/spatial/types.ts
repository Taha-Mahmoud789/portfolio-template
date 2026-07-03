/**
 * Spatial Object System — Types
 *
 * Core type definitions for the spatial object architecture.
 * Every visible object in every world uses this system.
 */

import type { Object3D, Vector3 } from "three";

// ============================================================================
// Object Types
// ============================================================================

export type SpatialObjectType =
  | "static"
  | "dynamic"
  | "interactive"
  | "background"
  | "decoration"
  | "particle"
  | "npc"
  | "physics";

// ============================================================================
// Object Status
// ============================================================================

export type ObjectStatus =
  | "idle"
  | "registered"
  | "loading"
  | "loaded"
  | "initializing"
  | "initialized"
  | "mounting"
  | "mounted"
  | "updating"
  | "suspending"
  | "suspended"
  | "resuming"
  | "destroying"
  | "destroyed"
  | "disposing"
  | "disposed";

// ============================================================================
// Valid State Transitions (Set-based for O(1) lookup)
// ============================================================================

export const VALID_TRANSITIONS: ReadonlyMap<ObjectStatus, ReadonlySet<ObjectStatus>> = new Map([
  ["idle", new Set(["registered"])],
  ["registered", new Set(["loading", "loaded"])],
  ["loading", new Set(["loaded", "destroying"])],
  ["loaded", new Set(["initializing", "destroying"])],
  ["initializing", new Set(["initialized", "destroying"])],
  ["initialized", new Set(["mounting", "destroying"])],
  ["mounting", new Set(["mounted", "destroying"])],
  ["mounted", new Set(["updating", "suspending", "destroying"])],
  ["updating", new Set(["suspending", "destroying"])],
  ["suspending", new Set(["suspended", "destroying"])],
  ["suspended", new Set(["resuming", "destroying"])],
  ["resuming", new Set(["updating", "destroying"])],
  ["destroying", new Set(["destroyed"])],
  ["destroyed", new Set(["disposing"])],
  ["disposing", new Set(["disposed"])],
  ["disposed", new Set()],
]);

// ============================================================================
// Spatial Properties
// ============================================================================

export interface SpatialPosition {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export interface SpatialRotation {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export interface SpatialScale {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

// Mutable versions for internal scratch use
export interface MutableSpatialPosition {
  x: number;
  y: number;
  z: number;
}

export interface MutableSpatialRotation {
  x: number;
  y: number;
  z: number;
}

export interface MutableSpatialScale {
  x: number;
  y: number;
  z: number;
}

// ============================================================================
// Object Configuration
// ============================================================================

export interface SpatialObjectConfig {
  readonly id?: string;
  readonly type: SpatialObjectType;
  readonly position?: Partial<SpatialPosition>;
  readonly rotation?: Partial<SpatialRotation>;
  readonly scale?: Partial<SpatialScale>;
  readonly visible?: boolean;
  readonly layer?: number;
  readonly priority?: number;
  readonly metadata?: Record<string, unknown>;
  readonly object3d?: Object3D;
}

// ============================================================================
// Object State (snapshot)
// ============================================================================

export interface SpatialObjectState {
  readonly id: string;
  readonly type: SpatialObjectType;
  readonly status: ObjectStatus;
  readonly visible: boolean;
  readonly layer: number;
  readonly priority: number;
  readonly distance: number;
  readonly worldPosition: SpatialPosition;
}

// ============================================================================
// Registry
// ============================================================================

export interface ObjectRegistryQuery {
  readonly type?: SpatialObjectType;
  readonly layer?: number;
  readonly status?: ObjectStatus;
  readonly visible?: boolean;
  readonly maxDistance?: number;
  readonly cameraPosition?: Vector3;
  readonly limit?: number;
}

// ============================================================================
// Cache
// ============================================================================

export interface CacheEntry {
  object3d: Object3D;
  type: SpatialObjectType;
  lastUsed: number;
  triangleCount: number;
}

// ============================================================================
// Object Manager Config
// ============================================================================

export interface ObjectManagerConfig {
  readonly maxObjects: number;
  readonly autoDispose: boolean;
  readonly cullingDistance: number;
}

// ============================================================================
// Object Manager State
// ============================================================================

export interface ObjectManagerState {
  readonly objectCount: number;
  readonly objectsByType: Record<SpatialObjectType, number>;
  readonly activeCount: number;
  readonly suspendedCount: number;
  readonly totalTriangles: number;
}

// ============================================================================
// Events
// ============================================================================

export type ObjectEventType =
  | "object:loaded"
  | "object:mounted"
  | "object:visible"
  | "object:hidden"
  | "object:updated"
  | "object:positionChanged"
  | "object:layerChanged"
  | "object:destroyed";

export interface ObjectEvent {
  readonly type: ObjectEventType;
  readonly objectId: string;
  readonly objectType: SpatialObjectType;
  readonly timestamp: number;
}

export type ObjectEventHandler = (event: ObjectEvent) => void;

// ============================================================================
// Hook Returns
// ============================================================================

export interface UseSpatialObjectReturn {
  readonly state: SpatialObjectState;
  readonly setVisible: (visible: boolean) => void;
  readonly setLayer: (layer: number) => void;
  readonly setPriority: (priority: number) => void;
  readonly setMetadata: (key: string, value: unknown) => void;
  readonly destroy: () => void;
}

export interface UseObjectManagerReturn {
  readonly state: ObjectManagerState;
  readonly addObject: (config: SpatialObjectConfig) => string;
  readonly removeObject: (id: string) => void;
  readonly getObject: (id: string) => unknown;
  readonly query: (query: ObjectRegistryQuery) => unknown[];
}
