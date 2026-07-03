/**
 * Rendering Pipeline — Environment Manager
 *
 * Manages scene background, environment maps, and fog.
 * Consolidated from EnvironmentRenderer + FogManager to eliminate
 * redundant scene.background manipulation and fog object creation.
 *
 * Memory safety:
 * - Reuses Color/Fog/FogExp2 objects via mutation instead of allocation
 * - Aborts pending texture loads on dispose
 * - Nulls scene reference on dispose
 */

import {
  Color,
  Fog,
  FogExp2,
  TextureLoader,
  EquirectangularReflectionMapping,
  type Scene,
  type ColorRepresentation,
  type Texture,
} from "three";
import type {
  RenderModule,
  BackgroundConfig,
  BackgroundType,
  EnvironmentConfig,
  EnvironmentState,
  FogType,
  FogConfig,
  FogState,
} from "./types";
import { BACKGROUND_DEFAULTS, FOG_DEFAULTS } from "./constants";

// ============================================================================
// Environment Manager
// ============================================================================

export class EnvironmentManager implements RenderModule {
  private backgroundConfig: BackgroundConfig;
  private fogConfig: FogConfig;
  private environmentMapUrl: string | null;
  private scene: Scene | null;
  private loadedTexture: Texture | null;
  private textureLoader: TextureLoader;
  private abortController: AbortController | null;

  // Reusable objects — mutated, never reallocated
  private reusableColor: Color;
  private reusableFogColor: Color;

  private environmentState: EnvironmentState;
  private fogState: FogState;

  constructor(config?: Partial<EnvironmentConfig>) {
    this.backgroundConfig = { ...BACKGROUND_DEFAULTS, ...config?.background };
    this.fogConfig = { ...FOG_DEFAULTS, ...config?.fog };
    this.environmentMapUrl = config?.environmentMapUrl ?? null;
    this.scene = null;
    this.loadedTexture = null;
    this.textureLoader = new TextureLoader();
    this.abortController = null;
    this.reusableColor = new Color(this.backgroundConfig.color);
    this.reusableFogColor = new Color(this.fogConfig.color);
    this.environmentState = {
      backgroundType: this.backgroundConfig.type,
      fogType: this.fogConfig.type,
      hasEnvironmentMap: this.environmentMapUrl !== null,
    };
    this.fogState = {
      type: this.fogConfig.type,
      color: new Color(this.fogConfig.color),
      isActive: this.fogConfig.type !== "none",
    };
  }

  // --------------------------------------------------------------------------
  // Lifecycle
  // --------------------------------------------------------------------------

  initialize(): void {
    this.applyBackground();
    this.applyFog();
    if (this.environmentMapUrl) {
      this.loadEnvironmentMap(this.environmentMapUrl);
    }
  }

  update(_delta: number): void {
    // No per-frame update unless animating fog/background (future).
  }

  resize(_width: number, _height: number): void {
    // Environment is resolution-independent.
  }

  dispose(): void {
    this.abortController?.abort();
    this.abortController = null;

    this.loadedTexture?.dispose();
    this.loadedTexture = null;

    if (this.scene) {
      this.scene.fog = null;
      this.scene.background = null;
      this.scene.environment = null;
      this.scene = null;
    }
  }

  // --------------------------------------------------------------------------
  // Scene Binding
  // --------------------------------------------------------------------------

  setScene(scene: Scene): void {
    this.scene = scene;
    this.applyBackground();
    this.applyFog();
  }

  // --------------------------------------------------------------------------
  // Environment State
  // --------------------------------------------------------------------------

  getEnvironmentState(): EnvironmentState {
    return this.environmentState;
  }

  // --------------------------------------------------------------------------
  // Background API
  // --------------------------------------------------------------------------

  setBackground(type: BackgroundType, color?: ColorRepresentation): void {
    if (color !== undefined) {
      this.backgroundConfig = { ...this.backgroundConfig, type, color };
    } else {
      this.backgroundConfig = { ...this.backgroundConfig, type };
    }
    this.environmentState = { ...this.environmentState, backgroundType: type };
    this.applyBackground();
  }

