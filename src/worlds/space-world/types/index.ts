/**
 * Space World Types
 *
 * Type definitions specific to the Space World.
 * The cosmos is indifferent. The user is a witness.
 */

import type { ReactNode } from "react";
import type { WorldSDKConfig } from "@/sdk/world/types";

// ============================================================================
// Space World Config
// ============================================================================

export type SpaceWorldConfig = WorldSDKConfig;

// ============================================================================
// Constellation System
// ============================================================================

export interface ConstellationPoint {
  readonly x: number;
  readonly y: number;
  readonly brightness: number;
}

export interface Constellation {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly points: readonly ConstellationPoint[];
  readonly lines: readonly [number, number][];
}

// ============================================================================
// Star Field
// ============================================================================

export type StarDepth = "near" | "mid" | "far";

export interface Star {
  readonly id: number;
  readonly x: number;
  readonly y: number;
  readonly size: number;
  readonly depth: StarDepth;
  readonly brightness: number;
  readonly twinkleSpeed: number;
  readonly twinklePhase: number;
  readonly color: string;
}

// ============================================================================
// Depth Layers
// ============================================================================

export type DepthLayer = "void" | "atmosphere" | "stars" | "structure" | "surface" | "floating";

export interface DepthLayerConfig {
  readonly speed: number;
  readonly opacity: number;
  readonly zIndex: number;
}

// ============================================================================
// Cosmic Entities
// ============================================================================

export interface DustParticle {
  readonly id: number;
  readonly x: number;
  readonly y: number;
  readonly size: number;
  readonly opacity: number;
  readonly speed: number;
  readonly angle: number;
}

export interface Nebula {
  readonly id: string;
  readonly gradient: string;
  readonly x: string;
  readonly y: string;
  readonly size: string;
  readonly opacity: number;
  readonly driftSpeed: number;
}

// ============================================================================
// Intent
// ============================================================================

export type ScrollIntent = "fast" | "slow" | "idle";

export interface IntentState {
  readonly velocity: number;
  readonly intent: ScrollIntent;
  readonly lastScrollTime: number;
}

// ============================================================================
// Component Props
// ============================================================================

export interface SpaceWorldProps {
  readonly children?: ReactNode;
  readonly onReady?: () => void;
  readonly onError?: (error: Error) => void;
}

export interface SpaceHeroProps {
  readonly className?: string;
}

export interface SpaceSectionsProps {
  readonly className?: string;
}
