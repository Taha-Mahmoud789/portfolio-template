/**
 * Animation Duration Constants
 *
 * Duration values in seconds for consistent timing.
 */

export const ANIMATION_DURATIONS = {
  instant: 0,
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  slower: 0.7,
  slowest: 1,
  ultra: 1.5,
  cinematic: 2,
} as const;

export type AnimationDuration = keyof typeof ANIMATION_DURATIONS;

/** Get duration value in seconds */
export function getDuration(name: AnimationDuration): number {
  return ANIMATION_DURATIONS[name];
}

/** Convert milliseconds to seconds */
export function msToSeconds(ms: number): number {
  return ms / 1000;
}

/** Convert seconds to milliseconds */
export function secondsToMs(seconds: number): number {
  return seconds * 1000;
}
