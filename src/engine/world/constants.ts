/**
 * World Engine Constants
 *
 * Default values, configuration, and lifecycle rules for the World Engine.
 */

import type {
  WorldRegistryConfig,
  WorldCacheConfig,
  WorldLoaderConfig,
  WorldMemoryConfig,
  WorldAssetManagerConfig,
  WorldManagerConfig,
  WorldLifecyclePhase,
  WorldTransitionConfig,
} from "./types";

// ============================================================================
// Storage
// ============================================================================

export const WORLD_STORAGE_KEY = "fm-world-engine";

// ============================================================================
// Lifecycle Valid Transitions
// ============================================================================

export const VALID_LIFECYCLE_TRANSITIONS: Record<
  WorldLifecyclePhase,
  readonly WorldLifecyclePhase[]
> = {
  unregistered: ["registered"],
  registered: ["preloading", "loading", "destroying"],
  preloading: ["preloaded", "loading", "error"],
  preloaded: ["loading", "destroying"],
  loading: ["loaded", "error"],
  loaded: ["mounting", "unloading", "destroying"],
  mounting: ["mounted", "error"],
  mounted: ["activating", "unloading", "destroying"],
  activating: ["active", "error"],
  active: ["suspending", "deactivating", "destroying"],
  suspending: ["suspended", "error"],
  suspended: ["resuming", "unloading", "destroying"],
  resuming: ["active", "error"],
  deactivating: ["inactive", "error"],
  inactive: ["loading", "destroying"],
  unloading: ["unloaded", "error"],
  unloaded: ["loading", "destroying"],
  destroying: ["destroyed"],
  destroyed: ["registered"],
  error: ["registered", "unloading", "destroying"],
};

// ============================================================================
// Lifecycle Phase Descriptions
// ============================================================================

export const LIFECYCLE_PHASE_LABELS: Record<WorldLifecyclePhase, string> = {
  unregistered: "Unregistered",
  registered: "Registered",
  preloading: "Preloading",
  preloaded: "Preloaded",
  loading: "Loading",
  loaded: "Loaded",
  mounting: "Mounting",
  mounted: "Mounted",
  activating: "Activating",
  active: "Active",
  suspending: "Suspending",
  suspended: "Suspended",
  resuming: "Resuming",
  deactivating: "Deactivating",
  inactive: "Inactive",
  unloading: "Unloading",
  unloaded: "Unloaded",
  destroying: "Destroying",
  destroyed: "Destroyed",
  error: "Error",
};

// ============================================================================
// Registry Defaults
// ============================================================================

export const WORLD_REGISTRY_DEFAULTS: WorldRegistryConfig = {
  enableValidation: true,
  allowOverride: false,
  maxWorlds: 100,
};

// ============================================================================
// Loader Defaults
// ============================================================================

export const WORLD_LOADER_DEFAULTS: WorldLoaderConfig = {
  retryCount: 2,
  retryDelay: 1000,
  timeout: 10000,
};

// ============================================================================
// Cache Defaults
// ============================================================================

export const WORLD_CACHE_DEFAULTS: WorldCacheConfig = {
  maxSize: 10,
  maxAge: 30 * 60 * 1000, // 30 minutes
  evictionPolicy: "lru",
};

// ============================================================================
// Memory Defaults
// ============================================================================

export const WORLD_MEMORY_DEFAULTS: WorldMemoryConfig = {
  warningThreshold: 50 * 1024 * 1024, // 50MB
  criticalThreshold: 100 * 1024 * 1024, // 100MB
  cleanupInterval: 60 * 1000, // 1 minute
  maxIdleTime: 5 * 60 * 1000, // 5 minutes
};

// ============================================================================
// Asset Manager Defaults
// ============================================================================

export const WORLD_ASSET_MANAGER_DEFAULTS: WorldAssetManagerConfig = {
  maxConcurrent: 6,
  retryCount: 2,
  retryDelay: 500,
  timeout: 15000,
};

// ============================================================================
// Transition Defaults
// ============================================================================

export const WORLD_TRANSITION_DEFAULTS: WorldTransitionConfig = {
  type: "crossfade",
  duration: 600,
  easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  stages: [
    { name: "exit-old", phase: "deactivating", duration: 300 },
    { name: "enter-new", phase: "activating", duration: 300 },
  ],
};

