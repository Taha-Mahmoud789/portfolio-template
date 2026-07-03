import { useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router";
import type { UsePortalReturn, UsePortalTransitionReturn } from "./types";
import {
  usePortalStore,
  selectSelectedPortalId,
  selectActivationPhase,
  selectHoveredPortalId,
  selectFocusedPortalId,
  selectPortals,
} from "./store";

export function usePortal(portalId: string) {
  const portal = usePortalStore(
    useCallback((s) => s.portals.find((p) => p.id === portalId), [portalId]),
  );
  const selectedId = usePortalStore(selectSelectedPortalId);
  const hoveredId = usePortalStore(selectHoveredPortalId);
  const focusedId = usePortalStore(selectFocusedPortalId);
  const phase = usePortalStore(selectActivationPhase);
  const selectPortal = usePortalStore((s) => s.selectPortal);
  const activatePortal = usePortalStore((s) => s.activatePortal);

  return useMemo<UsePortalReturn>(
    () => ({
      portal,
      isSelected: selectedId === portalId,
      isHovered: hoveredId === portalId,
      isFocused: focusedId === portalId,
      isActive: phase === "entered" && selectedId === portalId,
      select: () => selectPortal(portalId),
      activate: () => activatePortal(portalId),
    }),
    [portal, selectedId, hoveredId, focusedId, phase, portalId, selectPortal, activatePortal],
  );
}

export function useAllPortals() {
  return usePortalStore(selectPortals);
}

export function usePortalById(id: string) {
  return usePortalStore(useCallback((s) => s.portals.find((p) => p.id === id), [id]));
}

export function usePortalSearch(query: string) {
  const portals = usePortalStore(selectPortals);

  return useMemo(() => {
    if (!query.trim()) return portals;
    const lower = query.toLowerCase();
    return portals.filter(
      (p) =>
        p.title.toLowerCase().includes(lower) ||
        p.subtitle.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower) ||
        p.metadata.tags.some((t) => t.toLowerCase().includes(lower)),
    );
  }, [portals, query]);
}

export function usePortalActions() {
  return usePortalStore(
    useCallback(
      (s) => ({
        selectPortal: s.selectPortal,
        clearSelection: s.clearSelection,
        setHoveredPortal: s.setHoveredPortal,
        setFocusedPortal: s.setFocusedPortal,
        activatePortal: s.activatePortal,
        cancelActivation: s.cancelActivation,
      }),
      [],
    ),
  );
}

export function usePortalStatus(portalId: string) {
  const portal = usePortalStore(
    useCallback((s) => s.portals.find((p) => p.id === portalId), [portalId]),
  );
  return useMemo(() => {
    const status = portal?.status ?? "disabled";
    return {
      status,
      isInteractive: status === "active",
      isLocked: status === "locked",
      isComingSoon: status === "coming-soon",
      isDisabled: status === "disabled",
    };
  }, [portal]);
}

export function usePortalTransition() {
  const navigate = useNavigate();
  const activatePortal = usePortalStore((s) => s.activatePortal);
  const cancelActivation = usePortalStore((s) => s.cancelActivation);
  const phase = usePortalStore(selectActivationPhase);
  const portals = usePortalStore(selectPortals);

  const transition = useCallback(
    (portalId: string): boolean => {
      const portal = portals.find((p) => p.id === portalId);
      if (!portal) return false;

      activatePortal(portalId);
      void navigate(portal.destinationRoute);
      return true;
    },
    [portals, navigate, activatePortal],
  );

  return useMemo<UsePortalTransitionReturn>(
    () => ({
      transition,
      isTransitioning: phase !== "idle" && phase !== "entered",
      phase,
      cancel: cancelActivation,
    }),
    [transition, phase, cancelActivation],
  );
}

// ============================================================================
// Focus Management
// ============================================================================

/**
 * Manages focus during portal activation transitions.
 *
 * - Saves the currently focused element before activation
 * - Restores focus after the transition completes or is cancelled
 * - Provides an announce() function for screen reader announcements
 */
export function usePortalFocusManager() {
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const phase = usePortalStore(selectActivationPhase);

  // Save focus when activation begins
  useEffect(() => {
    if (phase === "selected") {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
  }, [phase]);

  // Restore focus when activation completes or is cancelled
  useEffect(() => {
    if (phase === "idle" || phase === "entered") {
      const prev = previousFocusRef.current;
      if (prev && typeof prev.focus === "function") {
        const timeout = setTimeout(() => {
          prev.focus();
        }, 100);
        return () => clearTimeout(timeout);
      }
    }
    return undefined;
  }, [phase]);

  const announce = useCallback((message: string) => {
    const el = document.getElementById("portal-announcer");
    if (el) {
      el.textContent = message;
    }
  }, []);

  return useMemo(
    () => ({
      saveFocus: () => {
        previousFocusRef.current = document.activeElement as HTMLElement;
      },
      restoreFocus: () => {
        const prev = previousFocusRef.current;
        if (prev && typeof prev.focus === "function") {
          prev.focus();
        }
      },
      announce,
      phase,
    }),
    [announce, phase],
  );
}
