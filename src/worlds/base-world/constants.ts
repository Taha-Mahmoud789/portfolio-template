/**
 * Base World Constants
 *
 * Default values, timing, and configuration for the Base World foundation.
 */

import type {
  BaseWorldPhase,
  BaseWorldState,
  BaseBackgroundVariant,
  BaseContentArea,
  BaseOverlayType,
  BaseTransitionPhase,
} from "./types";

// ============================================================================
// Default State
// ============================================================================

export const BASE_WORLD_DEFAULT_STATE: BaseWorldState = {
  phase: "idle",
  isMounted: false,
  isReady: false,
  isActive: false,
  isTransitioning: false,
  hasError: false,
  error: null,
  theme: "apple",
  worldId: null,
};

// ============================================================================
// Lifecycle Phases
// ============================================================================

export const BASE_WORLD_PHASES: readonly BaseWorldPhase[] = [
  "idle",
  "initializing",
  "ready",
  "active",
  "transitioning-in",
  "transitioning-out",
  "suspended",
  "destroying",
  "error",
] as const;

export const VALID_BASE_WORLD_TRANSITIONS: Record<BaseWorldPhase, readonly BaseWorldPhase[]> = {
  idle: ["initializing", "error"],
  initializing: ["ready", "error"],
  ready: ["active", "transitioning-in", "destroying", "error"],
  active: ["transitioning-out", "suspended", "destroying", "error"],
  "transitioning-in": ["active", "error"],
  "transitioning-out": ["idle", "error"],
  suspended: ["active", "destroying", "error"],
  destroying: ["idle"],
  error: ["idle", "initializing"],
} as const;

// ============================================================================
// Background
// ============================================================================

export const BASE_BACKGROUND_VARIANTS: readonly BaseBackgroundVariant[] = [
  "gradient",
  "image",
  "video",
  "mesh",
  "particle",
  "canvas",
  "three",
  "none",
] as const;

export const DEFAULT_BACKGROUND_CONFIG = {
  type: "gradient" as const,
  value: "linear-gradient(135deg, #09090b 0%, #18181b 50%, #09090b 100%)",
  fallbackColor: "#09090b",
  overlay: {
    color: "#000000",
    opacity: 0,
    blendMode: "normal" as const,
  },
  parallax: false,
};

// ============================================================================
// Content Areas
// ============================================================================

export const BASE_CONTENT_AREAS: readonly BaseContentArea[] = [
  "hero",
  "sections",
  "canvas",
  "floating",
  "overlay",
] as const;

// ============================================================================
// Overlay Types
// ============================================================================

export const BASE_OVERLAY_TYPES: readonly BaseOverlayType[] = [
  "hud",
  "dialog",
  "notification",
  "debug",
] as const;

// ============================================================================
// Transition
// ============================================================================

export const BASE_TRANSITION_PHASES: readonly BaseTransitionPhase[] = [
  "none",
  "entering",
  "entered",
  "exiting",
  "exited",
] as const;

export const BASE_TRANSITION_TIMING = {
  enterDuration: 500,
  exitDuration: 300,
  enterEasing: "cubic-bezier(0.16, 1, 0.3, 1)",
  exitEasing: "cubic-bezier(0.65, 0, 0.35, 1)",
} as const;

// ============================================================================
// Accessibility
// ============================================================================

export const BASE_WORLD_A11Y = {
  landmarkRole: "main",
  skipLinkId: "base-world-skip",
  skipLinkText: "Skip to main content",
  announcementDelay: 100,
  focusRestoreDelay: 100,
} as const;

// ============================================================================
// Performance
// ============================================================================

export const BASE_WORLD_PERFORMANCE = {
  maxRendersPerFrame: 1,
  lazyThreshold: 0.1,
  intersectionRootMargin: "100px",
  transitionFrameBudget: 16,
} as const;

// ============================================================================
// CSS Classes
// ============================================================================

export const BASE_WORLD_CLASSES = {
  root: "base-world",
  header: "base-world__header",
  wrapper: "base-world__wrapper",
  layout: "base-world__layout",
  background: "base-world__background",
  content: "base-world__content",
  overlay: "base-world__overlay",
  transition: "base-world__transition",
  loader: "base-world__loader",
  skipLink: "base-world__skip-link",
} as const;

// ============================================================================
// Timing
// ============================================================================

export const BASE_WORLD_TIMING = {
  mountTimeout: 5000,
  readyTimeout: 10000,
  destroyDelay: 100,
  focusRestoreDelay: 50,
} as const;
