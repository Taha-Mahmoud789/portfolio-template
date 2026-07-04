/**
 * Project Galaxy
 *
 * 3D composition for a focused project.
 * Renders only the visual field (floating screenshots).
 * Tech is shown in the 2D panel — no 3D tech web.
 */

import { useMemo } from "react";
import { getProjectGalaxy } from "../data/project-galaxy-data";
import { OBJECTS } from "../data/space.config";
import { ProjectVisualField } from "./project-visual-field";

interface ProjectGalaxyProps {
  readonly objectId: string;
  readonly isVisible: boolean;
}

export function ProjectGalaxy({ objectId, isVisible }: ProjectGalaxyProps) {
  const galaxy = useMemo(() => getProjectGalaxy(objectId), [objectId]);

  const parentPosition: [number, number, number] = useMemo(() => {
    const obj = OBJECTS.find((o) => o.id === objectId);
    return obj?.position ?? [0, 0, 0];
  }, [objectId]);

  if (!galaxy) return null;

  return (
    <group position={parentPosition}>
      <ProjectVisualField
        panels={galaxy.visualField}
        parentPosition={[0, 0, 0]}
        isVisible={isVisible}
      />
    </group>
  );
}
