/**
 * Spatial Object System — Barrel Exports
 */

// Core
export { ObjectManager } from "./object-manager";
export { SpatialObject } from "./spatial-object";

// Modules
export { ObjectRegistry } from "./object-registry";
export { ObjectFactory } from "./object-factory";
export { ObjectCache } from "./object-cache";
export { ObjectLoader } from "./object-loader";
export { ObjectEvents, EVENT_PRIORITY } from "./object-events";
export type { EventPriority } from "./object-events";
export { ObjectLifecycle } from "./object-lifecycle";

// React
export { SpatialProvider } from "./object-provider";
export { SpatialContext } from "./object-context";
export { useObjectManager, useSpatialObject } from "./object-hooks";
export type { UseObjectManagerReturn } from "./object-hooks";

// Utilities
export {
  distanceBetween,
  distanceSquared,
  computeBoundingBox,
  intersectsBox,
  containsPoint,
  isInDistance,
  spatialToVector3,
  vector3ToSpatial,
  applyToObject3D,
  disposeObjectResources,
  countTriangles,
} from "./object-utilities";

// Validation
export { validateObjectConfig } from "./object-validator";
export type { ValidationResult } from "./object-validator";

// Constants
export {
  OBJECT_MANAGER_DEFAULTS,
  EMPTY_TYPE_COUNTS,
  DEFAULT_POSITION,
  DEFAULT_ROTATION,
  DEFAULT_SCALE,
  ACTIVE_STATUSES,
  ALIVE_STATUSES,
  INITIALIZE_SEQUENCE,
} from "./constants";

// Types
export type {
  SpatialObjectType,
  ObjectStatus,
  SpatialPosition,
  SpatialRotation,
  SpatialScale,
  SpatialObjectConfig,
  SpatialObjectState,
  ObjectRegistryQuery,
  CacheEntry,
  ObjectManagerConfig,
  ObjectManagerState,
  ObjectEventType,
  ObjectEvent,
  ObjectEventHandler,
  UseSpatialObjectReturn,
} from "./types";

export type { SpatialContextValue } from "./object-context";
