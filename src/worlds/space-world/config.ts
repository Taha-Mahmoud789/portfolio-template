/**
 * Space World Configuration
 *
 * Developer Solar System — a premium, organized experience.
 * Center: Developer Core
 * Orbits: Projects → Code → Creative → Future
 */

import type { WorldSDKConfig } from "@/sdk/world/types";

// ============================================================================
// Space World SDK Config
// ============================================================================

export const SPACE_WORLD_CONFIG: WorldSDKConfig = {
  id: "space-world",
  name: "Solar System",
  description:
    "A developer solar system — identity at the center, projects and skills orbiting in elegant paths.",
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
    author: "Taha Mahmoud",
    version: "2.0.0",
    createdAt: "2026-01-01",
    tags: ["solar-system", "planets", "developer", "interactive", "premium"],
    category: "cosmic",
    featured: true,
  },
};

// ============================================================================
// Constellation Definitions — decorative spatial guides
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
] as const;
