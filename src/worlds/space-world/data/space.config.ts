/**
 * Space Scene Configuration — Developer Solar System
 *
 * Center: Developer Core (identity sphere)
 * Orbits: Projects → Code → Creative → Future
 * Each orbit has a planet with moons (project previews).
 *
 * Inspired by bobbyroe/solar-system — premium, not astronomy.
 */

import type {
  SpaceSceneConfig,
  SpaceObject,
  Connection,
  CameraPreset,
  CameraMode,
  SpaceAccessibility,
  SpacePerformance,
} from "./types";

// ============================================================================
// Core — Developer Identity (center of the solar system)
// ============================================================================

export const CORE = {
  position: [0, 0, 0] as [number, number, number],
  radius: 0.8,
  color: "#C9A96E",
  glowColor: "#f5f0e8",
  pulseSpeed: 0.6,
} as const;

// ============================================================================
// Orbits — 4 groups representing the developer journey
// ============================================================================

export const ORBITS = [
  {
    id: "projects",
    group: "projects" as const,
    label: "Projects",
    radius: 4,
    speed: 0.15,
    tilt: 0,
    objectIds: ["project-over-benefits", "project-window-corner", "project-mts-med"],
  },
  {
    id: "technology",
    group: "technology" as const,
    label: "Code",
    radius: 6.5,
    speed: 0.1,
    tilt: 0.12,
    objectIds: ["tech-react", "tech-typescript", "tech-gsap", "tech-threejs"],
  },
  {
    id: "creative",
    group: "creative" as const,
    label: "Creative",
    radius: 9,
    speed: 0.07,
    tilt: -0.08,
    objectIds: ["creative-motion", "creative-design", "creative-experiments"],
  },
  {
    id: "future",
    group: "future" as const,
    label: "Future",
    radius: 11.5,
    speed: 0.04,
    tilt: 0.15,
    objectIds: ["future-learning", "future-roadmap", "future-ideas"],
  },
] as const;

// ============================================================================
// Objects — Planets and moons in the solar system
// ============================================================================

