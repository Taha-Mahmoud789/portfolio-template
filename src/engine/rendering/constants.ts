/**
 * Rendering Pipeline — Constants
 *
 * Default values, quality presets, and shared constants.
 */

import type {
  RenderPipelineConfig,
  RendererConfig,
  EnvironmentConfig,
  PostProcessingConfig,
  QualityPreset,
  QualityLevel,
  FogConfig,
  BackgroundConfig,
  BloomConfig,
  VignetteConfig,
  FilmGrainConfig,
  FXAAConfig,
} from "./types";

// ============================================================================
// Renderer Defaults
// ============================================================================

export const RENDERER_DEFAULTS: RendererConfig = {
  canvas: null,
  antialias: true,
  alpha: false,
  powerPreference: "high-performance",
  pixelRatio: "auto",
  maxPixelRatio: 2,
  logarithmicDepthBuffer: false,
  stencil: false,
  toneMapping: "aces",
  toneMappingExposure: 1.0,
  outputColorSpace: "srgb",
  shadowMapEnabled: false,
};

// ============================================================================
// Fog Defaults
// ============================================================================

export const FOG_DEFAULTS: FogConfig = {
  type: "exponential",
  color: "#030712",
  near: 10,
  far: 100,
  density: 0.02,
};

// ============================================================================
// Background Defaults
// ============================================================================

export const BACKGROUND_DEFAULTS: BackgroundConfig = {
  type: "color",
  color: "#030712",
  textureUrl: null,
};

// ============================================================================
// Environment Defaults
// ============================================================================

export const ENVIRONMENT_DEFAULTS: EnvironmentConfig = {
  background: BACKGROUND_DEFAULTS,
  fog: FOG_DEFAULTS,
  environmentMapUrl: null,
  environmentMapIntensity: 1.0,
};

// ============================================================================
// Post Processing Defaults
// ============================================================================

export const BLOOM_DEFAULTS: BloomConfig = {
  enabled: true,
  threshold: 0.8,
  strength: 0.3,
  radius: 0.4,
};

export const VIGNETTE_DEFAULTS: VignetteConfig = {
  enabled: true,
  offset: 0.5,
  darkness: 0.5,
};

export const FILM_GRAIN_DEFAULTS: FilmGrainConfig = {
  enabled: false,
  intensity: 0.05,
};

export const FXAA_DEFAULTS: FXAAConfig = {
  enabled: true,
};

export const POST_PROCESSING_DEFAULTS: PostProcessingConfig = {
  bloom: BLOOM_DEFAULTS,
  vignette: VIGNETTE_DEFAULTS,
  filmGrain: FILM_GRAIN_DEFAULTS,
  fxaa: FXAA_DEFAULTS,
};

// ============================================================================
// Quality Presets
// ============================================================================

export const QUALITY_PRESETS: Record<QualityLevel, QualityPreset> = {
  low: {
    pixelRatioMax: 1,
    antialias: false,
    bloomEnabled: false,
    bloomResolutionScale: 0.5,
    fxaaEnabled: false,
    filmGrainEnabled: false,
    vignetteEnabled: false,
    shadowMapEnabled: false,
    shadowMapSize: 512,
    maxLights: 4,
  },
  medium: {
    pixelRatioMax: 1.5,
    antialias: true,
    bloomEnabled: true,
    bloomResolutionScale: 0.75,
    fxaaEnabled: true,
    filmGrainEnabled: false,
    vignetteEnabled: true,
    shadowMapEnabled: false,
    shadowMapSize: 1024,
    maxLights: 8,
  },
  high: {
    pixelRatioMax: 2,
    antialias: true,
    bloomEnabled: true,
    bloomResolutionScale: 1,
    fxaaEnabled: true,
    filmGrainEnabled: true,
    vignetteEnabled: true,
    shadowMapEnabled: true,
    shadowMapSize: 2048,
    maxLights: 16,
  },
  ultra: {
    pixelRatioMax: 2,
    antialias: true,
    bloomEnabled: true,
    bloomResolutionScale: 1,
    fxaaEnabled: true,
    filmGrainEnabled: true,
    vignetteEnabled: true,
    shadowMapEnabled: true,
    shadowMapSize: 4096,
    maxLights: 32,
  },
};

// ============================================================================
// Pipeline Defaults
// ============================================================================

export const PIPELINE_DEFAULTS: RenderPipelineConfig = {
  renderer: RENDERER_DEFAULTS,
  environment: ENVIRONMENT_DEFAULTS,
  postProcessing: POST_PROCESSING_DEFAULTS,
  quality: "high",
  autoStart: true,
  maxDelta: 0.1,
};
