/**
 * Content Types
 *
 * Interfaces for the centralized content system.
 * Changing these types causes TypeScript errors across all consuming components.
 */

// ============================================================================
// Metadata
// ============================================================================

export interface PersonalInfo {
  name: string;
  firstName: string;
  lastName: string;
  title: string;
  tagline: string;
  email: string;
  location: string;
  available: boolean;
  availableText: string;
}

export interface SocialLink {
  label: string;
  href: string;
  ariaLabel: string;
}

// ============================================================================
// Projects
// ============================================================================

export interface ProjectData {
  id: string;
  slug: string;
  number: number;
  title: string;
  description: string;
  category: string;
  year: string;
  accentColor: string;
  accentRgb: string;
  hero: {
    category: string;
    year: string;
    role: string;
    technologies: readonly string[];
    description: string;
  };
  overview: {
    challenge: string;
    idea: string;
    solution: string;
  };
  meta: {
    role: string;
    timeline: string;
    stack: readonly string[];
    responsibilities: readonly string[];
  };
  showcase: readonly { label: string; description: string; image?: string }[];
  process: readonly { number: string; title: string; description: string }[];
  technical: readonly { label: string; description: string }[];
  results: readonly { metric: string; value: string; description: string }[];
  images: {
    cover: string;
    hero: string;
    gallery: readonly string[];
  };
  liveUrl?: string;
  githubUrl?: string;
  logo?: string;
  prevProjectId: string | null;
  nextProjectId: string | null;
}

// ============================================================================
// Skills / Expertise
// ============================================================================

export interface Service {
  number: string;
  title: string;
  description: string;
  items: readonly string[];
}

// ============================================================================
// Experience
// ============================================================================

export interface ExperienceStat {
  value: number;
  suffix: string;
  label: string;
}

// ============================================================================
// Navigation
// ============================================================================

export interface NavLink {
  label: string;
  href: string;
}

export interface MenuItem {
  number: string;
  label: string;
  href: string;
}

// ============================================================================
// Multiverse
// ============================================================================

export interface WorldData {
  id: string;
  number: string;
  name: string;
  description: string;
  route: string;
  accentColor: string;
  status: "available" | "coming-soon";
  sectionLabel: string;
  sectionTitle: string;
  sectionDescription: string;
}
