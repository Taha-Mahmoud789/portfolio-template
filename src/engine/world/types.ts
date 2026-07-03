/**
 * World Engine Types
 *
 * Core type definitions for the World Engine.
 * Covers world definitions, lifecycle, state, events, and all subsystem interfaces.
 */

import type { ComponentType, ReactNode } from "react";
import type { ThemeId } from "@/engine/theme/types";
import type { TransitionType } from "@/engine/navigation/types";
import type { WorldId } from "@/types/world";

export type { WorldId } from "@/types/world";

// ============================================================================
// World Identity
// ============================================================================

export type WorldStatus = "active" | "coming-soon" | "disabled" | "maintenance";

export type WorldLifecyclePhase =
  | "unregistered"
  | "registered"
  | "preloading"
  | "preloaded"
  | "loading"
  | "loaded"
  | "mounting"
  | "mounted"
  | "activating"
  | "active"
  | "suspending"
  | "suspended"
  | "resuming"
  | "deactivating"
  | "inactive"
  | "unloading"
  | "unloaded"
  | "destroying"
  | "destroyed"
  | "error";

// ============================================================================
// World Definition
// ============================================================================

export interface WorldDefinition {
  id: WorldId;
  slug: string;
  name: string;
  description: string;
  theme: ThemeId;
  layout: WorldLayoutConfig;
  animationPreset: WorldAnimationPreset;
  transitionPreset: WorldTransitionPreset;
  background: WorldBackground;
  entrySequence: WorldSequence;
  exitSequence: WorldSequence;
  assets: WorldAssets;
  status: WorldStatus;
  permissions: WorldPermissions;
  metadata: WorldMetadata;
}

// ============================================================================
// World Layout
// ============================================================================

export type WorldLayoutType =
  "centered" | "sidebar" | "split" | "fullscreen" | "immersive" | "bento" | "dashboard" | "custom";

export interface WorldLayoutConfig {
  type: WorldLayoutType;
  component?: ComponentType<{ children: ReactNode }>;
  sidebar?: {
    position: "left" | "right";
    width: string;
    collapsible: boolean;
  };
  fullscreen?: boolean;
}

// ============================================================================
// World Animation
// ============================================================================

export type WorldAnimationPreset =
  | "fade"
  | "slide"
  | "scale"
  | "rotate"
  | "morph"
  | "glitch"
  | "bloom"
  | "wave"
  | "cinematic"
  | "none";

export type WorldTransitionPreset =
  | "zoom-in"
  | "slide-up"
  | "morph-expand"
  | "dissolve"
  | "iris"
  | "page-turn"
  | "particle-burst"
  | "crossfade"
  | "none";

// ============================================================================
// World Background
// ============================================================================

export type WorldBackgroundType =
  "gradient" | "image" | "video" | "mesh" | "particle" | "canvas" | "three" | "none";

export interface WorldBackground {
  type: WorldBackgroundType;
  value: string;
  fallbackColor: string;
  overlay?: {
    color: string;
    opacity: number;
    blendMode?: string;
  };
  parallax?: boolean;
}

// ============================================================================
// World Sequence
// ============================================================================

export interface WorldSequence {
  steps: WorldSequenceStep[];
  duration: number;
  easing: string;
  interruptible: boolean;
}

export interface WorldSequenceStep {
  id: string;
  type: "fade" | "slide" | "scale" | "rotate" | "custom";
  target?: string;
  from: Record<string, number | string>;
  to: Record<string, number | string>;
  duration: number;
  delay: number;
  easing?: string;
}

// ============================================================================
// World Assets
// ============================================================================

export interface WorldAssets {
  images: WorldAsset[];
  fonts: WorldAsset[];
  scripts: WorldAsset[];
  styles: WorldAsset[];
  models: WorldAsset[];
  audio: WorldAsset[];
  video: WorldAsset[];
}

export interface WorldAsset {
  id: string;
  url: string;
  type: string;
  size?: number;
  preload: boolean;
  lazy: boolean;
  integrity?: string;
}

// ============================================================================
// World Permissions
// ============================================================================

export interface WorldPermissions {
  requiresAuth: boolean;
  requiresConsent: boolean;
  allowedRoles: string[];
  geoRestrictions: string[];
}

