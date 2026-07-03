/**
 * Semantic Radius Tokens
 *
 * Contextual border-radius assignments.
 * Components USE these tokens.
 */

import { radius } from "../primitives/radius";

export const radiusSemantic = {
  none: radius.none,
  xs: radius.xs,
  sm: radius.sm,
  md: radius.md,
  lg: radius.lg,
  xl: radius.xl,
  "2xl": radius["2xl"],
  "3xl": radius["3xl"],
  full: radius.full,

  // --- Component-specific ---
  button: radius.md,
  input: radius.md,
  card: radius.lg,
  badge: radius.full,
  avatar: radius.full,
  modal: radius.xl,
  tooltip: radius.sm,
} as const;

export type RadiusToken = keyof typeof radiusSemantic;
