/**
 * Lighting Manager
 *
 * Owns ambient, directional, point lights, and future HDRI / volumetric lights.
 */

import {
  AmbientLight,
  DirectionalLight,
  PointLight,
  SpotLight,
  HemisphereLight,
  Color,
  type Light,
} from "three";
import type { Manager, LightingManagerConfig, LightingManagerState, LightConfig } from "./types";
import { LIGHTING_DEFAULTS } from "./constants";

// ============================================================================
// Light Factory
// ============================================================================

function createLight(config: LightConfig): Light {
  const color = new Color(config.color);

  switch (config.type) {
    case "ambient":
      return new AmbientLight(color, config.intensity);

    case "directional": {
      const light = new DirectionalLight(color, config.intensity);
      if (config.position) light.position.set(...config.position);
      if (config.target) light.target.position.set(...config.target);
      if (config.castShadow) light.castShadow = true;
      return light;
    }

    case "point": {
      const light = new PointLight(color, config.intensity, config.distance, config.decay);
      if (config.position) light.position.set(...config.position);
      return light;
    }

    case "spot": {
      const light = new SpotLight(color, config.intensity);
      if (config.position) light.position.set(...config.position);
      if (config.angle) light.angle = config.angle;
      if (config.penumbra) light.penumbra = config.penumbra;
      if (config.distance) light.distance = config.distance;
      if (config.decay) light.decay = config.decay;
      if (config.castShadow) light.castShadow = true;
      return light;
    }

    case "hemisphere": {
      const light = new HemisphereLight(color, new Color("#030712"), config.intensity);
      if (config.position) light.position.set(...config.position);
      return light;
    }

    default:
      return new AmbientLight(color, config.intensity);
  }
}

// ============================================================================
// LightingManager
// ============================================================================

export class LightingManager implements Manager {
  private config: LightingManagerConfig;
  private lights = new Map<string, Light>();
  private state: LightingManagerState;

  constructor(config?: Partial<LightingManagerConfig>) {
    this.config = { ...LIGHTING_DEFAULTS, ...config };
    this.state = {
      lightCount: 0,
      ambientIntensity: this.config.ambient.intensity,
    };
  }

  // --------------------------------------------------------------------------
  // Lifecycle
  // --------------------------------------------------------------------------

  initialize(): void {
    this.addLight(this.config.ambient);
    for (const dir of this.config.directional) {
      this.addLight(dir);
    }
    for (const point of this.config.point) {
      this.addLight(point);
    }
  }

  update(_delta: number): void {
    // Lights have no per-frame update logic.
  }

  dispose(): void {
    for (const light of this.lights.values()) {
      light.dispose();
    }
    this.lights.clear();
  }

  // --------------------------------------------------------------------------
  // Public API
  // --------------------------------------------------------------------------

  getState(): LightingManagerState {
    return this.state;
  }

  addLight(config: LightConfig): string {
    const id = `light-${config.type}-${String(this.lights.size)}`;
    const light = createLight(config);
    light.name = id;
    this.lights.set(id, light);
    this.updateState();
    return id;
  }

  removeLight(id: string): void {
    const light = this.lights.get(id);
    if (!light) return;
    light.dispose();
    this.lights.delete(id);
    this.updateState();
  }

  updateLight(id: string, config: Partial<LightConfig>): void {
    const existing = this.lights.get(id);
    if (!existing) return;

    if (config.color !== undefined) {
      (existing as { color: Color }).color.set(config.color);
    }
    if (config.intensity !== undefined) {
      existing.intensity = config.intensity;
    }
    if (config.position !== undefined && "position" in existing) {
      const pos = existing as { position: { set: (x: number, y: number, z: number) => void } };
      pos.position.set(config.position[0], config.position[1], config.position[2]);
    }
  }

  getLights(): Light[] {
    return Array.from(this.lights.values());
  }

  getLight(id: string): Light | undefined {
    return this.lights.get(id);
  }

  setAmbientIntensity(intensity: number): void {
    for (const light of this.lights.values()) {
      if (light instanceof AmbientLight) {
        light.intensity = intensity;
      }
    }
    this.state = { ...this.state, ambientIntensity: intensity };
  }

  // --------------------------------------------------------------------------
  // Internal
  // --------------------------------------------------------------------------

  private updateState(): void {
    this.state = {
      ...this.state,
      lightCount: this.lights.size,
    };
  }
}

// ============================================================================
// Factory
// ============================================================================

export function createLightingManager(config?: Partial<LightingManagerConfig>): LightingManager {
  return new LightingManager(config);
}
