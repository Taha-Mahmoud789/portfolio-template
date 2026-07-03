/**
 * Scene Manager
 *
 * Orchestrator that coordinates all scene subsystems:
 * renderer, camera, lighting, environment, objects, assets, post-processing, performance.
 *
 * Managers never depend on each other directly.
 * Communication happens through the SceneManager.
 */

import { Scene } from "three";
import type {
  SceneManagerConfig,
  SceneManagerState,
  Manager,
  ObjectCategory,
  PerformanceQuality,
} from "./types";
import { SCENE_MANAGER_DEFAULTS } from "./constants";
import { RendererManager } from "./renderer-manager";
import { CameraManager } from "./camera-manager";
import { LightingManager } from "./lighting-manager";
import { EnvironmentManager } from "./environment-manager";
import { ObjectManager } from "./object-manager";
import { AssetLoader } from "./asset-loader";
import { PostProcessingManager } from "./post-processing-manager";
import { PerformanceManager } from "./performance-manager";
import type { Object3D } from "three";

// ============================================================================
// SceneManager
// ============================================================================

export class SceneManager {
  readonly renderer: RendererManager;
  readonly camera: CameraManager;
  readonly lighting: LightingManager;
  readonly environment: EnvironmentManager;
  readonly objects: ObjectManager;
  readonly assets: AssetLoader;
  readonly postProcessing: PostProcessingManager;
  readonly performance: PerformanceManager;

  private config: SceneManagerConfig;
  private scene: Scene;
  private state: SceneManagerState;
  private isInitialized = false;
  private animationFrameId: number | null = null;
  private lastFrameTime = 0;

  constructor(config?: Partial<SceneManagerConfig>) {
    this.config = { ...SCENE_MANAGER_DEFAULTS, ...config };

    this.scene = new Scene();
    this.renderer = new RendererManager(this.config.renderer);
    this.camera = new CameraManager(this.config.camera);
    this.lighting = new LightingManager(this.config.lighting);
    this.environment = new EnvironmentManager(this.config.environment);
    this.objects = new ObjectManager();
    this.assets = new AssetLoader();
    this.postProcessing = new PostProcessingManager(this.config.postProcessing);
    this.performance = new PerformanceManager(this.config.performance);

    this.state = {
      isInitialized: false,
      isRunning: false,
      fps: 60,
      drawCalls: 0,
      triangles: 0,
      memoryUsage: 0,
    };
  }

  // --------------------------------------------------------------------------
  // Lifecycle
  // --------------------------------------------------------------------------

  initialize(): void {
    if (this.isInitialized) return;

    this.renderer.initialize();
    this.camera.initialize();
    this.lighting.initialize();
    this.environment.setScene(this.scene);
    this.environment.initialize();
    this.objects.setScene(this.scene);
    this.objects.initialize();
    this.assets.initialize();
    this.performance.initialize();

    const gl = this.renderer.getRenderer();
    if (gl) {
      this.performance.setRenderer(gl);
      this.postProcessing.setRenderer(gl, this.scene, this.camera.getCamera());
    }

    this.isInitialized = true;
    this.state = { ...this.state, isInitialized: true };
  }

  start(): void {
    if (this.state.isRunning) return;
    this.lastFrameTime = performance.now();
    this.state = { ...this.state, isRunning: true };
    this.tick();
  }

  stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.state = { ...this.state, isRunning: false };
  }

  dispose(): void {
    this.stop();
    this.postProcessing.dispose();
    this.objects.dispose();
    this.assets.dispose();
    this.environment.dispose();
    this.lighting.dispose();
    this.camera.dispose();
    this.renderer.dispose();
    this.performance.dispose();
    this.isInitialized = false;
    this.state = {
      isInitialized: false,
      isRunning: false,
      fps: 0,
      drawCalls: 0,
      triangles: 0,
      memoryUsage: 0,
    };
  }

  // --------------------------------------------------------------------------
  // Update Loop
  // --------------------------------------------------------------------------

  private tick = (): void => {
    this.animationFrameId = requestAnimationFrame(this.tick);

    const now = performance.now();
    const delta = Math.min((now - this.lastFrameTime) / 1000, 0.1);
    this.lastFrameTime = now;

    this.update(delta);
    this.render();
  };

  private update(delta: number): void {
    this.camera.update(delta);
    this.performance.update(delta);

    const metrics = this.performance.getMetrics();
    this.state = {
      ...this.state,
      fps: metrics.fps,
      drawCalls: metrics.drawCalls,
      triangles: metrics.triangles,
      memoryUsage: metrics.memoryUsage,
    };
  }

  private render(): void {
    const gl = this.renderer.getRenderer();
    if (!gl) return;

    if (this.postProcessing.getState().isEnabled) {
      this.postProcessing.render();
    } else {
      this.renderer.render(this.scene, this.camera.getCamera());
    }
  }

  // --------------------------------------------------------------------------
  // Public API — Scene
  // --------------------------------------------------------------------------

  getScene(): Scene {
    return this.scene;
  }

  getState(): SceneManagerState {
    return this.state;
  }

  // --------------------------------------------------------------------------
  // Public API — Object Delegation
  // --------------------------------------------------------------------------

  addObject(object: Object3D, category?: ObjectCategory, layer?: number): string {
    return this.objects.addObject(object, category, layer);
  }

  removeObject(id: string): void {
    this.objects.removeObject(id);
  }

  // --------------------------------------------------------------------------
  // Public API — Performance Delegation
  // --------------------------------------------------------------------------

  getPerformance(): PerformanceManager["state"] {
    return this.performance.getState();
  }

  setQuality(quality: PerformanceQuality): void {
    this.performance.setQuality(quality);
  }

  // --------------------------------------------------------------------------
  // Public API — Resize
  // --------------------------------------------------------------------------

  resize(width: number, height: number): void {
    this.renderer.resize(width, height);
    this.camera.getCamera().aspect = width / height;
    this.camera.getCamera().updateProjectionMatrix();
    this.postProcessing.resize(width, height);
  }
}

// ============================================================================
// Factory
// ============================================================================

export function createSceneManager(config?: Partial<SceneManagerConfig>): SceneManager {
  return new SceneManager(config);
}

// ============================================================================
// Manager type re-export (for users who need to implement Manager)
// ============================================================================

export type { Manager };
