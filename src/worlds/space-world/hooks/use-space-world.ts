/**
 * useSpaceWorld
 *
 * Main hook for the Space World.
 * Composes all systems into a single API.
 *
 * Camera moves TO the focused object (not to a fixed point).
 * Click empty space to dismiss focus.
 */

import { useCallback, useMemo, useRef } from "react";
import { useSpaceState } from "../systems/state-manager";
import { useCameraController } from "../systems/camera-controller";
import { useObjectRegistry } from "../systems/object-registry";
import { useInteractionManager } from "../systems/interaction-manager";
import { useSpatialNav } from "./use-spatial-nav";
import { SPACE_CONFIG } from "../data/space.config";
import type { CameraMode } from "../data/types";

export function useSpaceWorld() {
  const cameraRef = useRef<ReturnType<typeof useCameraController> | null>(null);

  const state = useSpaceState((_from, to) => {
    const camera = cameraRef.current;
    if (!camera) return;
    if (to === "exploring") {
      camera.transitionTo("overview");
    } else if (to === "focused") {
      camera.transitionTo("object-focus");
    } else if (to === "intro") {
      camera.transitionTo("intro");
    }
  });

  const camera = useCameraController();
  cameraRef.current = camera;

  const registry = useObjectRegistry();
  const interaction = useInteractionManager();

  const handleCameraModeChange = useCallback(
    (mode: CameraMode, objectId?: string) => {
      camera.transitionTo(mode, objectId);
      if (mode === "overview") {
        state.setPhase("exploring");
        interaction.exit();
      } else if (mode === "object-focus" && objectId) {
        state.setPhase("focused");
        interaction.select(objectId);
        interaction.focus(objectId);
      }
    },
    [camera, state, interaction],
  );

  const spatialNav = useSpatialNav(
    () => registry.objects,
    (id) => registry.getById(id),
    handleCameraModeChange,
  );

  const handleObjectSelect = useCallback(
    (id: string) => {
      spatialNav.selectObject(id);
    },
    [spatialNav],
  );

  const handleExit = useCallback(() => {
    spatialNav.exitFocus();
  }, [spatialNav]);

  const focusPosition = useMemo(() => {
    const focusedId = spatialNav.focusedId;
    if (!focusedId) return null;
    const obj = registry.getById(focusedId);
    return obj?.position ?? null;
  }, [spatialNav.focusedId, registry]);

  return {
    phase: state.phase,
    previousPhase: state.previousPhase,
    cameraMode: spatialNav.cameraMode,
    cameraTransition: camera.transitioning,
    cameraState: camera.state,
    objects: registry.objects,
    hoveredId: interaction.hoveredId,
    selectedId: spatialNav.selectedId,
    focusedId: spatialNav.focusedId,
    focusedIndex: spatialNav.focusedIndex,
    focusPosition,
    scrollProgress: spatialNav.scrollProgress,
    config: SPACE_CONFIG,
    setPhase: state.setPhase,
    transitionCamera: camera.transitionTo,
    completeCameraTransition: camera.completeTransition,
    setScrollOffset: camera.setScrollOffset,
    setMouseOffset: camera.setMouseOffset,
    hoverObject: interaction.hover,
    selectObject: handleObjectSelect,
    focusObject: spatialNav.focusObject,
    exitFocus: handleExit,
    cycleNext: spatialNav.cycleNext,
    cyclePrev: spatialNav.cyclePrev,
    getById: registry.getById,
    getByType: registry.getByType,
  };
}
