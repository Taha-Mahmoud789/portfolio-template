/**
 * Landing Experience Constants
 *
 * Logo path and layout values for the landing page.
 */

// ============================================================================
// FM Logo Path — simplified vector segments
// ============================================================================

/**
 * Normalized FM logo path (0-1 range).
 * Each segment: [x, y] pairs forming the F and M letters.
 */
const FM_LOGO_F: [number, number][] = [
  [0.0, 0.0], [0.35, 0.0],   // top bar
  [0.12, 0.0], [0.12, 0.5],  // vertical stem
  [0.12, 0.25], [0.3, 0.25], // middle bar
];

const FM_LOGO_M: [number, number][] = [
  [0.45, 0.0], [0.45, 0.5],  // left stem
  [0.45, 0.0], [0.6, 0.3],   // left diagonal
  [0.6, 0.3], [0.75, 0.0],   // right diagonal
  [0.75, 0.0], [0.75, 0.5],  // right stem
];

export const FM_LOGO_PATH: [number, number][] = [...FM_LOGO_F, ...FM_LOGO_M];

// ============================================================================
// Logo Layout
// ============================================================================

export const LOGO = {
  /** Logo dimensions as fraction of viewport (capped) */
  widthFraction: 0.35,
  heightFraction: 0.2,
  maxWidth: 400,
  maxHeight: 160,
  /** Stroke width for logo lines */
  strokeWidth: 2,
  /** Particle count forming the logo */
  particleCount: 300,
  /** Particle radius range */
  particleMinRadius: 0.8,
  particleMaxRadius: 2.5,
} as const;
