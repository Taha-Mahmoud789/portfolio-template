/**
 * Multiverse Worlds
 *
 * Single source of truth for all multiverse worlds.
 * Used by: hub page, Project Universe, MultiverseNav, breadcrumbs.
 *
 * To add a world: add one entry here + add route to routes.ts.
 */

import type { WorldData } from "./types";

export const WORLDS: readonly WorldData[] = [
  {
    id: "projects",
    number: "01",
    name: "Projects",
    description: "Case studies and technical deep dives",
    route: "/multiverse/projects",
    accentColor: "rgba(201, 169, 110, 1)",
    status: "available",
    sectionLabel: "Selected work",
    sectionTitle: "Projects",
    sectionDescription: "Click any project to see more. Click again to collapse.",
  },
  {
    id: "code",
    number: "02",
    name: "Code",
    description: "Architecture and engineering decisions",
    route: "/multiverse/code",
    accentColor: "rgba(96, 165, 250, 1)",
    status: "available",
    sectionLabel: "Architecture",
    sectionTitle: "Code Universe",
    sectionDescription: "604 source files. 20 modules. This is how the portfolio is built.",
  },
  {
    id: "creative",
    number: "03",
    name: "Creative",
    description: "Design systems and motion studies",
    route: "/multiverse/creative",
    accentColor: "rgba(201, 169, 110, 1)",
    status: "available",
    sectionLabel: "Design and motion",
    sectionTitle: "Creative Universe",
    sectionDescription:
      "The decisions behind the design. Why things move the way they do. How interactions create emotion.",
  },
] as const;

/** Hub page text */
export const MULTIVERSE_HUB = {
  label: "Behind the portfolio",
  heading: "There's more\nbehind the work.",
  subtitle: "Three rooms. Each shows a different side of the work.",
  backLabel: "Back to portfolio",
  backHint: "to return",
} as const;
