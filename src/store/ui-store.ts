import { create } from "zustand";

interface UiState {
  isWorldSwitcherOpen: boolean;
  isMenuOpen: boolean;
  isLoading: boolean;
  scrollY: number;
}

interface UiActions {
  toggleWorldSwitcher: () => void;
  setWorldSwitcherOpen: (open: boolean) => void;
  toggleMenu: () => void;
  setMenuOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  setScrollY: (scrollY: number) => void;
}

export type UiStore = UiState & UiActions;

export const useUiStore = create<UiStore>((set) => ({
  isWorldSwitcherOpen: false,
  isMenuOpen: false,
  isLoading: false,
  scrollY: 0,

  toggleWorldSwitcher: () => set((state) => ({ isWorldSwitcherOpen: !state.isWorldSwitcherOpen })),
  setWorldSwitcherOpen: (isWorldSwitcherOpen) => set({ isWorldSwitcherOpen }),
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  setMenuOpen: (isMenuOpen) => set({ isMenuOpen }),
  setLoading: (isLoading) => set({ isLoading }),
  setScrollY: (scrollY) => set({ scrollY }),
}));
