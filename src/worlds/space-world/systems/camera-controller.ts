/**
 * Camera Controller
 *
 * Manages cinematic camera transitions with smooth spring damping.
 * 3 modes: intro → overview → object-focus
 *
 * The R3F render loop reads target state each frame and interpolates.
 * The controller only computes targets — it does not touch camera directly.
 */

import { useCallback, useRef } from "react";
import type { CameraMode, CameraPreset } from "../data/types";
import { CAMERA_PRESETS } from "../data/space.config";

// ============================================================================
// Types
// ============================================================================

interface CameraTransition {
  readonly from: CameraMode;
  readonly to: CameraMode;
  readonly objectId: string | null;
  readonly startTime: number;
  readonly duration: number;
}

interface CameraControllerState {
  mode: CameraMode;
  targetPosition: [number, number, number];
  targetLookAt: [number, number, number];
  targetFov: number;
  scrollOffset: number;
  mouseOffset: { x: number; y: number };
  velocity: { x: number; y: number; z: number };
  lookAtVelocity: { x: number; y: number; z: number };
  fovVelocity: number;
  transitioning: boolean;
  transition: CameraTransition | null;
}

interface CameraController {
  readonly state: CameraControllerState;
  transitionTo: (mode: CameraMode, objectId?: string) => void;
  completeTransition: () => void;
  setScrollOffset: (offset: number) => void;
  setMouseOffset: (x: number, y: number) => void;
  getPresetForMode: (mode: CameraMode, objectId?: string) => CameraPreset;
  getMode: () => CameraMode;
  isTransitioning: () => boolean;
}

// ============================================================================
// Factory
// ============================================================================

export function createCameraController(): CameraController {
  const state: CameraControllerState = {
    mode: "intro",
    targetPosition: [...CAMERA_PRESETS.intro.position],
    targetLookAt: [...CAMERA_PRESETS.intro.target],
    targetFov: CAMERA_PRESETS.intro.fov,
    scrollOffset: 0,
    mouseOffset: { x: 0, y: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    lookAtVelocity: { x: 0, y: 0, z: 0 },
    fovVelocity: 0,
    transitioning: false,
    transition: null,
  };

  const getPresetForMode = (mode: CameraMode, objectId?: string): CameraPreset => {
    const preset = CAMERA_PRESETS[mode];
    if (mode === "object-focus" && objectId) {
      // Will be computed by the hook using object registry
      return preset;
    }
    return preset;
  };

  const transitionTo = (next: CameraMode, objectId?: string) => {
    if (next === state.mode && !state.transitioning) return;

    const from = state.mode;
    const duration = next === "intro" ? 2000 : next === "overview" ? 1200 : 800;

    state.transition = {
      from,
      to: next,
      objectId: objectId ?? null,
      startTime: performance.now(),
      duration,
    };
    state.transitioning = true;

    // Compute target position from preset
    const preset = getPresetForMode(next, objectId);
    state.targetPosition = [...preset.position];
    state.targetLookAt = [...preset.target];
    state.targetFov = preset.fov;
  };

  const completeTransition = () => {
    if (state.transition) {
      state.mode = state.transition.to;
    }
    state.transition = null;
    state.transitioning = false;
  };

  const setScrollOffset = (offset: number) => {
    state.scrollOffset = offset;
  };

  const setMouseOffset = (x: number, y: number) => {
    state.mouseOffset.x = x;
    state.mouseOffset.y = y;
  };

  return {
    state,
    transitionTo,
    completeTransition,
    setScrollOffset,
    setMouseOffset,
    getPresetForMode,
    getMode: () => state.mode,
    isTransitioning: () => state.transitioning,
  };
}

// ============================================================================
// React Hook
// ============================================================================

export function useCameraController() {
  const controllerRef = useRef<CameraController | null>(null);
  const stateRef = useRef({
    mode: "intro",
    transitioning: false,
  });

  controllerRef.current ??= createCameraController();

  const transitionTo = useCallback((mode: CameraMode, objectId?: string) => {
    controllerRef.current?.transitionTo(mode, objectId);
    const c = controllerRef.current;
    if (c) {
      stateRef.current = { mode: c.getMode(), transitioning: c.isTransitioning() };
    }
  }, []);

  const completeTransition = useCallback(() => {
    controllerRef.current?.completeTransition();
    const c = controllerRef.current;
    if (c) {
      stateRef.current = { mode: c.getMode(), transitioning: c.isTransitioning() };
    }
  }, []);

  const setScrollOffset = useCallback((offset: number) => {
    controllerRef.current?.setScrollOffset(offset);
  }, []);

  const setMouseOffset = useCallback((x: number, y: number) => {
    controllerRef.current?.setMouseOffset(x, y);
  }, []);

  return {
    mode: stateRef.current.mode,
    transitioning: stateRef.current.transitioning,
    state: controllerRef.current.state,
    transitionTo,
    completeTransition,
    setScrollOffset,
    setMouseOffset,
    getPresetForMode: controllerRef.current.getPresetForMode,
  };
}
