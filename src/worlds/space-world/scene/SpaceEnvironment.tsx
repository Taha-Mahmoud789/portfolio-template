/**
 * SpaceEnvironment — Fog, Lighting (Awwwards Grade)
 *
 * Atmospheric depth through FogExp2, directional key light for planet shaders,
 * hemisphere light for ambient color separation.
 * The cosmos is indifferent — the environment is the void.
 */

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { DirectionalLight } from "three";
import { useReducedMotion } from "../hooks";

// ============================================================================
// Constants
// ============================================================================

const FOG_CONFIG = {
  color: "#030712",
  density: 0.012,
} as const;

const LIGHT_CONFIG = {
  key: {
    color: "#e2e8f0",
    intensity: 0.8,
    position: [10, 5, 8] as [number, number, number],
  },
  fill: {
    color: "#6366f1",
    intensity: 0.15,
    position: [-8, -3, -5] as [number, number, number],
  },
  rim: {
    color: "#06b6d4",
    intensity: 0.1,
    position: [0, 8, -10] as [number, number, number],
  },
} as const;

// ============================================================================
// Component
// ============================================================================

export function SpaceEnvironment(): React.JSX.Element {
  const directionalRef = useRef<DirectionalLight>(null);
  const reducedMotion = useReducedMotion();
  const timeRef = useRef(0);

  useFrame((_state, delta) => {
    if (reducedMotion) return;
    if (!directionalRef.current) return;

    timeRef.current += delta;

    // Subtle light drift — distant star movement
    const t = timeRef.current;
    directionalRef.current.position.x = LIGHT_CONFIG.key.position[0] + Math.sin(t * 0.05) * 2;
    directionalRef.current.position.y = LIGHT_CONFIG.key.position[1] + Math.cos(t * 0.07) * 1;
  });

  return (
    <>
      {/* Scene fog — atmospheric depth */}
      <fogExp2 attach="fog" args={[FOG_CONFIG.color, FOG_CONFIG.density]} />

      {/* Ambient — very dim, space-tinted */}
      <ambientLight intensity={0.03} color="#c7d2fe" />

      {/* Hemisphere — subtle sky/ground separation */}
      <hemisphereLight args={["#6366f1", "#030712", 0.08]} />

      {/* Key light — directional, consistent for planet shaders */}
      <directionalLight
        ref={directionalRef}
        position={LIGHT_CONFIG.key.position}
        intensity={LIGHT_CONFIG.key.intensity}
        color={LIGHT_CONFIG.key.color}
      />

      {/* Fill light — indigo accent */}
      <pointLight
        position={LIGHT_CONFIG.fill.position}
        intensity={LIGHT_CONFIG.fill.intensity}
        color={LIGHT_CONFIG.fill.color}
        distance={50}
        decay={2}
      />

      {/* Rim light — cyan edge */}
      <pointLight
        position={LIGHT_CONFIG.rim.position}
        intensity={LIGHT_CONFIG.rim.intensity}
        color={LIGHT_CONFIG.rim.color}
        distance={60}
        decay={2}
      />
    </>
  );
}
