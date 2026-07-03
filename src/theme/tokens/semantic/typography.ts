/**
 * Semantic Typography Tokens
 *
 * Contextual typography assignments.
 * Components USE these tokens.
 */

import {
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
} from "../primitives/typography";

export const typography = {
  // --- Font Families ---
  "font-sans": fontFamily.sans,
  "font-heading": fontFamily.heading,
  "font-mono": fontFamily.mono,

  // --- Font Sizes (with line heights) ---
  "text-2xs": fontSize["2xs"],
  "text-xs": fontSize.xs,
  "text-sm": fontSize.sm,
  "text-base": fontSize.base,
  "text-lg": fontSize.lg,
  "text-xl": fontSize.xl,
  "text-2xl": fontSize["2xl"],
  "text-3xl": fontSize["3xl"],
  "text-4xl": fontSize["4xl"],
  "text-5xl": fontSize["5xl"],
  "text-6xl": fontSize["6xl"],
  "text-7xl": fontSize["7xl"],
  "text-8xl": fontSize["8xl"],
  "text-9xl": fontSize["9xl"],

  // --- Font Weights ---
  "font-thin": fontWeight.thin,
  "font-extralight": fontWeight.extralight,
  "font-light": fontWeight.light,
  "font-regular": fontWeight.regular,
  "font-medium": fontWeight.medium,
  "font-semibold": fontWeight.semibold,
  "font-bold": fontWeight.bold,
  "font-extrabold": fontWeight.extrabold,
  "font-black": fontWeight.black,

  // --- Letter Spacing ---
  "tracking-tighter": letterSpacing.tighter,
  "tracking-tight": letterSpacing.tight,
  "tracking-normal": letterSpacing.normal,
  "tracking-wide": letterSpacing.wide,
  "tracking-wider": letterSpacing.wider,
  "tracking-widest": letterSpacing.widest,

  // --- Line Heights ---
  "leading-none": lineHeight.none,
  "leading-tight": lineHeight.tight,
  "leading-snug": lineHeight.snug,
  "leading-normal": lineHeight.normal,
  "leading-relaxed": lineHeight.relaxed,
  "leading-loose": lineHeight.loose,
} as const;

export type TypographyToken = keyof typeof typography;
