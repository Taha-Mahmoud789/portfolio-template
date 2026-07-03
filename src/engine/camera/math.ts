/**
 * Cinematic Camera System — Math Utilities
 *
 * Spring physics, lerp, easing, and vector math.
 * All functions are pure and allocation-free.
 */

import { Vector3 } from "three";
import type { EasingFunction, EasingName } from "./types";

// ============================================================================
// Constants
// ============================================================================

const TWO_PI = Math.PI * 2;

// ============================================================================
// Core Math
// ============================================================================

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function inverseLerp(a: number, b: number, value: number): number {
  if (a === b) return 0;
  return (value - a) / (b - a);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function remap(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  const t = inverseLerp(inMin, inMax, value);
  return lerp(outMin, outMax, t);
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

// ============================================================================
// Spring Physics
// ============================================================================

export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

/**
 * Critical damping coefficient for a spring.
 * Returns the damping value that gives fastest convergence without oscillation.
 */
export function criticalDamping(stiffness: number): number {
  return 2 * Math.sqrt(stiffness);
}

/**
 * Step a spring forward by dt.
 * Returns the new value and velocity.
 */
export function springStep(
  current: number,
  target: number,
  velocity: number,
  stiffness: number,
  damping: number,
  mass: number,
  dt: number,
): { value: number; velocity: number } {
  const displacement = current - target;
  const springForce = -stiffness * displacement;
  const dampingForce = -damping * velocity;
  const acceleration = (springForce + dampingForce) / mass;
  const newVelocity = velocity + acceleration * dt;
  const newValue = current + newVelocity * dt;
  return { value: newValue, velocity: newVelocity };
}

/**
 * Step a Vector3 spring forward by dt.
 * Modifies target vectors in-place for zero allocation.
 */
export function springStepVec3(
  current: Vector3,
  target: Vector3,
  velocity: Vector3,
  stiffness: number,
  damping: number,
  mass: number,
  dt: number,
): void {
  const dx = current.x - target.x;
  const dy = current.y - target.y;
  const dz = current.z - target.z;

  const ax = (-stiffness * dx - damping * velocity.x) / mass;
  const ay = (-stiffness * dy - damping * velocity.y) / mass;
  const az = (-stiffness * dz - damping * velocity.z) / mass;

  velocity.x += ax * dt;
  velocity.y += ay * dt;
  velocity.z += az * dt;

  current.x += velocity.x * dt;
  current.y += velocity.y * dt;
  current.z += velocity.z * dt;
}

/**
 * Check if a spring has settled (value and velocity are near target).
 */
export function springSettled(
  current: number,
  target: number,
  velocity: number,
  threshold = 0.001,
): boolean {
  return Math.abs(current - target) < threshold && Math.abs(velocity) < threshold;
}

// ============================================================================
// Smooth Damp (Unity-style)
// ============================================================================

/**
 * Smoothly damp a value toward a target.
 * Returns the new value and modifies velocity in-place.
 */
export function smoothDamp(
  current: number,
  target: number,
  velocity: { value: number },
  smoothTime: number,
  maxSpeed: number,
  dt: number,
): number {
  const omega = 2 / Math.max(smoothTime, 0.0001);
  const x = omega * dt;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  let change = current - target;
  const maxChange = maxSpeed * smoothTime;
  change = clamp(change, -maxChange, maxChange);
  const temp = (velocity.value + omega * change) * dt;
  velocity.value = (velocity.value - omega * temp) * exp;
  let output = target + (change + temp) * exp;
  // Prevent overshooting
  if (target - current > 0 === output > target) {
    output = target;
    velocity.value = (output - target) / dt;
  }
  return output;
}

// ============================================================================
// Easing Functions
// ============================================================================

export const easings: Record<EasingName, EasingFunction> = {
  linear: (t) => t,

  easeIn: (t) => t * t,
  easeOut: (t) => t * (2 - t),
  easeInOut: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),

  easeInCubic: (t) => t * t * t,
  easeOutCubic: (t) => --t * t * t + 1,
  easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),

  easeInExpo: (t) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
  easeOutExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutExpo: (t) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
    return (2 - Math.pow(2, -20 * t + 10)) / 2;
  },

  spring: (t) => {
    const c4 = (TWO_PI / 3) * (t < 0.5 ? 1 : 1);
    if (t < 0.5) {
      return -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c4)) / 2;
    }
    return (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c4)) / 2 + 1;
  },

  bounce: (t) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  },

  elastic: (t) => {
    if (t === 0 || t === 1) return t;
    return -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * ((TWO_PI * 2) / 3));
  },
};

/**
 * Get an easing function by name.
 */
export function getEasing(name: EasingName): EasingFunction {
  return easings[name];
}

// ============================================================================
// Vector Utilities (allocation-free)
// ============================================================================

/** Scratch vectors for temporary computations. Use and return immediately. */
const _scratch = [new Vector3(), new Vector3(), new Vector3(), new Vector3()] as const;

let scratchIndex = 0;

/**
 * Acquire a scratch vector. Must call releaseScratch() when done.
 */
export function acquireScratch(): Vector3 {
  const v = _scratch[scratchIndex % _scratch.length] ?? new Vector3();
  scratchIndex++;
  return v;
}

/**
 * Release a scratch vector (no-op, just for clarity).
 */
export function releaseScratch(_v: Vector3): void {
  // Scratch vectors are reused by index, no actual release needed.
}

/**
 * Lerp two Vector3 in-place.
 */
export function lerpVec3(out: Vector3, a: Vector3, b: Vector3, t: number): Vector3 {
  out.x = a.x + (b.x - a.x) * t;
  out.y = a.y + (b.y - a.y) * t;
  out.z = a.z + (b.z - a.z) * t;
  return out;
}

/**
 * Clamp a Vector3's magnitude.
 */
export function clampMagnitudeVec3(v: Vector3, max: number): Vector3 {
  const len = v.length();
  if (len > max && len > 0) {
    v.multiplyScalar(max / len);
  }
  return v;
}

/**
 * Compute distance between two points (squared for comparison).
 */
export function distanceSq(a: Vector3, b: Vector3): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return dx * dx + dy * dy + dz * dz;
}

/**
 * Compute distance between two points.
 */
export function distance(a: Vector3, b: Vector3): number {
  return Math.sqrt(distanceSq(a, b));
}
