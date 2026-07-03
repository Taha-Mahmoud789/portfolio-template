/**
 * Cinematic Camera System — useCameraTimeline
 *
 * Timeline playback hook.
 */

import { useCallback, useMemo } from "react";
import { useCameraContext } from "../providers/camera-provider";
import { useCameraState } from "./use-camera-state";
import type { CameraSequence } from "../types";

export function useCameraTimeline() {
  const { manager } = useCameraContext();
  const state = useCameraState();

  const play = useCallback((sequence: CameraSequence) => manager.playSequence(sequence), [manager]);

  const pause = useCallback(() => manager.pauseTimeline(), [manager]);

  const resume = useCallback(() => manager.resumeTimeline(), [manager]);

  const stop = useCallback(() => manager.stopTimeline(), [manager]);

  return useMemo(
    () => ({
      timeline: state.timeline,
      play,
      pause,
      resume,
      stop,
    }),
    [state.timeline, play, pause, resume, stop],
  );
}
