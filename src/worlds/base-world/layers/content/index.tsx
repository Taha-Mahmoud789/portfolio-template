/**
 * Content Layer
 *
 * Provides named content areas for world components.
 * Areas: hero, sections, canvas, floating, overlay.
 * Worlds slot their content into these areas.
 */

import { createContext, useContext, useCallback, useMemo, useState } from "react";
import type { BaseContentLayerProps, BaseContentSlotProps, BaseContentArea } from "../../types";
import { BASE_CONTENT_AREAS } from "../../constants";

// ============================================================================
// Context
// ============================================================================

interface BaseContentContextValue {
  registeredAreas: ReadonlySet<BaseContentArea>;
  registerArea: (area: BaseContentArea) => void;
  unregisterArea: (area: BaseContentArea) => void;
}

const BaseContentContext = createContext<BaseContentContextValue>({
  registeredAreas: new Set(BASE_CONTENT_AREAS),
  registerArea: (_area: BaseContentArea) => {
    // no-op default — overridden by provider
  },
  unregisterArea: (_area: BaseContentArea) => {
    // no-op default — overridden by provider
  },
});

function useBaseContentContext(): BaseContentContextValue {
  return useContext(BaseContentContext);
}

// ============================================================================
// Content Slot
// ============================================================================

export function BaseContentSlot({ area, className = "", children }: BaseContentSlotProps) {
  return (
    <section
      className={`base-world__content-slot base-world__content-slot--${area} ${className}`}
      data-content-area={area}
      aria-label={`${area} content`}
    >
      {children}
    </section>
  );
}

// ============================================================================
// Component
// ============================================================================

export function BaseContentLayer({ children, className = "", areas }: BaseContentLayerProps) {
  const [registeredAreas, setRegisteredAreas] = useState<ReadonlySet<BaseContentArea>>(
    () => new Set(areas ?? BASE_CONTENT_AREAS),
  );

  const registerArea = useCallback((area: BaseContentArea) => {
    setRegisteredAreas((prev) => {
      if (prev.has(area)) return prev;
      const next = new Set(prev);
      next.add(area);
      return next;
    });
  }, []);

  const unregisterArea = useCallback((area: BaseContentArea) => {
    setRegisteredAreas((prev) => {
      if (!prev.has(area)) return prev;
      const next = new Set(prev);
      next.delete(area);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      registeredAreas,
      registerArea,
      unregisterArea,
    }),
    [registeredAreas, registerArea, unregisterArea],
  );

  return (
    <BaseContentContext.Provider value={value}>
      <div
        className={`base-world__content relative z-10 ${className}`}
        role="main"
        aria-label="World content"
      >
        {children}
      </div>
    </BaseContentContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useBaseContent(): BaseContentContextValue {
  return useBaseContentContext();
}
