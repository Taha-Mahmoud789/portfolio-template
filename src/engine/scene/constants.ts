/**
 * Scene Architecture Constants
 *
 * Default values, presets, and configuration for all scene managers.
 */

import type {
  SceneManagerConfig,
  RendererManagerConfig,
  CameraManagerConfig,
  CameraConfig,
  CameraPreset,
  LightingManagerConfig,
  EnvironmentManagerConfig,
  EnvironmentConfig,
  ObjectManagerConfig,
  AssetLoaderConfig,
  PostProcessingManagerConfig,
  PerformanceManagerConfig,
} from "./types";

// ============================================================================
// Renderer Defaults
// ============================================================================

export const RENDERER_DEFAULTS: RendererManagerConfig = {
  canvas: null,
  antialias: true,
  alpha: false,
  powerPreference: "high-performance",
  pixelRatio: "auto",
  maxPixelRatio: 2,
  toneMapping: "aces",
  toneMappingExposure: 1.0,
  outputColorSpace: "srgb",
  shadowMapEnabled: false,
  shadowMapType: "pcfsoft",
  logarithmicDepthBuffer: false,
  stencil: false,
};

// ============================================================================
// Camera Presets
// ============================================================================

export const CAMERA_PRESETS: Record<CameraPreset, CameraConfig> = {
  default: {
    fov: 60,
    near: 0.1,
    far: 1000,
    position: [0, 0, 5],
    lookAt: [0, 0, 0],
  },
  orbital: {
    fov: 50,
    near: 0.1,
    far: 2000,
    position: [0, 2, 8],
    lookAt: [0, 0, 0],
  },
  cinematic: {
    fov: 35,
    near: 0.1,
    far: 5000,
    position: [5, 3, 10],
    lookAt: [0, 0, 0],
  },
  firstPerson: {
    fov: 75,
    near: 0.01,
    far: 500,
    position: [0, 1.7, 0],
    lookAt: [0, 1.7, -1],
  },
  overhead: {
    fov: 45,
    near: 0.1,
    far: 1000,
    position: [0, 20, 0],
    lookAt: [0, 0, 0],
  },
  side: {
    fov: 50,
    near: 0.1,
    far: 1000,
    position: [10, 0, 0],
    lookAt: [0, 0, 0],
  },
  custom: {
    fov: 60,
    near: 0.1,
    far: 1000,
    position: [0, 0, 5],
    lookAt: [0, 0, 0],
  },
};

export const CAMERA_DEFAULTS: CameraManagerConfig = {
  preset: "default",
  config: {},
  enableShake: true,
  enableDamping: true,
  dampingFactor: 0.05,
  enableTracking: true,
  trackingSmoothing: 0.1,
};

// ============================================================================
// Lighting Defaults
// ============================================================================

export const LIGHTING_DEFAULTS: LightingManagerConfig = {
  ambient: {
    type: "ambient",
    color: "#ffffff",
    intensity: 0.4,
  },
  directional: [
    {
      type: "directional",
      color: "#e2e8f0",
      intensity: 0.6,
      position: [5, 10, 5],
      castShadow: false,
    },
  ],
  point: [],
  enableShadows: false,
  shadowMapSize: 1024,
};

// ============================================================================
// Environment Defaults
// ============================================================================

export const ENVIRONMENT_DEFAULTS: EnvironmentManagerConfig & {
  readonly environment: EnvironmentConfig;
} = {
  environment: {
    backgroundType: "color",
    backgroundValue: "#030712",
    backgroundColor: "#030712",
    fogType: "exponential",
    fogColor: "#030712",
    fogNear: 10,
    fogFar: 100,
    fogDensity: 0.02,
    environmentMap: null,
  },
};

// ============================================================================
// Object Manager Defaults
// ============================================================================

export const OBJECT_DEFAULTS: ObjectManagerConfig = {
  maxObjects: 1000,
  enableLOD: true,
  frustumCulled: true,
  autoDispose: true,
};

// ============================================================================
// Asset Loader Defaults
// ============================================================================

export const ASSET_LOADER_DEFAULTS: AssetLoaderConfig = {
  maxConcurrent: 4,
  retryCount: 3,
  retryDelay: 1000,
  timeout: 30000,
};

// ============================================================================
// Post Processing Defaults
// ============================================================================

export const POST_PROCESSING_DEFAULTS: PostProcessingManagerConfig = {
  enabled: true,
  bloom: {
    threshold: 0.8,
    strength: 0.3,
    radius: 0.4,
  },
  vignette: {
    offset: 0.5,
    darkness: 0.5,
  },
  pixelRatio: 1,
};

// ============================================================================
// Performance Defaults
// ============================================================================

export const PERFORMANCE_DEFAULTS: PerformanceManagerConfig = {
  targetFPS: 60,
  monitorInterval: 1000,
  enableAdaptiveQuality: true,
  lowFPSThreshold: 30,
  highFPSThreshold: 55,
};

// ============================================================================
// Scene Manager Defaults
// ============================================================================

export const SCENE_MANAGER_DEFAULTS: SceneManagerConfig = {
  renderer: RENDERER_DEFAULTS,
  camera: CAMERA_DEFAULTS,
  lighting: LIGHTING_DEFAULTS,
  environment: ENVIRONMENT_DEFAULTS,
  postProcessing: POST_PROCESSING_DEFAULTS,
  performance: PERFORMANCE_DEFAULTS,
  debug: false,
};

// ============================================================================
// Layer Mapping
// ============================================================================

export const SCENE_LAYERS = {
  void: 0,
  atmosphere: 1,
  stars: 2,
  structure: 3,
  surface: 4,
  floating: 5,
} as const;

// ============================================================================
// Dispose Helpers
// ============================================================================

export const DISPOSE_FLAGS = {
  geometry: true,
  material: true,
  texture: true,
  child: true,
} as const;
