/**
 * Cinematic Camera System — Config
 *
 * Default values, presets, and configuration for the camera engine.
 */

import type {
  CinematicCameraConfig,
  CameraPresetConfig,
  MovementConfig,
  CameraConstraints,
  CameraEffectsConfig,
  ShakeConfig,
  DriftConfig,
  BobConfig,
  SwayConfig,
  FocusConfig,
} from "./types";

// ============================================================================
// Movement Defaults
// ============================================================================

export const DEFAULT_MOVEMENT: MovementConfig = {
  stiffness: 120,
  damping: 14,
  mass: 1,
  maxSpeed: 50,
  acceleration: 8,
  deceleration: 12,
};

export const SPRING_MOVEMENT: MovementConfig = {
  stiffness: 180,
  damping: 12,
  mass: 1,
  maxSpeed: 100,
  acceleration: 20,
  deceleration: 16,
};

export const DAMPED_MOVEMENT: MovementConfig = {
  stiffness: 80,
  damping: 20,
  mass: 1,
  maxSpeed: 30,
  acceleration: 6,
  deceleration: 10,
};

export const HEAVY_MOVEMENT: MovementConfig = {
  stiffness: 60,
  damping: 8,
  mass: 3,
  maxSpeed: 15,
  acceleration: 3,
  deceleration: 5,
};

export const LIGHT_MOVEMENT: MovementConfig = {
  stiffness: 200,
  damping: 18,
  mass: 0.5,
  maxSpeed: 80,
  acceleration: 15,
  deceleration: 20,
};

// ============================================================================
// Constraints Defaults
// ============================================================================

export const DEFAULT_CONSTRAINTS: CameraConstraints = {
  minDistance: 1,
  maxDistance: 100,
  minFov: 15,
  maxFov: 120,
  minPitch: -Math.PI / 2 + 0.01,
  maxPitch: Math.PI / 2 - 0.01,
  minYaw: -Math.PI,
  maxYaw: Math.PI,
};

// ============================================================================
// Effects Defaults
// ============================================================================

export const DEFAULT_SHAKE: ShakeConfig = {
  enabled: true,
  intensity: 0.5,
  frequency: 30,
  decay: 3,
  damping: 0.92,
};

export const DEFAULT_DRIFT: DriftConfig = {
  enabled: true,
  amplitude: 0.5,
  frequency: 0.08,
  direction: [1, 0.5, 0.3],
};

export const DEFAULT_BOB: BobConfig = {
  enabled: false,
  amplitude: 0.2,
  frequency: 1.5,
  phase: 0,
};

export const DEFAULT_SWAY: SwayConfig = {
  enabled: false,
  amplitude: 0.3,
  frequency: 0.5,
  damping: 0.95,
};

export const DEFAULT_EFFECTS: CameraEffectsConfig = {
  shake: DEFAULT_SHAKE,
  drift: DEFAULT_DRIFT,
  bob: DEFAULT_BOB,
  sway: DEFAULT_SWAY,
};

// ============================================================================
// Focus Defaults
// ============================================================================

export const DEFAULT_FOCUS: FocusConfig = {
  enabled: true,
  smoothFactor: 0.1,
  autoDistance: 5,
  minDistance: 1,
  maxDistance: 50,
};

// ============================================================================
// Camera Manager Defaults
// ============================================================================

export const CAMERA_DEFAULTS: CinematicCameraConfig = {
  position: [0, 2, 8],
  lookAt: [0, 0, 0],
  fov: 60,
  near: 0.1,
  far: 1000,
  movement: DEFAULT_MOVEMENT,
  constraints: DEFAULT_CONSTRAINTS,
  effects: DEFAULT_EFFECTS,
  focus: DEFAULT_FOCUS,
  reducedMotion: false,
  sensitivity: 1,
};

// ============================================================================
// Camera Presets
// ============================================================================

export const CAMERA_PRESETS: Record<string, CameraPresetConfig> = {
  idle: {
    mode: "idle",
    position: [0, 2, 8],
    lookAt: [0, 0, 0],
    fov: 60,
    movement: LIGHT_MOVEMENT,
    constraints: {},
    effects: { drift: { ...DEFAULT_DRIFT, enabled: true, amplitude: 0.3 } },
  },
  floating: {
    mode: "floating",
    position: [0, 2, 8],
    lookAt: [0, 0, 0],
    fov: 60,
    movement: SPRING_MOVEMENT,
    constraints: {},
    effects: {
      drift: { ...DEFAULT_DRIFT, enabled: true, amplitude: 0.8, frequency: 0.06 },
      bob: { ...DEFAULT_BOB, enabled: true, amplitude: 0.15, frequency: 0.3 },
    },
  },
  orbit: {
    mode: "orbit",
    position: [0, 2, 8],
    lookAt: [0, 0, 0],
    fov: 55,
    movement: DAMPED_MOVEMENT,
    constraints: { minDistance: 3, maxDistance: 30 },
    effects: { drift: { ...DEFAULT_DRIFT, enabled: true, amplitude: 0.2 } },
  },
  focus: {
    mode: "focus",
    position: [0, 1, 3],
    lookAt: [0, 0, 0],
    fov: 45,
    movement: SPRING_MOVEMENT,
    constraints: { minFov: 20, maxFov: 60 },
    effects: {},
  },
  cinematic: {
    mode: "cinematic",
    position: [5, 3, 10],
    lookAt: [0, 0, 0],
    fov: 35,
    movement: HEAVY_MOVEMENT,
    constraints: {},
    effects: {},
  },
  follow: {
    mode: "follow",
    position: [0, 3, 8],
    lookAt: [0, 0, 0],
    fov: 50,
    movement: DAMPED_MOVEMENT,
    constraints: { minDistance: 3, maxDistance: 20 },
    effects: { bob: { ...DEFAULT_BOB, enabled: true, amplitude: 0.1, frequency: 2 } },
  },
  inspect: {
    mode: "inspect",
    position: [2, 1, 3],
    lookAt: [0, 0, 0],
    fov: 40,
    movement: SPRING_MOVEMENT,
    constraints: { minDistance: 1, maxDistance: 8, minFov: 25, maxFov: 50 },
    effects: {},
  },
  portal: {
    mode: "portal",
    position: [0, 0, 15],
    lookAt: [0, 0, 0],
    fov: 75,
    movement: HEAVY_MOVEMENT,
    constraints: {},
    effects: { shake: { ...DEFAULT_SHAKE, enabled: true, intensity: 0.8, frequency: 40 } },
  },
  vr: {
    mode: "vr",
    position: [0, 1.7, 0],
    lookAt: [0, 1.7, -1],
    fov: 75,
    movement: LIGHT_MOVEMENT,
    constraints: {},
    effects: {},
  },
} as const;

