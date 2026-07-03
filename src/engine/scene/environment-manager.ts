/**
 * Environment Manager
 *
 * Owns background, fog, skybox, environment map, and future weather.
 */

import { Color, Fog, FogExp2, type Scene, type ColorRepresentation } from "three";
import type {
  Manager,
  EnvironmentManagerConfig,
  EnvironmentManagerState,
  EnvironmentConfig,
  EnvironmentBackgroundType,
} from "./types";
import { ENVIRONMENT_DEFAULTS } from "./constants";

// ============================================================================
// EnvironmentManager
// ============================================================================

export class EnvironmentManager implements Manager {
  private config: EnvironmentConfig;
  private state: EnvironmentManagerState;
  private scene: Scene | null = null;

  constructor(config?: Partial<EnvironmentManagerConfig>) {
    const defaults = ENVIRONMENT_DEFAULTS.environment;
    const overrides: Partial<EnvironmentConfig> = config?.environment ?? {};
    this.config = {
      backgroundType: overrides.backgroundType ?? defaults.backgroundType,
      backgroundValue: overrides.backgroundValue ?? defaults.backgroundValue,
      backgroundColor: overrides.backgroundColor ?? defaults.backgroundColor,
      fogType: overrides.fogType ?? defaults.fogType,
      fogColor: overrides.fogColor ?? defaults.fogColor,
      fogNear: overrides.fogNear ?? defaults.fogNear,
      fogFar: overrides.fogFar ?? defaults.fogFar,
      fogDensity: overrides.fogDensity ?? defaults.fogDensity,
      environmentMap: overrides.environmentMap ?? defaults.environmentMap,
    };

    this.state = {
      backgroundType: this.config.backgroundType,
      fogType: this.config.fogType,
      hasEnvironmentMap: this.config.environmentMap !== null,
    };
  }

  // --------------------------------------------------------------------------
  // Lifecycle
  // --------------------------------------------------------------------------

  initialize(): void {
    // Scene reference is set via setScene() before initialize.
  }

  update(_delta: number): void {
    // Environment has no per-frame update logic.
  }

  dispose(): void {
    if (this.scene) {
      this.scene.background = null;
      this.scene.fog = null;
    }
  }

  // --------------------------------------------------------------------------
  // Public API
  // --------------------------------------------------------------------------

  getState(): EnvironmentManagerState {
    return this.state;
  }

  setScene(scene: Scene): void {
    this.scene = scene;
  }

  setBackground(type: EnvironmentBackgroundType, value: string | ColorRepresentation): void {
    if (!this.scene) return;

    switch (type) {
      case "color":
        this.scene.background = new Color(value);
        break;
      case "none":
        this.scene.background = null;
        break;
      default:
        this.scene.background = new Color(value);
        break;
    }

    this.state = { ...this.state, backgroundType: type };
  }

  setBackgroundColor(color: ColorRepresentation): void {
    if (!this.scene) return;
    this.scene.background = new Color(color);
  }

  setFog(type: "none" | "linear" | "exponential", config?: Partial<EnvironmentConfig>): void {
    if (!this.scene) return;

    if (type === "none") {
      this.scene.fog = null;
      this.state = { ...this.state, fogType: "none" };
      return;
    }

    const fogColor = new Color(config?.fogColor ?? this.config.fogColor);

    if (type === "linear") {
      this.scene.fog = new Fog(
        fogColor,
        config?.fogNear ?? this.config.fogNear,
        config?.fogFar ?? this.config.fogFar,
      );
    } else {
      this.scene.fog = new FogExp2(fogColor, config?.fogDensity ?? this.config.fogDensity);
    }

    this.state = { ...this.state, fogType: type };
  }

  getFog(): Fog | FogExp2 | null {
    if (!this.scene) return null;
    const fog = this.scene.fog;
    if (fog === null || fog === undefined) return null;
    return fog;
  }

  getBackground(): Color | null {
    const bg = this.scene?.background;
    if (bg instanceof Color) return bg;
    return null;
  }

  setEnvironmentMap(_url: string): void {
    // Placeholder for future HDR environment map loading.
    this.state = { ...this.state, hasEnvironmentMap: true };
  }

  // --------------------------------------------------------------------------
  // Dispose helpers
  // --------------------------------------------------------------------------

  disposeFog(): void {
    if (this.scene) {
      this.scene.fog = null;
    }
    this.state = { ...this.state, fogType: "none" };
  }
}

// ============================================================================
// Factory
// ============================================================================

export function createEnvironmentManager(
  config?: Partial<EnvironmentManagerConfig>,
): EnvironmentManager {
  return new EnvironmentManager(config);
}
