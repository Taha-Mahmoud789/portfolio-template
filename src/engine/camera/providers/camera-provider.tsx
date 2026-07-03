/**
 * Cinematic Camera System — Camera Provider
 *
 * React context that provides the camera system to the component tree.
 * Uses a ref-based callback pattern instead of polling to avoid unnecessary re-renders.
 * Components that need reactive state access the `state` via a dedicated hook;
 * the manager is stable across renders and never triggers re-renders on its own.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CinematicCameraConfig, CinematicCameraState } from "../types";
import { CameraManager } from "../camera-manager";

// ============================================================================
// Context Value
// ============================================================================

export interface CameraContextValue {
  readonly manager: CameraManager;
  readonly state: CinematicCameraState;
  readonly subscribe: (listener: (state: CinematicCameraState) => void) => () => void;
}

// ============================================================================
// Context
// ============================================================================

const CameraContext = createContext<CameraContextValue | null>(null);

// ============================================================================
// Hook — always valid
// ============================================================================

export function useCameraContext(): CameraContextValue {
  const ctx = useContext(CameraContext);
  if (!ctx) {
    throw new Error("useCameraContext must be used within a <CameraProvider>");
  }
  return ctx;
}

// ============================================================================
// Provider Props
// ============================================================================

interface CameraProviderProps {
  readonly children: ReactNode;
  readonly config?: Partial<CinematicCameraConfig>;
}

// ============================================================================
// Default state snapshot
// ============================================================================

const INITIAL_STATE: CinematicCameraState = {
  mode: "idle",
  cameraState: "idle",
  position: [0, 0, 0],
  lookAt: [0, 0, 0],
  fov: 60,
  distance: 8,
  isInitialized: false,
  isRunning: false,
  timeline: {
    isPlaying: false,
    isPaused: false,
    currentTime: 0,
    progress: 0,
    currentKeyframeIndex: 0,
    sequenceName: null,
  },
  transition: {
    isTransitioning: false,
    type: "fade",
    progress: 0,
    duration: 0,
  },
  effects: {
    shakeIntensity: 0,
    driftOffset: [0, 0, 0],
    bobOffset: [0, 0, 0],
    swayOffset: [0, 0, 0],
  },
};

// ============================================================================
// CameraProvider
// ============================================================================

export function CameraProvider({ children, config }: CameraProviderProps) {
  const managerRef = useRef<CameraManager | null>(null);
  const [state, setState] = useState<CinematicCameraState>(INITIAL_STATE);

  // Create manager once (ref, no re-render)
  managerRef.current ??= new CameraManager(config);
  const manager = managerRef.current;

  // Subscriber list (no state update to avoid renders)
  const listenersRef = useRef<Set<(state: CinematicCameraState) => void>>(new Set());

  // Initialize and start
  useEffect(() => {
    manager.initialize();
    manager.start();
    setState(manager.getState());

    return () => {
      manager.dispose();
    };
  }, [manager]);

  // Subscribe API — components opt-in to state updates
  const subscribe = useCallback((listener: (state: CinematicCameraState) => void) => {
    listenersRef.current.add(listener);
    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  const value: CameraContextValue = { manager, state, subscribe };

  return <CameraContext.Provider value={value}>{children}</CameraContext.Provider>;
}
