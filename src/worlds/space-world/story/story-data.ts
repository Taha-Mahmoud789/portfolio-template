/**
 * Story Data
 *
 * 5 scenes — Apple Keynote pacing.
 * Philosophy statements, not labels.
 * Each scene: camera move → pause → caption → hold → fade.
 *
 * Total duration: ~35 seconds
 */

import type { StoryScene } from "./types";

export const STORY_SCENES: readonly StoryScene[] = [
  // ─── 01 PHILOSOPHY ───────────────────────────────────────────────────────
  {
    id: "philosophy",
    chapter: 1,
    camera: {
      mode: "overview",
      position: [0, 1.5, 10],
      target: [0, 0, 0],
    },
    caption: {
      primary: "Interfaces should feel alive",
      secondary: "Not just function — but breathe",
      secondaryDelay: 800,
    },
    duration: 7000,
    fadeIn: 600,
    fadeOut: 500,
  },

  // ─── 02 CRAFT ────────────────────────────────────────────────────────────
  {
    id: "craft",
    chapter: 2,
    camera: {
      mode: "overview",
      position: [0, 1, 8],
      target: [0, 0, 0],
    },
    caption: {
      primary: "Built with React, TypeScript, and intention",
      secondary: "Every component earns its place",
      secondaryDelay: 800,
    },
    duration: 7500,
    fadeIn: 500,
    fadeOut: 500,
  },

  // ─── 03 WORK ─────────────────────────────────────────────────────────────
  {
    id: "work",
    chapter: 3,
    camera: {
      mode: "overview",
      position: [3.5, 1.2, 6],
      target: [3.5, 0, 0],
    },
    caption: {
      primary: "Three platforms. One standard.",
      secondary: "Clean code · Real impact · Shipped products",
      secondaryDelay: 800,
    },
    duration: 8000,
    fadeIn: 500,
    fadeOut: 500,
  },

  // ─── 04 VISION ───────────────────────────────────────────────────────────
  {
    id: "vision",
    chapter: 4,
    camera: {
      mode: "overview",
      position: [0, 2, 8],
      target: [2, -2, 0],
    },
    caption: {
      primary: "Motion is not decoration",
      secondary: "It is communication",
      secondaryDelay: 800,
    },
    duration: 7000,
    fadeIn: 500,
    fadeOut: 500,
  },

  // ─── 05 INVITATION ───────────────────────────────────────────────────────
  {
    id: "invitation",
    chapter: 5,
    camera: {
      mode: "overview",
      position: [0, 1.5, 10],
      target: [0, 0, 0],
    },
    caption: {
      primary: "The space is yours to explore",
    },
    duration: 6000,
    fadeIn: 500,
    fadeOut: 1000,
  },
] as const;

export const TOTAL_STORY_DURATION = STORY_SCENES.reduce((sum, s) => sum + s.duration, 0);
