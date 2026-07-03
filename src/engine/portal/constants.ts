import type {
  PortalConfig,
  PortalAnimationPreset,
  PortalTransitionPreset,
  PortalStatus,
} from "./types";

// ============================================================================
// Portal Grid Defaults
// ============================================================================

export const PORTAL_GRID_DEFAULTS: PortalConfig["grid"] = {
  columns: 3,
  gap: "1.5rem",
  minCardWidth: "280px",
  maxCardWidth: "420px",
  aspectRatio: "4 / 3",
  responsive: {
    mobile: { gap: "1rem", minCardWidth: "100%" },
    tablet: { gap: "1.25rem", minCardWidth: "240px" },
    desktop: { gap: "1.5rem", minCardWidth: "280px" },
    ultraWide: { gap: "2rem", minCardWidth: "320px" },
  },
};

// ============================================================================
// Portal Interaction Defaults
// ============================================================================

export const PORTAL_INTERACTION_DEFAULTS: PortalConfig["interaction"] = {
  hover: { enabled: true, scale: 1.03, lift: 8, duration: 0.3 },
  focus: {
    enabled: true,
    ringColor: "rgba(59, 130, 246, 0.5)",
    ringWidth: 2,
    ringOffset: 2,
  },
  magnetic: { enabled: true, strength: 0.15, range: 120 },
  depth: { enabled: true, perspective: 800, maxRotate: 5 },
  glow: { enabled: true, spread: 20, intensity: 0.4 },
};

// ============================================================================
// Portal Animation Presets — single source of truth
// ============================================================================

interface PortalAnimConfig {
  entrance: Record<string, number | string>;
  idle: Record<string, number | string>;
  hover: Record<string, number | string>;
  selected: Record<string, number | string>;
}

export const PORTAL_ANIMATION_PRESETS: Record<PortalAnimationPreset, PortalAnimConfig> = {
  fade: {
    entrance: { opacity: 0 },
    idle: { opacity: 1 },
    hover: { opacity: 0.92 },
    selected: { opacity: 1, scale: 1.02 },
  },
  slide: {
    entrance: { y: 40, opacity: 0 },
    idle: { y: 0, opacity: 1 },
    hover: { y: -4 },
    selected: { y: -2, scale: 1.02 },
  },
  scale: {
    entrance: { scale: 0.8, opacity: 0 },
    idle: { scale: 1, opacity: 1 },
    hover: { scale: 1.03 },
    selected: { scale: 1.05 },
  },
  rotate: {
    entrance: { rotate: -5, scale: 0.9, opacity: 0 },
    idle: { rotate: 0, scale: 1, opacity: 1 },
    hover: { rotate: 1, scale: 1.02 },
    selected: { rotate: 0, scale: 1.04 },
  },
  morph: {
    entrance: { borderRadius: 24, scale: 0.6, opacity: 0 },
    idle: { borderRadius: 16, scale: 1, opacity: 1 },
    hover: { borderRadius: 20, scale: 1.02 },
    selected: { borderRadius: 24, scale: 1.05 },
  },
  glitch: {
    entrance: { x: -5, opacity: 0 },
    idle: { x: 0, opacity: 1 },
    hover: { x: -2 },
    selected: { x: 0, scale: 1.03 },
  },
  bloom: {
    entrance: { filter: "blur(10px) brightness(2)", opacity: 0 },
    idle: { filter: "blur(0px) brightness(1)", opacity: 1 },
    hover: { filter: "blur(0px) brightness(1.1)" },
    selected: { filter: "blur(0px) brightness(1.15)", scale: 1.02 },
  },
  wave: {
    entrance: { rotateX: 15, y: 30, opacity: 0 },
    idle: { rotateX: 0, y: 0, opacity: 1 },
    hover: { rotateX: -2, y: -3 },
    selected: { rotateX: -1, y: -2, scale: 1.02 },
  },
};

// ============================================================================
// Portal Transition Presets — single source of truth
// ============================================================================

export const PORTAL_TRANSITION_PRESETS: Record<
  PortalTransitionPreset,
  { type: string; duration: number; easing: string; stages: string[] }
> = {
  "zoom-in": {
    type: "zoom",
    duration: 1400,
    easing: "cubic-bezier(0.23, 1, 0.32, 1)",
    stages: ["selection", "expansion", "world-loading", "world-entry"],
  },
  "slide-up": {
    type: "slide-up",
    duration: 1200,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    stages: ["selection", "scene-transition", "world-loading", "world-entry"],
  },
  "morph-expand": {
    type: "morph",
    duration: 1500,
    easing: "cubic-bezier(0.23, 1, 0.32, 1)",
    stages: ["selection", "expansion", "scene-transition", "world-entry"],
  },
  dissolve: {
    type: "fade",
    duration: 1000,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    stages: ["selection", "scene-transition", "world-entry"],
  },
  iris: {
    type: "iris",
    duration: 1300,
    easing: "cubic-bezier(0.23, 1, 0.32, 1)",
    stages: ["selection", "expansion", "world-loading", "world-entry"],
  },
  "page-turn": {
    type: "page-turn",
    duration: 1600,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    stages: ["selection", "scene-transition", "world-loading", "world-entry"],
  },
  "particle-burst": {
    type: "particle",
    duration: 1400,
    easing: "cubic-bezier(0.23, 1, 0.32, 1)",
    stages: ["selection", "expansion", "scene-transition", "world-entry"],
  },
  none: { type: "none", duration: 0, easing: "linear", stages: [] },
};

// ============================================================================
// Portal Status Defaults
// ============================================================================

export const PORTAL_STATUS_DEFAULTS: Record<
  PortalStatus,
  { interactive: boolean; opacity: number; tabIndex: 0 | -1 }
> = {
  active: { interactive: true, opacity: 1, tabIndex: 0 },
  "coming-soon": { interactive: false, opacity: 0.6, tabIndex: -1 },
  disabled: { interactive: false, opacity: 0.4, tabIndex: -1 },
  locked: { interactive: false, opacity: 0.5, tabIndex: -1 },
};

// ============================================================================
// Portal Config
// ============================================================================

export const PORTAL_CONFIG_DEFAULTS: PortalConfig = {
  grid: PORTAL_GRID_DEFAULTS,
  interaction: PORTAL_INTERACTION_DEFAULTS,
  transition: {
    type: "portal",
    duration: 1400,
    easing: "cubic-bezier(0.23, 1, 0.32, 1)",
  },
  performance: {
    lazyRender: true,
    memoizePortals: true,
    gpuAnimations: true,
    preventLayoutShift: true,
  },
  accessibility: {
    keyboardNavigation: true,
    ariaLabels: true,
    focusRings: true,
    screenReader: true,
    reducedMotion: true,
  },
};

// ============================================================================
// Portal A11y
// ============================================================================

export const PORTAL_A11Y = {
  GRID_ROLE: "grid",
  GRID_LABEL: "World portals",
  CARD_ROLE: "gridcell",
  CARD_LABEL: "{title} world portal",
  ACTIVATION_ANNOUNCE: "Entering {title} world",
  SELECTION_ANNOUNCE: "Selected {title} world",
  STATUS_ANNOUNCE: "{title} is {status}",
  KEYBOARD_HINT: "Press Enter to enter this world, Tab to navigate between portals",
} as const;

// ============================================================================
// Portal Storage
// ============================================================================

export const PORTAL_STORAGE_KEY = "fm-portal-system";
