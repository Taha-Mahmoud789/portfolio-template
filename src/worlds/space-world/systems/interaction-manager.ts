/**
 * Interaction Manager
 *
 * Handles hover, select, focus, exit events on space objects.
 * Tracks current hovered/selected/focused object.
 * Emits events for other systems to respond to.
 *
 * State object is cached and only recreated on change.
 */

import { useCallback, useRef, useState } from "react";
import type { InteractionEvent } from "../data/types";

type InteractionListener = (event: InteractionEvent) => void;

interface InteractionState {
  readonly hoveredId: string | null;
  readonly selectedId: string | null;
  readonly focusedId: string | null;
}

interface InteractionManager extends InteractionState {
  hover: (id: string | null) => void;
  select: (id: string | null) => void;
  focus: (id: string | null) => void;
  exit: () => void;
  subscribe: (listener: InteractionListener) => () => void;
}

export function createInteractionManager(): InteractionManager {
  let hoveredId: string | null = null;
  let selectedId: string | null = null;
  let focusedId: string | null = null;
  const listeners = new Set<InteractionListener>();
  let cachedState: InteractionState = { hoveredId: null, selectedId: null, focusedId: null };

  const getState = (): InteractionState => {
    if (
      cachedState.hoveredId !== hoveredId ||
      cachedState.selectedId !== selectedId ||
      cachedState.focusedId !== focusedId
    ) {
      cachedState = { hoveredId, selectedId, focusedId };
    }
    return cachedState;
  };

  const emit = (event: InteractionEvent) => {
    for (const listener of listeners) {
      listener(event);
    }
  };

  const hover = (id: string | null) => {
    hoveredId = id;
    emit({ type: "hover", objectId: id });
  };

  const select = (id: string | null) => {
    selectedId = id;
    emit({ type: "select", objectId: id });
  };

  const focus = (id: string | null) => {
    focusedId = id;
    emit({ type: "focus", objectId: id });
  };

  const exit = () => {
    hoveredId = null;
    selectedId = null;
    focusedId = null;
    emit({ type: "exit", objectId: null });
  };

  const subscribe = (listener: InteractionListener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  return {
    get hoveredId() {
      return getState().hoveredId;
    },
    get selectedId() {
      return getState().selectedId;
    },
    get focusedId() {
      return getState().focusedId;
    },
    hover,
    select,
    focus,
    exit,
    subscribe,
  };
}

// ============================================================================
// React Hook
// ============================================================================

export function useInteractionManager() {
  const managerRef = useRef<InteractionManager | null>(null);
  const [, forceUpdate] = useState(0);

  managerRef.current ??= createInteractionManager();

  const hover = useCallback((id: string | null) => {
    managerRef.current?.hover(id);
    forceUpdate((n) => n + 1);
  }, []);

  const select = useCallback((id: string | null) => {
    managerRef.current?.select(id);
    forceUpdate((n) => n + 1);
  }, []);

  const focus = useCallback((id: string | null) => {
    managerRef.current?.focus(id);
    forceUpdate((n) => n + 1);
  }, []);

  const exit = useCallback(() => {
    managerRef.current?.exit();
    forceUpdate((n) => n + 1);
  }, []);

  return {
    hoveredId: managerRef.current.hoveredId,
    selectedId: managerRef.current.selectedId,
    focusedId: managerRef.current.focusedId,
    hover,
    select,
    focus,
    exit,
    subscribe: managerRef.current.subscribe,
  };
}
