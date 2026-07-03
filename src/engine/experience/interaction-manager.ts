/**
 * Interaction Manager
 *
 * Orchestrates all experience managers: input, pointer, gesture, focus, hover.
 * Single entry point for initializing and destroying the experience engine.
 * Provides factory functions for testability.
 */

import type {
  InputManagerConfig,
  PointerManagerConfig,
  GestureManagerConfig,
  FocusManagerConfig,
  HoverManagerConfig,
  SceneManagerConfig,
} from "./types";
import { InputManager } from "./input-manager";
import { PointerManager } from "./pointer-manager";
import { GestureManager } from "./gesture-manager";
import { FocusManager } from "./focus-manager";
import { HoverManager } from "./hover-manager";
import { SceneManager } from "./scene-manager";
import { LifecycleManager } from "./lifecycle-manager";
import { StateSynchronization } from "./state-sync";
import { useExperienceStore } from "./store";
import { ExperienceRegistry } from "./registry";
import { experienceEvents } from "./events";

// ============================================================================
// Interaction Manager
// ============================================================================

interface InteractionManagerConfig {
  input?: Partial<InputManagerConfig>;
  pointer?: Partial<PointerManagerConfig>;
  gesture?: Partial<GestureManagerConfig>;
  focus?: Partial<FocusManagerConfig>;
  hover?: Partial<HoverManagerConfig>;
  scene?: Partial<SceneManagerConfig>;
}

class InteractionManagerImpl {
  private isInitialized = false;

  init(config?: InteractionManagerConfig): void {
    if (this.isInitialized) return;

    // Initialize lifecycle first
    LifecycleManager.init();

    // Initialize state synchronization
    StateSynchronization.init();

    // Initialize managers in order
    InputManager.init(config?.input);
    PointerManager.init(config?.pointer);
    GestureManager.init(config?.gesture);
    FocusManager.init(config?.focus);
    HoverManager.init(config?.hover);
    SceneManager.init(config?.scene);

    // Mark as initialized
    useExperienceStore.getState().setIsInitialized(true);
    useExperienceStore.getState().setLifecyclePhase("running");

    experienceEvents.emit("lifecycle:ready", {
      phase: "ready",
      timestamp: Date.now(),
      previousPhase: "running",
    });

    this.isInitialized = true;
  }

  destroy(): void {
    if (!this.isInitialized) return;

    // Destroy in reverse order
    SceneManager.destroy();
    HoverManager.destroy();
    FocusManager.destroy();
    GestureManager.destroy();
    PointerManager.destroy();
    InputManager.destroy();
    StateSynchronization.destroy();
    LifecycleManager.destroy();

    // Clean up events
    experienceEvents.removeAllListeners();

    useExperienceStore.getState().setIsInitialized(false);
    this.isInitialized = false;
  }

  // --- Config Updates ---

  updateConfig(config: InteractionManagerConfig): void {
    if (config.input) InputManager.updateConfig(config.input);
    if (config.pointer) PointerManager.updateConfig(config.pointer);
    if (config.gesture) GestureManager.updateConfig(config.gesture);
    if (config.focus) FocusManager.updateConfig(config.focus);
    if (config.hover) HoverManager.updateConfig(config.hover);
    if (config.scene) SceneManager.updateConfig(config.scene);
  }

  // --- Convenience Accessors ---

  get input() { return InputManager; }
  get pointer() { return PointerManager; }
  get gesture() { return GestureManager; }
  get focus() { return FocusManager; }
  get hover() { return HoverManager; }
  get scene() { return SceneManager; }
  get lifecycle() { return LifecycleManager; }
  get events() { return experienceEvents; }
  get registry() { return ExperienceRegistry; }
}

export const InteractionManager = new InteractionManagerImpl();

export function createInteractionManager(): InteractionManagerImpl {
  return new InteractionManagerImpl();
}
