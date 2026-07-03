/**
 * Scene Hooks
 *
 * React hooks for accessing scene subsystems from components.
 */

import { useCallback, useMemo } from "react";
import { useSceneContext } from "./context";
import type {
  CameraPreset,
  CameraShakeConfig,
  LightConfig,
  EnvironmentBackgroundType,
  EnvironmentConfig,
  ObjectCategory,
  AssetDefinition,
  PerformanceQuality,
} from "./types";
import type { ColorRepresentation } from "three";

// ============================================================================
// useScene
// ============================================================================

export function useScene() {
  const { manager, state } = useSceneContext();
  return useMemo(() => ({ manager, state }), [manager, state]);
}

// ============================================================================
// useCamera
// ============================================================================

export function useCamera() {
  const { manager } = useSceneContext();
  const camera = manager.camera;

  const setPreset = useCallback((preset: CameraPreset) => camera.setPreset(preset), [camera]);

  const setPosition = useCallback(
    (x: number, y: number, z: number) => camera.setPosition(x, y, z),
    [camera],
  );

  const lookAt = useCallback((x: number, y: number, z: number) => camera.lookAt(x, y, z), [camera]);

  const shake = useCallback(
    (config?: Partial<CameraShakeConfig>) => camera.shake(config),
    [camera],
  );

  const state = camera.getState();

  return useMemo(
    () => ({ state, setPreset, setPosition, lookAt, shake }),
    [state, setPreset, setPosition, lookAt, shake],
  );
}

// ============================================================================
// useLighting
// ============================================================================

export function useLighting() {
  const { manager } = useSceneContext();
  const lighting = manager.lighting;

  const addLight = useCallback((config: LightConfig) => lighting.addLight(config), [lighting]);

  const removeLight = useCallback((id: string) => lighting.removeLight(id), [lighting]);

  const updateLight = useCallback(
    (id: string, config: Partial<LightConfig>) => lighting.updateLight(id, config),
    [lighting],
  );

  const state = lighting.getState();

  return useMemo(
    () => ({ state, addLight, removeLight, updateLight }),
    [state, addLight, removeLight, updateLight],
  );
}

// ============================================================================
// useEnvironment
// ============================================================================

export function useEnvironment() {
  const { manager } = useSceneContext();
  const environment = manager.environment;

  const setBackground = useCallback(
    (type: EnvironmentBackgroundType, value: string | ColorRepresentation) =>
      environment.setBackground(type, value),
    [environment],
  );

  const setFog = useCallback(
    (type: "none" | "linear" | "exponential", config?: Partial<EnvironmentConfig>) =>
      environment.setFog(type, config),
    [environment],
  );

  const state = environment.getState();

  return useMemo(() => ({ state, setBackground, setFog }), [state, setBackground, setFog]);
}

// ============================================================================
// useObjects
// ============================================================================

export function useObjects() {
  const { manager } = useSceneContext();
  const objects = manager.objects;

  const addObject = useCallback(
    (object: Parameters<typeof objects.addObject>[0], category?: ObjectCategory, layer?: number) =>
      objects.addObject(object, category, layer),
    [objects],
  );

  const removeObject = useCallback((id: string) => objects.removeObject(id), [objects]);

  const getObject = useCallback((id: string) => objects.getObject(id), [objects]);

  const state = objects.getState();

  return useMemo(
    () => ({ state, addObject, removeObject, getObject }),
    [state, addObject, removeObject, getObject],
  );
}

// ============================================================================
// usePerformance
// ============================================================================

export function usePerformance() {
  const { manager, performance } = useSceneContext();

  const setQuality = useCallback(
    (quality: PerformanceQuality) => manager.setQuality(quality),
    [manager],
  );

  return useMemo(
    () => ({
      state: performance,
      metrics: performance.metrics,
      quality: performance.quality,
      setQuality,
    }),
    [performance, setQuality],
  );
}

// ============================================================================
// useAssets
// ============================================================================

export function useAssets() {
  const { manager } = useSceneContext();
  const assets = manager.assets;

  const load = useCallback((id: string) => assets.load(id), [assets]);

  const preload = useCallback(
    (definitions: AssetDefinition[]) => assets.preload(definitions),
    [assets],
  );

  const get = useCallback((id: string) => assets.get(id), [assets]);

  const state = assets.getState();

  return useMemo(() => ({ state, load, preload, get }), [state, load, preload, get]);
}
