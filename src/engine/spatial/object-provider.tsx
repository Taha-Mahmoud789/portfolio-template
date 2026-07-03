/**
 * Spatial Object System — React Provider
 *
 * Creates and manages the lifecycle of an ObjectManager.
 * Integrates with the render loop via the update callback.
 */

import { useEffect, useRef, useState, useMemo, type ReactNode } from "react";
import { ObjectManager } from "./object-manager";
import { SpatialContext, type SpatialContextValue } from "./object-context";
import type { ObjectManagerConfig, ObjectManagerState } from "./types";
import type { Scene } from "three";
import { EMPTY_TYPE_COUNTS } from "./constants";

// ============================================================================
// Props
// ============================================================================

export interface SpatialProviderProps {
  readonly config?: Partial<ObjectManagerConfig>;
  readonly scene?: Scene | null;
  readonly children: ReactNode;
}

// ============================================================================
// Provider
// ============================================================================

export function SpatialProvider({ config, scene, children }: SpatialProviderProps): ReactNode {
  const manager = useMemo(() => new ObjectManager(config), [config]);
  const [state, setState] = useState<ObjectManagerState>({
    objectCount: 0,
    objectsByType: { ...EMPTY_TYPE_COUNTS },
    activeCount: 0,
    suspendedCount: 0,
    totalTriangles: 0,
  });

  const [ready, setReady] = useState(false);
  const managerRef = useRef(manager);

  useEffect(() => {
    const mgr = managerRef.current;
    if (scene) {
      mgr.initialize(scene);
      setReady(true);
    }
    return () => {
      mgr.dispose();
      setReady(false);
    };
  }, [scene]);

  useEffect(() => {
    if (!ready) return;
    const id = setInterval(() => {
      setState(managerRef.current.getState());
    }, 250);
    return () => clearInterval(id);
  }, [ready]);

  const contextValue: SpatialContextValue = useMemo(
    () => ({ manager: managerRef.current, state }),
    [state],
  );

  if (!ready) return null;

  return <SpatialContext.Provider value={contextValue}>{children}</SpatialContext.Provider>;
}
