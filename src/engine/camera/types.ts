/**
 * Cinematic Camera System — Types
 *
 * Core type definitions for the reusable camera engine.
 * Every module exposes initialize(), update(), dispose().
 * Modules never communicate directly — everything goes through CameraManager.
 */

import type { Vector3, PerspectiveCamera, Object3D } from "three";

// ============================================================================
// Camera Modes
// ============================================================================

export type CameraMode =
  | "idle"
  | "floating"
  | "orbit"
  | "focus"
  | "cinematic"
  | "follow"
  | "inspect"
  | "portal"
  | "transition"
  | "vr";

// ============================================================================
// Camera States
// ============================================================================

export type CameraState = "idle" | "moving" | "transitioning" | "focused" | "locked" | "disabled";

// ============================================================================
// Valid State Transitions
// ============================================================================

export const VALID_CAMERA_TRANSITIONS: Record<CameraState, readonly CameraState[]> = {
  idle: ["moving", "transitioning", "focused", "locked", "disabled"],
  moving: ["idle", "transitioning", "focused", "locked", "disabled"],
  transitioning: ["idle", "moving", "focused", "locked", "disabled"],
  focused: ["idle", "moving", "transitioning", "locked", "disabled"],
  locked: ["idle", "transitioning", "disabled"],
  disabled: ["idle"],
} as const;

// ============================================================================
// Easing
// ============================================================================

export type EasingFunction = (t: number) => number;

export type EasingName =
  | "linear"
  | "easeIn"
  | "easeOut"
  | "easeInOut"
  | "easeInCubic"
  | "easeOutCubic"
  | "easeInOutCubic"
  | "easeInExpo"
  | "easeOutExpo"
  | "easeInOutExpo"
  | "spring"
  | "bounce"
  | "elastic";

// ============================================================================
// Movement
// ============================================================================

export interface MovementConfig {
  readonly stiffness: number;
  readonly damping: number;
  readonly mass: number;
  readonly maxSpeed: number;
  readonly acceleration: number;
  readonly deceleration: number;
}

export interface SpringState {
  value: number;
  velocity: number;
  target: number;
}

// ============================================================================
// Camera Constraints
// ============================================================================

export interface CameraConstraints {
  readonly minDistance: number;
  readonly maxDistance: number;
  readonly minFov: number;
  readonly maxFov: number;
  readonly minPitch: number;
  readonly maxPitch: number;
  readonly minYaw: number;
  readonly maxYaw: number;
}

// ============================================================================
// Camera Preset
// ============================================================================

export interface CameraPresetConfig {
  readonly mode: CameraMode;
  readonly position: readonly [number, number, number];
  readonly lookAt: readonly [number, number, number];
  readonly fov: number;
  readonly movement: Partial<MovementConfig>;
  readonly constraints: Partial<CameraConstraints>;
  readonly effects: Partial<CameraEffectsConfig>;
}

// ============================================================================
// Focus
// ============================================================================

export interface FocusTarget {
  readonly position: readonly [number, number, number];
  readonly distance: number;
  readonly duration: number;
  readonly easing: EasingName;
}

export interface FocusConfig {
  readonly enabled: boolean;
  readonly smoothFactor: number;
  readonly autoDistance: number;
  readonly minDistance: number;
  readonly maxDistance: number;
}

// ============================================================================
// Timeline
// ============================================================================

export interface CameraKeyframe {
  /** Normalized time in [0, 1]. Multiplied by sequence.duration during interpolation. */
  readonly time: number;
  readonly position: readonly [number, number, number];
  readonly lookAt: readonly [number, number, number];
  readonly fov: number;
  readonly easing: EasingName;
}

export interface CameraSequence {
  readonly name: string;
  readonly keyframes: readonly CameraKeyframe[];
  readonly loop: boolean;
  readonly duration: number;
}

export interface TimelineState {
  readonly isPlaying: boolean;
  readonly isPaused: boolean;
  readonly currentTime: number;
  readonly progress: number;
  readonly currentKeyframeIndex: number;
  readonly sequenceName: string | null;
}

// ============================================================================
// Effects
// ============================================================================

export interface ShakeConfig {
  readonly enabled: boolean;
  readonly intensity: number;
  readonly frequency: number;
  readonly decay: number;
  readonly damping: number;
}

export interface DriftConfig {
  readonly enabled: boolean;
  readonly amplitude: number;
  readonly frequency: number;
  readonly direction: readonly [number, number, number];
}

export interface BobConfig {
  readonly enabled: boolean;
  readonly amplitude: number;
  readonly frequency: number;
  readonly phase: number;
}

export interface SwayConfig {
  readonly enabled: boolean;
  readonly amplitude: number;
  readonly frequency: number;
  readonly damping: number;
}

export interface CameraEffectsConfig {
  readonly shake: ShakeConfig;
  readonly drift: DriftConfig;
  readonly bob: BobConfig;
  readonly sway: SwayConfig;
}

