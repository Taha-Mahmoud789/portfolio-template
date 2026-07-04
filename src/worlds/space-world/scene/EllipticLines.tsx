/**
 * EllipticLines — Subtle Orbital Grid
 *
 * Reduced count, subtler opacity, depth-based fade.
 * Should feel like faint navigation guides, not visual elements.
 * Premium sci-fi aesthetic.
 */

import { useMemo } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";

export function EllipticLines() {
  const rings = useMemo(() => {
    const result = [];
    for (let i = 0; i < 12; i++) {
      const gap = 0.08 + Math.random() * 0.004;
      const hue = 0.12 - (i / 12) * 0.12;
      const lightness = 0.45 - (i / 12) * 0.45;
      result.push({ radius: 1.2 + i * gap, hue, lightness, key: i });
    }
    return result;
  }, []);

  const radialLines = useMemo(() => {
    const lines = [];
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const minRadius = 1.2 + Math.random() * 0.1;
      const points: THREE.Vector3[] = [];
      for (let j = 0; j < 8; j++) {
        const r = minRadius + j / 6;
        points.push(new THREE.Vector3(Math.cos(angle) * r, 0, Math.sin(angle) * r));
      }
      const hue = 0.12 - (i / 20) * 0.12;
      const col = new THREE.Color().setHSL(hue, 0.8, 0.4);
      lines.push({ points, color: col, key: i });
    }
    return lines;
  }, []);

  return (
    <group>
      {/* Orbit rings — rotated 90° to lie flat */}
      <group rotation={[Math.PI * 0.5, 0, 0]}>
        {rings.map((ring) => {
          const points: THREE.Vector3[] = [];
          for (let i = 0; i <= 128; i++) {
            const a = (i / 128) * Math.PI * 2;
            points.push(new THREE.Vector3(Math.cos(a) * ring.radius, Math.sin(a) * ring.radius, 0));
          }
          const color = new THREE.Color().setHSL(ring.hue, 0.8, ring.lightness);
          return (
            <Line
              key={ring.key}
              points={points}
              color={color}
              lineWidth={0.4}
              transparent
              opacity={0.1}
            />
          );
        })}
      </group>

      {/* Radial lines — thinner, fewer */}
      {radialLines.map((line) => (
        <Line
          key={`r-${String(line.key)}`}
          points={line.points}
          color={line.color}
          lineWidth={0.3}
          transparent
          opacity={0.06}
        />
      ))}
    </group>
  );
}
