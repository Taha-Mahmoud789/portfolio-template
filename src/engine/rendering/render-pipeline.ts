/**
 * Rendering Pipeline — Render Pipeline
 *
 * Orchestrates all rendering modules. Manages the rAF loop.
 * Single source of truth for the render cycle.
 *
 * Lifecycle:
 * 1. createRenderPipeline(config)
 * 2. pipeline.initialize() — creates renderer, scene, camera, environment, post-processing
 * 3. pipeline.start() — begins rAF loop
 * 4. pipeline.update(delta) — called each frame (or managed internally)
 * 5. pipeline.dispose() — tears down everything
 *
 * Architecture:
 * - RendererManager owns the WebGLRenderer
 * - EnvironmentManager owns scene.background, scene.fog, scene.environment
 * - PostProcessingManager owns the EffectComposer pass chain
 * - This pipeline owns the rAF loop and coordinates resize
 */

import { Scene, PerspectiveCamera } from "three";
import type { Object3D } from "three";
import type {
  RenderModule,
  RenderPipelineConfig,
  RenderPipelineState,
  RenderPipelineRef,
  QualityLevel,
  ToneMappingMode,
  FogType,
  FogConfig,
  BackgroundType,
} from "./types";
import type { ColorRepresentation } from "three";
import { RendererManager } from "./renderer-manager";
import { EnvironmentManager } from "./environment-manager";
import { PostProcessingManager } from "./post-processing-manager";
import { PIPELINE_DEFAULTS, QUALITY_PRESETS } from "./constants";

// ============================================================================
// Render Pipeline
// ============================================================================

export class RenderPipeline implements RenderModule {
  private config: RenderPipelineConfig;

  // Managers
  private rendererManager: RendererManager;
  private environmentManager: EnvironmentManager;
  private postProcessingManager: PostProcessingManager;

  // Three.js core
  private scene: Scene | null;
  private camera: PerspectiveCamera;
  private rafId: number;
  private lastFrameTime: number;

  // State
  private state: RenderPipelineState;
  private isRunning: boolean;
  private isInitialized: boolean;

  constructor(config?: Partial<RenderPipelineConfig>) {
    this.config = this.mergeConfig(config);

    this.rendererManager = new RendererManager(this.config.renderer);
    this.environmentManager = new EnvironmentManager(this.config.environment);
    this.postProcessingManager = new PostProcessingManager(this.config.postProcessing);

    this.scene = null;
    this.camera = new PerspectiveCamera(60, 1, 0.1, 1000);
    this.rafId = 0;
    this.lastFrameTime = 0;
    this.isRunning = false;
    this.isInitialized = false;

    this.state = {
      isInitialized: false,
      isRunning: false,
      quality: this.config.quality,
      fps: 0,
      frameTime: 0,
      drawCalls: 0,
      triangles: 0,
      textures: 0,
      geometries: 0,
    };
  }

  // --------------------------------------------------------------------------
  // Lifecycle
  // --------------------------------------------------------------------------

  initialize(): void {
    if (this.isInitialized) return;

    // 1. Create scene
    this.scene = new Scene();

    // 2. Initialize renderer
    this.rendererManager.initialize();

    // 3. Bind environment to scene
    this.environmentManager.setScene(this.scene);

    // 4. Initialize environment (background, fog, env map)
    this.environmentManager.initialize();

    // 5. Initialize post-processing (binds renderer + scene + camera)
    const renderer = this.rendererManager.getRenderer();
    if (renderer) {
      this.postProcessingManager.setRenderer(renderer, this.scene, this.camera);
    }
    this.postProcessingManager.initialize();

    this.isInitialized = true;
    this.state = {
      ...this.state,
      isInitialized: true,
    };
  }

  update(delta: number): void {
    if (!this.isInitialized || !this.isRunning) return;

    const clampedDelta = Math.min(delta, this.config.maxDelta);

    // Update modules
    this.rendererManager.update(clampedDelta);
    this.environmentManager.update(clampedDelta);
    this.postProcessingManager.update(clampedDelta);

    // Render via post-processing composer (or direct render if disabled)
    const renderer = this.rendererManager.getRenderer();
    if (renderer && this.scene) {
      if (this.postProcessingManager.getState().isEnabled) {
        this.postProcessingManager.render();
      } else {
        renderer.render(this.scene, this.camera);
      }
    }

    // Update stats
    this.updateStats(clampedDelta);
  }

  resize(width: number, height: number): void {
    if (!this.isInitialized) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.rendererManager.resize(width, height);
    this.postProcessingManager.resize(width, height);
    // Environment is resolution-independent — no resize needed.
  }

  dispose(): void {
    this.stop();

    this.postProcessingManager.dispose();
    this.environmentManager.dispose();
    this.rendererManager.dispose();

    this.scene = null;
    this.isInitialized = false;

    this.state = {
      ...this.state,
      isInitialized: false,
      isRunning: false,
    };
  }

  // --------------------------------------------------------------------------
  // Render Loop
  // --------------------------------------------------------------------------

  start(): void {
    if (this.isRunning || !this.isInitialized) return;
    this.isRunning = true;
    this.lastFrameTime = performance.now();
    this.state = { ...this.state, isRunning: true };
    this.tick();
  }

  stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.rafId !== 0) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
    this.state = { ...this.state, isRunning: false };
  }

  private tick = (): void => {
    if (!this.isRunning) return;
    const now = performance.now();
    const delta = (now - this.lastFrameTime) / 1000;
    this.lastFrameTime = now;
    this.update(delta);
    this.rafId = requestAnimationFrame(this.tick);
  };

  // --------------------------------------------------------------------------
  // Public API — Ref
  // --------------------------------------------------------------------------

  getRef(): RenderPipelineRef {
    return {
      getRenderer: () => this.rendererManager.getRenderer(),
      getScene: () => this.scene,
      getCamera: () => this.camera,
      getComposer: () => this.postProcessingManager.getComposer(),
      getState: () => this.state,
      getRendererState: () => this.rendererManager.getState(),
      getEnvironmentState: () => this.environmentManager.getEnvironmentState(),
      getPostProcessingState: () => this.postProcessingManager.getState(),

      setCamera: (camera: PerspectiveCamera) => {
        this.camera = camera;
        const renderer = this.rendererManager.getRenderer();
        if (renderer && this.scene) {
          this.postProcessingManager.setRenderer(renderer, this.scene, camera);
        }
      },
      setPixelRatio: (ratio: number | "auto") => this.rendererManager.setPixelRatio(ratio),
      setQuality: (quality: QualityLevel) => this.setQuality(quality),
      setToneMapping: (mode: ToneMappingMode) => this.rendererManager.setToneMapping(mode),
      setExposure: (exposure: number) => this.rendererManager.setExposure(exposure),
      animateExposure: (target: number, duration: number) =>
        this.rendererManager.animateExposure(target, duration),
      setBackground: (type: BackgroundType, color: ColorRepresentation) =>
        this.environmentManager.setBackground(type, color),
      setFog: (type: FogType, config?: Partial<FogConfig>) =>
        this.environmentManager.setFog(type, config),
      setBloom: (strength: number, radius: number, threshold: number) =>
        this.postProcessingManager.setBloom(strength, radius, threshold),
      setBloomEnabled: (enabled: boolean) => this.postProcessingManager.setBloomEnabled(enabled),
      setVignetteEnabled: (enabled: boolean) =>
        this.postProcessingManager.setVignetteEnabled(enabled),
      setFilmGrainEnabled: (enabled: boolean) =>
        this.postProcessingManager.setFilmGrainEnabled(enabled),
      setFXAAEnabled: (enabled: boolean) => this.postProcessingManager.setFXAAEnabled(enabled),
      addObject: (object: Object3D) => {
        this.scene?.add(object);
      },
      removeObject: (object: Object3D) => {
        this.scene?.remove(object);
      },
      resize: (width: number, height: number) => this.resize(width, height),
    };
  }

  // --------------------------------------------------------------------------
  // Scene Access
  // --------------------------------------------------------------------------

  getScene(): Scene | null {
    return this.scene;
  }

  getCamera(): PerspectiveCamera {
    return this.camera;
  }

  getState(): RenderPipelineState {
    return this.state;
  }

  // --------------------------------------------------------------------------
  // Quality
  // --------------------------------------------------------------------------

  setQuality(quality: QualityLevel): void {
    const preset = QUALITY_PRESETS[quality];
    this.config = { ...this.config, quality };

    this.rendererManager.setPixelRatio(preset.pixelRatioMax);

    const pp = this.postProcessingManager;
    pp.setBloomEnabled(preset.bloomEnabled);
    pp.setFXAAEnabled(preset.fxaaEnabled);
    pp.setFilmGrainEnabled(preset.filmGrainEnabled);
    pp.setVignetteEnabled(preset.vignetteEnabled);

    this.rendererManager.setShadowMapEnabled(preset.shadowMapEnabled);
    this.state = { ...this.state, quality };
  }

  // --------------------------------------------------------------------------
  // Internal
  // --------------------------------------------------------------------------

  private updateStats(delta: number): void {
    const renderer = this.rendererManager.getRenderer();
    if (!renderer) return;

    const info = renderer.info;
    this.state = {
      ...this.state,
      frameTime: delta * 1000,
      fps: delta > 0 ? 1 / delta : 0,
      drawCalls: info.render.calls,
      triangles: info.render.triangles,
      textures: info.memory.textures,
      geometries: info.memory.geometries,
    };
  }

  private mergeConfig(overrides?: Partial<RenderPipelineConfig>): RenderPipelineConfig {
    if (!overrides) return PIPELINE_DEFAULTS;
    return {
      renderer: { ...PIPELINE_DEFAULTS.renderer, ...overrides.renderer },
      environment: { ...PIPELINE_DEFAULTS.environment, ...overrides.environment },
      postProcessing: { ...PIPELINE_DEFAULTS.postProcessing, ...overrides.postProcessing },
      quality: overrides.quality ?? PIPELINE_DEFAULTS.quality,
      autoStart: overrides.autoStart ?? PIPELINE_DEFAULTS.autoStart,
      maxDelta: overrides.maxDelta ?? PIPELINE_DEFAULTS.maxDelta,
    };
  }
}

// ============================================================================
// Factory
// ============================================================================

export function createRenderPipeline(
  config?: Partial<RenderPipelineConfig>,
): RenderPipeline {
  return new RenderPipeline(config);
}