export const OBJECTS: readonly SpaceObject[] = [
  // ─── PROJECTS — Innermost orbit ────────────────────────────────────────────
  {
    id: "project-over-benefits",
    type: "project",
    orbitGroup: "projects",
    position: [4, 0, 0],
    metadata: {
      title: "Over Benefits",
      subtitle: "Digital Benefits Platform",
      description:
        "A modern digital platform designed to simplify employee benefits, business solutions and consumer experiences through a clean responsive interface.",
      purpose: "Simplify how employees access and manage their benefits",
      tags: ["React", "TypeScript", "Tailwind CSS", "REST API"],
      route: "/projects/over-benefits",
      liveUrl: "https://www.overbenefits.net/",
      accentColor: "#3b82f6",
      accentRgb: "59, 130, 246",
    },
    interaction: { hover: true, select: true, focus: true, cursor: "pointer" },
    connections: ["tech-react", "tech-typescript"],
    visible: true,
  },
  {
    id: "project-window-corner",
    type: "project",
    orbitGroup: "projects",
    position: [-2, 3.4, -1.5],
    metadata: {
      title: "Window Corner",
      subtitle: "Corporate Website",
      description:
        "A premium web experience for an architectural aluminum and glass solutions company. Presenting products, projects and brand identity through a modern interface.",
      purpose: "Showcase architectural projects with cinematic presentation",
      tags: ["React", "TypeScript", "Framer Motion", "Tailwind CSS"],
      route: "/projects/window-corner",
      liveUrl: "https://window-corner.com/",
      accentColor: "#14b8a6",
      accentRgb: "20, 184, 166",
    },
    interaction: { hover: true, select: true, focus: true, cursor: "pointer" },
    connections: ["tech-react", "tech-typescript", "creative-motion"],
    visible: true,
  },
  {
    id: "project-mts-med",
    type: "project",
    orbitGroup: "projects",
    position: [-1.5, -3.5, 1],
    metadata: {
      title: "MTS MED",
      subtitle: "Healthcare Platform",
      description:
        "A healthcare product platform focused on presenting medical solutions with clear navigation and accessible product information.",
      purpose: "Present complex medical products with clarity",
      tags: ["React", "TypeScript", "Responsive Design"],
      route: "/projects/mts-med",
      liveUrl: "https://mtsmed-eg.com/",
      accentColor: "#ef4444",
      accentRgb: "239, 68, 68",
    },
    interaction: { hover: true, select: true, focus: true, cursor: "pointer" },
    connections: ["tech-react", "tech-typescript"],
    visible: true,
  },

  // ─── TECHNOLOGY — Code orbit ──────────────────────────────────────────────
  {
    id: "tech-react",
    type: "technology",
    orbitGroup: "technology",
    position: [5.5, 2, 1.5],
    metadata: {
      title: "React",
      subtitle: "UI Framework",
      description:
        "Component-based architecture for building interfaces. The foundation of every project.",
      purpose: "Build maintainable, component-driven user interfaces",
      tags: ["JSX", "Hooks", "Server Components"],
      accentColor: "#61dafb",
      accentRgb: "97, 218, 251",
    },
    interaction: { hover: true, select: true, focus: true, cursor: "pointer" },
    connections: [],
    visible: true,
  },
  {
    id: "tech-typescript",
    type: "technology",
    orbitGroup: "technology",
    position: [-5, -1.5, 0.5],
    metadata: {
      title: "TypeScript",
      subtitle: "Type Safety",
      description:
        "Type-safe code that catches errors at compile time. Makes refactoring safe and confidence high.",
      purpose: "Write reliable, self-documenting code",
      tags: ["Strict Mode", "Generics", "Utility Types"],
      accentColor: "#3178c6",
      accentRgb: "49, 120, 198",
    },
    interaction: { hover: true, select: true, focus: true, cursor: "pointer" },
    connections: [],
    visible: true,
  },
  {
    id: "tech-gsap",
    type: "technology",
    orbitGroup: "technology",
    position: [2, -5.5, -1],
    metadata: {
      title: "GSAP",
      subtitle: "Animation Engine",
      description:
        "Professional-grade animation for the web. From timelines to scroll-driven animations.",
      purpose: "Create fluid, performant animations",
      tags: ["Timeline", "ScrollTrigger", "MorphSVG"],
      accentColor: "#88ce02",
      accentRgb: "136, 206, 2",
    },
    interaction: { hover: true, select: true, focus: true, cursor: "pointer" },
    connections: [],
    visible: true,
  },
  {
    id: "tech-threejs",
    type: "technology",
    orbitGroup: "technology",
    position: [-3.5, 3.5, -0.5],
    metadata: {
      title: "Three.js",
      subtitle: "3D Graphics",
      description:
        "WebGL-powered 3D rendering. From product visualizers to spatial computing experiences.",
      purpose: "Build immersive 3D experiences in the browser",
      tags: ["WebGL", "React Three Fiber", "Shaders"],
      accentColor: "#049ef4",
      accentRgb: "4, 158, 244",
    },
    interaction: { hover: true, select: true, focus: true, cursor: "pointer" },
    connections: [],
    visible: true,
  },

  // ─── CREATIVE — Creative orbit ────────────────────────────────────────────
  {
    id: "creative-motion",
    type: "creative",
    orbitGroup: "creative",
    position: [6.5, 3, 1.5],
    metadata: {
      title: "Motion",
      subtitle: "Purposeful Animation",
      description:
        "Every animation serves a purpose. Motion guides attention, communicates state, and creates continuity.",
      purpose: "Make interfaces feel alive and intentional",
      tags: ["Timing", "Easing", "Choreography"],
      accentColor: "#a855f7",
      accentRgb: "168, 85, 247",
    },
    interaction: { hover: true, select: true, focus: true, cursor: "pointer" },
    connections: [],
    visible: true,
  },
  {
    id: "creative-design",
    type: "creative",
    orbitGroup: "creative",
    position: [-2, -7, -1],
    metadata: {
      title: "Design",
      subtitle: "Visual Systems",
      description:
        "Systematic design thinking. From typography scales to color systems — every decision is intentional.",
      purpose: "Create cohesive, scalable visual languages",
      tags: ["Typography", "Color Theory", "Layout"],
      accentColor: "#ec4899",
      accentRgb: "236, 72, 153",
    },
    interaction: { hover: true, select: true, focus: true, cursor: "pointer" },
    connections: [],
    visible: true,
  },
  {
    id: "creative-experiments",
    type: "creative",
    orbitGroup: "creative",
    position: [4, -5.5, 2],
    metadata: {
      title: "Experiments",
      subtitle: "Pushing Boundaries",
      description:
        "Pushing what browsers can do — 3D scenes, shader programming, canvas rendering, spatial computing.",
      purpose: "Create experiences that feel physical",
      tags: ["Three.js", "WebGL", "Canvas", "Web Audio"],
      accentColor: "#06b6d4",
      accentRgb: "6, 182, 212",
    },
    interaction: { hover: true, select: true, focus: true, cursor: "pointer" },
    connections: ["tech-threejs"],
    visible: true,
  },

  // ─── FUTURE — Outermost orbit ─────────────────────────────────────────────
  {
    id: "future-learning",
    type: "future",
    orbitGroup: "future",
    position: [8, 3, -1],
    metadata: {
      title: "Learning",
      subtitle: "Growing Forward",
      description:
        "Always learning. Currently exploring Rust, WebAssembly, and AI-assisted development workflows.",
      purpose: "Stay ahead of the curve",
      tags: ["Rust", "WASM", "AI/ML"],
      accentColor: "#8b5cf6",
      accentRgb: "139, 92, 246",
    },
    interaction: { hover: true, select: true, focus: true, cursor: "pointer" },
    connections: [],
    visible: true,
  },
  {
    id: "future-roadmap",
    type: "future",
    orbitGroup: "future",
    position: [-6, -5, 3],
    metadata: {
      title: "Roadmap",
      subtitle: "Strategic Vision",
      description:
        "Building toward spatial computing, AI-native interfaces, and the next generation of web experiences.",
      purpose: "Shape the future of digital interaction",
      tags: ["Spatial Computing", "AI-Native", "WebGPU"],
      accentColor: "#f59e0b",
      accentRgb: "245, 158, 11",
    },
    interaction: { hover: true, select: true, focus: true, cursor: "pointer" },
    connections: [],
    visible: true,
  },
  {
    id: "future-ideas",
    type: "future",
    orbitGroup: "future",
    position: [2, -8, -2],
    metadata: {
      title: "Ideas",
      subtitle: "Uncharted Territory",
      description:
        "Half-formed ideas waiting for the right moment. Experimental projects, creative prototypes, wild concepts.",
      purpose: "Explore the unknown",
      tags: ["Prototyping", "Research", "Play"],
      accentColor: "#10b981",
      accentRgb: "16, 185, 129",
    },
    interaction: { hover: true, select: true, focus: true, cursor: "pointer" },
    connections: [],
    visible: true,
  },
] as const;