  setBackgroundColor(color: ColorRepresentation): void {
    this.backgroundConfig = { ...this.backgroundConfig, color };
    if (this.backgroundConfig.type === "color") {
      this.applyBackground();
    }
  }

  getBackgroundConfig(): BackgroundConfig {
    return this.backgroundConfig;
  }

  // --------------------------------------------------------------------------
  // Environment Map API
  // --------------------------------------------------------------------------

  loadEnvironmentMap(url: string): void {
    this.abortController?.abort();
    this.abortController = new AbortController();
    this.environmentMapUrl = url;
    this.environmentState = { ...this.environmentState, hasEnvironmentMap: true };

    this.textureLoader.load(
      url,
      (texture) => {
        if (this.abortController?.signal.aborted) return;
        this.loadedTexture?.dispose();
        this.loadedTexture = texture;
        texture.mapping = EquirectangularReflectionMapping;
        if (this.scene) {
          this.scene.environment = texture;
        }
      },
      undefined,
      () => {
        if (this.abortController?.signal.aborted) return;
        this.environmentState = { ...this.environmentState, hasEnvironmentMap: false };
      },
    );
  }

  getEnvironmentMap(): Texture | null {
    return this.loadedTexture;
  }

  // --------------------------------------------------------------------------
  // Fog State
  // --------------------------------------------------------------------------

  getFogState(): FogState {
    return this.fogState;
  }

  getFogConfig(): FogConfig {
    return this.fogConfig;
  }

  // --------------------------------------------------------------------------
  // Fog API
  // --------------------------------------------------------------------------

  setFog(type: FogType, config?: Partial<FogConfig>): void {
    this.fogConfig = { ...this.fogConfig, ...config, type };
    this.fogState = { ...this.fogState, type, isActive: type !== "none" };
    this.applyFog();
  }

  setFogColor(color: ColorRepresentation): void {
    this.fogConfig = { ...this.fogConfig, color };
    this.reusableFogColor.set(color);
    this.fogState = { ...this.fogState, color: this.reusableFogColor.clone() };
    if (this.scene?.fog) {
      this.scene.fog.color.copy(this.reusableFogColor);
    }
  }

  setFogLinear(near: number, far: number): void {
    this.fogConfig = { ...this.fogConfig, near, far };
    if (this.fogConfig.type === "linear" && this.scene?.fog instanceof Fog) {
      this.scene.fog.near = near;
      this.scene.fog.far = far;
    }
  }

  setFogDensity(density: number): void {
    this.fogConfig = { ...this.fogConfig, density };
    if (this.fogConfig.type === "exponential" && this.scene?.fog instanceof FogExp2) {
      this.scene.fog.density = density;
    }
  }

  getFog(): Fog | FogExp2 | null {
    return this.scene?.fog ?? null;
  }

  // --------------------------------------------------------------------------
  // Internal — Background
  // --------------------------------------------------------------------------

  private applyBackground(): void {
    if (!this.scene) return;

    switch (this.backgroundConfig.type) {
      case "color":
        this.reusableColor.set(this.backgroundConfig.color);
        this.scene.background = this.reusableColor;
        break;
      case "none":
        this.scene.background = null;
        break;
      default:
        this.scene.background = null;
        break;
    }
  }

  // --------------------------------------------------------------------------
  // Internal — Fog
  // --------------------------------------------------------------------------

  private applyFog(): void {
    if (!this.scene) return;

    if (this.fogConfig.type === "none") {
      this.scene.fog = null;
      return;
    }

    this.reusableFogColor.set(this.fogConfig.color);

    if (this.fogConfig.type === "linear") {
      this.scene.fog = new Fog(this.reusableFogColor, this.fogConfig.near, this.fogConfig.far);
    } else {
      this.scene.fog = new FogExp2(this.reusableFogColor, this.fogConfig.density);
    }
  }
}

// ============================================================================
// Factory
// ============================================================================

export function createEnvironmentManager(
  config?: Partial<EnvironmentConfig>,
): EnvironmentManager {
  return new EnvironmentManager(config);
}
