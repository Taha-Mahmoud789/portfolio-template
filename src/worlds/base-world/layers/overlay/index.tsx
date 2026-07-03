/**
 * Overlay Layer
 *
 * Manages HUD, dialogs, notifications, and debug panels.
 * Overlays float above the content layer at different elevations.
 */

import { createContext, useContext, useCallback, useMemo, useState } from "react";
import type {
  BaseOverlayLayerProps,
  BaseOverlaySlotProps,
  BaseOverlayType,
  BaseOverlayContextValue,
} from "../../types";

// ============================================================================
// Context
// ============================================================================

const BaseOverlayContext = createContext<BaseOverlayContextValue>({
  visibleOverlays: new Set(),
  show: (_type: BaseOverlayType) => {
    // no-op default — overridden by provider
  },
  hide: (_type: BaseOverlayType) => {
    // no-op default — overridden by provider
  },
  toggle: (_type: BaseOverlayType) => {
    // no-op default — overridden by provider
  },
});

function useBaseOverlayContext(): BaseOverlayContextValue {
  return useContext(BaseOverlayContext);
}

// ============================================================================
// Overlay Slot
// ============================================================================

const OVERLAY_ELEVATION: Record<BaseOverlayType, string> = {
  hud: "z-30",
  notification: "z-40",
  dialog: "z-50",
  debug: "z-60",
};

export function BaseOverlaySlot({
  type,
  children,
  className = "",
  visible = true,
}: BaseOverlaySlotProps) {
  if (!visible || !children) return null;

  return (
    <div
      className={`base-world__overlay-slot base-world__overlay-slot--${type} fixed inset-0 pointer-events-none ${OVERLAY_ELEVATION[type]} ${className}`}
      data-overlay-type={type}
      role={type === "dialog" ? "dialog" : "status"}
      aria-live={type === "notification" ? "polite" : undefined}
    >
      <div className="pointer-events-auto">{children}</div>
    </div>
  );
}

// ============================================================================
// Component
// ============================================================================

export function BaseOverlayLayer({ className = "" }: BaseOverlayLayerProps) {
  const [visibleOverlays, setVisibleOverlays] = useState<ReadonlySet<BaseOverlayType>>(
    () => new Set(),
  );

  const show = useCallback((type: BaseOverlayType) => {
    setVisibleOverlays((prev) => {
      if (prev.has(type)) return prev;
      const next = new Set(prev);
      next.add(type);
      return next;
    });
  }, []);

  const hide = useCallback((type: BaseOverlayType) => {
    setVisibleOverlays((prev) => {
      if (!prev.has(type)) return prev;
      const next = new Set(prev);
      next.delete(type);
      return next;
    });
  }, []);

  const toggle = useCallback((type: BaseOverlayType) => {
    setVisibleOverlays((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }, []);

  const value = useMemo<BaseOverlayContextValue>(
    () => ({
      visibleOverlays,
      show,
      hide,
      toggle,
    }),
    [visibleOverlays, show, hide, toggle],
  );

  return (
    <BaseOverlayContext.Provider value={value}>
      <div className={`base-world__overlay relative z-20 ${className}`} aria-label="Overlays" />
    </BaseOverlayContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useBaseOverlay(): BaseOverlayContextValue {
  return useBaseOverlayContext();
}
