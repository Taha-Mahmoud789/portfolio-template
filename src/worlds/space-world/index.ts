/**
 * Space World
 *
 * The cosmos is indifferent. The user is a witness.
 * Built on Base World foundation with Three.js scene.
 */

// ============================================================================
// Types
// ============================================================================
export type {
  SpaceWorldConfig,
  ConstellationPoint,
  Constellation,
  StarDepth,
  Star,
  DepthLayer,
  DepthLayerConfig,
  DustParticle,
  Nebula,
  ScrollIntent,
  IntentState,
  SpaceWorldProps,
  SpaceHeroProps,
  SpaceSectionsProps,
} from "./types";

// ============================================================================
// Config
// ============================================================================
export {
  SPACE_WORLD_CONFIG,
  CONSTELLATIONS,
  DEPTH_LAYERS,
  SPACE_MOTION_TIMING,
  SPACE_CURSOR,
  STAR_FIELD_CONFIG,
  DUST_FIELD_CONFIG,
} from "./config";

// ============================================================================
// Scene (Three.js)
// ============================================================================
export {
  SpaceScene,
  DeepSpace,
  Galaxy,
  StarField,
  NebulaCloud,
  Planets,
  ConstellationLines,
  CosmicDust,
  SpaceEnvironment,
} from "./scene";

// ============================================================================
// Camera
// ============================================================================
export {
  SPACE_CAMERA_PRESETS,
  SPACE_CAMERA_STATES,
  SPACE_CAMERA_EFFECTS,
  SPACE_CAMERA_TIMELINE,
} from "./camera/space-camera";

// ============================================================================
// Components
// ============================================================================
export { SpaceWorld } from "./components/space-world";
export { SpaceHero } from "./components/space-hero";
export { SpaceSections } from "./components/space-sections";

// ============================================================================
// Hooks
// ============================================================================
export {
  useSpaceWorld,
  useStarField,
  useDustField,
  useConstellations,
  useDepthLayer,
  useScrollIntent,
  useReducedMotion,
} from "./hooks";
