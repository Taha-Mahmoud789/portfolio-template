/**
 * ConstellationLines — Spatial UI Connections
 *
 * Thin, solid lines connecting points.
 * Not dashed. Not animated. Just presence.
 * Like connection guidelines in a spatial interface.
 */

import { useMemo } from "react";
import { Line as DreiLine } from "@react-three/drei";
import { CONSTELLATIONS } from "../config";

interface ConstellationLineProps {
  readonly points: [number, number, number][];
  readonly opacity: number;
  readonly color: string;
}

function ConstellationLine({ points, opacity, color }: ConstellationLineProps) {
  return <DreiLine points={points} color={color} lineWidth={0.5} transparent opacity={opacity} />;
}

export function ConstellationLines() {
  const constellationData = useMemo(() => {
    // Only use first 3 constellations — less is more
    return CONSTELLATIONS.slice(0, 3).map((constellation) => {
      const positions: [number, number, number][] = constellation.points.map(
        (point): [number, number, number] => [
          ((point.x - 50) / 50) * 10,
          ((50 - point.y) / 50) * 10,
          -8,
        ],
      );

      const lines = constellation.lines.map((connection): [number, number, number][] => {
        const start = positions[connection[0]] ?? [0, 0, 0];
        const end = positions[connection[1]] ?? [0, 0, 0];
        return [start, end];
      });

      const firstBrightness = constellation.points[0].brightness;

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
            opacity={constellation.brightness * 0.15}
            color="#b8a990"
          />
        )),
      )}
    </group>
  );
}
