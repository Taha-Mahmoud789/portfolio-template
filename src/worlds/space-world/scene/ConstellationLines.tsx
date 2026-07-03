/**
 * ConstellationLines — Three.js Line Geometry
 *
 * Connects constellation points with thin, glowing lines.
 * Lines fade in/out based on camera distance.
 */

import { useMemo } from "react";
import { Line as DreiLine } from "@react-three/drei";
import { CONSTELLATIONS } from "../config";

// ============================================================================
// Types
// ============================================================================

interface ConstellationLineProps {
  readonly points: [number, number, number][];
  readonly opacity: number;
  readonly color: string;
}

// ============================================================================
// Component
// ============================================================================

function ConstellationLine({ points, opacity, color }: ConstellationLineProps): React.JSX.Element {
  return (
    <DreiLine
      points={points}
      color={color}
      lineWidth={0.5}
      transparent
      opacity={opacity}
      dashed
      dashScale={5}
      dashSize={0.5}
      gapSize={1}
    />
  );
}

// ============================================================================
// Main ConstellationLines
// ============================================================================

export function ConstellationLines(): React.JSX.Element {
  const constellationData = useMemo(() => {
    return CONSTELLATIONS.map((constellation) => {
      // Convert percentage positions to 3D coordinates
      const positions: [number, number, number][] = constellation.points.map(
        (point): [number, number, number] => [
          ((point.x - 50) / 50) * 10,
          ((50 - point.y) / 50) * 10,
          -5 - Math.random() * 5,
        ],
      );

      // Create line segments from connections
      const lines = constellation.lines.map((connection): [number, number, number][] => {
        const start = positions[connection[0]] ?? [0, 0, 0];
        const end = positions[connection[1]] ?? [0, 0, 0];
        return [start, end];
      });

      const firstBrightness = constellation.points[0]?.brightness;

      return {
        id: constellation.id,
        lines,
        brightness: typeof firstBrightness === "number" ? firstBrightness : 0.5,
      };
    });
  }, []);

  return (
    <group>
      {constellationData.map((constellation) =>
        constellation.lines.map((linePoints, i) => (
          <ConstellationLine
            key={`${constellation.id}-${String(i)}`}
            points={linePoints}
            opacity={constellation.brightness * 0.3}
            color="#6366f1"
          />
        )),
      )}
    </group>
  );
}
