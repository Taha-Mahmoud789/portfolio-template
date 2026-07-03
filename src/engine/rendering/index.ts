/**
 * Rendering Pipeline — Barrel Exports
 */

// Core
export { RenderPipeline, createRenderPipeline } from "./render-pipeline";
export { RenderProvider } from "./render-provider";
export { RenderContext } from "./render-context";

// Managers
export { RendererManager, createRendererManager } from "./renderer-manager";
export { EnvironmentManager, createEnvironmentManager } from "./environment-manager";
export { PostProcessingManager, createPostProcessingManager } from "./post-processing-manager";

// Hooks
export { useRenderer, useEnvironment, usePostProcessing } from "./hooks";

// Config
export {
  mergeRendererConfig,
  mergeEnvironmentConfig,
  mergePostProcessingConfig,
  mergeFogConfig,
  mergeBackgroundConfig,
  mergeBloomConfig,
  mergeVignetteConfig,
  mergeFilmGrainConfig,
  mergeFXAAConfig,
  mergePipelineConfig,
  SPACE_WORLD_RENDERING,
} from "./config";

// Constants
export {
  RENDERER_DEFAULTS,
  FOG_DEFAULTS,
  BACKGROUND_DEFAULTS,
  ENVIRONMENT_DEFAULTS,
  POST_PROCESSING_DEFAULTS,
  BLOOM_DEFAULTS,
  VIGNETTE_DEFAULTS,
  FILM_GRAIN_DEFAULTS,
  FXAA_DEFAULTS,
  QUALITY_PRESETS,
  PIPELINE_DEFAULTS,
} from "./constants";

// Types
export type {
  RenderModule,
  QualityLevel,
  QualityPreset,
  ToneMappingMode,
  ColorSpace,
  FogType,
  FogConfig,
  BackgroundType,
  BackgroundConfig,
  EnvironmentConfig,
  BloomConfig,
  VignetteConfig,
  FilmGrainConfig,
  FXAAConfig,
  PostProcessingConfig,
  PowerPreference,
  RendererConfig,
  RenderPipelineConfig,
  RenderPipelineState,
  RendererState,
  EnvironmentState,
  PostProcessingState,
  RenderContextValue,
  RenderPipelineRef,
  UseRendererReturn,
  UseEnvironmentReturn,
  UsePostProcessingReturn,
} from "./types";

// Utils
export {
  isMobile,
  isTablet,
  isLowEndDevice,
  getMaxPixelRatio,
  getGPUCapabilities,
  recommendQuality,
  getFrameBudget,
  isFrameBudgetExceeded,
} from "./utils/device";
export type { GPUCapabilities } from "./utils/device";
