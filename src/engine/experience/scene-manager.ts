/**
 * Scene Manager
 *
 * Manages scene lifecycle: entry, exit, activation, deactivation.
 * Supports nested scenes and transitions.
 * Respects reduced motion preference.
 * Restores focus across scene transitions.
 */

import type { SceneId, SceneState, SceneManagerConfig } from "./types";
import { useExperienceStore } from "./store";
import { ExperienceRegistry } from "./registry";
import { experienceEvents } from "./events";
import { SCENE_DEFAULTS, A11Y } from "./constants";

// ============================================================================
// Scene Manager
// ============================================================================

class SceneManagerImpl {
  private config: SceneManagerConfig = { ...SCENE_DEFAULTS };
  private isInitialized = false;
  private transitionTimeout: ReturnType<typeof setTimeout> | null = null;
  private previousFocus: HTMLElement | null = null;
  private transitionGeneration = 0;

  init(config?: Partial<SceneManagerConfig>): void {
    if (this.isInitialized) return;
    this.config = { ...this.config, ...config };
    this.isInitialized = true;
  }

  updateConfig(config: Partial<SceneManagerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  destroy(): void {
    if (this.transitionTimeout) clearTimeout(this.transitionTimeout);
    this.isInitialized = false;
  }

  // --- Scene Lifecycle ---

  async enterScene(sceneId: SceneId): Promise<void> {
    const scene = ExperienceRegistry.getScene(sceneId);
    if (!scene) {
      console.warn(`[ExperienceEngine] Scene "${sceneId}" not found`);
      return;
    }

    const currentSceneId = useExperienceStore.getState().activeSceneId;

    // Exit current scene first
    if (currentSceneId && currentSceneId !== sceneId) {
      await this.exitScene(currentSceneId);
    }

    // Save focus before transition
    this.previousFocus = document.activeElement as HTMLElement;

    // Update state
    useExperienceStore.getState().setInteractionState("transitioning");
    useExperienceStore.getState().setActiveScene(sceneId);

    ExperienceRegistry.updateSceneState(sceneId, {
      isActive: true,
      isLoaded: true,
      enteredAt: Date.now(),
    });

    experienceEvents.emit("scene:enter", { sceneId, scene, timestamp: Date.now() });

    // Call scene callbacks
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    scene.onEnter?.();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    scene.onActivate?.();

    // Wait for transition (respects reduced motion)
    await this.waitForTransition();

    useExperienceStore.getState().setInteractionState("idle");

    // Restore focus after transition
    this.restoreFocus();
  }

  async exitScene(sceneId: SceneId): Promise<void> {
    const scene = ExperienceRegistry.getScene(sceneId);
    if (!scene) return;

    useExperienceStore.getState().setInteractionState("transitioning");

    scene.onDeactivate?.();

    experienceEvents.emit("scene:exit", { sceneId, scene, timestamp: Date.now() });

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    scene.onExit?.();

    ExperienceRegistry.updateSceneState(sceneId, {
      isActive: false,
      exitedAt: Date.now(),
    });

    await this.waitForTransition();

    if (useExperienceStore.getState().activeSceneId === sceneId) {
      useExperienceStore.getState().setActiveScene(null);
    }
  }

  activateScene(sceneId: SceneId): void {
    const scene = ExperienceRegistry.getScene(sceneId);
    if (!scene) return;

    scene.onActivate?.();
    experienceEvents.emit("scene:activate", { sceneId, scene, timestamp: Date.now() });
  }

  deactivateScene(sceneId: SceneId): void {
    const scene = ExperienceRegistry.getScene(sceneId);
    if (!scene) return;

    scene.onDeactivate?.();
    experienceEvents.emit("scene:deactivate", { sceneId, scene, timestamp: Date.now() });
  }

  // --- Getters ---

  getActiveSceneId(): SceneId | null {
    return useExperienceStore.getState().activeSceneId;
  }

  getSceneState(sceneId: SceneId): SceneState | undefined {
    return ExperienceRegistry.getSceneState(sceneId);
  }

  isSceneActive(sceneId: SceneId): boolean {
    return useExperienceStore.getState().activeSceneId === sceneId;
  }

  // --- Internal ---

  private async waitForTransition(): Promise<void> {
    // Check reduced motion — skip transition if preferred
    const reducedMotion = useExperienceStore.getState().reducedMotion;
    const duration = reducedMotion ? A11Y.REDUCED_MOTION_DURATION : this.config.transitionDuration;

    // Use generation counter to discard stale transitions
    const generation = ++this.transitionGeneration;

    return new Promise((resolve) => {
      this.transitionTimeout = setTimeout(() => {
        // Only resolve if this is still the current transition
        if (generation === this.transitionGeneration) {
          resolve();
        }
      }, duration);
    });
  }

  private restoreFocus(): void {
    if (this.previousFocus?.isConnected) {
      this.previousFocus.focus();
    }
    this.previousFocus = null;
  }
}

export const SceneManager = new SceneManagerImpl();

export function createSceneManager(): SceneManagerImpl {
  return new SceneManagerImpl();
}
