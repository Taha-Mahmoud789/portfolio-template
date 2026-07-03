/**
 * Scene Architecture
 *
 * Reusable Three.js scene management system.
 * Every manager exposes initialize(), update(), dispose().
 * Managers never depend on each other directly.
 */

// ============================================================================
// Types
// ============================================================================
export type {
  Manager,
  SceneManagerConfig,
  SceneManagerState,
  RendererManagerConfig,
  RendererManagerState,
  ToneMapping,
  CameraPreset,
  CameraConfig,
  CameraManagerConfig,
  CameraManagerState,
  CameraShakeConfig,
  CameraTransitionConfig,
  LightType,
  LightConfig,
  LightingManagerConfig,
  LightingManagerState,
  EnvironmentBackgroundType,
  EnvironmentConfig,
  EnvironmentManagerConfig,
  EnvironmentManagerState,
  ObjectCategory,
  ManagedObject,
  ObjectManagerConfig,
  ObjectManagerState,
  AssetType,
  AssetDefinition,
  LoadedAsset,
  AssetLoaderConfig,
  AssetLoaderState,
  EffectType,
  BloomConfig,
  VignetteConfig,
  PostProcessingManagerConfig,
  PostProcessingManagerState,
  PerformanceMetrics,
  PerformanceQuality,
  PerformanceManagerConfig,
  PerformanceManagerState,
  SceneContextValue,
  SceneProviderProps,
  UseSceneReturn,
  UseCameraReturn,
  UseLightingReturn,
  UseEnvironmentReturn,
  UseObjectReturn,
  UsePerformanceReturn,
  UseAssetReturn,
  SceneManagerRef,
} from "./types";

// ============================================================================
// Constants
// ============================================================================
export {
  RENDERER_DEFAULTS,
  CAMERA_PRESETS,
  CAMERA_DEFAULTS,
  LIGHTING_DEFAULTS,
  ENVIRONMENT_DEFAULTS,
  OBJECT_DEFAULTS,
  ASSET_LOADER_DEFAULTS,
  POST_PROCESSING_DEFAULTS,
  PERFORMANCE_DEFAULTS,
  SCENE_MANAGER_DEFAULTS,
  SCENE_LAYERS,
  DISPOSE_FLAGS,
} from "./constants";

// ============================================================================
// Managers
// ============================================================================
export { RendererManager, createRendererManager } from "./renderer-manager";
export { CameraManager, createCameraManager } from "./camera-manager";
export { LightingManager, createLightingManager } from "./lighting-manager";
export { EnvironmentManager, createEnvironmentManager } from "./environment-manager";
export { ObjectManager, createObjectManager } from "./object-manager";
export { AssetLoader, createAssetLoader } from "./asset-loader";
export { PostProcessingManager, createPostProcessingManager } from "./post-processing-manager";
export { PerformanceManager, createPerformanceManager } from "./performance-manager";

// ============================================================================
// Scene Manager (Orchestrator)
// ============================================================================
export { SceneManager, createSceneManager } from "./scene-manager";

// ============================================================================
// React Integration
// ============================================================================
export { SceneContext, useSceneContext, useOptionalSceneContext } from "./context";
export type { SceneContextValue as SceneContextType } from "./context";
export { SceneProvider } from "./provider";
export {
  useScene,
  useCamera,
  useLighting,
  useEnvironment,
  useObjects,
  usePerformance,
  useAssets,
} from "./hooks";
