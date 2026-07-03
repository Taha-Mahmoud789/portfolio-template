/**
 * Experience Registry
 *
 * Central registry for experience configurations.
 * Manages scene registrations, input configs, and interaction presets.
 */

import type {
  SceneConfig,
  SceneState,
  SceneId,
  ExperienceRegistryEntry,
  InputManagerConfig,
  PointerManagerConfig,
  GestureManagerConfig,
  FocusManagerConfig,
  HoverManagerConfig,
  SceneManagerConfig,
} from "./types";
import {
  INPUT_DEFAULTS,
  POINTER_DEFAULTS,
  GESTURE_DEFAULTS,
  FOCUS_DEFAULTS,
  HOVER_DEFAULTS,
  SCENE_DEFAULTS,
} from "./constants";

// ============================================================================
// Registry
// ============================================================================

class ExperienceRegistryImpl {
  private scenes = new Map<SceneId, SceneConfig>();
  private sceneStates = new Map<SceneId, SceneState>();
  private entries = new Map<string, ExperienceRegistryEntry>();
  private listeners = new Set<() => void>();

  // --- Config (merged defaults) ---
  inputConfig: InputManagerConfig = { ...INPUT_DEFAULTS };
  pointerConfig: PointerManagerConfig = { ...POINTER_DEFAULTS };
  gestureConfig: GestureManagerConfig = { ...GESTURE_DEFAULTS };
  focusConfig: FocusManagerConfig = { ...FOCUS_DEFAULTS };
  hoverConfig: HoverManagerConfig = { ...HOVER_DEFAULTS };
  sceneConfig: SceneManagerConfig = { ...SCENE_DEFAULTS };

  // --- Scene Management ---

  registerScene(scene: SceneConfig): void {
    this.scenes.set(scene.id, scene);
    this.sceneStates.set(scene.id, {
      id: scene.id,
      isActive: false,
      isLoaded: false,
      enteredAt: null,
      exitedAt: null,
    });
    this.notify();
  }

  registerScenes(scenes: SceneConfig[]): void {
    for (const scene of scenes) {
      this.registerScene(scene);
    }
  }

  getScene(sceneId: SceneId): SceneConfig | undefined {
    return this.scenes.get(sceneId);
  }

  getSceneOrThrow(sceneId: SceneId): SceneConfig {
    const scene = this.scenes.get(sceneId);
    if (!scene) throw new Error(`Scene "${sceneId}" not found in experience registry`);
    return scene;
  }

  hasScene(sceneId: SceneId): boolean {
    return this.scenes.has(sceneId);
  }

  getSceneState(sceneId: SceneId): SceneState | undefined {
    return this.sceneStates.get(sceneId);
  }

  updateSceneState(sceneId: SceneId, state: Partial<SceneState>): void {
    const existing = this.sceneStates.get(sceneId);
    if (existing) {
      this.sceneStates.set(sceneId, { ...existing, ...state });
      this.notify();
    }
  }

  getAllScenes(): SceneConfig[] {
    return Array.from(this.scenes.values());
  }

  getDefaultScene(): SceneConfig {
    return this.getSceneOrThrow(this.sceneConfig.defaultScene);
  }

  // --- Entry Management ---

  registerEntry(entry: ExperienceRegistryEntry): void {
    this.entries.set(entry.id, entry);
    this.notify();
  }

  getEntry(id: string): ExperienceRegistryEntry | undefined {
    return this.entries.get(id);
  }

  // --- Config Merging ---

  updateInputConfig(config: Partial<InputManagerConfig>): void {
    this.inputConfig = { ...this.inputConfig, ...config };
  }

  updatePointerConfig(config: Partial<PointerManagerConfig>): void {
    this.pointerConfig = { ...this.pointerConfig, ...config };
  }

  updateGestureConfig(config: Partial<GestureManagerConfig>): void {
    this.gestureConfig = { ...this.gestureConfig, ...config };
  }

  updateFocusConfig(config: Partial<FocusManagerConfig>): void {
    this.focusConfig = { ...this.focusConfig, ...config };
  }

  updateHoverConfig(config: Partial<HoverManagerConfig>): void {
    this.hoverConfig = { ...this.hoverConfig, ...config };
  }

  updateSceneConfig(config: Partial<SceneManagerConfig>): void {
    this.sceneConfig = { ...this.sceneConfig, ...config };
  }

  // --- Subscription ---

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  clear(): void {
    this.scenes.clear();
    this.sceneStates.clear();
    this.entries.clear();
    this.listeners.clear();
  }
}

// Singleton
export const ExperienceRegistry = new ExperienceRegistryImpl();

export function createExperienceRegistry(): ExperienceRegistryImpl {
  return new ExperienceRegistryImpl();
}
