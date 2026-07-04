/**
 * ConnectionArcs — Premium Animated Connections
 *
 * Quadratic bezier curves with:
 * - Animated particle flow (small dots moving along the path)
 * - Glow effect on hover/focus
 * - Thinner default, thicker on activation
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { CONNECTIONS, OBJECTS } from "../data/space.config";

interface ConnectionArcProps {
  readonly fromPosition: [number, number, number];
  readonly toPosition: [number, number, number];
  readonly isActive: boolean;
  readonly index: number;
}

function ConnectionArc({ fromPosition, toPosition, isActive, index }: ConnectionArcProps) {
  const dotRef = useRef<THREE.Mesh>(null);

  const midPoint = useMemo(() => {
    const mx = (fromPosition[0] + toPosition[0]) / 2;
    const my = (fromPosition[1] + toPosition[1]) / 2 + 0.8;
    const mz = (fromPosition[2] + toPosition[2]) / 2;
    return [mx, my, mz] as [number, number, number];
  }, [fromPosition, toPosition]);

  const points = useMemo(() => {
    const steps = 24;
    const result: THREE.Vector3[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x =
        fromPosition[0] * (1 - t) * (1 - t) + midPoint[0] * 2 * (1 - t) * t + toPosition[0] * t * t;
      const y =
        fromPosition[1] * (1 - t) * (1 - t) + midPoint[1] * 2 * (1 - t) * t + toPosition[1] * t * t;
      const z =
        fromPosition[2] * (1 - t) * (1 - t) + midPoint[2] * 2 * (1 - t) * t + toPosition[2] * t * t;
      result.push(new THREE.Vector3(x, y, z));
    }
    return result;
  }, [fromPosition, toPosition, midPoint]);

  // Animated dot along the arc
  useFrame((state) => {
    if (!dotRef.current || !isActive) return;
    const t = (state.clock.elapsedTime * 0.3 + index * 0.5) % 1;
    const idx = Math.floor(t * (points.length - 1));
    const nextIdx = Math.min(idx + 1, points.length - 1);
    const localT = (t * (points.length - 1)) % 1;
    const pos = points[idx]?.clone().lerp(points[nextIdx] ?? points[idx], localT);
    if (pos) dotRef.current.position.copy(pos);
  });

  const opacity = isActive ? 0.3 : 0.03;
  const lineWidth = isActive ? 0.6 : 0.15;

  return (
    <group>
      <Line points={points} color="#C9A96E" lineWidth={lineWidth} transparent opacity={opacity} />
      {/* Animated flow dot — only visible when active */}
      {isActive && (
        <mesh ref={dotRef}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#C9A96E" transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
}

export function ConnectionArcs({
  focusedId,
  hoveredId,
}: {
  readonly focusedId: string | null;
  readonly hoveredId: string | null;
}) {
  const objectMap = useMemo(() => {
    const map = new Map<string, (typeof OBJECTS)[number]>();
    for (const obj of OBJECTS) {
      map.set(obj.id, obj);
    }
    return map;
  }, []);

  const validConnections = useMemo(() => {
    return CONNECTIONS.filter((conn) => {
      const from = objectMap.get(conn.from);
      const to = objectMap.get(conn.to);
      return from && to && from.visible && to.visible;
    });
  }, [objectMap]);

  const activeId = focusedId ?? hoveredId;

  return (
    <group>
      {validConnections.map((conn, i) => {
        const from = objectMap.get(conn.from);
        const to = objectMap.get(conn.to);
        if (!from || !to) return null;

        const isActive = activeId === conn.from || activeId === conn.to;

        return (
          <ConnectionArc
            key={`${conn.from}-${conn.to}`}
            fromPosition={from.position}
            toPosition={to.position}
            isActive={isActive}
            index={i}
          />
        );
      })}
    </group>
  );
}
