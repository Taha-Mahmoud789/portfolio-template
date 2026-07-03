/**
 * Space World Configuration
 *
 * The cosmos is indifferent. The user is a witness.
 * Every element exists on the near side of the event horizon.
 */

import type { WorldSDKConfig } from "@/sdk/world/types";

// ============================================================================
// Space World SDK Config
// ============================================================================

export const SPACE_WORLD_CONFIG: WorldSDKConfig = {
  id: "space-world",
  name: "Space World",
  description:
    "The cosmos is indifferent. You are a witness, not a protagonist. Time dilates at 0.3x velocity.",
  theme: "space",
  route: "/worlds/space",

  layout: {
    type: "fullscreen",
    fullscreen: true,
  },

  animationPreset: "none",
  transitionPreset: "zoom-in",

  background: {
    type: "gradient",
    value: "linear-gradient(180deg, #030712 0%, #0a0f1e 30%, #1e1b4b 60%, #030712 100%)",
    fallbackColor: "#030712",
    parallax: true,
  },

  status: "active",

  permissions: {
    requiresAuth: false,
    requiresConsent: false,
    allowedRoles: [],
    geoRestrictions: [],
  },

  metadata: {
    author: "Frontend Multiverse",
    version: "1.0.0",
    createdAt: "2026-01-01",
    tags: ["space", "cosmic", "stellar", "dark", "void", "constellation"],
    category: "cosmic",
    featured: true,
  },
};

// ============================================================================
// Constellation Definitions
// ============================================================================

export const CONSTELLATIONS = [
  {
    id: "compass",
    name: "The Compass",
    description: "Always points toward what matters",
    points: [
      { x: 15, y: 20, brightness: 0.6 },
      { x: 20, y: 15, brightness: 0.4 },
      { x: 25, y: 22, brightness: 0.5 },
      { x: 18, y: 30, brightness: 0.3 },
    ],
    lines: [
      [0, 1],
      [1, 2],
      [0, 3],
    ],
  },
  {
    id: "voyager",
    name: "The Voyager",
    description: "Moving toward the edge of the map",
    points: [
      { x: 70, y: 10, brightness: 0.5 },
      { x: 75, y: 18, brightness: 0.4 },
      { x: 80, y: 12, brightness: 0.6 },
      { x: 78, y: 25, brightness: 0.3 },
      { x: 85, y: 20, brightness: 0.4 },
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 4],
      [1, 3],
    ],
  },
  {
    id: "beacon",
    name: "The Beacon",
    description: "A signal in the void",
    points: [
      { x: 45, y: 40, brightness: 0.7 },
      { x: 50, y: 35, brightness: 0.5 },
      { x: 55, y: 42, brightness: 0.4 },
    ],
    lines: [
      [0, 1],
      [1, 2],
    ],
  },
  {
    id: "frontier",
    name: "The Frontier",
    description: "The edge of known space",
    points: [
      { x: 85, y: 60, brightness: 0.4 },
      { x: 90, y: 55, brightness: 0.5 },
      { x: 92, y: 65, brightness: 0.3 },
      { x: 88, y: 70, brightness: 0.4 },
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
  },
  {
    id: "relay",
    name: "The Relay",
    description: "Passing messages between stars",
    points: [
      { x: 30, y: 70, brightness: 0.5 },
      { x: 35, y: 65, brightness: 0.4 },
      { x: 40, y: 72, brightness: 0.6 },
      { x: 38, y: 78, brightness: 0.3 },
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
  },
  {
    id: "anchor",
    name: "The Anchor",
    description: "Holding position against the current",
    points: [
      { x: 60, y: 80, brightness: 0.4 },
      { x: 65, y: 75, brightness: 0.5 },
      { x: 62, y: 85, brightness: 0.3 },
    ],
    lines: [
      [0, 1],
      [0, 2],
    ],
  },
  {
    id: "void",
    name: "The Void",
    description: "An absence that defines everything around it",
    points: [
      { x: 10, y: 50, brightness: 0.2 },
      { x: 15, y: 45, brightness: 0.15 },
      { x: 12, y: 55, brightness: 0.1 },
    ],
    lines: [
      [0, 1],
      [1, 2],
    ],
  },
] as const;

// ============================================================================
// Depth Layer Speeds
// ============================================================================

export const DEPTH_LAYERS = {
  void: { speed: 0.1, opacity: 1.0, zIndex: 0 },
  atmosphere: { speed: 0.2, opacity: 0.95, zIndex: 1 },
  stars: { speed: 0.3, opacity: 0.9, zIndex: 2 },
  structure: { speed: 0.6, opacity: 1.0, zIndex: 3 },
  surface: { speed: 0.85, opacity: 1.0, zIndex: 4 },
  floating: { speed: 1.0, opacity: 1.0, zIndex: 5 },
} as const;

// ============================================================================
// Motion Timing
// ============================================================================

export const SPACE_MOTION_TIMING = {
  microFeedback: 180,
  hoverResponse: 350,
  elementEntrance: 750,
  sceneTransition: 1200,
  worldTransition: 2400,
  ambientDrift: { min: 8000, max: 15000 },
  scrollParallax: { lerpMin: 0.02, lerpMax: 0.08 },
} as const;

// ============================================================================
// Cursor
// ============================================================================

export const SPACE_CURSOR = {
  defaultSize: 8,
  hoverSize: 24,
  clickSize: 6,
  color: "rgba(226, 232, 240, 0.9)",
  borderColor: "rgba(226, 232, 240, 0.5)",
  blendMode: "screen" as const,
} as const;

// ============================================================================
// Star Field Config
// ============================================================================

export const STAR_FIELD_CONFIG = {
  density: 120,
  depthLayers: {
    near: {
      count: 20,
      sizeMin: 1,
      sizeMax: 3,
      brightnessMin: 0.7,
      brightnessMax: 1.0,
      twinkleMin: 1,
      twinkleMax: 2,
      color: "#ffffff",
    },
    mid: {
      count: 50,
      sizeMin: 0.5,
      sizeMax: 1.5,
      brightnessMin: 0.4,
      brightnessMax: 0.7,
      twinkleMin: 0.5,
      twinkleMax: 1,
      color: "#e2e8f0",
    },
    far: {
      count: 50,
      sizeMin: 0.3,
      sizeMax: 0.8,
      brightnessMin: 0.15,
      brightnessMax: 0.4,
      twinkleMin: 0,
      twinkleMax: 0.3,
      color: "#94a3b8",
    },
  },
  galacticCenter: { x: 0.7, y: 0.8 },
} as const;

// ============================================================================
// Dust Field Config
// ============================================================================

export const DUST_FIELD_CONFIG = {
  count: 50,
  sizeMin: 1,
  sizeMax: 2,
  color: "rgba(99, 102, 241, 0.15)",
  speedMin: 0.5,
  speedMax: 1.0,
  blendMode: "screen" as const,
} as const;
