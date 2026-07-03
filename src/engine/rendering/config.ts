/**
 * Rendering Pipeline — Config
 *
 * Deep merge utilities and configuration helpers.
 */

import type {
  RenderPipelineConfig,
  RendererConfig,
  EnvironmentConfig,
  PostProcessingConfig,
  FogConfig,
  BackgroundConfig,
  BloomConfig,
  VignetteConfig,
  FilmGrainConfig,
  FXAAConfig,
} from "./types";
import {
  RENDERER_DEFAULTS,
  ENVIRONMENT_DEFAULTS,
  POST_PROCESSING_DEFAULTS,
  FOG_DEFAULTS,
  BACKGROUND_DEFAULTS,
  BLOOM_DEFAULTS,
  VIGNETTE_DEFAULTS,
  FILM_GRAIN_DEFAULTS,
  FXAA_DEFAULTS,
  PIPELINE_DEFAULTS,
} from "./constants";

// ============================================================================
// Merge Utilities
// ============================================================================

export function mergeRendererConfig(overrides: Partial<RendererConfig>): RendererConfig {
  return { ...RENDERER_DEFAULTS, ...overrides };
}

export function mergeEnvironmentConfig(overrides: Partial<EnvironmentConfig>): EnvironmentConfig {
  const base = ENVIRONMENT_DEFAULTS;
  return {
    background: { ...base.background, ...overrides.background },
    fog: { ...base.fog, ...overrides.fog },
    environmentMapUrl: overrides.environmentMapUrl ?? base.environmentMapUrl,
    environmentMapIntensity: overrides.environmentMapIntensity ?? base.environmentMapIntensity,
  };
}

export function mergePostProcessingConfig(
  overrides: Partial<PostProcessingConfig>,
): PostProcessingConfig {
  const base = POST_PROCESSING_DEFAULTS;
  return {
    bloom: { ...base.bloom, ...overrides.bloom },
    vignette: { ...base.vignette, ...overrides.vignette },
    filmGrain: { ...base.filmGrain, ...overrides.filmGrain },
    fxaa: { ...base.fxaa, ...overrides.fxaa },
  };
}

export function mergeFogConfig(overrides: Partial<FogConfig>): FogConfig {
  return { ...FOG_DEFAULTS, ...overrides };
}

export function mergeBackgroundConfig(overrides: Partial<BackgroundConfig>): BackgroundConfig {
  return { ...BACKGROUND_DEFAULTS, ...overrides };
}

export function mergeBloomConfig(overrides: Partial<BloomConfig>): BloomConfig {
  return { ...BLOOM_DEFAULTS, ...overrides };
}

export function mergeVignetteConfig(overrides: Partial<VignetteConfig>): VignetteConfig {
  return { ...VIGNETTE_DEFAULTS, ...overrides };
}

export function mergeFilmGrainConfig(overrides: Partial<FilmGrainConfig>): FilmGrainConfig {
  return { ...FILM_GRAIN_DEFAULTS, ...overrides };
}

export function mergeFXAAConfig(overrides: Partial<FXAAConfig>): FXAAConfig {
  return { ...FXAA_DEFAULTS, ...overrides };
}

export function mergePipelineConfig(overrides: Partial<RenderPipelineConfig>): RenderPipelineConfig {
  const base = PIPELINE_DEFAULTS;
  return {
    renderer: { ...base.renderer, ...overrides.renderer },
    environment: { ...base.environment, ...overrides.environment },
    postProcessing: { ...base.postProcessing, ...overrides.postProcessing },
    quality: overrides.quality ?? base.quality,
    autoStart: overrides.autoStart ?? base.autoStart,
    maxDelta: overrides.maxDelta ?? base.maxDelta,
  };
}

// ============================================================================
// Preset Configs
// ============================================================================

export const SPACE_WORLD_RENDERING: Partial<RenderPipelineConfig> = {
  renderer: {
    toneMapping: "aces",
    toneMappingExposure: 1.0,
    outputColorSpace: "srgb",
    shadowMapEnabled: false,
    antialias: true,
    maxPixelRatio: 2,
  },
  environment: {
    background: {
      type: "color",
      color: "#030712",
      textureUrl: null,
    },
    fog: {
      type: "exponential",
      color: "#030712",
      near: 10,
      far: 100,
      density: 0.015,
    },
  },
  postProcessing: {
    bloom: { enabled: true, threshold: 0.6, strength: 0.4, radius: 0.5 },
    vignette: { enabled: true, offset: 0.5, darkness: 0.6 },
    filmGrain: { enabled: true, intensity: 0.03 },
    fxaa: { enabled: true },
  },
  quality: "high",
};
