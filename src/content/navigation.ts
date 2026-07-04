/**
 * Navigation
 *
 * Single source of truth for all navigation links.
 * Used by: main nav, creative menu, footer, command palette.
 */

import type { NavLink, MenuItem } from "./types";

/** Main navigation links — used by nav bar and footer */
export const NAV_LINKS: readonly NavLink[] = [
  { label: "Home", href: "#hero" },
  { label: "Work", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Expertise", href: "#expertise" },
  { label: "Worlds", href: "/worlds" },
  { label: "Contact", href: "#contact" },
] as const;

/** Footer navigation links — includes "How I Work" */
export const FOOTER_NAV_LINKS: readonly NavLink[] = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Expertise", href: "#expertise" },
  { label: "Worlds", href: "/worlds" },
  { label: "How I Work", href: "#how-i-work" },
  { label: "Contact", href: "#contact" },
] as const;

/** Creative menu items — numbered labels for fullscreen menu */
export const MENU_ITEMS: readonly MenuItem[] = [
  { number: "01", label: "HOME", href: "#hero" },
  { number: "02", label: "WORK", href: "#projects" },
  { number: "03", label: "ABOUT", href: "#about" },
  { number: "04", label: "EXPERTISE", href: "#expertise" },
  { number: "05", label: "WORLDS", href: "/worlds" },
  { number: "06", label: "CONTACT", href: "#contact" },
] as const;

/** Command palette actions — Ctrl+K menu */
export const COMMAND_ACTIONS = [
  {
    id: "home",
    label: "Go Home",
    description: "Return to the landing page",
    shortcut: "H",
  },
  {
    id: "projects",
    label: "View Projects",
    description: "Browse all case studies",
    shortcut: "P",
  },
  {
    id: "contact",
    label: "Open Contact",
    description: "Get in touch",
    shortcut: "C",
  },
  {
    id: "about",
    label: "About",
    description: "Learn about the developer",
    shortcut: "A",
  },
  {
    id: "expertise",
    label: "Expertise",
    description: "View skills and capabilities",
    shortcut: "E",
  },
] as const;
