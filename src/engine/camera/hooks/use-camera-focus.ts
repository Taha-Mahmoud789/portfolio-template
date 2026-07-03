/**
 * Cinematic Camera System — useCameraFocus
 *
 * Focus and follow target hook.
 */

import { useCallback, useMemo } from "react";
import { useCameraContext } from "../providers/camera-provider";
import type { FocusTarget } from "../types";
import type { Object3D } from "three";

export function useCameraFocus() {
  const { manager } = useCameraContext();

  const focus = useCallback((target: FocusTarget) => manager.focus(target), [manager]);

  const setFollowTarget = useCallback(
    (id: string | null) => manager.setFollowTarget(id),
    [manager],
  );

  const addObject = useCallback(
    (object: Object3D, followOffset?: readonly [number, number, number]) =>
      manager.addObject(object, followOffset),
    [manager],
  );

  const removeObject = useCallback((id: string) => manager.removeObject(id), [manager]);

  return useMemo(
    () => ({
      focus,
      setFollowTarget,
      addObject,
      removeObject,
    }),
    [focus, setFollowTarget, addObject, removeObject],
  );
}
