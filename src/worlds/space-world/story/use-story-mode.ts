/**
 * useStoryMode
 *
 * State machine for the cinematic journey.
 * Manages scene progression, timing, pause/resume, and controls.
 * Uses refs for timer state to avoid re-renders on every tick.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { StoryPhase, StoryState, StoryControls } from "./types";
import { STORY_SCENES } from "./story-data";

// ============================================================================
// Factory
// ============================================================================

export function createStoryMode() {
  let phase: StoryPhase = "idle";
  let currentScene = 0;
  let elapsed = 0;
  let sceneElapsed = 0;
  let lastTick = 0;

  const totalScenes = STORY_SCENES.length;

  const getCurrentScene = () => STORY_SCENES[currentScene];

  const tick = (now: number) => {
    if (phase !== "playing") return;

    if (lastTick === 0) {
      lastTick = now;
      return;
    }

    const delta = now - lastTick;
    lastTick = now;

    elapsed += delta;
    sceneElapsed += delta;

    const scene = getCurrentScene();
    if (scene && sceneElapsed >= scene.duration) {
      // Advance to next scene
      if (currentScene < totalScenes - 1) {
        currentScene++;
        sceneElapsed = 0;
      } else {
        // Story complete
        phase = "completed";
      }
    }
  };

  const play = () => {
    if (phase === "completed") {
      currentScene = 0;
      elapsed = 0;
      sceneElapsed = 0;
    }
    phase = "playing";
    lastTick = 0;
  };

  const pause = () => {
    if (phase === "playing") {
      phase = "paused";
    }
  };

  const resume = () => {
    if (phase === "paused") {
      phase = "playing";
      lastTick = 0;
    }
  };

  const toggle = () => {
    if (phase === "playing") {
      pause();
    } else {
      resume();
    }
  };

  const next = () => {
    if (currentScene < totalScenes - 1) {
      currentScene++;
      sceneElapsed = 0;
      if (phase !== "playing") {
        phase = "playing";
        lastTick = 0;
      }
    } else {
      phase = "completed";
    }
  };

  const previous = () => {
    if (currentScene > 0) {
      currentScene--;
      sceneElapsed = 0;
      if (phase !== "playing") {
        phase = "playing";
        lastTick = 0;
      }
    }
  };

  const skipTo = (index: number) => {
    if (index >= 0 && index < totalScenes) {
      currentScene = index;
      sceneElapsed = 0;
      if (phase !== "playing") {
        phase = "playing";
        lastTick = 0;
      }
    }
  };

  const exit = () => {
    phase = "idle";
    currentScene = 0;
    elapsed = 0;
    sceneElapsed = 0;
    lastTick = 0;
  };

  const start = () => {
    phase = "playing";
    currentScene = 0;
    elapsed = 0;
    sceneElapsed = 0;
    lastTick = 0;
  };

  return {
    get state(): StoryState {
      return {
        phase,
        currentScene,
        totalScenes,
        elapsed,
        sceneElapsed,
      };
    },
    get currentSceneConfig() {
      return getCurrentScene();
    },
    actions: {
      start,
      play,
      pause,
      resume,
      toggle,
      next,
      previous,
      skipTo,
      exit,
      tick,
    },
  };
}

// ============================================================================
// React Hook
// ============================================================================

export function useStoryMode(onSceneChange?: (sceneIndex: number) => void) {
  const modeRef = useRef<ReturnType<typeof createStoryMode> | null>(null);
  const [state, setState] = useState<StoryState>({
    phase: "idle",
    currentScene: 0,
    totalScenes: STORY_SCENES.length,
    elapsed: 0,
    sceneElapsed: 0,
  });
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  modeRef.current ??= createStoryMode();

  const onSceneChangeRef = useRef(onSceneChange);
  onSceneChangeRef.current = onSceneChange;

  // Tick loop
  useEffect(() => {
    let raf: number;

    function tick() {
      const mode = modeRef.current;
      if (!mode) return;

      const prevScene = mode.state.currentScene;
      mode.actions.tick(performance.now());
      const newState = mode.state;

      // Only update React state if something changed
      setState((prev) => {
        if (
          prev.phase === newState.phase &&
          prev.currentScene === newState.currentScene &&
          prev.elapsed === newState.elapsed
        ) {
          return prev;
        }
        return { ...newState };
      });

      // Notify on scene change
      if (newState.currentScene !== prevScene) {
        setCurrentSceneIndex(newState.currentScene);
        onSceneChangeRef.current?.(newState.currentScene);
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const start = useCallback(() => {
    modeRef.current?.actions.start();
    setCurrentSceneIndex(0);
    onSceneChangeRef.current?.(0);
  }, []);

  const play = useCallback(() => modeRef.current?.actions.play(), []);
  const pause = useCallback(() => modeRef.current?.actions.pause(), []);
  const toggle = useCallback(() => modeRef.current?.actions.toggle(), []);
  const next = useCallback(() => {
    modeRef.current?.actions.next();
    const s = modeRef.current?.state;
    if (s) setCurrentSceneIndex(s.currentScene);
  }, []);
  const previous = useCallback(() => {
    modeRef.current?.actions.previous();
    const s = modeRef.current?.state;
    if (s) setCurrentSceneIndex(s.currentScene);
  }, []);
  const exit = useCallback(() => {
    modeRef.current?.actions.exit();
    setCurrentSceneIndex(0);
  }, []);
  const skipTo = useCallback((index: number) => {
    modeRef.current?.actions.skipTo(index);
    setCurrentSceneIndex(index);
  }, []);

  const controls: StoryControls = { play, pause, toggle, next, previous, exit, skipTo };

  // Keyboard controls
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const mode = modeRef.current;
      if (!mode || mode.state.phase === "idle") return;

      switch (e.key) {
        case " ":
          e.preventDefault();
          toggle();
          break;
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          next();
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          previous();
          break;
        case "Escape":
          e.preventDefault();
          exit();
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggle, next, previous, exit]);

  return {
    state,
    currentSceneIndex,
    controls,
    start,
    currentSceneConfig: modeRef.current.currentSceneConfig ?? null,
  };
}
