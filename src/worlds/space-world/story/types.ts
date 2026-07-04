/**
 * Story Mode Types
 *
 * Types for the cinematic journey system.
 * Extends existing Space World types — does not replace them.
 */

import type { CameraMode } from "../data/types";

// ============================================================================
// Story Scenes
// ============================================================================

export interface StoryScene {
  readonly id: string;
  readonly chapter: number;
  readonly camera: {
    readonly mode: CameraMode;
    readonly position: [number, number, number];
    readonly target: [number, number, number];
    readonly focusObjectId?: string;
  };
  readonly caption: {
    readonly primary: string;
    readonly secondary?: string;
    readonly secondaryDelay?: number;
  };
  readonly duration: number;
  readonly fadeIn?: number;
  readonly fadeOut?: number;
}

// ============================================================================
// Story State
// ============================================================================

export type StoryPhase = "idle" | "playing" | "paused" | "completed";

export interface StoryState {
  readonly phase: StoryPhase;
  readonly currentScene: number;
  readonly totalScenes: number;
  readonly elapsed: number;
  readonly sceneElapsed: number;
}

// ============================================================================
// Story Controls
// ============================================================================

export interface StoryControls {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  previous: () => void;
  exit: () => void;
  skipTo: (index: number) => void;
}
