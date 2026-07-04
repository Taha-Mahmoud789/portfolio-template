/**
 * ConnectionLines — Premium spatial connections
 *
 * Ultra-thin gold lines linking related objects.
 * Reacts to hover and focus.
 * Premium feel — subtle, not distracting.
 */

import { useMemo } from "react";
import { Line as DreiLine } from "@react-three/drei";
import { CONNECTIONS, OBJECTS } from "../data/space.config";

interface ConnectionLineProps {
  readonly fromPosition: [number, number, number];
  readonly toPosition: [number, number, number];
  readonly isActive: boolean;
}

function ConnectionLine({ fromPosition, toPosition, isActive }: ConnectionLineProps) {
  const opacity = isActive ? 0.2 : 0.03;
  const lineWidth = isActive ? 0.5 : 0.2;

  return (
    <DreiLine
      points={[fromPosition, toPosition]}
      color="#C9A96E"
      lineWidth={lineWidth}
      transparent
      opacity={opacity}
    />
  );
}

export function ConnectionLines({
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
      {validConnections.map((conn) => {
        const from = objectMap.get(conn.from);
        const to = objectMap.get(conn.to);
        if (!from || !to) return null;

        const isActive = activeId === conn.from || activeId === conn.to;

        return (
          <ConnectionLine
            key={`${conn.from}-${conn.to}`}
            fromPosition={from.position}
            toPosition={to.position}
            isActive={isActive}
          />
        );
      })}
    </group>
  );
}
