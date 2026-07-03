/**
 * Cinematic Camera System — useCamera
 *
 * Full camera API hook.
 */

import { useCallback, useMemo } from "react";
import { useCameraContext } from "../providers/camera-provider";
import { useCameraState } from "./use-camera-state";
import type { CameraMode } from "../types";

export function useCamera() {
  const { manager } = useCameraContext();
  const state = useCameraState();

  const setMode = useCallback((mode: CameraMode) => manager.setMode(mode), [manager]);

  const setPosition = useCallback(
    (x: number, y: number, z: number) => manager.setPosition(x, y, z),
    [manager],
  );

  const setLookAt = useCallback(
    (x: number, y: number, z: number) => manager.setLookAt(x, y, z),
    [manager],
  );

  const setFov = useCallback((fov: number) => manager.setFov(fov), [manager]);

  const setTarget = useCallback(
    (position: readonly [number, number, number], lookAt: readonly [number, number, number]) =>
      manager.setTarget(position, lookAt),
    [manager],
  );

  return useMemo(
    () => ({
      state,
      setMode,
      setPosition,
      setLookAt,
      setFov,
      setTarget,
      manager,
    }),
    [state, setMode, setPosition, setLookAt, setFov, setTarget, manager],
  );
}
