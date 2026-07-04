/**
 * Project Galaxy Data
 *
 * Per-project spatial experience configuration.
 * Pulls from src/content/projects.ts for core data.
 * Adds: visual field layout, story layer, tech web, action portals.
 *
 * Each project gets a unique "galaxy" — a spatial composition
 * that reveals when the project is focused in the Space World.
 */

import { PROJECTS } from "../../../content/projects";
import type { ProjectData } from "../../../content/types";

// ============================================================================
// Types
// ============================================================================

export interface VisualPanel {
  readonly image: string;
  readonly label: string;
  readonly description: string;
  readonly position: [number, number, number];
  readonly rotation: [number, number, number];
  readonly size: [number, number];
}

export interface TechNode {
  readonly id: string;
  readonly label: string;
  readonly position: [number, number, number];
  readonly color: string;
}

export interface TechLink {
  readonly from: string;
  readonly to: string;
}

export interface StoryData {
  readonly challenge: string;
  readonly solution: string;
  readonly role: string;
  readonly timeline: string;
  readonly highlights: readonly string[];
}

export interface ActionPortal {
  readonly id: string;
  readonly label: string;
  readonly url: string;
  readonly type: "case-study" | "live-site";
  readonly position: [number, number, number];
}

export interface ProjectGalaxyConfig {
  readonly projectId: string;
  readonly identity: string;
  readonly feeling: readonly string[];
  readonly visualField: readonly VisualPanel[];
  readonly techWeb: {
    readonly nodes: readonly TechNode[];
    readonly links: readonly TechLink[];
  };
  readonly story: StoryData;
  readonly actions: readonly ActionPortal[];
}

// ============================================================================
// Galaxy Configs
// ============================================================================

const OVER_BENEFITS_GALAXY: ProjectGalaxyConfig = {
  projectId: "over-benefits",
  identity: "Modern Digital Platform",
  feeling: ["Clean", "Connected", "Smart"],
  visualField: [
    {
      image: "/projects/over-benefits/cover.webp",
      label: "Benefits Dashboard",
      description: "Clean overview of all available benefits",
      position: [-2.2, 0.8, -0.5],
      rotation: [0, 0.15, 0],
      size: [2.4, 1.5],
    },
    {
      image: "/projects/over-benefits/hero.webp",
      label: "Plan Comparison",
      description: "Side-by-side plan comparison",
      position: [2.0, -0.3, -0.8],
      rotation: [0, -0.12, 0],
      size: [2.0, 1.2],
    },
    {
      image: "/projects/over-benefits/gallery-01.webp",
      label: "Mobile Experience",
      description: "Fully responsive interface",
      position: [0.0, 1.5, -1.2],
      rotation: [0.05, 0.08, 0],
      size: [1.4, 2.0],
    },
  ],
  techWeb: {
    nodes: [
      { id: "tr", label: "React", position: [2.5, 1.8, 0], color: "#61dafb" },
      { id: "tt", label: "TypeScript", position: [-2.5, 1.5, 0.3], color: "#3178c6" },
      { id: "tw", label: "Tailwind", position: [0, 2.5, -0.3], color: "#06b6d4" },
      { id: "api", label: "REST API", position: [-1.5, 2.2, 0.5], color: "#f59e0b" },
    ],
    links: [
      { from: "tr", to: "tt" },
      { from: "tr", to: "tw" },
      { from: "tt", to: "api" },
    ],
  },
  story: {
    challenge:
      "Employee benefits platforms are typically cluttered and hard to navigate. Users struggled to find the right plans and manage their benefits efficiently.",
    solution:
      "Component-based React architecture with TypeScript. Tailwind CSS for consistent design. Responsive layouts that work across all devices.",
    role: "Frontend Developer",
    timeline: "6 weeks",
    highlights: [
      "30+ reusable components",
      "Fully responsive across all devices",
      "<2s load on 3G",
      "WCAG accessible",
    ],
  },
  actions: [
    {
      id: "case-study",
      label: "View Case Study",
      url: "/projects/over-benefits",
      type: "case-study",
      position: [0, -2.0, 0],
    },
    {
      id: "live-site",
      label: "Visit Site",
      url: "https://www.overbenefits.net/",
      type: "live-site",
      position: [1.5, -2.0, 0],
    },
  ],
};

