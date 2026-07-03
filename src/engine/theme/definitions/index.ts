/**
 * Theme Definitions
 *
 * All built-in theme definitions for the Theme Engine.
 */

export { appleTheme } from "./apple";
export { cyberpunkTheme } from "./cyberpunk";
export { spaceTheme } from "./space";
export { gamingTheme } from "./gaming";
export { aiTheme } from "./ai";
export { editorialTheme } from "./editorial";
export { liquidTheme } from "./liquid";
export { retroTheme } from "./retro";
export { brutalistTheme } from "./brutalist";
export { experimentalTheme } from "./experimental";

import { appleTheme } from "./apple";
import { cyberpunkTheme } from "./cyberpunk";
import { spaceTheme } from "./space";
import { gamingTheme } from "./gaming";
import { aiTheme } from "./ai";
import { editorialTheme } from "./editorial";
import { liquidTheme } from "./liquid";
import { retroTheme } from "./retro";
import { brutalistTheme } from "./brutalist";
import { experimentalTheme } from "./experimental";

import type { ThemeDefinition } from "../types";

/**
 * All built-in themes as an array.
 */
export const allThemes: ThemeDefinition[] = [
  appleTheme,
  cyberpunkTheme,
  spaceTheme,
  gamingTheme,
  aiTheme,
  editorialTheme,
  liquidTheme,
  retroTheme,
  brutalistTheme,
  experimentalTheme,
];

/**
 * Get a theme by ID.
 */
export function getThemeById(id: string): ThemeDefinition | undefined {
  return allThemes.find((theme) => theme.id === id);
}
