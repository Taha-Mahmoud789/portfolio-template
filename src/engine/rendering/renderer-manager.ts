/**
 * Rendering Pipeline — Renderer Manager
 *
 * Owns the WebGLRenderer. Single source of truth for:
 * - Pixel ratio, color space, tone mapping, shadows
 * - Animated exposure with smooth ease-in-out
 * - Color management initialization
 *
 * No other manager touches renderer properties directly.
 */

import {
  WebGLRenderer,
  ColorManagement,
  SRGBColorSpace,
  LinearSRGBColorSpace,
  NoToneMapping,
  LinearToneMapping,
  ReinhardToneMapping,
  CineonToneMapping,
  ACESFilmicToneMapping,
  type Scene,
  type Camera,
} from "three";
import type {
  RenderModule,
  RendererConfig,
  RendererState,
  ColorSpace,
  ToneMappingMode,
} from "./types";
import { RENDERER_DEFAULTS } from "./constants";

// ============================================================================
// Tone Mapping Map
// ============================================================================

const TONE_MAPPING_MAP = {
  none: NoToneMapping,
  linear: LinearToneMapping,
  reinhard: ReinhardToneMapping,
  cineon: CineonToneMapping,
  aces: ACESFilmicToneMapping,
} as const;

// ============================================================================
// Color Space Map
// ============================================================================

const COLOR_SPACE_MAP: Record<ColorSpace, typeof SRGBColorSpace | typeof LinearSRGBColorSpace> = {
  srgb: SRGBColorSpace,
  linear: LinearSRGBColorSpace,
};

// ============================================================================
// Renderer Manager
// ============================================================================

export class RendererManager implements RenderModule {
  private config: RendererConfig;
  private renderer: WebGLRenderer | null;
  private state: RendererState;

  // Exposure animation (consolidated from ExposureManager)
  private currentExposure: number;
  private targetExposure: number;
  private exposureStart: number;
  private exposureDuration: number;
  private exposureElapsed: number;
  private isExposureAnimating: boolean;
  private minExposure: number;
  private maxExposure: number;

  constructor(config?: Partial<RendererConfig>) {
    this.config = { ...RENDERER_DEFAULTS, ...config };
    this.renderer = null;
    this.currentExposure = this.config.toneMappingExposure;
    this.targetExposure = this.currentExposure;
    this.exposureStart = this.currentExposure;
    this.exposureDuration = 0;
    this.exposureElapsed = 0;
    this.isExposureAnimating = false;
    this.minExposure = 0.1;
    this.maxExposure = 5.0;
    this.state = {
      width: 0,
      height: 0,
      pixelRatio: 1,
      isWebGL2: false,
      toneMapping: this.config.toneMapping,
      toneMappingExposure: this.config.toneMappingExposure,
      outputColorSpace: this.config.outputColorSpace,
    };
  }

  // --------------------------------------------------------------------------
  // Lifecycle
  // --------------------------------------------------------------------------

  initialize(): void {
    if (this.renderer) return;

    ColorManagement.enabled = true;
    ColorManagement.workingColorSpace = LinearSRGBColorSpace;

    const canvas = this.config.canvas ?? document.createElement("canvas");

    this.renderer = new WebGLRenderer({
      canvas,
      antialias: this.config.antialias,
      alpha: this.config.alpha,
      powerPreference: this.config.powerPreference,
      logarithmicDepthBuffer: this.config.logarithmicDepthBuffer,
      stencil: this.config.stencil,
    });

    const pixelRatio = this.resolvePixelRatio();
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.outputColorSpace = COLOR_SPACE_MAP[this.config.outputColorSpace];
    this.renderer.toneMapping = TONE_MAPPING_MAP[this.config.toneMapping];
    this.renderer.toneMappingExposure = this.config.toneMappingExposure;

    if (this.config.shadowMapEnabled) {
      this.renderer.shadowMap.enabled = true;
    }

    const canvasEl = this.renderer.domElement;
    const width = canvasEl.clientWidth || 1;
    const height = canvasEl.clientHeight || 1;
    this.renderer.setSize(width, height);

    this.state = {
      width,
      height,
      pixelRatio,
      isWebGL2: this.renderer.capabilities.isWebGL2,
      toneMapping: this.config.toneMapping,
      toneMappingExposure: this.config.toneMappingExposure,
      outputColorSpace: this.config.outputColorSpace,
    };
  }

