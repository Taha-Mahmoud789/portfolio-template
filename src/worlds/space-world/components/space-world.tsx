/**
 * SpaceWorld — Root Component
 *
 * Developer Solar System experience.
 * Built on BaseWorld foundation with fullscreen layout.
 * R3F Canvas provides the 3D scene.
 */

import { useCallback } from "react";
import { BaseWorld } from "@/worlds/base-world";
import { createWorld } from "@/sdk/world/factory";
import { SPACE_WORLD_CONFIG } from "../config";
import { SpaceScene } from "../scene";
import { SpaceHero } from "./space-hero";
import { SpaceSections } from "./space-sections";
import type { SpaceWorldProps } from "../types";

// ============================================================================
// Factory
// ============================================================================

const spaceWorldResult = createWorld({
  config: SPACE_WORLD_CONFIG,
  validate: false,
});

const spaceWorldDefinition = spaceWorldResult.definition;

// ============================================================================
// Component
// ============================================================================

export function SpaceWorld({ children, onReady, onError }: SpaceWorldProps) {
  const handleReady = useCallback(() => {
    onReady?.();
  }, [onReady]);

  const handleError = useCallback(
    (error: Error) => {
      onError?.(error);
    },
    [onError],
  );

  return (
    <BaseWorld
      worldId="space-world"
      theme="space"
      definition={spaceWorldDefinition}
      showHeader={true}
      showBackground={false}
      showOverlays={true}
      enableAccessibility={true}
      onReady={handleReady}
      onError={handleError}
    >
      {/* Three.js 3D Scene — behind everything */}
      <SpaceScene className="fixed inset-0 z-0" />

      {/* Content layers — above the 3D scene */}
      <div className="relative z-10">
        <SpaceHero />
        <SpaceSections />
        {children}
      </div>
    </BaseWorld>
  );
}
