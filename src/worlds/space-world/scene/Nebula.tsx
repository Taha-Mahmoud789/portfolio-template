/**
 * Nebula — Cinematic Depth Layers
 *
 * Larger, more visible nebula clouds with:
 * - Better opacity for visibility
 * - Organic sprite layering
 * - Slow rotation for life
 * - Premium color palette (warm gold, cool blue, violet)
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface NebulaCloudProps {
  readonly position: [number, number, number];
  readonly count: number;
  readonly radius: number;
  readonly size: number;
  readonly hue: number;
  readonly opacity: number;
}

function NebulaCloud({ position, count, radius, size, hue, opacity }: NebulaCloudProps) {
  const groupRef = useRef<THREE.Group>(null);

  const sprites = useMemo(() => {
    const result: {
      x: number;
      y: number;
      z: number;
      s: number;
      o: number;
    }[] = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.random() * radius;
      result.push({
        x: Math.sin(phi) * Math.cos(theta) * r,
        y: Math.sin(phi) * Math.sin(theta) * r,
        z: Math.cos(phi) * r,
        s: size * (0.4 + Math.random() * 0.6),
        o: opacity * (0.2 + Math.random() * 0.8),
      });
    }
    return result;
  }, [count, radius, size, opacity]);

  const material = useMemo(() => {
    const color = new THREE.Color().setHSL(hue, 0.5, 0.25);
    return new THREE.SpriteMaterial({
      color,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [hue]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.003;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {sprites.map((s, i) => (
        <sprite
          key={`nebula-${String(i)}`}
          position={[s.x, s.y, s.z]}
          scale={[s.s, s.s, 1]}
          material={material.clone()}
        />
      ))}
    </group>
  );
}

export function Nebula() {
  return (
    <group>
      {/* Back nebula — deep blue/cyan, large and diffuse */}
      <NebulaCloud
        position={[0, 0, -45]}
        count={20}
        radius={15}
        size={10}
        hue={0.55}
        opacity={0.18}
      />
      {/* Warm gold nebula — mid depth */}
      <NebulaCloud
        position={[-10, 5, -25]}
        count={14}
        radius={10}
        size={8}
        hue={0.12}
        opacity={0.12}
      />
      {/* Violet accent nebula — side */}
      <NebulaCloud
        position={[18, -4, -30]}
        count={10}
        radius={8}
        size={7}
        hue={0.75}
        opacity={0.08}
      />
      {/* Subtle red warmth — bottom */}
      <NebulaCloud
        position={[0, -8, -35]}
        count={8}
        radius={10}
        size={9}
        hue={0.02}
        opacity={0.06}
      />
    </group>
  );
}