  update(delta: number): void {
    if (!this.renderer || !this.isExposureAnimating) return;

    this.exposureElapsed += delta;
    const progress = Math.min(this.exposureElapsed / this.exposureDuration, 1);
    const eased = progress < 0.5
      ? 2 * progress * progress
      : 1 - (-2 * progress + 2) ** 2 / 2;

    this.currentExposure = this.exposureStart + (this.targetExposure - this.exposureStart) * eased;

    if (progress >= 1) {
      this.currentExposure = this.targetExposure;
      this.isExposureAnimating = false;
    }

    this.renderer.toneMappingExposure = this.currentExposure;
    this.state = {
      ...this.state,
      toneMappingExposure: this.currentExposure,
    };
  }

  resize(width: number, height: number): void {
    if (!this.renderer) return;
    this.renderer.setSize(width, height);
    this.state = { ...this.state, width, height };
  }

  dispose(): void {
    if (!this.renderer) return;
    this.renderer.dispose();
    this.renderer = null;
    this.isExposureAnimating = false;
  }

  // --------------------------------------------------------------------------
  // Public API
  // --------------------------------------------------------------------------

  getRenderer(): WebGLRenderer | null {
    return this.renderer;
  }

  getState(): RendererState {
    return this.state;
  }

  render(scene: Scene, camera: Camera): void {
    if (!this.renderer) return;
    this.renderer.render(scene, camera);
  }

  setPixelRatio(ratio: number | "auto"): void {
    this.config = { ...this.config, pixelRatio: ratio };
    if (!this.renderer) return;
    const resolved = ratio === "auto"
      ? Math.min(window.devicePixelRatio, this.config.maxPixelRatio)
      : ratio;
    this.renderer.setPixelRatio(resolved);
    this.state = { ...this.state, pixelRatio: resolved };
  }

  setOutputColorSpace(space: ColorSpace): void {
    this.config = { ...this.config, outputColorSpace: space };
    if (this.renderer) {
      this.renderer.outputColorSpace = COLOR_SPACE_MAP[space];
    }
    this.state = { ...this.state, outputColorSpace: space };
  }

  setToneMapping(mode: ToneMappingMode): void {
    this.config = { ...this.config, toneMapping: mode };
    if (this.renderer) {
      this.renderer.toneMapping = TONE_MAPPING_MAP[mode];
    }
    this.state = { ...this.state, toneMapping: mode };
  }

  setExposure(exposure: number): void {
    const clamped = this.clampExposure(exposure);
    this.currentExposure = clamped;
    this.targetExposure = clamped;
    this.isExposureAnimating = false;
    if (this.renderer) {
      this.renderer.toneMappingExposure = clamped;
    }
    this.state = { ...this.state, toneMappingExposure: clamped };
  }

  animateExposure(target: number, duration: number): void {
    this.exposureStart = this.currentExposure;
    this.targetExposure = this.clampExposure(target);
    this.exposureDuration = Math.max(duration, 0.01);
    this.exposureElapsed = 0;
    this.isExposureAnimating = true;
  }

  setShadowMapEnabled(enabled: boolean): void {
    this.config = { ...this.config, shadowMapEnabled: enabled };
    if (this.renderer) {
      this.renderer.shadowMap.enabled = enabled;
    }
  }

  getDomElement(): HTMLCanvasElement | null {
    return this.renderer?.domElement ?? null;
  }

  // --------------------------------------------------------------------------
  // Internal
  // --------------------------------------------------------------------------

  private resolvePixelRatio(): number {
    if (this.config.pixelRatio === "auto") {
      return Math.min(window.devicePixelRatio, this.config.maxPixelRatio);
    }
    return this.config.pixelRatio;
  }

  private clampExposure(value: number): number {
    return Math.max(this.minExposure, Math.min(this.maxExposure, value));
  }
}

// ============================================================================
// Factory
// ============================================================================

export function createRendererManager(config?: Partial<RendererConfig>): RendererManager {
  return new RendererManager(config);
}
