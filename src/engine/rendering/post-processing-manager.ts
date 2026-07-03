/**
 * Rendering Pipeline — Post Processing Manager
 *
 * Manages the EffectComposer pass chain.
 * Supports bloom, vignette, film grain, FXAA.
 *
 * Memory safety:
 * - Reuses Vector2 for bloom resolution
 * - Deep merges config to preserve nested defaults
 * - Properly disposes all passes
 *
 * Pass chain order:
 * 1. RenderPass (scene → framebuffer)
 * 2. UnrealBloomPass (glow)
 * 3. VignetteShaderPass (darkened edges)
 * 4. FilmPass (grain/noise)
 * 5. ShaderPass (FXAA)
 * 6. OutputPass (final output to screen)
 */

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import { Vector2, type WebGLRenderer, type Scene, type Camera } from "three";
import type {
  RenderModule,
  PostProcessingConfig,
  PostProcessingState,
} from "./types";
import { POST_PROCESSING_DEFAULTS } from "./constants";

// ============================================================================
// Vignette Shader
// ============================================================================

const VignetteShader = {
  uniforms: {
    tDiffuse: { value: null },
    offset: { value: 0.5 },
    darkness: { value: 0.5 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float offset;
    uniform float darkness;
    varying vec2 vUv;
    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      vec2 uv = (vUv - vec2(0.5)) * vec2(offset);
      float vignette = 1.0 - dot(uv, uv);
      texel.rgb *= mix(1.0, vignette, darkness);
      gl_FragColor = texel;
    }
  `,
};

// ============================================================================
// Film Grain Shader
// ============================================================================

const FilmGrainShader = {
  uniforms: {
    tDiffuse: { value: null },
    intensity: { value: 0.05 },
    time: { value: 0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float intensity;
    uniform float time;
    varying vec2 vUv;

    float rand(vec2 co) {
      return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      float grain = rand(vUv + time) * intensity;
      texel.rgb += grain - intensity * 0.5;
      gl_FragColor = texel;
    }
  `,
};

// ============================================================================
// Post Processing Manager
// ============================================================================

export class PostProcessingManager implements RenderModule {
  private config: PostProcessingConfig;
  private composer: EffectComposer | null;
  private bloomPass: UnrealBloomPass | null;
  private vignettePass: ShaderPass | null;
  private filmGrainPass: ShaderPass | null;
  private fxaaPass: ShaderPass | null;
  private time: number;
  private state: PostProcessingState;

  // Reusable Vector2 — avoids allocation in setRenderer/resize
  private reusableSize: Vector2;

  constructor(config?: Partial<PostProcessingConfig>) {
    this.config = this.deepMergePostProcessing(POST_PROCESSING_DEFAULTS, config);
    this.composer = null;
    this.bloomPass = null;
    this.vignettePass = null;
    this.filmGrainPass = null;
    this.fxaaPass = null;
    this.time = 0;
    this.reusableSize = new Vector2();
    this.state = {
      isEnabled: true,
      activeEffects: this.computeActiveEffects(),
    };
  }

  // --------------------------------------------------------------------------
  // Lifecycle
  // --------------------------------------------------------------------------

  initialize(): void {
    // Composer is created via setRenderer() before initialize.
  }

  update(delta: number): void {
    this.time += delta;
    if (this.filmGrainPass && this.config.filmGrain.enabled) {
      const timeUniform = this.filmGrainPass.uniforms.time;
      if (timeUniform) {
        (timeUniform.value as number) = this.time;
      }
    }
  }

  resize(width: number, height: number): void {
    if (!this.composer) return;
    this.composer.setSize(width, height);

    if (this.bloomPass) {
      this.bloomPass.resolution.set(width, height);
    }

    if (this.fxaaPass) {
      const resUniform = this.fxaaPass.uniforms.resolution;
      if (resUniform) {
        const resolution = resUniform.value as { set: (x: number, y: number) => void };
        resolution.set(1 / width, 1 / height);
      }
    }
  }

  dispose(): void {
    this.composer?.dispose();
    this.composer = null;
    this.bloomPass = null;
    this.vignettePass = null;
    this.filmGrainPass = null;
    this.fxaaPass = null;
  }

  // --------------------------------------------------------------------------
  // Renderer Binding
  // --------------------------------------------------------------------------

  setRenderer(renderer: WebGLRenderer, scene: Scene, camera: Camera): void {
    this.composer?.dispose();

    renderer.getSize(this.reusableSize);
    this.composer = new EffectComposer(renderer);

    // 1. Render pass
    this.composer.addPass(new RenderPass(scene, camera));

    // 2. Bloom
    if (this.config.bloom.enabled) {
      const bc = this.config.bloom;
      this.bloomPass = new UnrealBloomPass(
        this.reusableSize.clone(),
        bc.strength,
        bc.radius,
        bc.threshold,
      );
      this.composer.addPass(this.bloomPass);
    }

    // 3. Vignette
    if (this.config.vignette.enabled) {
      const vc = this.config.vignette;
      this.vignettePass = new ShaderPass(VignetteShader);
      const offsetUniform = this.vignettePass.uniforms.offset;
      const darknessUniform = this.vignettePass.uniforms.darkness;
      if (offsetUniform) {
        (offsetUniform.value as number) = vc.offset;
      }
      if (darknessUniform) {
        (darknessUniform.value as number) = vc.darkness;
      }
      this.composer.addPass(this.vignettePass);
    }

    // 4. Film grain
    if (this.config.filmGrain.enabled) {
      const fc = this.config.filmGrain;
      this.filmGrainPass = new ShaderPass(FilmGrainShader);
      const intensityUniform = this.filmGrainPass.uniforms.intensity;
      const timeUniform = this.filmGrainPass.uniforms.time;
      if (intensityUniform) {
        (intensityUniform.value as number) = fc.intensity;
      }
      if (timeUniform) {
        (timeUniform.value as number) = 0;
      }
      this.composer.addPass(this.filmGrainPass);
    }

    // 5. FXAA
    if (this.config.fxaa.enabled) {
      this.fxaaPass = new ShaderPass(FXAAShader);
      const resUniform = this.fxaaPass.uniforms.resolution;
      if (resUniform) {
        const fxaaRes = resUniform.value as { set: (x: number, y: number) => void };
        fxaaRes.set(
          1 / this.reusableSize.x,
          1 / this.reusableSize.y,
        );
      }
      this.composer.addPass(this.fxaaPass);
    }

    // 6. Output
    this.composer.addPass(new OutputPass());
  }

  // --------------------------------------------------------------------------
  // Public API
  // --------------------------------------------------------------------------

  getState(): PostProcessingState {
    return this.state;
  }

  getComposer(): EffectComposer | null {
    return this.composer;
  }

  render(): void {
    if (!this.composer || !this.state.isEnabled) return;
    this.composer.render();
  }

  setEnabled(enabled: boolean): void {
    this.state = { ...this.state, isEnabled: enabled };
  }

  setBloom(strength: number, radius: number, threshold: number): void {
    this.config = {
      ...this.config,
      bloom: { enabled: true, strength, radius, threshold },
    };
    if (this.bloomPass) {
      this.bloomPass.strength = strength;
      this.bloomPass.radius = radius;
      this.bloomPass.threshold = threshold;
    }
    this.state = { ...this.state, activeEffects: this.computeActiveEffects() };
  }

  setBloomEnabled(enabled: boolean): void {
    this.config = { ...this.config, bloom: { ...this.config.bloom, enabled } };
    this.state = { ...this.state, activeEffects: this.computeActiveEffects() };
  }

  setVignetteEnabled(enabled: boolean): void {
    this.config = { ...this.config, vignette: { ...this.config.vignette, enabled } };
    if (this.vignettePass) {
      this.vignettePass.enabled = enabled;
    }
    this.state = { ...this.state, activeEffects: this.computeActiveEffects() };
  }

  setFilmGrainEnabled(enabled: boolean): void {
    this.config = { ...this.config, filmGrain: { ...this.config.filmGrain, enabled } };
    if (this.filmGrainPass) {
      this.filmGrainPass.enabled = enabled;
    }
    this.state = { ...this.state, activeEffects: this.computeActiveEffects() };
  }

  setFXAAEnabled(enabled: boolean): void {
    this.config = { ...this.config, fxaa: { ...this.config.fxaa, enabled } };
    if (this.fxaaPass) {
      this.fxaaPass.enabled = enabled;
    }
    this.state = { ...this.state, activeEffects: this.computeActiveEffects() };
  }

  // --------------------------------------------------------------------------
  // Internal
  // --------------------------------------------------------------------------

  private computeActiveEffects(): string[] {
    const effects: string[] = [];
    if (this.config.bloom.enabled) effects.push("bloom");
    if (this.config.vignette.enabled) effects.push("vignette");
    if (this.config.filmGrain.enabled) effects.push("filmGrain");
    if (this.config.fxaa.enabled) effects.push("fxaa");
    return effects;
  }

  private deepMergePostProcessing(
    base: PostProcessingConfig,
    overrides?: Partial<PostProcessingConfig>,
  ): PostProcessingConfig {
    if (!overrides) return base;
    return {
      bloom: { ...base.bloom, ...overrides.bloom },
      vignette: { ...base.vignette, ...overrides.vignette },
      filmGrain: { ...base.filmGrain, ...overrides.filmGrain },
      fxaa: { ...base.fxaa, ...overrides.fxaa },
    };
  }
}

// ============================================================================
// Factory
// ============================================================================

export function createPostProcessingManager(
  config?: Partial<PostProcessingConfig>,
): PostProcessingManager {
  return new PostProcessingManager(config);
}
