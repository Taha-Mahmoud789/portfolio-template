/**
 * Experience & Process
 *
 * Stats shown in the About section.
 * Process steps shown in the How I Work section.
 */

import type { ExperienceStat } from "./types";

export const EXPERIENCE_STATS: readonly ExperienceStat[] = [
  { value: 4, suffix: "+", label: "Years Building" },
  { value: 15, suffix: "+", label: "Projects Shipped" },
  { value: 8, suffix: "+", label: "Clients Served" },
] as const;

export const PROCESS_STEPS = [
  {
    number: "01",
    title: "Understand",
    description:
      "Before writing code, I learn the problem. Architecture decisions shape everything that follows.",
  },
  {
    number: "02",
    title: "Craft",
    description:
      "Component by component, frame by frame. Clean TypeScript, intentional motion, and structure that scales.",
  },
  {
    number: "03",
    title: "Refine",
    description:
      "Performance, accessibility, and the details that separate functional from exceptional. Then ship.",
  },
] as const;
