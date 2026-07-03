/**
 * App Settings Store
 *
 * Zustand store for settings NOT covered by existing theme-store or ui-store.
 * This store holds only genuinely new settings to avoid duplication.
 *
 * Existing stores handle:
 * - theme-store: themeMode, reducedMotion
 * - ui-store: isMenuOpen, isWorldSwitcherOpen, isLoading, scrollY
 * - world-store: currentWorld, worldHistory
 *
 * This store handles:
 * - soundEnabled, locale, debugPanelVisible, animationQuality
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "../config/constants";

interface AppSettingsState {
  soundEnabled: boolean;
  locale: string;
  debugPanelVisible: boolean;
  animationQuality: "low" | "medium" | "high";
}

interface AppSettingsActions {
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
  setLocale: (locale: string) => void;
  toggleDebugPanel: () => void;
  setDebugPanelVisible: (visible: boolean) => void;
  setAnimationQuality: (quality: AppSettingsState["animationQuality"]) => void;
}

export type AppSettingsStore = AppSettingsState & AppSettingsActions;

export const useAppSettingsStore = create<AppSettingsStore>()(
  persist(
    (set) => ({
      soundEnabled: false,
      locale: "en",
      debugPanelVisible: false,
      animationQuality: "high",

      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      setLocale: (locale) => set({ locale }),
      toggleDebugPanel: () => set((s) => ({ debugPanelVisible: !s.debugPanelVisible })),
      setDebugPanelVisible: (debugPanelVisible) => set({ debugPanelVisible }),
      setAnimationQuality: (animationQuality) => set({ animationQuality }),
    }),
    {
      name: STORAGE_KEYS.SETTINGS,
      partialize: (state) => ({
        soundEnabled: state.soundEnabled,
        locale: state.locale,
      }),
    },
  ),
);
