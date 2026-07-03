/**
 * World Transition Manager
 *
 * Orchestrates transitions between worlds. Integrates with the
 * Animation Engine, Navigation Engine, and Portal System.
 */

import type { WorldId, WorldTransitionConfig, WorldTransitionState } from "./types";
import { WORLD_TRANSITION_DEFAULTS, WORLD_TRANSITION_PRESETS } from "./constants";

type TransitionCallback = (state: WorldTransitionState) => void;

export class WorldTransitionManager {
  private state: WorldTransitionState = {
    isTransitioning: false,
    fromWorldId: null,
    toWorldId: null,
    progress: 0,
    currentStage: "",
    type: "crossfade",
  };
  private listeners: TransitionCallback[] = [];
  private abortController: AbortController | null = null;

  getState(): Readonly<WorldTransitionState> {
    return this.state;
  }

  isTransitioning(): boolean {
    return this.state.isTransitioning;
  }

  onStateChange(callback: TransitionCallback): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  async transition(
    fromWorldId: WorldId | null,
    toWorldId: WorldId,
    config?: Partial<WorldTransitionConfig>,
    onExit?: () => Promise<void> | void,
    onEnter?: () => Promise<void> | void,
  ): Promise<void> {
    if (this.state.isTransitioning) {
      throw new Error("A transition is already in progress");
    }

    const transitionConfig = this.buildConfig(config);
    this.abortController = new AbortController();

    this.state = {
      isTransitioning: true,
      fromWorldId,
      toWorldId,
      progress: 0,
      currentStage: "",
      type: transitionConfig.type,
    };

    this.notifyListeners();

    try {
      for (const stage of transitionConfig.stages) {
        if (this.abortController.signal.aborted) break;

        this.state.currentStage = stage.name;
        this.notifyListeners();

        if (stage.phase === "deactivating" && onExit) {
          await onExit();
        }

        if (stage.phase === "activating" && onEnter) {
          await onEnter();
        }

        await this.delay(stage.duration);
        this.state.progress += stage.duration / transitionConfig.duration;
      }

      this.state.progress = 1;
      this.state.currentStage = "complete";
      this.notifyListeners();
    } finally {
      this.state.isTransitioning = false;
      this.state.fromWorldId = null;
      this.state.currentStage = "";
      this.abortController = null;
      this.notifyListeners();
    }
  }

  cancel(): void {
    if (this.abortController) {
      this.abortController.abort();
    }

    this.state = {
      isTransitioning: false,
      fromWorldId: null,
      toWorldId: null,
      progress: 0,
      currentStage: "",
      type: "crossfade",
    };

    this.notifyListeners();
  }

  getPreset(name: string): WorldTransitionConfig | undefined {
    return WORLD_TRANSITION_PRESETS[name];
  }

  getPresetNames(): string[] {
    return Object.keys(WORLD_TRANSITION_PRESETS);
  }

  private buildConfig(partial?: Partial<WorldTransitionConfig>): WorldTransitionConfig {
    const preset = partial?.type
      ? (WORLD_TRANSITION_PRESETS[partial.type] ?? WORLD_TRANSITION_DEFAULTS)
      : WORLD_TRANSITION_DEFAULTS;

    return {
      ...preset,
      ...partial,
    };
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      try {
        listener({ ...this.state });
      } catch {
        // Listener errors should not break the transition
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
