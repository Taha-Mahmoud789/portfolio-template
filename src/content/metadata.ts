/**
 * Personal Metadata
 *
 * Name, email, social links, about text, intro, 404.
 * Changing data here updates the entire portfolio.
 */

import type { PersonalInfo, SocialLink } from "./types";

// ============================================================================
// Personal Info
// ============================================================================

export const PERSONAL_INFO: PersonalInfo = {
  name: "Taha Mahmoud",
  firstName: "Taha",
  lastName: "Mahmoud",
  title: "Frontend Developer",
  tagline: "Frontend developer focused on React, TypeScript, and interfaces that feel right.",
  email: "hello@taha.dev",
  location: "Cairo, Egypt",
  available: true,
  availableText: "Available for work",
};

// ============================================================================
// Social Links — used by contact, footer
// ============================================================================

export const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/taha-mahmoud",
    ariaLabel: "View GitHub profile",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/taha-mahmoud",
    ariaLabel: "Connect on LinkedIn",
  },
  {
    label: "Email",
    href: `mailto:${PERSONAL_INFO.email}`,
    ariaLabel: "Send an email",
  },
] as const;

// ============================================================================
// About Section
// ============================================================================

export const ABOUT = {
  heading:
    "Frontend developer who writes clean code, builds fast interfaces, and cares about the details.",
  body: "I work with React and TypeScript to build interfaces that are fast, accessible, and feel right. Motion is intentional. Structure is clean. Every decision serves the user.",
  focusLabel: "Focus",
  focusText: "React, TypeScript, and motion-driven interfaces.",
} as const;

// ============================================================================
// Intro Section
// ============================================================================

export const INTRO = {
  line1: "Clarity first.",
  line2: "Craft over clutter.",
  line3: "Built to last.",
} as const;

// ============================================================================
// 404 Page
// ============================================================================

export const NOT_FOUND = {
  code: "404",
  title: "Lost in the interface",
  description: "The page you're looking for doesn't exist or has been moved.",
  cta: "Back to home",
} as const;
