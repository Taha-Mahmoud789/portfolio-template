/**
 * Scene Architecture Types
 *
 * Core type definitions for the Three.js Scene Architecture.
 * Every manager exposes initialize(), update(), dispose().
 * Managers never depend on each other directly.
 */

import type { ReactNode } from "react";
import type { Scene, Camera, WebGLRenderer, Object3D, Texture, ColorRepresentation } from "three";
import type { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";

// ============================================================================
// Manager Lifecycle
// ============================================================================

export interface Manager {
  initialize(): void;
  update(delta: number): void;
  dispose(): void;
}

// ============================================================================
// Scene Manager
// ============================================================================

export interface SceneManagerConfig {
  readonly renderer: Partial<RendererManagerConfig>;
  readonly camera: Partial<CameraManagerConfig>;
  readonly lighting: Partial<LightingManagerConfig>;
  readonly environment: Partial<EnvironmentManagerConfig>;
  readonly postProcessing: Partial<PostProcessingManagerConfig>;
  readonly performance: Partial<PerformanceManagerConfig>;
  readonly debug: boolean;
}

export interface SceneManagerState {
  readonly isInitialized: boolean;
  readonly isRunning: boolean;
  readonly fps: number;
  readonly drawCalls: number;
  readonly triangles: number;
  readonly memoryUsage: number;
}

// ============================================================================
// Renderer Manager
// ============================================================================

export type ToneMapping = "none" | "linear" | "reinhard" | "cineon" | "aces";

export interface RendererManagerConfig {
  readonly canvas: HTMLCanvasElement | null;
  readonly antialias: boolean;
  readonly alpha: boolean;
  readonly powerPreference: "default" | "high-performance" | "low-power";
  readonly pixelRatio: number | "auto";
  readonly maxPixelRatio: number;
  readonly toneMapping: ToneMapping;
  readonly toneMappingExposure: number;
  readonly outputColorSpace: "srgb" | "linear";
  readonly shadowMapEnabled: boolean;
  readonly shadowMapType: "basic" | "pcf" | "pcfsoft" | "vsm";
  readonly logarithmicDepthBuffer: boolean;
  readonly stencil: boolean;
}

export interface RendererManagerState {
  readonly pixelRatio: number;
  readonly width: number;
  readonly height: number;
  readonly isWebGL2: boolean;
}

// ============================================================================
// Camera Manager
// ============================================================================

export type CameraPreset =
  "default" | "orbital" | "cinematic" | "firstPerson" | "overhead" | "side" | "custom";

export interface CameraConfig {
  readonly fov: number;
  readonly near: number;
  readonly far: number;
  readonly position: [number, number, number];
  readonly lookAt: [number, number, number];
}

export interface CameraManagerConfig {
  readonly preset: CameraPreset;
  readonly config: Partial<CameraConfig>;
  readonly enableShake: boolean;
  readonly enableDamping: boolean;
  readonly dampingFactor: number;
  readonly enableTracking: boolean;
  readonly trackingSmoothing: number;
}

export interface CameraShakeConfig {
  readonly intensity: number;
  readonly frequency: number;
  readonly decay: number;
}

export interface CameraTransitionConfig {
  readonly duration: number;
  readonly easing: string;
}

export interface CameraManagerState {
  readonly currentPreset: CameraPreset;
  readonly position: [number, number, number];
  readonly isShaking: boolean;
  readonly isTransitioning: boolean;
}

// ============================================================================
// Lighting Manager
// ============================================================================

export type LightType = "ambient" | "directional" | "point" | "spot" | "hemisphere";

export interface LightConfig {
  readonly type: LightType;
  readonly color: ColorRepresentation;
  readonly intensity: number;
  readonly position?: [number, number, number];
  readonly target?: [number, number, number];
  readonly castShadow?: boolean;
  readonly distance?: number;
  readonly decay?: number;
  readonly angle?: number;
  readonly penumbra?: number;
}

export interface LightingManagerConfig {
  readonly ambient: LightConfig;
  readonly directional: LightConfig[];
  readonly point: LightConfig[];
  readonly enableShadows: boolean;
  readonly shadowMapSize: number;
}

export interface LightingManagerState {
  readonly lightCount: number;
  readonly ambientIntensity: number;
}

// ============================================================================
// Environment Manager
// ============================================================================

export type EnvironmentBackgroundType = "color" | "gradient" | "texture" | "cube" | "none";

export interface EnvironmentConfig {
  readonly backgroundType: EnvironmentBackgroundType;
  readonly backgroundValue: string | ColorRepresentation;
  readonly backgroundColor: ColorRepresentation;
  readonly fogType: "none" | "linear" | "exponential";
  readonly fogColor: ColorRepresentation;
  readonly fogNear: number;
  readonly fogFar: number;
  readonly fogDensity: number;
  readonly environmentMap: string | null;
}

export interface EnvironmentManagerConfig {
  readonly environment: Partial<EnvironmentConfig>;
}

export interface EnvironmentManagerState {
  readonly backgroundType: EnvironmentBackgroundType;
  readonly fogType: string;
  readonly hasEnvironmentMap: boolean;
}

// ============================================================================
// Object Manager
// ============================================================================

export type ObjectCategory = "planet" | "star" | "particle" | "nebula" | "dust" | "ui" | "custom";

export interface ManagedObject {
  readonly id: string;
  readonly object: Object3D;
  readonly category: ObjectCategory;
  readonly layer: number;
  readonly parallaxSpeed: number;
  readonly isInteractive: boolean;
}

export interface ObjectManagerConfig {
  readonly maxObjects: number;
  readonly enableLOD: boolean;
  readonly frustumCulled: boolean;
  readonly autoDispose: boolean;
}

export interface ObjectManagerState {
  readonly objectCount: number;
  readonly objectsByCategory: Record<ObjectCategory, number>;
  readonly totalTriangles: number;
}

// ============================================================================
// Asset Loader
// ============================================================================

export type AssetType = "texture" | "model" | "audio" | "font" | "hdr";

export interface AssetDefinition {
  readonly id: string;
  readonly url: string;
  readonly type: AssetType;
  readonly preload: boolean;
}

export interface LoadedAsset {
  readonly id: string;
  readonly data: Texture | Object3D | AudioBuffer;
  readonly type: AssetType;
  readonly loadedAt: number;
}

export interface AssetLoaderConfig {
  readonly maxConcurrent: number;
  readonly retryCount: number;
  readonly retryDelay: number;
  readonly timeout: number;
}

export interface AssetLoaderState {
  readonly loadedCount: number;
  readonly loadingCount: number;
  readonly failedCount: number;
  readonly totalSize: number;
}

// ============================================================================
// Post Processing Manager
// ============================================================================

export type EffectType = "bloom" | "vignette" | "chromatic" | "film" | "ssao" | "none";

export interface BloomConfig {
  readonly threshold: number;
  readonly strength: number;
  readonly radius: number;
}

export interface VignetteConfig {
  readonly offset: number;
  readonly darkness: number;
}

export interface PostProcessingManagerConfig {
  readonly enabled: boolean;
  readonly bloom: Partial<BloomConfig>;
  readonly vignette: Partial<VignetteConfig>;
  readonly pixelRatio: number;
}

export interface PostProcessingManagerState {
  readonly isEnabled: boolean;
  readonly activeEffects: EffectType[];
}

// ============================================================================
// Performance Manager
// ============================================================================

export interface PerformanceMetrics {
  readonly fps: number;
  readonly frameTime: number;
  readonly drawCalls: number;
  readonly triangles: number;
  readonly geometries: number;
  readonly textures: number;
  readonly programs: number;
  readonly memoryUsage: number;
}

export type PerformanceQuality = "low" | "medium" | "high" | "ultra";

export interface PerformanceManagerConfig {
  readonly targetFPS: number;
  readonly monitorInterval: number;
  readonly enableAdaptiveQuality: boolean;
  readonly lowFPSThreshold: number;
  readonly highFPSThreshold: number;
}

export interface PerformanceManagerState {
  readonly metrics: PerformanceMetrics;
  readonly quality: PerformanceQuality;
  readonly isThrottled: boolean;
}

// ============================================================================
// Scene Context (React)
// ============================================================================

export interface SceneContextValue {
  readonly manager: SceneManagerRef;
  readonly state: SceneManagerState;
  readonly performance: PerformanceManagerState;
}

export interface SceneProviderProps {
  readonly children: ReactNode;
  readonly config?: Partial<SceneManagerConfig>;
}

// ============================================================================
// Scene Hooks
// ============================================================================

export interface UseSceneReturn {
  readonly state: SceneManagerState;
  readonly manager: SceneManagerRef;
}

export interface UseCameraReturn {
  readonly state: CameraManagerState;
  readonly setPreset: (preset: CameraPreset) => void;
  readonly setPosition: (x: number, y: number, z: number) => void;
  readonly lookAt: (x: number, y: number, z: number) => void;
  readonly shake: (config?: Partial<CameraShakeConfig>) => void;
}

export interface UseLightingReturn {
  readonly state: LightingManagerState;
  readonly addLight: (config: LightConfig) => string;
  readonly removeLight: (id: string) => void;
  readonly updateLight: (id: string, config: Partial<LightConfig>) => void;
}

export interface UseEnvironmentReturn {
  readonly state: EnvironmentManagerState;
  readonly setBackground: (
    type: EnvironmentBackgroundType,
    value: string | ColorRepresentation,
  ) => void;
  readonly setFog: (
    type: "none" | "linear" | "exponential",
    config: Partial<EnvironmentConfig>,
  ) => void;
}

export interface UseObjectReturn {
  readonly state: ObjectManagerState;
  readonly addObject: (object: Object3D, category: ObjectCategory, layer?: number) => string;
  readonly removeObject: (id: string) => void;
  readonly getObject: (id: string) => ManagedObject | undefined;
}

export interface UsePerformanceReturn {
  readonly state: PerformanceManagerState;
  readonly metrics: PerformanceMetrics;
  readonly quality: PerformanceQuality;
}

export interface UseAssetReturn {
  readonly state: AssetLoaderState;
  readonly load: (id: string) => Promise<unknown>;
  readonly preload: (definitions: AssetDefinition[]) => Promise<void>;
  readonly get: (id: string) => unknown;
}

// ============================================================================
// Manager References
// ============================================================================

export interface SceneManagerRef {
  readonly getRenderer: () => WebGLRenderer | null;
  readonly getScene: () => Scene | null;
  readonly getCamera: () => Camera | null;
  readonly getComposer: () => EffectComposer | null;
  readonly addObject: (object: Object3D, category?: ObjectCategory, layer?: number) => string;
  readonly removeObject: (id: string) => void;
  readonly getState: () => SceneManagerState;
  readonly getPerformance: () => PerformanceManagerState;
  readonly setQuality: (quality: PerformanceQuality) => void;
}
