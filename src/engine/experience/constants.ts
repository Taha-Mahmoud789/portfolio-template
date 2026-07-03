/**
 * Experience Engine Constants
 *
 * Default values, configuration, and magic numbers for the Experience Engine.
 */

import type {
  GestureConfig,
  InputManagerConfig,
  PointerManagerConfig,
  GestureManagerConfig,
  FocusManagerConfig,
  HoverManagerConfig,
  SceneManagerConfig,
  InteractionState,
  CursorState,
  PointerPosition,
  PointerVelocity,
} from "./types";

// ============================================================================
// Engine Defaults
// ============================================================================

export const EXPERIENCE_STORAGE_KEY = "fm-experience";

// ============================================================================
// Input Defaults
// ============================================================================

export const INPUT_DEFAULTS: InputManagerConfig = {
  keyboard: true,
  wheel: true,
  passive: true,
};

// ============================================================================
// Pointer Defaults
// ============================================================================

export const POINTER_DEFAULTS: PointerManagerConfig = {
  hover: true,
  magnetic: true,
  drag: true,
  velocity: true,
  velocitySampleSize: 5,
  moveThrottle: 16,
};

export const DEFAULT_POINTER_POSITION: PointerPosition = {
  x: 0,
  y: 0,
  normalizedX: 0.5,
  normalizedY: 0.5,
};

export const DEFAULT_POINTER_VELOCITY: PointerVelocity = {
  x: 0,
  y: 0,
  magnitude: 0,
  angle: 0,
};

// ============================================================================
// Gesture Defaults
// ============================================================================

export const GESTURE_CONFIG: GestureConfig = {
  tapThreshold: 10,
  tapTimeout: 300,
  longPressDelay: 500,
  swipeThreshold: 50,
  swipeTimeout: 300,
  pinchThreshold: 0.1,
  rotateThreshold: 15,
};

export const GESTURE_DEFAULTS: GestureManagerConfig = {
  ...GESTURE_CONFIG,
  enabled: true,
  preventDefault: true,
};

// ============================================================================
// Focus Defaults
// ============================================================================

export const FOCUS_DEFAULTS: FocusManagerConfig = {
  mainContentSelector: "#main-content",
  skipLinkSelector: "#skip-link",
  focusDelay: 100,
  trapFocus: true,
};

// ============================================================================
// Hover Defaults
// ============================================================================

export const HOVER_DEFAULTS: HoverManagerConfig = {
  enterDelay: 0,
  leaveDelay: 100,
  touchSupport: false,
};

// ============================================================================
// Scene Defaults
// ============================================================================

export const SCENE_DEFAULTS: SceneManagerConfig = {
  defaultScene: "main",
  transitionDuration: 300,
};

// ============================================================================
// Interaction States
// ============================================================================

export const INTERACTION_STATES: readonly InteractionState[] = [
  "idle",
  "hover",
  "pressed",
  "focused",
  "dragging",
  "scrolling",
  "loading",
  "transitioning",
] as const;

// ============================================================================
// Cursor States
// ============================================================================

export const CURSOR_STATES: readonly CursorState[] = [
  "default",
  "pointer",
  "grab",
  "grabbing",
  "crosshair",
  "wait",
  "text",
  "move",
  "not-allowed",
  "zoom-in",
  "zoom-out",
  "custom",
] as const;

export const INTERACTION_CURSOR_MAP: Record<InteractionState, CursorState> = {
  idle: "default",
  hover: "pointer",
  pressed: "grabbing",
  focused: "default",
  dragging: "grabbing",
  scrolling: "default",
  loading: "wait",
  transitioning: "default",
};

// ============================================================================
// Keyboard Keys
// ============================================================================

/**
 * Comprehensive focusable element selectors.
 * Includes ARIA roles and contenteditable for full keyboard accessibility.
 */
export const FOCUSABLE_SELECTORS = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
  '[role="button"]',
  '[role="link"]',
  '[role="tab"]',
  '[role="menuitem"]',
  '[role="option"]',
  '[role="switch"]',
  '[role="checkbox"]',
  '[role="radio"]',
  '[contenteditable="true"]',
].join(", ");

/**
 * Keyboard gesture equivalents.
 * Maps keyboard keys to gesture types for accessibility.
 */
export const KEYBOARD_GESTURES = {
  tap: ["Enter", " "],
  swipeUp: ["ArrowUp"],
  swipeDown: ["ArrowDown"],
  swipeLeft: ["ArrowLeft"],
  swipeRight: ["ArrowRight"],
  zoomIn: ["+", "="],
  zoomOut: ["-"],
  cancel: ["Escape"],
} as const;

// ============================================================================
// Performance
// ============================================================================

export const PERFORMANCE = {
  /** Max event listeners per event type */
  maxListeners: 50,
  /** Throttle interval for pointer move (ms) */
  pointerMoveThrottle: 16,
  /** Throttle interval for scroll (ms) */
  scrollThrottle: 16,
  /** Debounce interval for resize (ms) */
  resizeDebounce: 150,
  /** Max drag distance before drag is cancelled (px) */
  maxDragDistance: 1000,
  /** How often to refresh magnetic target bounding rects (ms) */
  magneticRectRefreshInterval: 200,
} as const;

// ============================================================================
// Accessibility
// ============================================================================

export const A11Y = {
  /** Reduced motion media query */
  REDUCED_MOTION_QUERY: "(prefers-reduced-motion: reduce)",
  /** High contrast media query */
  HIGH_CONTRAST_QUERY: "(prefers-contrast: high)",
  /** Screen reader only class */
  SR_ONLY_CLASS: "sr-only",
  /** Live region for announcements */
  LIVE_REGION_ID: "experience-announcer",
  /** Default reduced motion transition duration */
  REDUCED_MOTION_DURATION: 0,
} as const;
