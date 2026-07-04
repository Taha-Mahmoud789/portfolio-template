/**
 * Content System — Public API
 *
 * Import from "@/content" to access all portfolio data.
 *
 * Usage:
 *   import { PROJECTS, PERSONAL_INFO, SERVICES } from "@/content";
 */

// Types — only those imported by components
export type {
  PersonalInfo,
  SocialLink,
  ProjectData,
  Service,
  ExperienceStat,
  WorldData,
} from "./types";

// Data
export { PERSONAL_INFO, SOCIAL_LINKS, ABOUT, INTRO, NOT_FOUND } from "./metadata";
export {
  PROJECTS,
  getProjectBySlug,
  getProjectById,
  getAllProjectSlugs,
  getOrderedProjects,
  getAdjacentProjects,
} from "./projects";
export { SERVICES } from "./skills";
export { EXPERIENCE_STATS, PROCESS_STEPS } from "./experience";
export { NAV_LINKS, FOOTER_NAV_LINKS, MENU_ITEMS, COMMAND_ACTIONS } from "./navigation";
export { WORLDS, MULTIVERSE_HUB } from "./multiverse";
export { SECTIONS } from "./sections";
