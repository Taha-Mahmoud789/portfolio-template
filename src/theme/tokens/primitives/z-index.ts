/**
 * Primitive Z-Index Tokens
 *
 * Raw z-index values. Use semantic zIndex tokens in components.
 * NEVER used directly in components.
 */

export const zIndex = {
  base: 0,
  raised: 10,
  dropdown: 20,
  sticky: 30,
  overlay: 40,
  modal: 50,
  toast: 60,
  tooltip: 70,
  cursor: 80,
  max: 9999,
} as const;
