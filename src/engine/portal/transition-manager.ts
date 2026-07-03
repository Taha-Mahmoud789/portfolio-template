import type { PortalActivationPhase, PortalTransitionPreset } from "./types";
import { PORTAL_TRANSITION_PRESETS } from "./constants";

type PhaseCallback = (phase: PortalActivationPhase) => void;

const PHASE_MAP: Record<string, PortalActivationPhase> = {
  selection: "selected",
  expansion: "expanding",
  "scene-transition": "transitioning",
  "world-loading": "loading",
  "world-entry": "entering",
};

export interface PortalTransitionManagerConfig {
  stages: string[];
  totalDuration: number;
  easing: string;
}

/**
 * Orchestrates the multi-stage portal activation flow.
 * Coordinates with the Zustand store via the onPhaseChange callback.
 *
 * Lifecycle:
 *   selection → expansion → scene-transition → world-loading → world-entry → entered
 */
export class PortalTransitionManager {
  private config: PortalTransitionManagerConfig;
  private currentPhase: PortalActivationPhase = "idle";
  private isTransitioning = false;
  private abortController: AbortController | null = null;

  constructor(
    preset: PortalTransitionPreset = "zoom-in",
    config?: Partial<PortalTransitionManagerConfig>,
  ) {
    const presetConfig = PORTAL_TRANSITION_PRESETS[preset];
    this.config = {
      stages: presetConfig.stages,
      totalDuration: presetConfig.duration,
      easing: presetConfig.easing,
      ...config,
    };
  }

  async execute(
    onPhaseChange: PhaseCallback,
  ): Promise<{ success: boolean; duration: number; stages: string[] }> {
    if (this.isTransitioning) {
      return { success: false, duration: 0, stages: [] };
    }

    this.isTransitioning = true;
    this.abortController = new AbortController();
    const signal = this.abortController.signal;
    const startTime = performance.now();
    const executedStages: string[] = [];

    try {
      for (const stageName of this.config.stages) {
        if (signal.aborted) break;

        const phase = PHASE_MAP[stageName] ?? "idle";
        this.currentPhase = phase;
        onPhaseChange(phase);

        const stageDuration = this.config.totalDuration / this.config.stages.length;

        await new Promise<void>((resolve) => {
          const timeout = setTimeout(resolve, stageDuration);
          signal.addEventListener("abort", () => {
            clearTimeout(timeout);
            resolve();
          });
        });

        executedStages.push(stageName);
      }

      if (!signal.aborted) {
        this.currentPhase = "entered";
        onPhaseChange("entered");
      }

      return {
        success: !signal.aborted,
        duration: performance.now() - startTime,
        stages: executedStages,
      };
    } finally {
      this.isTransitioning = false;
      this.abortController = null;
    }
  }

  cancel(): void {
    this.abortController?.abort();
    this.isTransitioning = false;
    this.currentPhase = "idle";
  }

  getPhase(): PortalActivationPhase {
    return this.currentPhase;
  }

  getIsTransitioning(): boolean {
    return this.isTransitioning;
  }
}
