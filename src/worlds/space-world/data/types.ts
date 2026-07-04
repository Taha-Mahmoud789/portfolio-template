/**
 * Space World Types
 *
 * All interfaces for the spatial experience system.
 * Changing these types causes TypeScript errors across all systems.
 */

import type { Vector3 as ThreeVector3 } from "three";

// ============================================================================
// World States
// ============================================================================

export type WorldPhase = "intro" | "exploring" | "focused" | "transitioning";

// ============================================================================
// Camera
// ============================================================================

export type CameraMode = "intro" | "overview" | "object-focus";

export interface CameraPreset {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

// ============================================================================
// Object States
// ============================================================================

export type ObjectState = "idle" | "discovered" | "hovered" | "focused" | "selected";

// ============================================================================
// Orbit Groups
// ============================================================================

export type OrbitGroup = "projects" | "technology" | "creative" | "future";

// ============================================================================
// Space Objects
// ============================================================================

export type SpaceObjectType = "project" | "technology" | "creative" | "future";

export interface SpaceObject {
  id: string;
  type: SpaceObjectType;
  orbitGroup: OrbitGroup;
  position: [number, number, number];
  metadata: SpaceObjectMetadata;
  interaction: SpaceObjectInteraction;
  connections: readonly string[];
  visible: boolean;
}

export interface SpaceObjectMetadata {
  title: string;
  subtitle?: string;
  description?: string;
  purpose?: string;
  tags?: readonly string[];
  route?: string;
  liveUrl?: string;
  accentColor: string;
  accentRgb: string;
  icon?: string;
}

export interface SpaceObjectInteraction {
  hover: boolean;
  select: boolean;
  focus: boolean;
  cursor: "pointer" | "default";
}

// ============================================================================
// Connections
// ============================================================================

export interface Connection {
  from: string;
  to: string;
  label?: string;
}

// ============================================================================
// Orbit
// ============================================================================

export interface OrbitConfig {
  id: string;
  group: OrbitGroup;
  label: string;
  radius: number;
  speed: number;
  tilt: number;
  objectIds: readonly string[];
}

// ============================================================================
// Core
// ============================================================================

export interface CoreConfig {
  position: [number, number, number];
  radius: number;
  color: string;
  glowColor: string;
  pulseSpeed: number;
}

// ============================================================================
// Scene Config
// ============================================================================

export interface SpaceSceneConfig {
  core: CoreConfig;
  orbits: readonly OrbitConfig[];
  objects: readonly SpaceObject[];
  connections: readonly Connection[];
  navigation: SpaceNavigation;
}

export interface SpaceNavigation {
  entryObject: string | null;
  exitObject: string | null;
  defaultCameraMode: CameraMode;
  keyboardEnabled: boolean;
  scrollSpeed: number;
  focusOffset: [number, number, number];
  introPosition: [number, number, number];
  overviewPosition: [number, number, number];
  scrollRange: [number, number];
  inertiaDecay: number;
  focusApproachDistance: number;
}

// ============================================================================
// Interaction Events
// ============================================================================

export interface InteractionEvent {
  type: "hover" | "select" | "focus" | "exit";
  objectId: string | null;
  position?: ThreeVector3;
}

// ============================================================================
// Accessibility
// ============================================================================

export interface SpaceAccessibility {
  keyboardEnabled: boolean;
  reducedMotion: boolean;
  screenReaderAnnouncements: boolean;
  fallbackContent: string;
}

// ============================================================================
// Performance
// ============================================================================

export interface SpacePerformance {
  maxPixelRatio: number;
  shadows: boolean;
  antialias: boolean;
  dpr: [number, number];
  frameloop: "always" | "demand" | "never";
}
