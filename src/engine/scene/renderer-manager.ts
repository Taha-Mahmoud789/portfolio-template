/**
 * Renderer Manager
 *
 * Owns the WebGLRenderer: creation, pixel ratio, tone mapping,
 * color management, resize, and disposal.
 */

import {
  WebGLRenderer,
  ColorManagement,
  ACESFilmicToneMapping,
  LinearToneMapping,
  ReinhardToneMapping,
  CineonToneMapping,
  type Scene,
  type Camera,
} from "three";
import type { Manager, RendererManagerConfig, RendererManagerState } from "./types";
import { RENDERER_DEFAULTS } from "./constants";

// ============================================================================
// Tone Mapping Map
// ============================================================================

const TONE_MAPPING_MAP = {
  none: 0,
  linear: LinearToneMapping,
  reinhard: ReinhardToneMapping,
  cineon: CineonToneMapping,
  aces: ACESFilmicToneMapping,
} as const;

// ============================================================================
// RendererManager
// ============================================================================

export class RendererManager implements Manager {
  private config: RendererManagerConfig;
  private renderer: WebGLRenderer | null = null;
  private state: RendererManagerState = {
    pixelRatio: 1,
    width: 0,
    height: 0,
    isWebGL2: false,
  };

  constructor(config?: Partial<RendererManagerConfig>) {
    this.config = { ...RENDERER_DEFAULTS, ...config };
  }

  // --------------------------------------------------------------------------
  // Lifecycle
  // --------------------------------------------------------------------------

  initialize(): void {
    if (this.renderer) return;

    ColorManagement.enabled = true;

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

    const toneMapping = TONE_MAPPING_MAP[this.config.toneMapping];
    if (toneMapping !== 0) {
      this.renderer.toneMapping = toneMapping;
    }
    this.renderer.toneMappingExposure = this.config.toneMappingExposure;
    this.renderer.outputColorSpace = this.config.outputColorSpace;

    if (this.config.shadowMapEnabled) {
      this.renderer.shadowMap.enabled = true;
    }

    this.state = {
      pixelRatio,
      width: canvas.clientWidth,
      height: canvas.clientHeight,
      isWebGL2: this.renderer.capabilities.isWebGL2,
    };
  }

  update(_delta: number): void {
    // Renderer has no per-frame update logic.
  }

  dispose(): void {
    if (!this.renderer) return;
    this.renderer.dispose();
    this.renderer = null;
  }

  // --------------------------------------------------------------------------
  // Public API
  // --------------------------------------------------------------------------

  getRenderer(): WebGLRenderer | null {
    return this.renderer;
  }

  getState(): RendererManagerState {
    return this.state;
  }

  resize(width: number, height: number): void {
    if (!this.renderer) return;
    this.renderer.setSize(width, height);
    this.state = { ...this.state, width, height };
  }

  setPixelRatio(ratio: number | "auto"): void {
    if (!this.renderer) return;
    const resolved =
      ratio === "auto" ? Math.min(window.devicePixelRatio, this.config.maxPixelRatio) : ratio;
    this.renderer.setPixelRatio(resolved);
    this.state = { ...this.state, pixelRatio: resolved };
  }

  setToneMapping(exposure: number): void {
    if (!this.renderer) return;
    this.renderer.toneMappingExposure = exposure;
  }

  render(scene: Scene, camera: Camera): void {
    if (!this.renderer) return;
    this.renderer.render(scene, camera);
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
}

// ============================================================================
// Factory
// ============================================================================

export function createRendererManager(config?: Partial<RendererManagerConfig>): RendererManager {
  return new RendererManager(config);
}
