/**
 * Base World Foundation
 *
 * Reusable foundation from which every world inherits.
 * Contains zero world-specific styling.
 */

// ============================================================================
// Types
// ============================================================================
export type {
  BaseWorldPhase,
  BaseWorldState,
  BaseWorldActions,
  BaseWorldStore,
  BaseBackgroundVariant,
  BaseBackgroundLayerProps,
  BaseBackgroundContextValue,
  BaseContentArea,
  BaseContentLayerProps,
  BaseContentSlotProps,
  BaseOverlayType,
  BaseOverlayLayerProps,
  BaseOverlaySlotProps,
  BaseOverlayContextValue,
  BaseTransitionPhase,
  BaseTransitionLayerProps,
  BaseTransitionContextValue,
  BaseWorldHeaderProps,
  BaseWorldWrapperProps,
  BaseWorldLayoutProps,
  BaseWorldLoaderProps,
  BaseWorldProps,
  UseBaseWorldReturn,
  UseBaseWorldBackgroundReturn,
  UseBaseWorldContentReturn,
  UseBaseWorldOverlayReturn,
  UseBaseWorldTransitionReturn,
} from "./types";

// ============================================================================
// Constants
// ============================================================================
export {
  BASE_WORLD_DEFAULT_STATE,
  BASE_WORLD_PHASES,
  VALID_BASE_WORLD_TRANSITIONS,
  BASE_BACKGROUND_VARIANTS,
  DEFAULT_BACKGROUND_CONFIG,
  BASE_CONTENT_AREAS,
  BASE_OVERLAY_TYPES,
  BASE_TRANSITION_PHASES,
  BASE_TRANSITION_TIMING,
  BASE_WORLD_A11Y,
  BASE_WORLD_PERFORMANCE,
  BASE_WORLD_CLASSES,
  BASE_WORLD_TIMING,
} from "./constants";

// ============================================================================
// Config
// ============================================================================
export {
  BASE_WORLD_DEFAULT_CONFIG,
  mergeBaseWorldConfig,
  deriveBaseWorldConfig,
  isPhaseActive,
  isPhaseTransitioning,
  isPhaseReady,
  isTransitionPhaseComplete,
} from "./config";
export type { BaseWorldConfig } from "./config";

// ============================================================================
// State
// ============================================================================
export {
  useBaseWorldStore,
  selectBaseWorldPhase,
  selectBaseWorldMounted,
  selectBaseWorldReady,
  selectBaseWorldActive,
  selectBaseWorldTransitioning,
  selectBaseWorldError,
  selectBaseWorldTheme,
  selectBaseWorldId,
} from "./state";

// ============================================================================
// Layers
// ============================================================================
export { BaseBackgroundLayer, useBaseBackground } from "./layers/background";
export { BaseContentLayer, BaseContentSlot, useBaseContent } from "./layers/content";
export { BaseOverlayLayer, BaseOverlaySlot, useBaseOverlay } from "./layers/overlay";
export { BaseTransitionLayer, useBaseTransition } from "./layers/transition";

// ============================================================================
// Components
// ============================================================================
export { BaseWorld } from "./components/base-world";
export { BaseWorldHeader } from "./components/world-header";
export { BaseWorldWrapper } from "./components/world-wrapper";
export { BaseWorldLayout } from "./components/world-layout";
export { BaseWorldLoader } from "./components/world-loader";

// ============================================================================
// Hooks
// ============================================================================
export {
  useBaseWorld,
  useBaseWorldBackground,
  useBaseWorldContent,
  useBaseWorldOverlay,
  useBaseWorldTransition,
} from "./hooks";
