export const ANIMATION_EASINGS = {
  expoOut: "expo.out",
  expoIn: "expo.in",
  backOut: "back.out(1.7)",
  powerOut: "power3.out",
  powerIn: "power3.in",
  powerInOut: "power3.inOut",
  linear: "none",
} as const;

export const ANIMATION_DURATIONS = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
  instant: 0.1,
} as const;

export const ANIMATION_DELAYS = {
  none: 0,
  small: 0.1,
  medium: 0.2,
  large: 0.3,
  xlarge: 0.5,
} as const;
