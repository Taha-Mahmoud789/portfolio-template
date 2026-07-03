import { create } from "zustand";
import type { WorldId } from "@/types/world";

interface WorldState {
  currentWorld: WorldId | null;
  previousWorld: WorldId | null;
  isTransitioning: boolean;
  worldHistory: WorldId[];
}

interface WorldActions {
  setCurrentWorld: (worldId: WorldId) => void;
  setTransitioning: (isTransitioning: boolean) => void;
  goBack: () => void;
  reset: () => void;
}

export type WorldStore = WorldState & WorldActions;

const initialState: WorldState = {
  currentWorld: null,
  previousWorld: null,
  isTransitioning: false,
  worldHistory: [],
};

export const useWorldStore = create<WorldStore>((set) => ({
  ...initialState,

  setCurrentWorld: (worldId) =>
    set((state) => ({
      previousWorld: state.currentWorld,
      currentWorld: worldId,
      worldHistory: [...state.worldHistory, worldId],
    })),

  setTransitioning: (isTransitioning) => set({ isTransitioning }),

  goBack: () =>
    set((state) => {
      const history = [...state.worldHistory];
      history.pop();
      const previousWorld = history[history.length - 1] ?? null;
      return {
        worldHistory: history,
        currentWorld: previousWorld,
        previousWorld: state.currentWorld,
      };
    }),

  reset: () => set(initialState),
}));