// ============================================================================
// Connections — Relationships between objects
// ============================================================================

export const CONNECTIONS: readonly Connection[] = [
  // Over Benefits uses React, TypeScript
  { from: "project-over-benefits", to: "tech-react" },
  { from: "project-over-benefits", to: "tech-typescript" },
  // Window Corner uses React, TypeScript, Motion
  { from: "project-window-corner", to: "tech-react" },
  { from: "project-window-corner", to: "tech-typescript" },
  { from: "project-window-corner", to: "creative-motion" },
  // MTS MED uses React, TypeScript
  { from: "project-mts-med", to: "tech-react" },
  { from: "project-mts-med", to: "tech-typescript" },
  // Creative connections
  { from: "creative-experiments", to: "tech-threejs" },
] as const;

// ============================================================================
// Camera Presets
// ============================================================================

export const CAMERA_PRESETS: Record<CameraMode, CameraPreset> = {
  intro: {
    position: [0, 4, 14],
    target: [0, 0, 0],
    fov: 50,
  },
  overview: {
    position: [0, 3, 12],
    target: [0, 0, 0],
    fov: 50,
  },
  "object-focus": {
    position: [0, 0, 5],
    target: [0, 0, 0],
    fov: 50,
  },
} as const;

// ============================================================================
// Navigation
// ============================================================================

export const NAVIGATION = {
  entryObject: null,
  exitObject: null,
  defaultCameraMode: "intro" as const,
  keyboardEnabled: true,
  scrollSpeed: 0.15,
  focusOffset: [0, 0.5, 3] as [number, number, number],
  introPosition: [0, 4, 14] as [number, number, number],
  overviewPosition: [0, 3, 12] as [number, number, number],
  scrollRange: [-3, 3] as [number, number],
  inertiaDecay: 0.92,
  focusApproachDistance: 3.5,
} as const;

// ============================================================================
// Accessibility
// ============================================================================

export const ACCESSIBILITY: SpaceAccessibility = {
  keyboardEnabled: true,
  reducedMotion: false,
  screenReaderAnnouncements: true,
  fallbackContent:
    "Taha Mahmoud's portfolio — Frontend developer specializing in React, TypeScript, and interactive experiences.",
};

// ============================================================================
// Performance
// ============================================================================

export const PERFORMANCE: SpacePerformance = {
  maxPixelRatio: 2,
  shadows: false,
  antialias: true,
  dpr: [1, 2] as [number, number],
  frameloop: "always",
};

// ============================================================================
// Full Scene Config
// ============================================================================

export const SPACE_CONFIG: SpaceSceneConfig = {
  core: CORE,
  orbits: ORBITS,
  objects: OBJECTS,
  connections: CONNECTIONS,
  navigation: NAVIGATION,
};
