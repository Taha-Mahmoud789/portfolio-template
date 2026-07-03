import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  mode: ThemeMode;
  reducedMotion: boolean;
}

interface ThemeActions {
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  setReducedMotion: (reduced: boolean) => void;
}

export type ThemeStore = ThemeState & ThemeActions;

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: "system",
      reducedMotion: false,

      setMode: (mode) => set({ mode }),

      toggleMode: () =>
        set((state) => ({
          mode: state.mode === "dark" ? "light" : state.mode === "light" ? "system" : "dark",
        })),

      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
    }),
    {
      name: "multiverse-theme",
      partialize: (state) => ({ mode: state.mode }),
    },
  ),
);
