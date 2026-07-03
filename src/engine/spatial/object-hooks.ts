/**
 * Spatial Object System — React Hooks
 */

import { useCallback, useContext, useEffect, useState } from "react";
import { SpatialContext, type SpatialContextValue } from "./object-context";
import type {
  SpatialObjectConfig,
  SpatialObjectState,
  UseSpatialObjectReturn,
  ObjectManagerState,
  ObjectRegistryQuery,
} from "./types";
import type { SpatialObject } from "./spatial-object";

// ============================================================================
// Internal — Context Access
// ============================================================================

function useSpatialContext(): SpatialContextValue {
  const ctx = useContext(SpatialContext);
  if (!ctx) {
    throw new Error("useSpatialObject/useObjectManager must be used within <SpatialProvider>");
  }
  return ctx;
}

// ============================================================================
// useObjectManager
// ============================================================================

export interface UseObjectManagerReturn {
  readonly state: ObjectManagerState;
  readonly addObject: (config: SpatialObjectConfig) => string;
  readonly addObjects: (configs: readonly SpatialObjectConfig[]) => string[];
  readonly removeObject: (id: string) => void;
  readonly removeObjectBatch: (ids: readonly string[]) => void;
  readonly getObject: (id: string) => SpatialObject | undefined;
  readonly query: (query: ObjectRegistryQuery) => SpatialObject[];
}

export function useObjectManager(): UseObjectManagerReturn {
  const { manager } = useSpatialContext();
  const [state, setState] = useState(manager.getState());

  useEffect(() => {
    const id = setInterval(() => {
      setState(manager.getState());
    }, 250);
    return () => clearInterval(id);
  }, [manager]);

  const addObject = useCallback(
    (config: SpatialObjectConfig) => manager.addObject(config),
    [manager],
  );

  const addObjects = useCallback(
    (configs: readonly SpatialObjectConfig[]) => manager.addObjects(configs),
    [manager],
  );

  const removeObject = useCallback((id: string) => manager.removeObject(id), [manager]);

  const removeObjectBatch = useCallback(
    (ids: readonly string[]) => manager.removeObjectBatch(ids),
    [manager],
  );

  const getObject = useCallback((id: string) => manager.getObject(id), [manager]);

  const query = useCallback((q: ObjectRegistryQuery) => manager.query(q), [manager]);

  return { state, addObject, addObjects, removeObject, removeObjectBatch, getObject, query };
}

// ============================================================================
// useSpatialObject
// ============================================================================

export function useSpatialObject(id: string): UseSpatialObjectReturn {
  const { manager } = useSpatialContext();
  const object = manager.getObject(id);

  const [state, setState] = useState<SpatialObjectState>(
    object?.getState() ?? {
      id,
      type: "static",
      status: "disposed",
      visible: false,
      layer: 0,
      priority: 0,
      distance: 0,
      worldPosition: { x: 0, y: 0, z: 0 },
    },
  );

  useEffect(() => {
    if (!object) return;
    const intervalId = setInterval(() => {
      setState(object.getState());
    }, 100);
    return () => clearInterval(intervalId);
  }, [object]);

  const setVisible = useCallback((visible: boolean) => object?.setVisible(visible), [object]);

  const setLayer = useCallback((layer: number) => object?.setLayer(layer), [object]);

  const setPriority = useCallback((priority: number) => object?.setPriority(priority), [object]);

  const setMetadata = useCallback(
    (key: string, value: unknown) => object?.setMetadata(key, value),
    [object],
  );

  const destroy = useCallback(() => manager.removeObject(id), [manager, id]);

  return { state, setVisible, setLayer, setPriority, setMetadata, destroy };
}
