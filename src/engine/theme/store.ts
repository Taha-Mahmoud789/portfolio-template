/**
 * Theme Store
 *
 * Zustand store for theme state management.
 * Supports persisting theme selection and restoring previous sessions.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ThemeId,
  ThemeDefinition,
  ThemeStoreState,
  ThemeStoreActions,
  ColorBlindMode,
} from "./types";
import { ThemeRegistry } from "./registry";
import { ThemeLoader } from "./loader";
import {
  applyThemeToElement,
  removeThemeFromElement,
} from "./css-generator";
import {
  DEFAULT_THEME_ID,
  THEME_STORAGE_KEY,
  THEME_TRANSITION_DURATION,
} from "./constants";

const MAX_HISTORY = 20;

// ============================================================================
// Store State
// ============================================================================

interface ThemeStoreStateWithActions extends ThemeStoreState, ThemeStoreActions {}

const initialState: ThemeStoreState = {
  currentThemeId: DEFAULT_THEME_ID,
  previousThemeId: null,
  themeHistory: [DEFAULT_THEME_ID],
  isTransitioning: false,
  reducedMotion: false,
  highContrast: false,
  colorBlindMode: "none",
};

// ============================================================================
// Store Implementation
// ============================================================================

export const useThemeEngineStore = create<ThemeStoreStateWithActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setTheme: async (themeId: ThemeId) => {
        const state = get();

        // Prevent setting the same theme
        if (state.currentThemeId === themeId) return;

        // Prevent concurrent transitions
        if (state.isTransitioning) return;

        try {
          // Start transition
          set({ isTransitioning: true });

          // Load the theme
          let theme: ThemeDefinition;
          try {
            theme = ThemeRegistry.getOrThrow(themeId);
          } catch {
            theme = await ThemeLoader.loadTheme(themeId);
          }

          // Apply the theme to the DOM
          applyThemeToElement(theme);

          // Update state
          set({
            previousThemeId: state.currentThemeId,
            currentThemeId: themeId,
            themeHistory: [...state.themeHistory, themeId].slice(-MAX_HISTORY),
          });

          // End transition after animation
          await new Promise((resolve) =>
            setTimeout(resolve, THEME_TRANSITION_DURATION)
          );
        } catch (error) {
          console.error(`Failed to set theme "${themeId}":`, error);
          // Try to fallback to default theme
          if (themeId !== DEFAULT_THEME_ID) {
            try {
              const fallbackTheme = ThemeRegistry.getDefaultTheme();
              applyThemeToElement(fallbackTheme);
              set({
                previousThemeId: state.currentThemeId,
                currentThemeId: DEFAULT_THEME_ID,
              });
            } catch {
              console.error("Failed to apply fallback theme");
            }
          }
        } finally {
          set({ isTransitioning: false });
        }
      },

      setThemeSync: (themeId: ThemeId) => {
        const state = get();
        if (state.currentThemeId === themeId) return;

        const theme = ThemeRegistry.get(themeId);
        if (theme) {
          applyThemeToElement(theme);
          set({
            previousThemeId: state.currentThemeId,
            currentThemeId: themeId,
            themeHistory: [...state.themeHistory, themeId].slice(-MAX_HISTORY),
          });
        }
      },

      goBack: () => {
        const state = get();
        if (state.themeHistory.length <= 1) return;

        const newHistory = [...state.themeHistory];
        newHistory.pop();
        const previousId = newHistory[newHistory.length - 1];

        if (previousId) {
          const theme = ThemeRegistry.get(previousId);
          if (theme) {
            applyThemeToElement(theme);
            set({
              currentThemeId: previousId,
              previousThemeId: state.currentThemeId,
              themeHistory: newHistory,
            });
          }
        }
      },

      setReducedMotion: (reduced: boolean) => set({ reducedMotion: reduced }),

      setHighContrast: (high: boolean) => set({ highContrast: high }),

      setColorBlindMode: (
        mode: ColorBlindMode
      ) => set({ colorBlindMode: mode }),

      reset: () => {
        removeThemeFromElement();
        const defaultTheme = ThemeRegistry.getDefaultTheme();
        applyThemeToElement(defaultTheme);
        set({ ...initialState });
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      partialize: (state) => ({
        currentThemeId: state.currentThemeId,
        themeHistory: state.themeHistory.slice(-10), // Keep last 10
        reducedMotion: state.reducedMotion,
        highContrast: state.highContrast,
        colorBlindMode: state.colorBlindMode,
      }),
    }
  )
);

// ============================================================================
// Selectors
// ============================================================================

export const selectCurrentThemeId = (state: ThemeStoreStateWithActions) =>
  state.currentThemeId;

export const selectIsTransitioning = (state: ThemeStoreStateWithActions) =>
  state.isTransitioning;

export const selectReducedMotion = (state: ThemeStoreStateWithActions) =>
  state.reducedMotion;

export const selectHighContrast = (state: ThemeStoreStateWithActions) =>
  state.highContrast;

export const selectColorBlindMode = (state: ThemeStoreStateWithActions) =>
  state.colorBlindMode;

export const selectThemeHistory = (state: ThemeStoreStateWithActions) =>
  state.themeHistory;

export const selectPreviousThemeId = (state: ThemeStoreStateWithActions) =>
  state.previousThemeId;

export const selectGoBack = (state: ThemeStoreStateWithActions) => state.goBack;

export const selectReset = (state: ThemeStoreStateWithActions) => state.reset;
