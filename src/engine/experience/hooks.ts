/**
 * Experience Hooks
 *
 * Public API for consuming the Experience Engine.
 * Provides hooks for pointer, gesture, focus, hover, scene, and lifecycle.
 * High-frequency data (pointer position) uses store selectors, not context.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  useExperienceActions,
  useExperienceState,
  useExperienceContext,
} from "./context";
import { useExperienceStore, selectInteractionState, selectPointerPosition, selectPointerVelocity, selectCursorState, selectReducedMotion, selectLifecyclePhase, selectActiveSceneId, selectIsVisible, selectIsInitialized } from "./store";
import { experienceEvents } from "./events";
import { FocusManager } from "./focus-manager";
import { HoverManager } from "./hover-manager";
import { A11Y } from "./constants";
import type {
  InteractionState,
  CursorState,
  PointerPosition,
  PointerVelocity,
  LifecyclePhase,
  SceneId,
  ExperienceEventType,
  ExperienceEventCallback,
  GestureEvent,
  GestureType,
} from "./types";

// ============================================================================
// Core Hooks
// ============================================================================

/** Full experience context (state + actions). Prefer split hooks for perf. */
export function useExperience(): ReturnType<typeof useExperienceContext> {
  return useExperienceContext();
}

/** Experience actions only — stable, never rerenders. */
export function useExperienceActionsOnly(): ReturnType<typeof useExperienceActions> {
  return useExperienceActions();
}

/** Experience state only — rerenders on state changes. */
export function useExperienceStateOnly(): ReturnType<typeof useExperienceState> {
  return useExperienceState();
}

// ============================================================================
// State Selector Hooks
// ============================================================================

/** Current interaction state. */
export function useInteractionState(): InteractionState {
  return useExperienceStore(selectInteractionState);
}

/** Current pointer position. Uses Zustand selector — only rerenders when position changes. */
export function usePointerPosition(): PointerPosition {
  return useExperienceStore(selectPointerPosition);
}

/** Current pointer velocity. Uses Zustand selector. */
export function usePointerVelocity(): PointerVelocity {
  return useExperienceStore(selectPointerVelocity);
}

/** Current cursor state. */
export function useCursorState(): CursorState {
  return useExperienceStore(selectCursorState);
}

/** Whether reduced motion is preferred. */
export function useReducedMotion(): boolean {
  return useExperienceStore(selectReducedMotion);
}

/** Current lifecycle phase. */
export function useLifecyclePhase(): LifecyclePhase {
  return useExperienceStore(selectLifecyclePhase);
}

/** Active scene ID. */
export function useActiveSceneId(): SceneId | null {
  return useExperienceStore(selectActiveSceneId);
}

/** Whether the page is visible. */
export function usePageVisible(): boolean {
  return useExperienceStore(selectIsVisible);
}

/** Whether the engine is initialized. */
export function useExperienceInitialized(): boolean {
  return useExperienceStore(selectIsInitialized);
}

// ============================================================================
// Action Hooks
// ============================================================================

/** Set interaction state. */
export function useSetInteractionState(): (state: InteractionState) => void {
  return useExperienceStore((s) => s.setInteractionState);
}

/** Set cursor state. */
export function useSetCursorState(): (state: CursorState) => void {
  return useExperienceStore((s) => s.setCursorState);
}

/** Set active scene. */
export function useSetActiveScene(): (sceneId: SceneId | null) => void {
  return useExperienceStore((s) => s.setActiveScene);
}

// ============================================================================
// Event Hooks
// ============================================================================

/** Subscribe to an experience event with automatic cleanup. */
export function useExperienceEvent(
  event: ExperienceEventType,
  callback: ExperienceEventCallback
): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const unsub = experienceEvents.on(event, (data) => callbackRef.current(data));
    return unsub;
  }, [event]);
}

/** Subscribe to multiple experience events. Event names are used as deps. */
export function useExperienceEvents(
  events: [ExperienceEventType, ExperienceEventCallback][]
): void {
  // Use serialized event names as dependency to avoid re-subscription on inline arrays
  const eventNames = events.map(([name]) => name).join(",");
   
  const memoizedEvents = useRef(events);
  memoizedEvents.current = events;

  useEffect(() => {
    const unsubs = memoizedEvents.current.map(([event, callback]) =>
      experienceEvents.on(event, callback)
    );
    return () => {
      for (const unsub of unsubs) unsub();
    };
  }, [eventNames]);
}

// ============================================================================
// Pointer Hooks
// ============================================================================

/** Track pointer position on a specific element. */
export function usePointerTrack(
  elementRef: React.RefObject<HTMLElement | null>
): { isHovering: boolean; position: PointerPosition } {
  const [isHovering, setIsHovering] = useState(false);
  const position = usePointerPosition();

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const onEnter = () => setIsHovering(true);
    const onLeave = () => setIsHovering(false);

    el.addEventListener("mouseenter", onEnter, { passive: true });
    el.addEventListener("mouseleave", onLeave, { passive: true });

    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [elementRef]);

  return { isHovering, position };
}