// ============================================================================
// World Metadata
// ============================================================================

export interface WorldMetadata {
  author: string;
  version: string;
  createdAt: string;
  updatedAt?: string;
  tags: string[];
  category: string;
  featured: boolean;
  thumbnail?: string;
  icon?: string;
}

// ============================================================================
// World State
// ============================================================================

export interface WorldInstanceState {
  worldId: WorldId;
  phase: WorldLifecyclePhase;
  isLoaded: boolean;
  isMounted: boolean;
  isActive: boolean;
  isSuspended: boolean;
  hasError: boolean;
  error: Error | null;
  loadedAt: number | null;
  activatedAt: number | null;
  suspendedAt: number | null;
  memoryUsage: number;
}

export interface WorldEngineState {
  currentWorldId: WorldId | null;
  previousWorldId: WorldId | null;
  loadingWorldId: WorldId | null;
  transitioning: boolean;
  transitionType: TransitionType;
  worldInstances: Map<WorldId, WorldInstanceState>;
  registeredWorlds: Map<WorldId, WorldDefinition>;
  readyWorlds: Set<WorldId>;
  cachedWorlds: Set<WorldId>;
  totalMemoryUsage: number;
  isInitialized: boolean;
}

// ============================================================================
// World Engine Actions
// ============================================================================

export interface WorldEngineActions {
  initialize: () => void;
  destroy: () => void;

  register: (definition: WorldDefinition) => void;
  registerAll: (definitions: WorldDefinition[]) => void;
  unregister: (worldId: WorldId) => void;

  preload: (worldId: WorldId) => Promise<void>;
  preloadAll: () => Promise<void>;

  load: (worldId: WorldId) => Promise<ComponentType>;
  unload: (worldId: WorldId) => Promise<void>;

  mount: (worldId: WorldId) => void;
  unmount: (worldId: WorldId) => void;

  activate: (worldId: WorldId) => Promise<void>;
  deactivate: (worldId: WorldId) => void;

  suspend: (worldId: WorldId) => void;
  resume: (worldId: WorldId) => void;

  transition: (worldId: WorldId, type?: TransitionType) => Promise<void>;
  cancelTransition: () => void;

  getWorld: (worldId: WorldId) => WorldDefinition | undefined;
  getWorlds: () => WorldDefinition[];
  getWorldState: (worldId: WorldId) => WorldInstanceState | undefined;
  isWorldReady: (worldId: WorldId) => boolean;
  isWorldCached: (worldId: WorldId) => boolean;

  setError: (worldId: WorldId, error: Error) => void;
  clearError: (worldId: WorldId) => void;
}

// ============================================================================
// World Store
// ============================================================================

export type WorldStore = WorldEngineState & WorldEngineActions;

// ============================================================================
// World Registry
// ============================================================================

export interface WorldRegistryEntry {
  definition: WorldDefinition;
  registeredAt: number;
  index: number;
}

export interface WorldRegistryConfig {
  enableValidation: boolean;
  allowOverride: boolean;
  maxWorlds: number;
}

// ============================================================================
// World Cache
// ============================================================================

export interface WorldCacheEntry {
  worldId: WorldId;
  component: ComponentType;
  module: unknown;
  cachedAt: number;
  accessCount: number;
  lastAccessedAt: number;
  memoryEstimate: number;
}

export interface WorldCacheConfig {
  maxSize: number;
  maxAge: number;
  evictionPolicy: "lru" | "lfu" | "fifo";
}

// ============================================================================
// World Loader
// ============================================================================

export type WorldModuleLoader = () => Promise<{
  default: ComponentType;
  WorldConfig?: WorldDefinition;
}>;

export interface WorldLoaderConfig {
  retryCount: number;
  retryDelay: number;
  timeout: number;
  fallback?: ComponentType;
}

export interface WorldLoaderResult {
  component: ComponentType;
  module: unknown;
  loadTime: number;
}

// ============================================================================
// World Events
// ============================================================================

