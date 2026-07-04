/**
 * Orbit Ring
 *
 * Visual ring around an orbit path.
 * Renders as a thin torus.
 */

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import type { OrbitConfig } from "../data/types";

interface OrbitRingProps {
  orbit: OrbitConfig;
  color?: string;
  opacity?: number;
}

export function OrbitRing({ orbit, color = "#ffffff", opacity = 0.1 }: OrbitRingProps) {
  const ref = useRef<Mesh>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x = Math.PI / 2;
    }
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[orbit.radius, 0.01, 16, 100]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}
