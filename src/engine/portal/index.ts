/**
 * Portal System
 *
 * The gateway into the Frontend Multiverse.
 * Each portal is a living gateway to a different world.
 */

// ============================================================================
// Types
// ============================================================================
export type {
  PortalStatus,
  PortalActivationPhase,
  PortalDefinition,
  PortalBackground,
  PortalBackgroundOverlay,
  PortalIcon,
  PortalAccent,
  PortalAnimationPreset,
  PortalTransitionPreset,
  PortalGridColumns,
  PortalGridConfig,
  PortalInteractionConfig,
  PortalState,
  PortalActions,
  PortalStore,
  PortalConfig,
  PortalRegistryEntry,
  PortalRegistryConfig,
  PortalMetadata,
  UsePortalReturn,
  UsePortalTransitionReturn,
  PortalCardProps,
  PortalGridProps,
  PortalIconProps,
  PortalGlowProps,
} from "./types";

// ============================================================================
// Constants
// ============================================================================
export {
  PORTAL_GRID_DEFAULTS,
  PORTAL_INTERACTION_DEFAULTS,
  PORTAL_ANIMATION_PRESETS,
  PORTAL_TRANSITION_PRESETS,
  PORTAL_STATUS_DEFAULTS,
  PORTAL_CONFIG_DEFAULTS,
  PORTAL_STORAGE_KEY,
  PORTAL_A11Y,
} from "./constants";

// ============================================================================
// Validation
// ============================================================================
export {
  validatePortal,
  validatePortals,
  isValidPortal,
  isValidPortalStatus,
  isValidAnimationPreset,
  isValidTransitionPreset,
} from "./validation";
export type { PortalValidationResult } from "./validation";

// ============================================================================
// Registry
// ============================================================================
export { PortalRegistry } from "./registry";

// ============================================================================
// Store
// ============================================================================
export {
  usePortalStore,
  selectSelectedPortalId,
  selectActivationPhase,
  selectHoveredPortalId,
  selectFocusedPortalId,
  selectIsGridReady,
  selectPortals,
  selectVisiblePortals,
  selectPortalById,
} from "./store";

// ============================================================================
// Hooks
// ============================================================================
export {
  usePortal,
  useAllPortals,
  usePortalById,
  usePortalSearch,
  usePortalActions,
  usePortalStatus,
  usePortalTransition,
  usePortalFocusManager,
} from "./hooks";

// ============================================================================
// Animations
// ============================================================================
export {
  getNormalizedMouseOffset,
  depthTransform,
  magneticOffset,
  getPortalEntranceVariants,
  getPortalHoverVariants,
  getPortalActivationVariants,
  getPortalGridTransition,
} from "./animations";

// ============================================================================
// Transition Manager
// ============================================================================
export { PortalTransitionManager } from "./transition-manager";

// ============================================================================
// Navigation
// ============================================================================
export { usePortalNavigation } from "./navigation";

// ============================================================================
// Metadata
// ============================================================================
export { getPortalMeta, clearPortalMetaCache, generatePortalStructuredData } from "./metadata";

// ============================================================================
// Components
// ============================================================================
export {
  PortalCard,
  PortalGrid,
  PortalIcon as PortalIconComponent,
  PortalGlow,
  PortalDepth,
  PortalMagnetic,
  PortalAnnouncer,
} from "./components";
