/**
 * Base World Configuration
 *
 * Default configuration for the Base World foundation.
 * Worlds override these defaults through the SDK factory.
 */

import type { WorldDefinition, WorldLayoutConfig, WorldBackground } from "@/engine/world/types";
import type { ThemeId } from "@/engine/theme/types";
import type { BaseWorldPhase, BaseBackgroundVariant, BaseContentArea } from "./types";
import { DEFAULT_BACKGROUND_CONFIG, BASE_TRANSITION_TIMING } from "./constants";

// ============================================================================
// Base World Config
// ============================================================================

export interface BaseWorldConfig {
  theme: ThemeId;
  layout: WorldLayoutConfig;
  background: WorldBackground;
  backgroundVariant: BaseBackgroundVariant;
  contentAreas: BaseContentArea[];
  showHeader: boolean;
  showBackground: boolean;
  showOverlays: boolean;
  enableTransitions: boolean;
  enableAccessibility: boolean;
  enableReducedMotion: boolean;
  transitionEnterDuration: number;
  transitionExitDuration: number;
}

export const BASE_WORLD_DEFAULT_CONFIG: BaseWorldConfig = {
  theme: "apple",
  layout: {
    type: "fullscreen",
    fullscreen: true,
  },
  background: { ...DEFAULT_BACKGROUND_CONFIG },
  backgroundVariant: "gradient",
  contentAreas: ["hero", "sections"],
  showHeader: true,
  showBackground: true,
  showOverlays: true,
  enableTransitions: true,
  enableAccessibility: true,
  enableReducedMotion: false,
  transitionEnterDuration: BASE_TRANSITION_TIMING.enterDuration,
  transitionExitDuration: BASE_TRANSITION_TIMING.exitDuration,
};

// ============================================================================
// Merge Config
// ============================================================================

export function mergeBaseWorldConfig(
  base: BaseWorldConfig,
  override: Partial<BaseWorldConfig>,
): BaseWorldConfig {
  return {
    ...base,
    ...override,
    layout: { ...base.layout, ...override.layout },
    background: { ...base.background, ...override.background },
  };
}

// ============================================================================
// Derive Config from WorldDefinition
// ============================================================================

export function deriveBaseWorldConfig(definition: WorldDefinition): BaseWorldConfig {
  return {
    ...BASE_WORLD_DEFAULT_CONFIG,
    theme: definition.theme,
    layout: definition.layout,
    background: definition.background,
  };
}

// ============================================================================
// Phase Helpers
// ============================================================================

export function isPhaseActive(phase: BaseWorldPhase): boolean {
  return phase === "active";
}

export function isPhaseTransitioning(phase: BaseWorldPhase): boolean {
  return phase === "transitioning-in" || phase === "transitioning-out";
}

export function isPhaseReady(phase: BaseWorldPhase): boolean {
  return phase === "ready" || phase === "active";
}

import type { BaseTransitionPhase } from "./types";

export function isTransitionPhaseComplete(phase: BaseTransitionPhase): boolean {
  return phase === "entered" || phase === "exited";
}
