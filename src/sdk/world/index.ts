/**
 * World SDK
 *
 * Reusable development kit for building worlds in the Frontend Multiverse.
 * Provides contracts, factories, validators, helpers, and utilities.
 */

// ============================================================================
// Types
// ============================================================================
export type {
  WorldContract,
  WorldComponentSet,
  WorldRouteConfig,
  WorldSDKConfig,
  WorldFactoryOptions,
  WorldFactoryResult,
  WorldContractValidationResult,
  WorldContractError,
  WorldRegistrationOptions,
  WorldLoaderHelperOptions,
  WorldSDKMeta,
  WorldDefaultConfig,
} from "./types";

// ============================================================================
// Constants
// ============================================================================
export {
  WORLD_SDK_DEFAULTS,
  THEME_WORLD_MAP,
  REQUIRED_CONTRACT_FIELDS,
  SDK_VERSION,
  SDK_NAME,
  WORLD_ROUTE_PREFIX,
} from "./constants";

// ============================================================================
// Factory
// ============================================================================
export { createWorld, createWorlds } from "./factory";

// ============================================================================
// Validation
// ============================================================================
export {
  validateWorldSDKConfig,
  validateWorldContract,
  validateWorldContracts,
} from "./validation";

// ============================================================================
// Registration
// ============================================================================
export { registerWorld, registerWorlds, unregisterWorld } from "./registration";

// ============================================================================
// Loader
// ============================================================================
export { createWorldLoader, createBatchLoader } from "./loader";

// ============================================================================
// Metadata
// ============================================================================
export {
  generateWorldSDKMeta,
  generateWorldTitle,
  generateWorldDescription,
  generateWorldOGTags,
} from "./metadata";

// ============================================================================
// Configuration
// ============================================================================
export { mergeWorldConfig, mergeWorldDefaults, buildWorldDefinition } from "./config";

// ============================================================================
// Hooks
// ============================================================================
export {
  useWorldSDK,
  useWorldLifecycle,
  useWorldAssets,
  useWorldGuard,
  useWorldMetadata,
} from "./hooks";

// ============================================================================
// Utilities
// ============================================================================
export {
  worldIdToSlug,
  slugToWorldId,
  worldIdToRoute,
  routeToWorldId,
  isValidWorldId,
  isSameWorld,
  getWorldDisplayName,
  getWorldRoute,
  isWorldFeatured,
  getWorldCategory,
  getWorldCategories,
  filterByCategory,
  sortByName,
  sortByDate,
  searchContracts,
} from "./utilities";
