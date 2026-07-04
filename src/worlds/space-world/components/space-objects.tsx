/**
 * Space Objects
 *
 * Renders all scene objects from the registry.
 * Each object handles its own hover/select/focus states.
 * Objects are grouped by orbit for visual hierarchy.
 */

import { useSpaceWorld } from "../hooks";
import { SpaceObjectMesh } from "./space-object-mesh";

export function SpaceObjects() {
  const { objects, hoveredId, focusedId, hoverObject, selectObject } = useSpaceWorld();

  return (
    <group>
      {objects.map((obj) => (
        <SpaceObjectMesh
          key={obj.id}
          object={obj}
          isHovered={hoveredId === obj.id}
          isFocused={focusedId === obj.id}
          hoveredId={hoveredId}
          onHover={hoverObject}
          onSelect={selectObject}
        />
      ))}
    </group>
  );
}
