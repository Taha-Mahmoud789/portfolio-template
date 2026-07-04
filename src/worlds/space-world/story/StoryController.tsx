/**
 * Story Controller
 *
 * Bridges story mode with the Space World camera system.
 * When story is active, overrides camera targets for each scene.
 * Computes focus position for object-focus scenes.
 */

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useReducedMotion } from "../hooks";
import { STORY_SCENES } from "./story-data";
import type { StoryState } from "./types";

interface StoryControllerProps {
  readonly state: StoryState;
  readonly onCameraTarget: (
    position: [number, number, number],
    target: [number, number, number],
    focusObjectId?: string,
  ) => void;
}

export function StoryController({ state, onCameraTarget }: StoryControllerProps) {
  const reducedMotion = useReducedMotion();
  const lastSceneRef = useRef(-1);

  // Update camera target when scene changes
  useFrame(() => {
    if (reducedMotion) return;
    if (state.phase !== "playing" && state.phase !== "paused") return;

    const scene = STORY_SCENES[state.currentScene];
    if (!scene) return;

    // Only update on scene change
    if (state.currentScene !== lastSceneRef.current) {
      lastSceneRef.current = state.currentScene;
      onCameraTarget(scene.camera.position, scene.camera.target, scene.camera.focusObjectId);
    }
  });

  // Reset on story exit
  useEffect(() => {
    if (state.phase === "idle") {
      lastSceneRef.current = -1;
    }
  }, [state.phase]);

  return null;
}
