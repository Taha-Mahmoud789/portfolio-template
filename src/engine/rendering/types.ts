/**
 * Rendering Pipeline — Types
 *
 * Core type definitions for the rendering engine.
 * Every module exposes initialize(), update(), resize(), dispose().
 * Modules communicate only through RenderPipeline.
 */

import type {
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  ColorRepresentation,
  Object3D,
  Scene,
} from "three";
import type { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";

export type { ColorRepresentation } from "three";

// ============================================================================
// Lifecycle
// ============================================================================

export interface RenderModule {
  initialize(): void;
  update(delta: number): void;
  resize(width: number, height: number): void;
  dispose(): void;
}

// ============================================================================
// Quality Levels
// ============================================================================

export type QualityLevel = "low" | "medium" | "high" | "ultra";

export interface QualityPreset {
  readonly pixelRatioMax: number;
  readonly antialias: boolean;
  readonly bloomEnabled: boolean;
  readonly bloomResolutionScale: number;
  readonly fxaaEnabled: boolean;
  readonly filmGrainEnabled: boolean;
  readonly vignetteEnabled: boolean;
  readonly shadowMapEnabled: boolean;
  readonly shadowMapSize: number;
  readonly maxLights: number;
}

// ============================================================================
// Tone Mapping
// ============================================================================

export type ToneMappingMode = "none" | "linear" | "reinhard" | "cineon" | "aces";

// ============================================================================
// Color Space
// ============================================================================

export type ColorSpace = "srgb" | "linear";

// ============================================================================
// Fog
// ============================================================================

export type FogType = "none" | "linear" | "exponential";

export interface FogConfig {
  readonly type: FogType;
  readonly color: ColorRepresentation;
  readonly near: number;
  readonly far: number;
  readonly density: number;
}

export interface FogState {
  readonly type: FogType;
  readonly color: Color;
  readonly isActive: boolean;
}

// ============================================================================
// Background
// ============================================================================

export type BackgroundType = "color" | "texture" | "cube" | "none";

export interface BackgroundConfig {
  readonly type: BackgroundType;
  readonly color: ColorRepresentation;
  readonly textureUrl: string | null;
}

// ============================================================================
// Environment
// ============================================================================

export interface EnvironmentConfig {
  readonly background: BackgroundConfig;
  readonly fog: FogConfig;
  readonly environmentMapUrl: string | null;
  readonly environmentMapIntensity: number;
}

// ============================================================================
// Post Processing
// ============================================================================

export interface BloomConfig {
  readonly enabled: boolean;
  readonly threshold: number;
  readonly strength: number;
  readonly radius: number;
}

export interface VignetteConfig {
  readonly enabled: boolean;
  readonly offset: number;
  readonly darkness: number;
}

export interface FilmGrainConfig {
  readonly enabled: boolean;
  readonly intensity: number;
}

export interface FXAAConfig {
  readonly enabled: boolean;
}

export interface PostProcessingConfig {
  readonly bloom: BloomConfig;
  readonly vignette: VignetteConfig;
  readonly filmGrain: FilmGrainConfig;
  readonly fxaa: FXAAConfig;
}

// ============================================================================
// Renderer
// ============================================================================

export type PowerPreference = "default" | "high-performance" | "low-power";

export interface RendererConfig {
  readonly canvas: HTMLCanvasElement | null;
  readonly antialias: boolean;
  readonly alpha: boolean;
  readonly powerPreference: PowerPreference;
  readonly pixelRatio: number | "auto";
  readonly maxPixelRatio: number;
  readonly logarithmicDepthBuffer: boolean;
  readonly stencil: boolean;
  readonly toneMapping: ToneMappingMode;
  readonly toneMappingExposure: number;
  readonly outputColorSpace: ColorSpace;
  readonly shadowMapEnabled: boolean;
}

// ============================================================================
// Render Pipeline Config
// ============================================================================

export interface RenderPipelineConfig {
  readonly renderer: Partial<RendererConfig>;
  readonly environment: Partial<EnvironmentConfig>;
  readonly postProcessing: Partial<PostProcessingConfig>;
  readonly quality: QualityLevel;
  readonly autoStart: boolean;
  readonly maxDelta: number;
}

// ============================================================================
// Render Pipeline State
// ============================================================================

export interface RenderPipelineState {
  readonly isInitialized: boolean;
  readonly isRunning: boolean;
  readonly quality: QualityLevel;
  readonly fps: number;
  readonly frameTime: number;
  readonly drawCalls: number;
  readonly triangles: number;
  readonly textures: number;
  readonly geometries: number;
}

// ============================================================================
// Renderer State
// ============================================================================

export interface RendererState {
  readonly width: number;
  readonly height: number;
  readonly pixelRatio: number;
  readonly isWebGL2: boolean;
  readonly toneMapping: ToneMappingMode;
  readonly toneMappingExposure: number;
  readonly outputColorSpace: ColorSpace;
}

// ============================================================================
// Environment State
// ============================================================================

export interface EnvironmentState {
  readonly backgroundType: BackgroundType;
  readonly fogType: FogType;
  readonly hasEnvironmentMap: boolean;
}

// ============================================================================
// Post Processing State
// ============================================================================

export interface PostProcessingState {
  readonly isEnabled: boolean;
  readonly activeEffects: readonly string[];
}

// ============================================================================
// Context Value
// ============================================================================

export interface RenderContextValue {
  readonly pipeline: RenderPipelineRef;
  readonly state: RenderPipelineState;
}

// ============================================================================
// Pipeline Ref (public API)
// ============================================================================

export interface RenderPipelineRef {
  readonly getRenderer: () => WebGLRenderer | null;
  readonly getScene: () => Scene | null;
  readonly getCamera: () => PerspectiveCamera;
  readonly getComposer: () => EffectComposer | null;
  readonly getState: () => RenderPipelineState;
  readonly getRendererState: () => RendererState;
  readonly getEnvironmentState: () => EnvironmentState;
  readonly getPostProcessingState: () => PostProcessingState;

  readonly setCamera: (camera: PerspectiveCamera) => void;
  readonly setPixelRatio: (ratio: number | "auto") => void;
  readonly setQuality: (quality: QualityLevel) => void;
  readonly setToneMapping: (mode: ToneMappingMode) => void;
  readonly setExposure: (exposure: number) => void;
  readonly animateExposure: (target: number, duration: number) => void;
  readonly setBackground: (type: BackgroundType, color: ColorRepresentation) => void;
  readonly setFog: (type: FogType, config?: Partial<FogConfig>) => void;
  readonly setBloom: (strength: number, radius: number, threshold: number) => void;
  readonly setBloomEnabled: (enabled: boolean) => void;
  readonly setVignetteEnabled: (enabled: boolean) => void;
  readonly setFilmGrainEnabled: (enabled: boolean) => void;
  readonly setFXAAEnabled: (enabled: boolean) => void;
  readonly addObject: (object: Object3D) => void;
  readonly removeObject: (object: Object3D) => void;
  readonly resize: (width: number, height: number) => void;
}

// ============================================================================
// Hook Returns
// ============================================================================

export interface UseRendererReturn {
  readonly state: RendererState;
  readonly setPixelRatio: (ratio: number | "auto") => void;
  readonly setToneMapping: (mode: ToneMappingMode) => void;
  readonly setToneMappingExposure: (exposure: number) => void;
}

export interface UseEnvironmentReturn {
  readonly state: EnvironmentState;
  readonly setBackground: (type: BackgroundType, color: ColorRepresentation) => void;
  readonly setFog: (type: FogType, config?: Partial<FogConfig>) => void;
}

export interface UsePostProcessingReturn {
  readonly state: PostProcessingState;
  readonly setBloom: (strength: number, radius: number, threshold: number) => void;
  readonly setBloomEnabled: (enabled: boolean) => void;
  readonly setVignetteEnabled: (enabled: boolean) => void;
  readonly setFilmGrainEnabled: (enabled: boolean) => void;
  readonly setFXAAEnabled: (enabled: boolean) => void;
}