// ============================================================================
// Transition Presets
// ============================================================================

export const WORLD_TRANSITION_PRESETS: Record<string, WorldTransitionConfig> = {
  fade: {
    type: "fade",
    duration: 500,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    stages: [
      { name: "fade-out", phase: "deactivating", duration: 250 },
      { name: "fade-in", phase: "activating", duration: 250 },
    ],
  },
  crossfade: {
    type: "crossfade",
    duration: 600,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    stages: [{ name: "crossfade", phase: "activating", duration: 600 }],
  },
  "slide-up": {
    type: "slide-up",
    duration: 700,
    easing: "cubic-bezier(0.23, 1, 0.32, 1)",
    stages: [
      { name: "slide-out", phase: "deactivating", duration: 350 },
      { name: "slide-in", phase: "activating", duration: 350 },
    ],
  },
  "zoom-in": {
    type: "zoom",
    duration: 800,
    easing: "cubic-bezier(0.23, 1, 0.32, 1)",
    stages: [
      { name: "zoom-out", phase: "deactivating", duration: 400 },
      { name: "zoom-in", phase: "activating", duration: 400 },
    ],
  },
  portal: {
    type: "portal",
    duration: 1000,
    easing: "cubic-bezier(0.23, 1, 0.32, 1)",
    stages: [
      { name: "portal-exit", phase: "deactivating", duration: 500 },
      { name: "portal-enter", phase: "activating", duration: 500 },
    ],
  },
  none: {
    type: "none",
    duration: 0,
    easing: "linear",
    stages: [],
  },
};

// ============================================================================
// Manager Config
// ============================================================================

export const WORLD_MANAGER_DEFAULTS: WorldManagerConfig = {
  registry: WORLD_REGISTRY_DEFAULTS,
  loader: WORLD_LOADER_DEFAULTS,
  cache: WORLD_CACHE_DEFAULTS,
  memory: WORLD_MEMORY_DEFAULTS,
  assetManager: WORLD_ASSET_MANAGER_DEFAULTS,
  autoPreload: false,
  autoCleanup: true,
  debug: false,
};

// ============================================================================
// Performance
// ============================================================================

export const WORLD_PERFORMANCE = {
  /** Max worlds to keep in memory simultaneously */
  maxActiveWorlds: 3,
  /** Delay before suspending idle worlds (ms) */
  suspendIdleDelay: 30000,
  /** Max concurrent asset loads */
  maxConcurrentLoads: 4,
  /** Debounce interval for memory checks (ms) */
  memoryCheckInterval: 5000,
} as const;

// ============================================================================
// Accessibility
// ============================================================================

export const WORLD_A11Y = {
  /** Announce world transitions to screen readers */
  announceTransitions: true,
  /** Manage focus during transitions */
  manageFocus: true,
  /** Restore focus after transition */
  restoreFocus: true,
  /** Focus selector for world content */
  focusSelector: "#main-content",
  /** Live region for announcements */
  liveRegionId: "world-announcer",
  /** Reduced motion transition duration */
  reducedMotionDuration: 0,
} as const;

// ============================================================================
// Error Messages
// ============================================================================

export const WORLD_ERRORS = {
  NOT_FOUND: "World not found",
  ALREADY_REGISTERED: "World is already registered",
  NOT_REGISTERED: "World is not registered",
  LOAD_FAILED: "Failed to load world",
  LOAD_TIMEOUT: "World load timed out",
  INVALID_DEFINITION: "Invalid world definition",
  MAX_WORLDS_REACHED: "Maximum number of worlds reached",
  TRANSITION_IN_PROGRESS: "A world transition is already in progress",
  MEMORY_CRITICAL: "Memory usage critical — triggering cleanup",
  ASSET_LOAD_FAILED: "Failed to load world asset",
  CACHE_FULL: "World cache is full",
  DESTROY_FAILED: "Failed to destroy world instance",
} as const;

// ============================================================================
// Debug
// ============================================================================

export const WORLD_DEBUG = {
  logLifecycle: false,
  logTransitions: false,
  logMemory: false,
  logEvents: false,
  logPerformance: false,
} as const;
