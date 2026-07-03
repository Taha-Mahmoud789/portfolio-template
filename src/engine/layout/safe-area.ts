/**
 * Safe Area Utilities
 *
 * CSS and JS utilities for handling safe areas on notched devices.
 */

import type { CSSProperties } from "react";

/**
 * CSS values for safe area insets.
 * Use these in CSS-in-JS or inline styles.
 */
export const safeAreaInset = {
  top: "env(safe-area-inset-top)",
  right: "env(safe-area-inset-right)",
  bottom: "env(safe-area-inset-bottom)",
  left: "env(safe-area-inset-left)",
} as const;

/**
 * Generate padding styles that account for safe areas.
 *
 * @example
 * const style = safeAreaPadding("all");
 * // => { paddingTop: "env(safe-area-inset-top)", ... }
 *
 * const style = safeAreaPadding("bottom");
 * // => { paddingBottom: "env(safe-area-inset-bottom)" }
 */
export function safeAreaPadding(
  sides: "all" | "top" | "right" | "bottom" | "left" | "vertical" | "horizontal",
): CSSProperties {
  switch (sides) {
    case "all":
      return {
        paddingTop: safeAreaInset.top,
        paddingRight: safeAreaInset.right,
        paddingBottom: safeAreaInset.bottom,
        paddingLeft: safeAreaInset.left,
      };
    case "top":
      return { paddingTop: safeAreaInset.top };
    case "right":
      return { paddingRight: safeAreaInset.right };
    case "bottom":
      return { paddingBottom: safeAreaInset.bottom };
    case "left":
      return { paddingLeft: safeAreaInset.left };
    case "vertical":
      return {
        paddingTop: safeAreaInset.top,
        paddingBottom: safeAreaInset.bottom,
      };
    case "horizontal":
      return {
        paddingLeft: safeAreaInset.left,
        paddingRight: safeAreaInset.right,
      };
  }
}

/**
 * Generate margin styles that account for safe areas.
 */
export function safeAreaMargin(
  sides: "all" | "top" | "right" | "bottom" | "left" | "vertical" | "horizontal",
): CSSProperties {
  switch (sides) {
    case "all":
      return {
        marginTop: safeAreaInset.top,
        marginRight: safeAreaInset.right,
        marginBottom: safeAreaInset.bottom,
        marginLeft: safeAreaInset.left,
      };
    case "top":
      return { marginTop: safeAreaInset.top };
    case "right":
      return { marginRight: safeAreaInset.right };
    case "bottom":
      return { marginBottom: safeAreaInset.bottom };
    case "left":
      return { marginLeft: safeAreaInset.left };
    case "vertical":
      return {
        marginTop: safeAreaInset.top,
        marginBottom: safeAreaInset.bottom,
      };
    case "horizontal":
      return {
        marginLeft: safeAreaInset.left,
        marginRight: safeAreaInset.right,
      };
  }
}

/**
 * Tailwind CSS class strings for safe area insets.
 */
export const safeAreaClasses = {
  pt: "pt-[env(safe-area-inset-top)]",
  pr: "pr-[env(safe-area-inset-right)]",
  pb: "pb-[env(safe-area-inset-bottom)]",
  pl: "pl-[env(safe-area-inset-left)]",
  px: "px-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]",
  py: "py-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
  p: "p-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)]",
  mt: "mt-[env(safe-area-inset-top)]",
  mr: "mr-[env(safe-area-inset-right)]",
  mb: "mb-[env(safe-area-inset-bottom)]",
  ml: "ml-[env(safe-area-inset-left)]",
  mx: "ml-[env(safe-area-inset-left)] mr-[env(safe-area-inset-right)]",
  my: "mt-[env(safe-area-inset-top)] mb-[env(safe-area-inset-bottom)]",
  m: "mt-[env(safe-area-inset-top)] mr-[env(safe-area-inset-right)] mb-[env(safe-area-inset-bottom)] ml-[env(safe-area-inset-left)]",
} as const;

/**
 * Viewport utility classes for dynamic viewport units.
 */
export const viewportClasses = {
  /** Full dynamic viewport height */
  hScreen: "h-[100dvh]",
  /** Small viewport height */
  hScreenSmall: "h-[100svh]",
  /** Large viewport height */
  hScreenLarge: "h-[100lvh]",
  /** Full dynamic viewport width */
  wScreen: "w-[100dvw]",
  /** Small viewport width */
  wScreenSmall: "w-[100svw]",
  /** Large viewport width */
  wScreenLarge: "w-[100lvw]",
  /** Min height dynamic viewport */
  minHScreen: "min-h-[100dvh]",
  /** Max height dynamic viewport */
  maxHScreen: "max-h-[100dvh]",
} as const;
