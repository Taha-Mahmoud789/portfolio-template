/**
 * Post Processing Manager
 *
 * Owns bloom, vignette, chromatic aberration, film grain, and future effects.
 */

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";
import { Vector2, type WebGLRenderer, type Scene, type Camera } from "three";
import type {
  Manager,
  PostProcessingManagerConfig,
  PostProcessingManagerState,
  EffectType,
} from "./types";
import { POST_PROCESSING_DEFAULTS } from "./constants";

// ============================================================================
// PostProcessingManager
// ============================================================================

export class PostProcessingManager implements Manager {
  private config: PostProcessingManagerConfig;
  private composer: EffectComposer | null = null;
  private bloomPass: UnrealBloomPass | null = null;
  private state: PostProcessingManagerState;

  constructor(config?: Partial<PostProcessingManagerConfig>) {
    this.config = { ...POST_PROCESSING_DEFAULTS, ...config };
    this.state = {
      isEnabled: this.config.enabled,
      activeEffects: this.config.enabled ? ["bloom"] : [],
    };
  }

  // --------------------------------------------------------------------------
  // Lifecycle
  // --------------------------------------------------------------------------

  initialize(): void {
    // Composer is created via setRenderer() before initialize.
  }

  update(_delta: number): void {
    // Post processing has no per-frame update logic from the manager.
  }

  dispose(): void {
    if (this.composer) {
      this.composer.dispose();
      this.composer = null;
    }
    this.bloomPass = null;
  }

  // --------------------------------------------------------------------------
  // Public API
  // --------------------------------------------------------------------------

  getState(): PostProcessingManagerState {
    return this.state;
  }

  getComposer(): EffectComposer | null {
    return this.composer;
  }

  setRenderer(renderer: WebGLRenderer, scene: Scene, camera: Camera): void {
    const size = renderer.getSize(new Vector2());
    this.composer = new EffectComposer(renderer);

    const renderPass = new RenderPass(scene, camera);
    this.composer.addPass(renderPass);

    const bloomConfig = this.config.bloom;
    this.bloomPass = new UnrealBloomPass(
      new Vector2(size.x, size.y),
      bloomConfig.strength ?? 0.3,
      bloomConfig.radius ?? 0.4,
      bloomConfig.threshold ?? 0.8,
    );
    this.composer.addPass(this.bloomPass);

    const outputPass = new OutputPass();
    this.composer.addPass(outputPass);
  }

  render(): void {
    if (!this.composer || !this.config.enabled) return;
    this.composer.render();
  }

  resize(width: number, height: number): void {
    if (!this.composer) return;
    this.composer.setSize(width, height);
    if (this.bloomPass) {
      this.bloomPass.resolution.set(width, height);
    }
  }

  setEnabled(enabled: boolean): void {
    this.config = { ...this.config, enabled };
    this.state = {
      ...this.state,
      isEnabled: enabled,
      activeEffects: enabled ? ["bloom"] : [],
    };
  }

  setBloom(strength?: number, radius?: number, threshold?: number): void {
    if (!this.bloomPass) return;
    if (strength !== undefined) this.bloomPass.strength = strength;
    if (radius !== undefined) this.bloomPass.radius = radius;
    if (threshold !== undefined) this.bloomPass.threshold = threshold;
  }

  addEffect(_type: EffectType): void {
    // Placeholder for future effects (vignette, chromatic, film, ssao).
  }

  removeEffect(_type: EffectType): void {
    // Placeholder for future effects.
  }
}

// ============================================================================
// Factory
// ============================================================================

export function createPostProcessingManager(
  config?: Partial<PostProcessingManagerConfig>,
): PostProcessingManager {
  return new PostProcessingManager(config);
}
