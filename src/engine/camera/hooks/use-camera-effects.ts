/**
 * Cinematic Camera System — useCameraEffects
 *
 * Camera effects hook.
 */

import { useCallback, useMemo } from "react";
import { useCameraContext } from "../providers/camera-provider";
import { useCameraState } from "./use-camera-state";
import type { ShakeConfig, CameraEffectsConfig } from "../types";

export function useCameraEffects() {
  const { manager } = useCameraContext();
  const state = useCameraState();

  const triggerShake = useCallback(
    (config?: Partial<ShakeConfig>) => manager.triggerShake(config),
    [manager],
  );

  const setEffectWeight = useCallback(
    (effect: keyof CameraEffectsConfig, weight: number) => manager.setEffectWeight(effect, weight),
    [manager],
  );

  return useMemo(
    () => ({
      effects: state.effects,
      triggerShake,
      setEffectWeight,
    }),
    [state.effects, triggerShake, setEffectWeight],
  );
}
