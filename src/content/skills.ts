/**
 * Skills & Expertise
 *
 * Service categories shown in the Expertise section.
 * To add a skill: add an item to the relevant service.
 * To add a service: add a new entry to SERVICES.
 */

import type { Service } from "./types";

export const SERVICES: readonly Service[] = [
  {
    number: "01",
    title: "Frontend Architecture",
    description:
      "Building scalable interfaces with React and Next.js. Component systems, state management, and type-safe code that teams can maintain.",
    items: [
      "React & Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Component Architecture",
      "State Management",
    ],
  },
  {
    number: "02",
    title: "Motion Systems",
    description:
      "Creating performant motion that guides users. Scroll-driven reveals, page transitions, and animation that serves a purpose.",
    items: [
      "GSAP & ScrollTrigger",
      "Framer Motion",
      "CSS Animations",
      "Scroll-Driven Effects",
      "Page Transitions",
    ],
  },
  {
    number: "03",
    title: "Interactive Experiences",
    description:
      "Pushing what browsers can do — 3D scenes, shader programming, canvas rendering, and spatial computing.",
    items: [
      "Three.js & WebGL",
      "React Three Fiber",
      "Canvas API",
      "Web Audio",
      "Shader Programming",
    ],
  },
  {
    number: "04",
    title: "Performance Engineering",
    description:
      "Optimizing for speed at every level — code splitting, lazy loading, efficient rendering. Users shouldn't wait.",
    items: [
      "Core Web Vitals",
      "Bundle Optimization",
      "Image Optimization",
      "Caching Strategies",
      "Monitoring",
    ],
  },
] as const;
