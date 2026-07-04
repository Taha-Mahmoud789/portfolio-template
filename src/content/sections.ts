/**
 * Section Text
 *
 * Only text shared across multiple components.
 * Page-specific text lives in the component itself.
 */

export const SECTIONS = {
  hero: {
    greeting: {
      morning: "Good morning",
      afternoon: "Good afternoon",
      evening: "Good evening",
    },
    headline1: "INTERFACES THAT",
    headline2: "MOVE",
  },
  screenReader: "Welcome to the Creative Developer Portfolio. Scroll to explore.",
} as const;
