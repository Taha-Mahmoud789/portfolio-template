import { create } from "zustand";
import type { PortalStore } from "./types";

const initialState: Pick<
  PortalStore,
  | "selectedPortalId"
  | "activationPhase"
  | "hoveredPortalId"
  | "focusedPortalId"
  | "isGridReady"
  | "portals"
  | "visiblePortals"
> = {
  selectedPortalId: null,
  activationPhase: "idle",
  hoveredPortalId: null,
  focusedPortalId: null,
  isGridReady: false,
  portals: [],
  visiblePortals: [],
};

export const usePortalStore = create<PortalStore>((set) => ({
  ...initialState,

  selectPortal: (portalId) => set({ selectedPortalId: portalId, activationPhase: "selected" }),

  clearSelection: () => set({ selectedPortalId: null, activationPhase: "idle" }),

  setHoveredPortal: (portalId) => set({ hoveredPortalId: portalId }),

  setFocusedPortal: (portalId) => set({ focusedPortalId: portalId }),

  activatePortal: (portalId) => set({ selectedPortalId: portalId, activationPhase: "selected" }),

  cancelActivation: () => set({ selectedPortalId: null, activationPhase: "idle" }),

  setGridReady: (ready) => set({ isGridReady: ready }),

  registerPortals: (portals) => set({ portals }),

  setVisiblePortals: (portalIds) => set({ visiblePortals: portalIds }),
}));

// Selectors — stable references for usePortalStore(selector)
export const selectSelectedPortalId = (s: PortalStore) => s.selectedPortalId;
export const selectActivationPhase = (s: PortalStore) => s.activationPhase;
export const selectHoveredPortalId = (s: PortalStore) => s.hoveredPortalId;
export const selectFocusedPortalId = (s: PortalStore) => s.focusedPortalId;
export const selectIsGridReady = (s: PortalStore) => s.isGridReady;
export const selectPortals = (s: PortalStore) => s.portals;
export const selectVisiblePortals = (s: PortalStore) => s.visiblePortals;
export const selectPortalById = (id: string) => (s: PortalStore) =>
  s.portals.find((p) => p.id === id);