// ============================================================================
// Gesture Hooks
// ============================================================================

/** Listen for specific gesture types. */
export function useGesture(
  type: GestureType,
  callback: (event: GestureEvent) => void
): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const event = `gesture:${type}` as ExperienceEventType;
    const unsub = experienceEvents.on(event, (data) => callbackRef.current(data as GestureEvent));
    return unsub;
  }, [type]);
}

/** Listen for multiple gesture types. Types array is used as dep. */
export function useGestures(
  types: GestureType[],
  callback: (event: GestureEvent) => void
): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  // Use sorted type names as dependency
  const typeKey = [...types].sort().join(",");
   
  const memoizedTypes = useRef(types);
  memoizedTypes.current = types;

  useEffect(() => {
    const unsubs = memoizedTypes.current.map((type) => {
      const event = `gesture:${type}` as ExperienceEventType;
      return experienceEvents.on(event, (data) => callbackRef.current(data as GestureEvent));
    });
    return () => {
      for (const unsub of unsubs) unsub();
    };
  }, [typeKey]);
}

// ============================================================================
// Focus Hooks
// ============================================================================

/** Trap focus within a container element. */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>,
  isActive = true
): void {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    FocusManager.trapFocus(containerRef.current);
    return () => {
      FocusManager.releaseTrap();
    };
  }, [containerRef, isActive]);
}

/** Focus the main content area. */
export function useFocusMainContent(): () => void {
  return useCallback(() => {
    FocusManager.focusMainContent();
  }, []);
}

// ============================================================================
// Hover Hooks
// ============================================================================

/** Register an element as a hover target. */
export function useHoverTarget(
  elementRef: React.RefObject<HTMLElement | null>
): { isHovering: boolean } {
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    HoverManager.registerTarget(el);

    const unsubEnter = experienceEvents.on("pointer:hover-enter", (data) => {
      if ((data as { element: HTMLElement }).element === el) {
        setIsHovering(true);
      }
    });
    const unsubLeave = experienceEvents.on("pointer:hover-leave", (data) => {
      if ((data as { element: HTMLElement }).element === el) {
        setIsHovering(false);
      }
    });

    return () => {
      HoverManager.unregisterTarget(el);
      unsubEnter();
      unsubLeave();
    };
  }, [elementRef]);

  return { isHovering };
}

// ============================================================================
// Scene Hooks
// ============================================================================

/** Get the active scene ID. */
export function useActiveScene(): SceneId | null {
  return useActiveSceneId();
}

/** Check if a specific scene is active. */
export function useIsSceneActive(sceneId: SceneId): boolean {
  const activeSceneId = useActiveSceneId();
  return activeSceneId === sceneId;
}

// ============================================================================
// Lifecycle Hooks
// ============================================================================

/** Run a callback when the engine is ready. */
export function useOnExperienceReady(callback: () => void): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const unsub = experienceEvents.on("lifecycle:ready", () => callbackRef.current());
    return unsub;
  }, []);
}

/** Run a callback on experience destroy. */
export function useOnExperienceDestroy(callback: () => void): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const unsub = experienceEvents.on("lifecycle:phase-change", (data) => {
      const event = data as { phase: string };
      if (event.phase === "destroyed") {
        callbackRef.current();
      }
    });
    return unsub;
  }, []);
}

// ============================================================================
// System Hooks
// ============================================================================

/** Track window resize events. */
export function useResize(
  callback: (data: { width: number; height: number }) => void
): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const unsub = experienceEvents.on("system:resize", (data) => {
      callbackRef.current(data as { width: number; height: number });
    });
    return unsub;
  }, []);
}

/** Track visibility changes. */
export function useVisibilityChange(
  callback: (isVisible: boolean) => void
): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const unsub = experienceEvents.on("system:visibility-change", (data) => {
      callbackRef.current((data as { isVisible: boolean }).isVisible);
    });
    return unsub;
  }, []);
}

/** Track reduced motion preference changes. */
export function useMotionPreferenceChange(
  callback: (reducedMotion: boolean) => void
): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const unsub = experienceEvents.on("system:motion-preference-change", (data) => {
      callbackRef.current((data as { reducedMotion: boolean }).reducedMotion);
    });
    return unsub;
  }, []);
}

// ============================================================================
// Accessibility Hooks
// ============================================================================

/** Announce a message to screen readers via the live region. */
export function useAnnounce(): (message: string) => void {
  return useCallback((message: string) => {
    if (typeof document === "undefined") return;
    const region = document.getElementById(A11Y.LIVE_REGION_ID);
    if (region) {
      region.textContent = message;
      experienceEvents.emit("a11y:announce", { message, timestamp: Date.now() });
    }
  }, []);
}
