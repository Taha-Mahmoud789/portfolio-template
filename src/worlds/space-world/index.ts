/**
 * Space World — Public API
 */

// Types
export type {
  WorldPhase,
  CameraMode,
  CameraPreset,
  ObjectState,
  OrbitGroup,
  SpaceObject,
  SpaceObjectType,
  Connection,
  OrbitConfig,
  CoreConfig,
  SpaceSceneConfig,
} from "./data/types";

// Config
export {
  CORE,
  ORBITS,
  OBJECTS,
  CONNECTIONS,
  CAMERA_PRESETS,
  NAVIGATION,
  SPACE_CONFIG,
} from "./data/space.config";

// Systems
export { useSpaceState } from "./systems/state-manager";
export { useCameraController } from "./systems/camera-controller";
export { useObjectRegistry } from "./systems/object-registry";
export { useInteractionManager } from "./systems/interaction-manager";

// Hooks
export { useSpaceWorld } from "./hooks/use-space-world";
export { useReducedMotion } from "./hooks/use-reduced-motion";
export { useSpatialNav } from "./hooks/use-spatial-nav";

// Components
export { SpaceWorldExperience, ReducedMotionFallback } from "./components";

// Accessibility
export {
  prefersReducedMotion,
  onReducedMotionChange,
  getReducedMotionDuration,
  shouldAnimate,
  announceToScreenReader,
} from "./accessibility";
