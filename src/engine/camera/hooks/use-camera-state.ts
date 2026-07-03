/**
 * Cinematic Camera System — useCameraState
 *
 * Subscribes to the CameraProvider and keeps a local state copy.
 * Each hook that needs reactive camera state calls this independently,
 * so they only re-render when their own subscription fires.
 */

import { useEffect, useState } from "react";
import { useCameraContext } from "../providers/camera-provider";

/**
 * Subscribe to camera state updates from the provider.
 * Returns the latest state snapshot. Updates are debounced
 * internally by the provider's tick rate.
 */
export function useCameraState() {
  const { manager, subscribe } = useCameraContext();
  const [state, setState] = useState(() => manager.getState());

  useEffect(() => {
    return subscribe((newState) => {
      setState(newState);
    });
  }, [subscribe]);

  return state;
}