export interface CameraEffectsState {
  readonly shakeIntensity: number;
  readonly driftOffset: readonly [number, number, number];
  readonly bobOffset: readonly [number, number, number];
  readonly swayOffset: readonly [number, number, number];
}

// ============================================================================
// Transitions
// ============================================================================

export type TransitionType = "fade" | "zoom" | "orbit" | "dolly" | "portal" | "custom";

export interface TransitionConfig {
  readonly type: TransitionType;
  readonly duration: number;
  readonly easing: EasingName;
}

export interface TransitionState {
  readonly isTransitioning: boolean;
  readonly type: TransitionType;
  readonly progress: number;
  readonly duration: number;
}

// ============================================================================
// Camera Manager Config
// ============================================================================

export interface CinematicCameraConfig {
  readonly position: readonly [number, number, number];
  readonly lookAt: readonly [number, number, number];
  readonly fov: number;
  readonly near: number;
  readonly far: number;
  readonly movement: Partial<MovementConfig>;
  readonly constraints: Partial<CameraConstraints>;
  readonly effects: Partial<CameraEffectsConfig>;
  readonly focus: Partial<FocusConfig>;
  readonly reducedMotion: boolean;
  readonly sensitivity: number;
}

// ============================================================================
// Camera Manager State
// ============================================================================

export interface CinematicCameraState {
  readonly mode: CameraMode;
  readonly cameraState: CameraState;
  readonly position: readonly [number, number, number];
  readonly lookAt: readonly [number, number, number];
  readonly fov: number;
  readonly distance: number;
  readonly isInitialized: boolean;
  readonly isRunning: boolean;
  readonly timeline: TimelineState;
  readonly transition: TransitionState;
  readonly effects: CameraEffectsState;
}

// ============================================================================
// Camera Manager Ref (for React context)
// ============================================================================

export interface CinematicCameraRef {
  readonly getCamera: () => PerspectiveCamera;
  readonly getPosition: () => Vector3;
  readonly getLookAt: () => Vector3;
  readonly getState: () => CinematicCameraState;
  readonly setMode: (mode: CameraMode) => void;
  readonly setPosition: (x: number, y: number, z: number) => void;
  readonly setLookAt: (x: number, y: number, z: number) => void;
  readonly setFov: (fov: number) => void;
  readonly setTarget: (
    position: readonly [number, number, number],
    lookAt: readonly [number, number, number],
  ) => void;
  readonly focus: (target: FocusTarget) => void;
  readonly playSequence: (sequence: CameraSequence) => void;
  readonly pauseTimeline: () => void;
  readonly resumeTimeline: () => void;
  readonly stopTimeline: () => void;
  readonly setTransition: (config: TransitionConfig) => void;
  readonly setEffectWeight: (effect: keyof CameraEffectsConfig, weight: number) => void;
  readonly triggerShake: (config?: Partial<ShakeConfig>) => void;
  readonly setReducedMotion: (enabled: boolean) => void;
  readonly setSensitivity: (sensitivity: number) => void;
  readonly addObject: (
    object: Object3D,
    followOffset?: readonly [number, number, number],
  ) => string;
  readonly removeObject: (id: string) => void;
  readonly setFollowTarget: (id: string | null) => void;
  readonly resize: (width: number, height: number) => void;
}

// ============================================================================
// React Hook Returns
// ============================================================================

export interface UseCameraReturn {
  readonly state: CinematicCameraState;
  readonly setMode: (mode: CameraMode) => void;
  readonly setPosition: (x: number, y: number, z: number) => void;
  readonly setLookAt: (x: number, y: number, z: number) => void;
  readonly setFov: (fov: number) => void;
  readonly setTarget: (
    position: readonly [number, number, number],
    lookAt: readonly [number, number, number],
  ) => void;
}

export interface UseCameraModeReturn {
  readonly mode: CameraMode;
  readonly state: CameraState;
  readonly setMode: (mode: CameraMode) => void;
  readonly isMode: (mode: CameraMode) => boolean;
}

export interface UseCameraFocusReturn {
  readonly focus: (target: FocusTarget) => void;
  readonly setFollowTarget: (id: string | null) => void;
  readonly addObject: (
    object: Object3D,
    followOffset?: readonly [number, number, number],
  ) => string;
  readonly removeObject: (id: string) => void;
}

export interface UseCameraTimelineReturn {
  readonly timeline: TimelineState;
  readonly play: (sequence: CameraSequence) => void;
  readonly pause: () => void;
  readonly resume: () => void;
  readonly stop: () => void;
}

export interface UseCameraEffectsReturn {
  readonly effects: CameraEffectsState;
  readonly triggerShake: (config?: Partial<ShakeConfig>) => void;
  readonly setEffectWeight: (effect: keyof CameraEffectsConfig, weight: number) => void;
}

export interface UseReducedMotionReturn {
  readonly prefersReducedMotion: boolean;
  readonly setReducedMotion: (enabled: boolean) => void;
}
