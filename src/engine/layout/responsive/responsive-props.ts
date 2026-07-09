/**
 * Responsive Prop System
 *
 * Allows layout components to accept breakpoint-based prop overrides.
 *
 * Usage:
 *   <Grid columns={{ sm: 1, md: 2, lg: 3 }} />
 *   <Section padding={{ sm: "sm", lg: "xl" }} />
 *   <Container size={{ md: "lg", xl: "2xl" }} />
 */

import type { Breakpoint } from "./breakpoints";
import { BREAKPOINT_ORDER } from "./breakpoints";

/**
 * A value that can be responsive across breakpoints.
 *
 * - `string | number` — static value, same at all breakpoints
 * - `{ sm?: T; md?: T; lg?: T; xl?: T; "2xl"?: T }` — breakpoint-specific overrides
 */
export type Responsive<T> = T | Partial<Record<Breakpoint, T>>;

/**
 * Check if a value is a responsive object (vs a static value).
 */
export function isResponsiveValue<T>(
  value: Responsive<T>,
): value is Partial<Record<Breakpoint, T>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Resolve a responsive value to its final value for the current breakpoint.
 *
 * Uses mobile-first cascade: values from smaller breakpoints
 * carry forward to larger ones unless overridden.
 *
 * @param value - The responsive value to resolve
 * @param currentBreakpoint - The current active breakpoint
 * @returns The resolved static value
 *
 * @example
 * // columns={{ sm: 1, md: 2, lg: 3 }}
 * // At "lg" breakpoint => returns 3
 * // At "md" breakpoint => returns 2
 * // At "xs" (below sm) => returns 1 (falls back to sm)
 */
export function resolveResponsive<T>(
  value: Responsive<T>,
  currentBreakpoint: Breakpoint | "xs",
): T {
  if (!isResponsiveValue(value)) {
    return value;
  }

  const responsiveObj = value;

  // Start from the current breakpoint and cascade down to find the value
  const startIndex = BREAKPOINT_ORDER.indexOf(currentBreakpoint as Breakpoint);
  const effectiveIndex = startIndex === -1 ? 0 : startIndex;

  // Walk backwards from current breakpoint to find the nearest defined value
  for (let i = effectiveIndex; i >= 0; i--) {
    const bp = BREAKPOINT_ORDER[i];
    if (bp !== undefined && responsiveObj[bp] !== undefined) {
      return responsiveObj[bp];
    }
  }

  // If no value found walking backwards, try walking forwards (for "xs" below sm)
  for (const bp of BREAKPOINT_ORDER) {
    if (bp !== undefined && responsiveObj[bp] !== undefined) {
      return responsiveObj[bp];
    }
  }

  // This should never happen with a proper Responsive<T> value
  throw new Error("Could not resolve responsive value");
}

/**
 * Resolve a responsive value for multiple breakpoints and return a map.
 *
 * Useful for generating responsive Tailwind classes.
 *
 * @param value - The responsive value to resolve
 * @returns A map of breakpoint -> resolved value
 *
 * @example
 * // resolveResponsiveMap({ sm: 1, md: 2, lg: 3 })
 * // => { sm: 1, md: 2, lg: 3, xl: 3, "2xl": 3 }
 */
export function resolveResponsiveMap<T>(value: Responsive<T>): Record<Breakpoint, T> {
  if (!isResponsiveValue(value)) {
    const map = {} as Record<Breakpoint, T>;
    for (const bp of BREAKPOINT_ORDER) {
      map[bp] = value;
    }
    return map;
  }

  const result = {} as Record<Breakpoint, T>;
  let lastValue: T | undefined;

  for (const bp of BREAKPOINT_ORDER) {
    const responsiveObj = value;
    if (responsiveObj[bp] !== undefined) {
      lastValue = responsiveObj[bp];
    }
    if (lastValue !== undefined) {
      result[bp] = lastValue;
    }
  }

  return result;
}
