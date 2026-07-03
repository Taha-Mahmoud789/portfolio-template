/**
 * Experience Engine Store
 *
 * Zustand store for engine-level state only.
 * High-frequency state (pointer position) uses direct store updates.
 * Low-frequency state (scenes, lifecycle) uses context.
 * State transitions respect priority to prevent conflicts.
 */

import { create } from "zustand";
import type {
  ExperienceEngineState,
  ExperienceEngineActions,
  InteractionState,
  PointerPosition,
  PointerVelocity,
  CursorState,
  LifecyclePhase,
  SceneId,
  SceneState,
} from "./types";
import { STATE_PRIORITY } from "./types";
import {
  DEFAULT_POINTER_POSITION,
  DEFAULT_POINTER_VELOCITY,
} from "./constants";

interface ExperienceEngineStore extends ExperienceEngineState, ExperienceEngineActions {}

export const useExperienceStore = create<ExperienceEngineStore>()((set, get) => ({
  // --- State ---
  interactionState: "idle",
  pointerPosition: DEFAULT_POINTER_POSITION,
  pointerVelocity: DEFAULT_POINTER_VELOCITY,
  cursorState: "default",
  isInitialized: false,
  reducedMotion: false,
  lifecyclePhase: "idle",
  activeSceneId: null,
  sceneStates: {},
  pointerCount: 0,
  isVisible: true,

  // --- Actions ---
  setInteractionState: (state: InteractionState) => {
    const current = get().interactionState;
    const currentPriority = STATE_PRIORITY[current] ?? 0;
    const newPriority = STATE_PRIORITY[state] ?? 0;

    // Only allow transition if new state has equal or higher priority
    // Exception: always allow transition to "idle"
    if (state === "idle" || newPriority >= currentPriority) {
      set({ interactionState: state });
    }
  },
  setPointerPosition: (position: PointerPosition) => set({ pointerPosition: position }),
  setPointerVelocity: (velocity: PointerVelocity) => set({ pointerVelocity: velocity }),
  setCursorState: (state: CursorState) => set({ cursorState: state }),
  setReducedMotion: (reduced: boolean) => set({ reducedMotion: reduced }),
  setLifecyclePhase: (phase: LifecyclePhase) => set({ lifecyclePhase: phase }),
  setActiveScene: (sceneId: SceneId | null) => set({ activeSceneId: sceneId }),
  updateSceneState: (sceneId: SceneId, state: Partial<SceneState>) =>
    set((prev) => ({
      sceneStates: {
        ...prev.sceneStates,
        [sceneId]: { ...prev.sceneStates[sceneId], ...state } as SceneState,
      },
    })),
  setPointerCount: (count: number) => set({ pointerCount: count }),
  setIsVisible: (visible: boolean) => set({ isVisible: visible }),
  setIsInitialized: (initialized: boolean) => set({ isInitialized: initialized }),
}));

// --- Selectors ---
export const selectInteractionState = (state: ExperienceEngineStore) => state.interactionState;
export const selectPointerPosition = (state: ExperienceEngineStore) => state.pointerPosition;
export const selectPointerVelocity = (state: ExperienceEngineStore) => state.pointerVelocity;
export const selectCursorState = (state: ExperienceEngineStore) => state.cursorState;
export const selectIsInitialized = (state: ExperienceEngineStore) => state.isInitialized;
export const selectReducedMotion = (state: ExperienceEngineStore) => state.reducedMotion;
export const selectLifecyclePhase = (state: ExperienceEngineStore) => state.lifecyclePhase;
export const selectActiveSceneId = (state: ExperienceEngineStore) => state.activeSceneId;
export const selectSceneStates = (state: ExperienceEngineStore) => state.sceneStates;
export const selectPointerCount = (state: ExperienceEngineStore) => state.pointerCount;
export const selectIsVisible = (state: ExperienceEngineStore) => state.isVisible;