// ============================================================================
// Merge Utility
// ============================================================================

export function mergeCameraConfig(
  base: CinematicCameraConfig,
  overrides: Partial<CinematicCameraConfig>,
): CinematicCameraConfig {
  const bShake = base.effects.shake ?? DEFAULT_SHAKE;
  const bDrift = base.effects.drift ?? DEFAULT_DRIFT;
  const bBob = base.effects.bob ?? DEFAULT_BOB;
  const bSway = base.effects.sway ?? DEFAULT_SWAY;
  const oShake = overrides.effects?.shake;
  const oDrift = overrides.effects?.drift;
  const oBob = overrides.effects?.bob;
  const oSway = overrides.effects?.sway;
  return {
    ...base,
    ...overrides,
    movement: { ...DEFAULT_MOVEMENT, ...base.movement, ...overrides.movement },
    constraints: { ...DEFAULT_CONSTRAINTS, ...base.constraints, ...overrides.constraints },
    effects: {
      shake: {
        enabled: oShake?.enabled ?? bShake.enabled,
        intensity: oShake?.intensity ?? bShake.intensity,
        frequency: oShake?.frequency ?? bShake.frequency,
        decay: oShake?.decay ?? bShake.decay,
        damping: oShake?.damping ?? bShake.damping,
      },
      drift: {
        enabled: oDrift?.enabled ?? bDrift.enabled,
        amplitude: oDrift?.amplitude ?? bDrift.amplitude,
        frequency: oDrift?.frequency ?? bDrift.frequency,
        direction: oDrift?.direction ?? bDrift.direction,
      },
      bob: {
        enabled: oBob?.enabled ?? bBob.enabled,
        amplitude: oBob?.amplitude ?? bBob.amplitude,
        frequency: oBob?.frequency ?? bBob.frequency,
        phase: oBob?.phase ?? bBob.phase,
      },
      sway: {
        enabled: oSway?.enabled ?? bSway.enabled,
        amplitude: oSway?.amplitude ?? bSway.amplitude,
        frequency: oSway?.frequency ?? bSway.frequency,
        damping: oSway?.damping ?? bSway.damping,
      },
    },
    focus: { ...DEFAULT_FOCUS, ...base.focus, ...overrides.focus },
  };
}

// ============================================================================
// Preset Merge
// ============================================================================

export function mergePresetWithDefaults(preset: Partial<CameraPresetConfig>): CameraPresetConfig {
  const pShake = preset.effects?.shake;
  const pDrift = preset.effects?.drift;
  const pBob = preset.effects?.bob;
  const pSway = preset.effects?.sway;
  return {
    mode: preset.mode ?? "idle",
    position: preset.position ?? CAMERA_DEFAULTS.position,
    lookAt: preset.lookAt ?? CAMERA_DEFAULTS.lookAt,
    fov: preset.fov ?? CAMERA_DEFAULTS.fov,
    movement: { ...DEFAULT_MOVEMENT, ...preset.movement },
    constraints: { ...DEFAULT_CONSTRAINTS, ...preset.constraints },
    effects: {
      shake: {
        enabled: pShake?.enabled ?? DEFAULT_SHAKE.enabled,
        intensity: pShake?.intensity ?? DEFAULT_SHAKE.intensity,
        frequency: pShake?.frequency ?? DEFAULT_SHAKE.frequency,
        decay: pShake?.decay ?? DEFAULT_SHAKE.decay,
        damping: pShake?.damping ?? DEFAULT_SHAKE.damping,
      },
      drift: {
        enabled: pDrift?.enabled ?? DEFAULT_DRIFT.enabled,
        amplitude: pDrift?.amplitude ?? DEFAULT_DRIFT.amplitude,
        frequency: pDrift?.frequency ?? DEFAULT_DRIFT.frequency,
        direction: pDrift?.direction ?? DEFAULT_DRIFT.direction,
      },
      bob: {
        enabled: pBob?.enabled ?? DEFAULT_BOB.enabled,
        amplitude: pBob?.amplitude ?? DEFAULT_BOB.amplitude,
        frequency: pBob?.frequency ?? DEFAULT_BOB.frequency,
        phase: pBob?.phase ?? DEFAULT_BOB.phase,
      },
      sway: {
        enabled: pSway?.enabled ?? DEFAULT_SWAY.enabled,
        amplitude: pSway?.amplitude ?? DEFAULT_SWAY.amplitude,
        frequency: pSway?.frequency ?? DEFAULT_SWAY.frequency,
        damping: pSway?.damping ?? DEFAULT_SWAY.damping,
      },
    },
  };
}
