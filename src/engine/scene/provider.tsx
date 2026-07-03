/**
 * Scene Provider
 *
 * React provider that initializes and manages the SceneManager lifecycle.
 */

import { useState, useEffect, useRef, type ReactNode } from "react";
import type { SceneManagerConfig, SceneManagerState, PerformanceManagerState } from "./types";
import { SceneContext, type SceneContextValue } from "./context";
import { SceneManager } from "./scene-manager";

// ============================================================================
// Provider Props
// ============================================================================

interface SceneProviderProps {
  readonly children: ReactNode;
  readonly config?: Partial<SceneManagerConfig>;
}

// ============================================================================
// SceneProvider
// ============================================================================

export function SceneProvider({ children, config }: SceneProviderProps) {
  const managerRef = useRef<SceneManager | null>(null);
  const [state, setState] = useState<SceneManagerState>({
    isInitialized: false,
    isRunning: false,
    fps: 60,
    drawCalls: 0,
    triangles: 0,
    memoryUsage: 0,
  });
  const [performanceState, setPerformanceState] = useState<PerformanceManagerState>({
    metrics: {
      fps: 60,
      frameTime: 16.67,
      drawCalls: 0,
      triangles: 0,
      geometries: 0,
      textures: 0,
      programs: 0,
      memoryUsage: 0,
    },
    quality: "high",
    isThrottled: false,
  });

  // Create manager once
  managerRef.current ??= new SceneManager(config);

  const manager = managerRef.current;

  // Initialize and start
  useEffect(() => {
    manager.initialize();
    manager.start();
    setState(manager.getState());
    setPerformanceState(manager.performance.getState());

    return () => {
      manager.dispose();
    };
  }, [manager]);

  // Poll state periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setState(manager.getState());
      setPerformanceState(manager.performance.getState());
    }, 1000);

    return () => clearInterval(interval);
  }, [manager]);

  const value: SceneContextValue = { manager, state, performance: performanceState };

  return <SceneContext.Provider value={value}>{children}</SceneContext.Provider>;
}
