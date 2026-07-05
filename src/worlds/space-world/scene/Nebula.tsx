/**
 * Nebula — Cinematic Depth Layers
 *
 * Subtle nebula clouds with premium color palette:
 * - Warm gold dust
 * - Cool blue mist
 * - Deep violet haze
 *
 * Very low opacity, additive blending for ethereal feel.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface NebulaCloudProps {
  readonly position: [number, number, number];
  readonly count: number;
  readonly radius: number;
  readonly size: number;
  readonly color: string;
  readonly opacity: number;
}

function NebulaCloud({ position, count, radius, size, color, opacity }: NebulaCloudProps) {
  const groupRef = useRef<THREE.Group>(null);

  const material = useMemo(() => {
    return new THREE.SpriteMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [color, opacity]);

  const sprites = useMemo(() => {
    const result: { x: number; y: number; z: number; s: number }[] = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.random() * radius;
      result.push({
        x: Math.sin(phi) * Math.cos(theta) * r,
        y: Math.sin(phi) * Math.sin(theta) * r,
        z: Math.cos(phi) * r,
        s: size * (0.5 + Math.random() * 0.5),
      });
    }
    return result;
  }, [count, radius, size]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.002;
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
      {/* Back layer — deep blue mist */}
      <NebulaCloud
        position={[0, 0, -50]}
        count={8}
        radius={18}
        size={12}
        color="#0a1628"
        opacity={0.06}
      />
      {/* Warm gold dust — mid depth */}
      <NebulaCloud
        position={[-15, 6, -30]}
        count={5}
        radius={12}
        size={9}
        color="#2a2010"
        opacity={0.04}
      />
      {/* Cool violet — side */}
      <NebulaCloud
        position={[20, -5, -35]}
        count={4}
        radius={10}
        size={8}
        color="#15102a"
        opacity={0.03}
      />
    </group>
  );
}
