/**
 * World Engine
 *
 * Infrastructure that powers every visual world in the Frontend Multiverse.
 * Handles loading, activating, suspending, and unloading worlds.
 */

// ============================================================================
// Types
// ============================================================================
export type {
  WorldStatus,
  WorldLifecyclePhase,
  WorldDefinition,
  WorldLayoutType,
  WorldLayoutConfig,
  WorldAnimationPreset,
  WorldTransitionPreset,
  WorldBackgroundType,
  WorldBackground,
  WorldSequence,
  WorldSequenceStep,
  WorldAssets,
  WorldAsset,
  WorldPermissions,
  WorldMetadata,
  WorldInstanceState,
  WorldEngineState,
  WorldEngineActions,
  WorldStore,
  WorldRegistryEntry,
  WorldRegistryConfig,
  WorldCacheEntry,
  WorldCacheConfig,
  WorldModuleLoader,
  WorldLoaderConfig,
  WorldLoaderResult,
  WorldEventType,
  WorldEvent,
  WorldEventCallback,
  WorldEventUnsubscribe,
  WorldTransitionConfig,
  WorldTransitionStage,
  WorldTransitionState,
  WorldAssetManagerConfig,
  WorldAssetLoadState,
  WorldMemoryConfig,
  WorldMemoryStats,
  WorldErrorBoundaryProps,
  WorldErrorBoundaryState,
  WorldValidationResult,
  WorldMeta,
  UseWorldReturn,
  UseWorldLoaderReturn,
  UseWorldTransitionReturn,
  UseWorldEventsReturn,
  WorldManagerConfig,
} from "./types";

// ============================================================================
// Constants
// ============================================================================
export {
  WORLD_STORAGE_KEY,
  VALID_LIFECYCLE_TRANSITIONS,
  LIFECYCLE_PHASE_LABELS,
  WORLD_REGISTRY_DEFAULTS,
  WORLD_LOADER_DEFAULTS,
  WORLD_CACHE_DEFAULTS,
  WORLD_MEMORY_DEFAULTS,
  WORLD_ASSET_MANAGER_DEFAULTS,
  WORLD_TRANSITION_DEFAULTS,
  WORLD_TRANSITION_PRESETS,
  WORLD_MANAGER_DEFAULTS,
  WORLD_PERFORMANCE,
  WORLD_A11Y,
  WORLD_ERRORS,
  WORLD_DEBUG,
} from "./constants";

// ============================================================================
// Core
// ============================================================================
export { WorldRegistry } from "./registry";
export { WorldEventBus } from "./events";
export { WorldCache } from "./cache";
export { WorldLoader } from "./loader";
export { WorldLifecycle } from "./lifecycle";
export { WorldTransitionManager } from "./transitions";
export { WorldMemoryManager } from "./memory";
export { WorldAssetManager } from "./assets";
export { WorldManager } from "./manager";

// ============================================================================
// Validation
// ============================================================================
export {
  validateWorld,
  validateWorlds,
  isValidWorldId,
  isValidWorldStatus,
  isValidAnimationPreset,
  isValidTransitionPreset,
} from "./validation";

// ============================================================================
// Metadata
// ============================================================================
export {
  getWorldMeta,
  clearWorldMetaCache,
  generateWorldStructuredData,
  applyWorldMeta,
  resetWorldMeta,
} from "./metadata";

// ============================================================================
// Store
// ============================================================================
export {
  useWorldStore,
  selectCurrentWorldId,
  selectPreviousWorldId,
  selectLoadingWorldId,
  selectTransitioning,
  selectWorldInstances,
  selectRegisteredWorlds,
  selectReadyWorlds,
  selectCachedWorlds,
  selectWorldInstance,
} from "./store";

// ============================================================================
// Context
// ============================================================================
export {
  WorldActionsContext,
  WorldStateContext,
  useWorldActions,
  useWorldState,
  useOptionalWorldActions,
  useOptionalWorldState,
} from "./context";
export type { WorldActionsContextValue, WorldStateContextValue } from "./context";

// ============================================================================
// Provider
// ============================================================================
export { WorldProvider } from "./provider";

// ============================================================================
// Hooks
// ============================================================================
export {
  useWorld,
  useCurrentWorld,
  useWorldLoader,
  useWorldTransition,
  useWorldEvents,
  useWorldPhase,
  useIsWorldReady,
  useIsWorldCached,
  useWorldSwitcher,
} from "./hooks";

// ============================================================================
// Components
// ============================================================================
export { WorldErrorBoundary } from "./error-boundary";
