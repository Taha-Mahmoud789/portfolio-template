/**
 * Space Scene Configuration — Portfolio Projects (Minimal Premium)
 *
 * Center: TAHA CORE (Creative Developer identity)
 * Orbits: 3 project planets with technology moons
 * Each planet = real project, moons = key technologies (max 5-6)
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
// Core — TAHA CORE (center of the solar system)
// ============================================================================

export const CORE = {
  position: [0, 0, 0] as [number, number, number],
  radius: 0.5,
  color: "#C9A96E",
  glowColor: "#f5f0e8",
  pulseSpeed: 0.6,
} as const;

// ============================================================================
// Orbits — 3 project planets (spaced for minimal composition)
// ============================================================================

export const ORBITS = [
  {
    id: "projects",
    group: "projects" as const,
    label: "Projects",
    radius: 14,
    speed: 0.12,
    tilt: 0.08,
    objectIds: ["project-over-benefits", "project-mts-med", "project-el-hady-law"],
  },
] as const;

// ============================================================================
// Objects — Planets and moons (projects with key technologies only)
// ============================================================================

export const OBJECTS: readonly SpaceObject[] = [
  // ─── OVER BENEFITS — Corporate Business Website ──────────────────────────
  {
    id: "project-over-benefits",
    type: "project",
    orbitGroup: "projects",
    position: [7, 0, 0],
    metadata: {
      title: "Over Benefits",
      subtitle: "Corporate Business Website",
      description:
        "A corporate business website delivering digital benefits solutions with a clean, professional interface.",
      purpose: "Corporate digital presence for employee benefits platform",
      tags: [
        "HTML5",
        "CSS3",
        "Bootstrap",
        "JavaScript",
        "jQuery",
        "PHP",
        "SEO",
        "Responsive Design",
      ],
      route: "/projects/over-benefits",
      liveUrl: "https://www.overbenefits.net/",
      accentColor: "#3b82f6",
      accentRgb: "59, 130, 246",
    },
    interaction: { hover: true, select: true, focus: true, cursor: "pointer" },
    connections: [],
    visible: true,
  },
  {
    id: "moon-html5-over",
    type: "project",
    orbitGroup: "projects",
    position: [7, 0, 0],
    metadata: {
      title: "HTML5",
      subtitle: "Semantic Markup",
      description: "Modern semantic HTML5 structure for accessibility and SEO.",
      purpose: "Structure and accessibility",
      tags: [],
      accentColor: "#e34c26",
      accentRgb: "227, 76, 38",
    },
    interaction: { hover: true, select: false, focus: false, cursor: "pointer" },
    connections: [],
    visible: true,
  },
  {
    id: "moon-css3-over",
    type: "project",
    orbitGroup: "projects",
    position: [7, 0, 0],
    metadata: {
      title: "CSS3",
      subtitle: "Styling & Layout",
      description: "Custom CSS3 styling with Flexbox and Grid layouts.",
      purpose: "Visual design and responsive layout",
      tags: [],
      accentColor: "#264de4",
      accentRgb: "38, 77, 228",
    },
    interaction: { hover: true, select: false, focus: false, cursor: "pointer" },
    connections: [],
    visible: true,
  },
  {
    id: "moon-bootstrap-over",
    type: "project",
    orbitGroup: "projects",
    position: [7, 0, 0],
    metadata: {
      title: "Bootstrap",
      subtitle: "Responsive UI Framework",
      description: "Bootstrap framework for rapid responsive UI development.",
      purpose: "Responsive UI framework",
      tags: [],
      accentColor: "#7952b3",
      accentRgb: "121, 82, 179",
    },
    interaction: { hover: true, select: false, focus: false, cursor: "pointer" },
    connections: [],
    visible: true,
  },
  {
    id: "moon-js-over",
    type: "project",
    orbitGroup: "projects",
    position: [7, 0, 0],
    metadata: {
      title: "JavaScript",
      subtitle: "Interactivity",
      description: "Vanilla JavaScript for dynamic interactions and DOM manipulation.",
      purpose: "Dynamic interactivity",
      tags: [],
      accentColor: "#f7df1e",
      accentRgb: "247, 223, 30",
    },
    interaction: { hover: true, select: false, focus: false, cursor: "pointer" },
    connections: [],
    visible: true,
  },
  {
    id: "moon-php-over",
    type: "project",
    orbitGroup: "projects",
    position: [7, 0, 0],
    metadata: {
      title: "PHP",
      subtitle: "Server-Side Logic",
      description: "PHP backend for form handling, authentication, and data processing.",
      purpose: "Server-side processing",
      tags: [],
      accentColor: "#777bb4",
      accentRgb: "119, 123, 180",
    },
    interaction: { hover: true, select: false, focus: false, cursor: "pointer" },
    connections: [],
    visible: true,
  },

  // ─── MTS MED — Medical E-Commerce ────────────────────────────────────────
  {
    id: "project-mts-med",
    type: "project",
    orbitGroup: "projects",
    position: [-4, 5, -3],
    metadata: {
      title: "MTS MED",
      subtitle: "Medical E-Commerce",
      description:
        "A medical e-commerce platform for healthcare products with seamless shopping experience.",
      purpose: "Medical product e-commerce platform",
      tags: [
        "WordPress",
        "WooCommerce",
        "Elementor",
        "PHP",
        "JavaScript",
        "CSS3",
        "SEO",
        "Responsive Design",
      ],
      route: "/projects/mts-med",
      liveUrl: "https://mtsmed-eg.com/",
      accentColor: "#ef4444",
      accentRgb: "239, 68, 68",
    },
    interaction: { hover: true, select: true, focus: true, cursor: "pointer" },
    connections: [],
    visible: true,
  },
  {
    id: "moon-wordpress-mts",
    type: "project",
    orbitGroup: "projects",
    position: [-4, 5, -3],
    metadata: {
      title: "WordPress",
      subtitle: "CMS Platform",
      description: "WordPress content management system for flexible site management.",
      purpose: "Content management",
      tags: [],
      accentColor: "#21759b",
      accentRgb: "33, 117, 155",
    },
    interaction: { hover: true, select: false, focus: false, cursor: "pointer" },
    connections: [],
    visible: true,
  },
  {
    id: "moon-woocommerce-mts",
    type: "project",
    orbitGroup: "projects",
    position: [-4, 5, -3],
    metadata: {
      title: "WooCommerce",
      subtitle: "E-Commerce Engine",
      description: "WooCommerce for product catalog, cart, and checkout functionality.",
      purpose: "E-commerce functionality",
      tags: [],
      accentColor: "#96588a",
      accentRgb: "150, 88, 138",
    },
    interaction: { hover: true, select: false, focus: false, cursor: "pointer" },
    connections: [],
    visible: true,
  },
  {
    id: "moon-elementor-mts",
    type: "project",
    orbitGroup: "projects",
    position: [-4, 5, -3],
    metadata: {
      title: "Elementor",
      subtitle: "Page Builder",
      description: "Elementor drag-and-drop page builder for custom layouts.",
      purpose: "Visual page building",
      tags: [],
      accentColor: "#92003b",
      accentRgb: "146, 0, 59",
    },
    interaction: { hover: true, select: false, focus: false, cursor: "pointer" },
    connections: [],
    visible: true,
  },
  {
    id: "moon-php-mts",
    type: "project",
    orbitGroup: "projects",
    position: [-4, 5, -3],
    metadata: {
      title: "PHP",
      subtitle: "Server-Side Logic",
      description: "PHP backend for WooCommerce and custom functionality.",
      purpose: "Server-side processing",
      tags: [],
      accentColor: "#777bb4",
      accentRgb: "119, 123, 180",
    },
    interaction: { hover: true, select: false, focus: false, cursor: "pointer" },
    connections: [],
    visible: true,
  },
  {
    id: "moon-js-mts",
    type: "project",
    orbitGroup: "projects",
    position: [-4, 5, -3],
    metadata: {
      title: "JavaScript",
      subtitle: "Interactivity",
      description: "JavaScript for dynamic product displays and cart interactions.",
      purpose: "Dynamic interactions",
      tags: [],
      accentColor: "#f7df1e",
      accentRgb: "247, 223, 30",
    },
    interaction: { hover: true, select: false, focus: false, cursor: "pointer" },
    connections: [],
    visible: true,
  },

  // ─── EL-HADY LAW FIRM — Legal Corporate Website ──────────────────────────
  {
    id: "project-el-hady-law",
    type: "project",
    orbitGroup: "projects",
    position: [-3, -5, 3],
    metadata: {
      title: "El-Hady Law Firm",
      subtitle: "Legal Corporate Website",
      description:
        "A professional legal corporate website with multilingual support for an international law firm.",
      purpose: "Legal corporate digital presence",
      tags: [
        "WordPress",
        "Elementor",
        "PHP",
        "JavaScript",
        "CSS3",
        "SEO",
        "Multilingual",
        "Responsive Design",
      ],
      route: "/projects/el-hady-law",
      liveUrl: "https://elhadylaw.com/",
      accentColor: "#8b5cf6",
      accentRgb: "139, 92, 246",
    },
    interaction: { hover: true, select: true, focus: true, cursor: "pointer" },
    connections: [],
    visible: true,
  },
  {
    id: "moon-wordpress-elhady",
    type: "project",
    orbitGroup: "projects",
    position: [-3, -5, 3],
    metadata: {
      title: "WordPress",
      subtitle: "CMS Platform",
      description: "WordPress for content management and blog functionality.",
      purpose: "Content management",
      tags: [],
      accentColor: "#21759b",
      accentRgb: "33, 117, 155",
    },
    interaction: { hover: true, select: false, focus: false, cursor: "pointer" },
    connections: [],
    visible: true,
  },
  {
    id: "moon-elementor-elhady",
    type: "project",
    orbitGroup: "projects",
    position: [-3, -5, 3],
    metadata: {
      title: "Elementor",
      subtitle: "Page Builder",
      description: "Elementor for custom page layouts and visual editing.",
      purpose: "Visual page building",
      tags: [],
      accentColor: "#92003b",
      accentRgb: "146, 0, 59",
    },
    interaction: { hover: true, select: false, focus: false, cursor: "pointer" },
    connections: [],
    visible: true,
  },
  {
    id: "moon-php-elhady",
    type: "project",
    orbitGroup: "projects",
    position: [-3, -5, 3],
    metadata: {
      title: "PHP",
      subtitle: "Server-Side Logic",
      description: "PHP backend for custom functionality and form handling.",
      purpose: "Server-side processing",
      tags: [],
      accentColor: "#777bb4",
      accentRgb: "119, 123, 180",
    },
    interaction: { hover: true, select: false, focus: false, cursor: "pointer" },
    connections: [],
    visible: true,
  },
  {
    id: "moon-multilingual-elhady",
    type: "project",
    orbitGroup: "projects",
    position: [-3, -5, 3],
    metadata: {
      title: "Multilingual",
      subtitle: "Language Support",
      description: "Multi-language support for international audience reach.",
      purpose: "International audience reach",
      tags: [],
      accentColor: "#ff6b6b",
      accentRgb: "255, 107, 107",
    },
    interaction: { hover: true, select: false, focus: false, cursor: "pointer" },
    connections: [],
    visible: true,
  },
  {
    id: "moon-responsive-elhady",
    type: "project",
    orbitGroup: "projects",
    position: [-3, -5, 3],
    metadata: {
      title: "Responsive",
      subtitle: "Multi-Device",
      description: "Fully responsive for all device sizes.",
      purpose: "Cross-device compatibility",
      tags: [],
      accentColor: "#06d6a0",
      accentRgb: "6, 214, 160",
    },
    interaction: { hover: true, select: false, focus: false, cursor: "pointer" },
    connections: [],
    visible: true,
  },
] as const;

// ============================================================================
// Connections — No connections for clean minimal look
// ============================================================================

export const CONNECTIONS: readonly Connection[] = [] as const;

// ============================================================================
// Camera Presets
// ============================================================================

export const CAMERA_PRESETS: Record<CameraMode, CameraPreset> = {
  intro: {
    position: [8, 12, 28],
    target: [0, -1, 0],
    fov: 45,
  },
  overview: {
    position: [6, 10, 24],
    target: [0, 0, 0],
    fov: 45,
  },
  "object-focus": {
    position: [0, 2, 8],
    target: [0, 0, 0],
    fov: 45,
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
  introPosition: [8, 12, 28] as [number, number, number],
  overviewPosition: [6, 10, 24] as [number, number, number],
  scrollRange: [-3, 3] as [number, number],
  inertiaDecay: 0.92,
  focusApproachDistance: 5,
} as const;

// ============================================================================
// Accessibility
// ============================================================================

export const ACCESSIBILITY: SpaceAccessibility = {
  keyboardEnabled: true,
  reducedMotion: false,
  screenReaderAnnouncements: true,
  fallbackContent:
    "Taha Mahmoud's portfolio — Creative Developer specializing in digital experiences.",
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
