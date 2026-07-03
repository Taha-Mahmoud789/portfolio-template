/**
 * Cinematic Camera System — useCameraMode
 *
 * Camera mode tracking hook.
 */

import { useCallback, useMemo } from "react";
import { useCameraContext } from "../providers/camera-provider";
import { useCameraState } from "./use-camera-state";
import type { CameraMode } from "../types";

export function useCameraMode() {
  const { manager } = useCameraContext();
  const state = useCameraState();

  const setMode = useCallback((mode: CameraMode) => manager.setMode(mode), [manager]);

  const isMode = useCallback((mode: CameraMode) => state.mode === mode, [state.mode]);

  return useMemo(
    () => ({
      mode: state.mode,
      state: state.cameraState,
      setMode,
      isMode,
    }),
    [state.mode, state.cameraState, setMode, isMode],
  );
}
