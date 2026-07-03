/**
 * Space Camera — Orbital/Weightless Motion Configuration
 *
 * The cosmos is indifferent. The camera drifts weightlessly.
 * No ground, no horizon, no gravity.
 */

// ============================================================================
// Space Camera Presets
// ============================================================================

export const SPACE_CAMERA_PRESETS: Record<string, SpaceCameraPreset> = {
  // Orbital drift — weightless float
  orbital: {
    sensitivity: 0.3,
    spring: {
      stiffness: 0.8,
      damping: 0.95,
      mass: 1,
    },
    bounds: {
      minX: -5,
      maxX: 5,
      minY: -3,
      maxY: 3,
      minZ: 2,
      maxZ: 10,
    },
  },

  // Focus on constellation — smooth approach
  focus: {
    sensitivity: 0.5,
    spring: {
      stiffness: 1.2,
      damping: 0.9,
      mass: 0.8,
    },
    bounds: {
      minX: -8,
      maxX: 8,
      minY: -5,
      maxY: 5,
      minZ: 1,
      maxZ: 15,
    },
  },

  // Portal transition — dramatic zoom
  portal: {
    sensitivity: 0.8,
    spring: {
      stiffness: 2,
      damping: 0.85,
      mass: 0.6,
    },
    bounds: {
      minX: -10,
      maxX: 10,
      minY: -8,
      maxY: 8,
      minZ: 0.5,
      maxZ: 20,
    },
  },
};

// ============================================================================
// Space Camera Preset Type
// ============================================================================

interface SpaceCameraSpring {
  readonly stiffness: number;
  readonly damping: number;
  readonly mass: number;
}

interface SpaceCameraBounds {
  readonly minX: number;
  readonly maxX: number;
  readonly minY: number;
  readonly maxY: number;
  readonly minZ: number;
  readonly maxZ: number;
}

interface SpaceCameraPreset {
  readonly sensitivity: number;
  readonly spring: SpaceCameraSpring;
  readonly bounds: SpaceCameraBounds;
}

// ============================================================================
// Space Camera State Machine
// ============================================================================

export const SPACE_CAMERA_STATES = {
  idle: {
    transitions: ["orbital", "focus", "portal"],
  },
  orbital: {
    transitions: ["idle", "focus"],
  },
  focus: {
    transitions: ["idle", "orbital"],
  },
  portal: {
    transitions: ["idle"],
  },
} as const;

// ============================================================================
// Space Camera Effects
// ============================================================================

export const SPACE_CAMERA_EFFECTS = {
  // Weightless drift — constant gentle movement
  drift: {
    enabled: true,
    intensity: 0.3,
    speed: 0.1,
    axes: [0, 1, 2] as const,
  },

  // No bob — weightless, no walking
  bob: {
    enabled: false,
  },

  // No sway — no ground contact
  sway: {
    enabled: false,
  },

  // Subtle shake on portal entry
  shake: {
    enabled: false,
    intensity: 0,
    duration: 0,
  },
};

// ============================================================================
// Space Camera Timeline
// ============================================================================

export const SPACE_CAMERA_TIMELINE = {
  sequences: {
    // Hero sequence — emerge from void
    hero: {
      duration: 3000,
      keyframes: [
        { time: 0, position: [0, 0, 8], lookAt: [0, 0, 0] },
        { time: 0.5, position: [0, 0, 5], lookAt: [0, 0, 0] },
        { time: 1, position: [0, 0, 5], lookAt: [0, 0, 0] },
      ],
    },

    // Constellation approach
    constellation: {
      duration: 2000,
      keyframes: [
        { time: 0, position: [0, 0, 5], lookAt: [0, 0, 0] },
        { time: 1, position: [2, 1, 3], lookAt: [2, 1, 0] },
      ],
    },

    // Exit — drift into void
    exit: {
      duration: 2500,
      keyframes: [
        { time: 0, position: [0, 0, 5], lookAt: [0, 0, 0] },
        { time: 1, position: [0, 0, 15], lookAt: [0, 0, 0] },
      ],
    },
  },
};
