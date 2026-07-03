/**
 * Cinematic Camera System — Barrel Exports
 *
 * Reusable camera engine for the Frontend Multiverse.
 * Every module exposes initialize(), update(), dispose().
 * Modules never communicate directly — everything goes through CameraManager.
 */

// ============================================================================
// Types
// ============================================================================
export type {
  CameraMode,
  CameraState,
  EasingFunction,
  EasingName,
  MovementConfig,
  SpringState,
  CameraConstraints,
  CameraPresetConfig,
  FocusTarget,
  FocusConfig,
  CameraKeyframe,
  CameraSequence,
  TimelineState,
  ShakeConfig,
  DriftConfig,
  BobConfig,
  SwayConfig,
  CameraEffectsConfig,
  CameraEffectsState,
  TransitionType,
  TransitionConfig,
  TransitionState,
  CinematicCameraConfig,
  CinematicCameraState,
  CinematicCameraRef,
  UseCameraReturn,
  UseCameraModeReturn,
  UseCameraFocusReturn,
  UseCameraTimelineReturn,
  UseCameraEffectsReturn,
  UseReducedMotionReturn,
} from "./types";

// ============================================================================
// Config
// ============================================================================
export {
  DEFAULT_MOVEMENT,
  SPRING_MOVEMENT,
  DAMPED_MOVEMENT,
  HEAVY_MOVEMENT,
  LIGHT_MOVEMENT,
  DEFAULT_CONSTRAINTS,
  DEFAULT_SHAKE,
  DEFAULT_DRIFT,
  DEFAULT_BOB,
  DEFAULT_SWAY,
  DEFAULT_EFFECTS,
  DEFAULT_FOCUS,
  CAMERA_DEFAULTS,
  CAMERA_PRESETS,
  mergeCameraConfig,
  mergePresetWithDefaults,
} from "./config";

// ============================================================================
// Math
// ============================================================================
export {
  lerp,
  inverseLerp,
  clamp,
  remap,
  smoothstep,
  criticalDamping,
  springStep,
  springStepVec3,
  springSettled,
  smoothDamp,
  easings,
  getEasing,
  acquireScratch,
  releaseScratch,
  lerpVec3,
  clampMagnitudeVec3,
  distanceSq,
  distance,
} from "./math";

// ============================================================================
// Vector Pool
// ============================================================================
export { Vector3Pool, QuaternionPool, vector3Pool, quaternionPool } from "./vector-pool";

// ============================================================================
// Managers
// ============================================================================
export { CameraManager, createCinematicCamera } from "./camera-manager";
export { CameraStateMachine } from "./camera-state-machine";
export { CameraRig } from "./camera-rig";
export { CameraController } from "./camera-controller";
export { CameraEffects } from "./camera-effects";
export { CameraTimeline, createSequence, createKeyframe } from "./camera-timeline";
export { CameraTransitionManager } from "./camera-transition-manager";

// ============================================================================
// React Integration
// ============================================================================
export { CameraProvider, useCameraContext } from "./providers/camera-provider";
export type { CameraContextValue } from "./providers/camera-provider";
export {
  useCameraState,
  useCamera,
  useCameraMode,
  useCameraFocus,
  useCameraTimeline,
  useCameraEffects,
  useReducedMotion,
} from "./hooks";
