/**
 * Object Registry
 *
 * Central registry for all interactive objects in the scene.
 * Objects are registered on mount, unregistered on unmount.
 * Supports spatial queries (nearest, by type, by id).
 *
 * The objects array is cached and only recreated when the map changes.
 */

import { useCallback, useRef, useState } from "react";
import type { SpaceObject, SpaceObjectType } from "../data/types";
import { OBJECTS } from "../data/space.config";

interface ObjectRegistry {
  readonly objects: readonly SpaceObject[];
  getById: (id: string) => SpaceObject | undefined;
  getByType: (type: SpaceObjectType) => readonly SpaceObject[];
  getNearest: (position: [number, number, number], maxDistance?: number) => SpaceObject | null;
  register: (object: SpaceObject) => void;
  unregister: (id: string) => void;
}

export function createObjectRegistry(): ObjectRegistry {
  const map = new Map<string, SpaceObject>();
  let cachedArray: readonly SpaceObject[] = [];
  let dirty = true;

  for (const obj of OBJECTS) {
    map.set(obj.id, obj);
  }

  const getArray = (): readonly SpaceObject[] => {
    if (dirty) {
      cachedArray = Array.from(map.values());
      dirty = false;
    }
    return cachedArray;
  };

  const getById = (id: string) => map.get(id);

  const getByType = (type: SpaceObjectType) => getArray().filter((o) => o.type === type);

  const getNearest = (position: [number, number, number], maxDistance = Infinity) => {
    let nearest: SpaceObject | null = null;
    let minDist = maxDistance;

    for (const obj of getArray()) {
      if (!obj.visible) continue;
      const [ox, oy, oz] = obj.position;
      const dx = position[0] - ox;
      const dy = position[1] - oy;
      const dz = position[2] - oz;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < minDist) {
        minDist = dist;
        nearest = obj;
      }
    }

    return nearest;
  };

  const register = (object: SpaceObject) => {
    map.set(object.id, object);
    dirty = true;
  };

  const unregister = (id: string) => {
    map.delete(id);
    dirty = true;
  };

  return {
    get objects() {
      return getArray();
    },
    getById,
    getByType,
    getNearest,
    register,
    unregister,
  };
}

// ============================================================================
// React Hook
// ============================================================================

export function useObjectRegistry() {
  const registryRef = useRef<ObjectRegistry | null>(null);
  const [, forceUpdate] = useState(0);

  registryRef.current ??= createObjectRegistry();

  const register = useCallback((object: SpaceObject) => {
    registryRef.current?.register(object);
    forceUpdate((n) => n + 1);
  }, []);

  const unregister = useCallback((id: string) => {
    registryRef.current?.unregister(id);
    forceUpdate((n) => n + 1);
  }, []);

  return {
    objects: registryRef.current.objects,
    getById: registryRef.current.getById,
    getByType: registryRef.current.getByType,
    getNearest: registryRef.current.getNearest,
    register,
    unregister,
  };
}