export type WorldEventType =
  | "world:registered"
  | "world:unregistered"
  | "world:preloading"
  | "world:preloaded"
  | "world:loading"
  | "world:loaded"
  | "world:mounting"
  | "world:mounted"
  | "world:activating"
  | "world:active"
  | "world:suspending"
  | "world:suspended"
  | "world:resuming"
  | "world:deactivating"
  | "world:inactive"
  | "world:unloading"
  | "world:unloaded"
  | "world:destroying"
  | "world:destroyed"
  | "world:error"
  | "world:transition-start"
  | "world:transition-end"
  | "world:memory-warning"
  | "world:memory-cleanup"
  | "world:asset-preloaded"
  | "world:asset-error";

export interface WorldEvent {
  type: WorldEventType;
  worldId: WorldId;
  timestamp: number;
  data?: unknown;
  error?: Error;
}

export type WorldEventCallback = (event: WorldEvent) => void;
export type WorldEventUnsubscribe = () => void;

// ============================================================================
// World Transition Manager
// ============================================================================

export interface WorldTransitionConfig {
  type: TransitionType;
  duration: number;
  easing: string;
  stages: WorldTransitionStage[];
}

export interface WorldTransitionStage {
  name: string;
  phase: WorldLifecyclePhase;
  duration: number;
}

export interface WorldTransitionState {
  isTransitioning: boolean;
  fromWorldId: WorldId | null;
  toWorldId: WorldId | null;
  progress: number;
  currentStage: string;
  type: TransitionType;
}

// ============================================================================
// World Asset Manager
// ============================================================================

export interface WorldAssetManagerConfig {
  maxConcurrent: number;
  retryCount: number;
  retryDelay: number;
  timeout: number;
}

export interface WorldAssetLoadState {
  total: number;
  loaded: number;
  failed: number;
  progress: number;
}

// ============================================================================
// World Memory Manager
// ============================================================================

export interface WorldMemoryConfig {
  warningThreshold: number;
  criticalThreshold: number;
  cleanupInterval: number;
  maxIdleTime: number;
}

export interface WorldMemoryStats {
  totalUsage: number;
  worldUsages: Map<WorldId, number>;
  gcCount: number;
  lastCleanup: number;
}

// ============================================================================
// World Error Boundary
// ============================================================================

export interface WorldErrorBoundaryProps {
  worldId: WorldId;
  children: ReactNode;
  fallback?: ReactNode | ComponentType<{ error: Error; reset: () => void }>;
  onError?: (error: Error, worldId: WorldId) => void;
}

export interface WorldErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// ============================================================================
// World Validator
// ============================================================================

export interface WorldValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// ============================================================================
// World Metadata Manager
// ============================================================================

export interface WorldMeta {
  title: string;
  description: string;
  ogImage?: string;
  keywords: string[];
  canonical?: string;
}

// ============================================================================
// Hook Types
// ============================================================================

export interface UseWorldReturn {
  world: WorldDefinition | undefined;
  state: WorldInstanceState | undefined;
  isLoading: boolean;
  isLoaded: boolean;
  isActive: boolean;
  isSuspended: boolean;
  hasError: boolean;
  error: Error | null;
}

export interface UseWorldLoaderReturn {
  load: () => Promise<ComponentType>;
  preload: () => Promise<void>;
  unload: () => Promise<void>;
  isLoaded: boolean;
  isLoading: boolean;
  error: Error | null;
}

export interface UseWorldTransitionReturn {
  transition: (worldId: WorldId, type?: TransitionType) => Promise<void>;
  cancel: () => void;
  isTransitioning: boolean;
  progress: number;
  fromWorldId: WorldId | null;
  toWorldId: WorldId | null;
}

export interface UseWorldEventsReturn {
  subscribe: (type: WorldEventType, callback: WorldEventCallback) => WorldEventUnsubscribe;
  on: (type: WorldEventType, callback: WorldEventCallback) => WorldEventUnsubscribe;
}

// ============================================================================
// World Manager Config
// ============================================================================

export interface WorldManagerConfig {
  registry: Partial<WorldRegistryConfig>;
  loader: Partial<WorldLoaderConfig>;
  cache: Partial<WorldCacheConfig>;
  memory: Partial<WorldMemoryConfig>;
  assetManager: Partial<WorldAssetManagerConfig>;
  autoPreload: boolean;
  autoCleanup: boolean;
  debug: boolean;
}