const WINDOW_CORNER_GALAXY: ProjectGalaxyConfig = {
  projectId: "window-corner",
  identity: "Architecture / Premium Brand",
  feeling: ["Elegant", "Architectural", "Structured"],
  visualField: [
    {
      image: "/projects/window-corner/cover.webp",
      label: "Project Gallery",
      description: "Full-width project showcases",
      position: [-2.0, 0.5, -0.6],
      rotation: [0, 0.12, 0],
      size: [2.6, 1.6],
    },
    {
      image: "/projects/window-corner/hero.webp",
      label: "Product Catalog",
      description: "Browsable product catalog",
      position: [2.2, -0.2, -0.4],
      rotation: [0, -0.1, 0],
      size: [2.2, 1.4],
    },
    {
      image: "/projects/window-corner/gallery-01.webp",
      label: "Company Overview",
      description: "Brand story with cinematic presentation",
      position: [0.0, 1.3, -1.0],
      rotation: [0.03, 0.06, 0],
      size: [1.6, 2.2],
    },
  ],
  techWeb: {
    nodes: [
      { id: "tr", label: "React", position: [2.5, 1.8, 0], color: "#61dafb" },
      { id: "tt", label: "TypeScript", position: [-2.5, 1.5, 0.3], color: "#3178c6" },
      { id: "fm", label: "Framer Motion", position: [0, 2.5, -0.3], color: "#a855f7" },
      { id: "tw", label: "Tailwind", position: [-1.5, 2.2, 0.5], color: "#06b6d4" },
    ],
    links: [
      { from: "tr", to: "tt" },
      { from: "tr", to: "fm" },
      { from: "tt", to: "tw" },
    ],
  },
  story: {
    challenge:
      "Architectural companies need websites that reflect the quality of their work. Creating a digital presence that showcases large-scale projects while maintaining fast load times.",
    solution:
      "React-based frontend with Framer Motion for smooth transitions. Responsive grid system for project showcases. Product catalog with filtering and detailed specification views.",
    role: "Frontend Developer",
    timeline: "8 weeks",
    highlights: [
      "20+ project case studies showcased",
      "50+ products with filtering",
      "<2.5s mobile load time",
      "Cinematic scroll animations",
    ],
  },
  actions: [
    {
      id: "case-study",
      label: "View Case Study",
      url: "/projects/window-corner",
      type: "case-study",
      position: [0, -2.0, 0],
    },
    {
      id: "live-site",
      label: "Visit Site",
      url: "https://window-corner.com/",
      type: "live-site",
      position: [1.5, -2.0, 0],
    },
  ],
};

const MTS_MED_GALAXY: ProjectGalaxyConfig = {
  projectId: "mts-med",
  identity: "Healthcare Platform",
  feeling: ["Clean", "Trust", "Professional"],
  visualField: [
    {
      image: "/projects/mts-med/hero.webp",
      label: "Product Catalog",
      description: "Structured product browsing",
      position: [-2.0, 0.6, -0.5],
      rotation: [0, 0.1, 0],
      size: [2.4, 1.5],
    },
    {
      image: "/projects/mts-med/gallery-01.jpeg",
      label: "Product Details",
      description: "Clear specification presentation",
      position: [2.0, -0.3, -0.7],
      rotation: [0, -0.08, 0],
      size: [2.0, 1.3],
    },
    {
      image: "/projects/mts-med/gallery-02.jpeg",
      label: "Category Navigation",
      description: "Intuitive product navigation",
      position: [0.0, 1.4, -1.1],
      rotation: [0.04, 0.05, 0],
      size: [1.5, 2.0],
    },
  ],
  techWeb: {
    nodes: [
      { id: "tr", label: "React", position: [2.5, 1.8, 0], color: "#61dafb" },
      { id: "tt", label: "TypeScript", position: [-2.5, 1.5, 0.3], color: "#3178c6" },
      { id: "tw", label: "Tailwind", position: [0, 2.5, -0.3], color: "#06b6d4" },
      { id: "rd", label: "Responsive", position: [-1.5, 2.2, 0.5], color: "#10b981" },
    ],
    links: [
      { from: "tr", to: "tt" },
      { from: "tr", to: "tw" },
      { from: "tw", to: "rd" },
    ],
  },
  story: {
    challenge:
      "Medical product catalogs need to present complex technical information clearly. Healthcare professionals need to quickly find products by category or specification.",
    solution:
      "React frontend with clear information architecture. Product detail pages with structured specifications. Responsive design for tablet and mobile access.",
    role: "Frontend Developer",
    timeline: "5 weeks",
    highlights: [
      "100+ medical products cataloged",
      "8+ product categories",
      "Tablet-optimized for clinical use",
      "<2s initial load",
    ],
  },
  actions: [
    {
      id: "case-study",
      label: "View Case Study",
      url: "/projects/mts-med",
      type: "case-study",
      position: [0, -2.0, 0],
    },
    {
      id: "live-site",
      label: "Visit Site",
      url: "https://mtsmed-eg.com/",
      type: "live-site",
      position: [1.5, -2.0, 0],
    },
  ],
};

// ============================================================================
// Registry
// ============================================================================

const GALAXY_MAP: Record<string, ProjectGalaxyConfig> = {
  "project-over-benefits": OVER_BENEFITS_GALAXY,
  "project-window-corner": WINDOW_CORNER_GALAXY,
  "project-mts-med": MTS_MED_GALAXY,
};

/** Get galaxy config for a space object ID */
export function getProjectGalaxy(objectId: string): ProjectGalaxyConfig | null {
  return GALAXY_MAP[objectId] ?? null;
}

/** Check if an object ID has a project galaxy */
export function hasProjectGalaxy(objectId: string): boolean {
  return objectId in GALAXY_MAP;
}

/** Get all galaxy configs */
export function getAllGalaxies(): readonly ProjectGalaxyConfig[] {
  return Object.values(GALAXY_MAP);
}

/** Get project data from content system by galaxy object ID */
export function getProjectContent(objectId: string) {
  const slug = objectId.replace("project-", "");
  return PROJECTS.find((p: ProjectData) => p.slug === slug) ?? null;
}
