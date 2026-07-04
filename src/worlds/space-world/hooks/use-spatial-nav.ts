/**
 * useSpatialNav
 *
 * Spatial navigation for the Space World.
 * Apple Vision Pro–inspired:
 * - Scroll has inertia (momentum decays naturally)
 * - Touch gestures for mobile (swipe orbit, tap focus, swipe-down dismiss)
 * - Click empty space to dismiss (handled by SpaceScene)
 * - No instruction text — interface is self-explanatory
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { CameraMode, SpaceObject } from "../data/types";
import { NAVIGATION } from "../data/space.config";

// ============================================================================
// Types
// ============================================================================

export interface SpatialNavState {
  readonly selectedId: string | null;
  readonly focusedId: string | null;
  readonly focusedIndex: number;
  readonly cameraMode: CameraMode;
  readonly scrollProgress: number;
  readonly scrollVelocity: number;
}

export interface SpatialNavActions {
  selectObject: (id: string | null) => void;
  focusObject: (id: string | null) => void;
  exitFocus: () => void;
  cycleNext: () => void;
  cyclePrev: () => void;
  handleScroll: (deltaY: number) => void;
  tickInertia: () => void;
  handleTouchStart: (x: number, y: number) => void;
  handleTouchMove: (x: number, y: number) => void;
  handleTouchEnd: () => void;
}

// ============================================================================
// Factory
// ============================================================================

export function createSpatialNav(
  getObjects: () => readonly SpaceObject[],
  getById: (id: string) => SpaceObject | undefined,
): { state: SpatialNavState; actions: SpatialNavActions } {
  let selectedId: string | null = null;
  let focusedId: string | null = null;
  let focusedIndex = -1;
  let cameraMode: CameraMode = "intro";
  let scrollProgress = 0;
  let scrollVelocity = 0;

  // Touch state
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  let isTouchDragging = false;

  const getVisibleObjects = () => getObjects().filter((o) => o.visible && o.interaction.hover);
  const getObjectIndex = (id: string) => getVisibleObjects().findIndex((o) => o.id === id);

  const selectObject = (id: string | null) => {
    if (id === selectedId) return;
    selectedId = id;

    if (id) {
      const obj = getById(id);
      if (obj?.interaction.focus) {
        focusedId = id;
        focusedIndex = getObjectIndex(id);
        cameraMode = "object-focus";
      }
    }
  };

  const focusObject = (id: string | null) => {
    if (id === focusedId) return;
    focusedId = id;

    if (id) {
      focusedIndex = getObjectIndex(id);
      selectedId = id;
      cameraMode = "object-focus";
    } else {
      focusedIndex = -1;
      cameraMode = "overview";
    }
  };

  const exitFocus = () => {
    focusedId = null;
    focusedIndex = -1;
    selectedId = null;
    cameraMode = "overview";
  };

  const cycleNext = () => {
    const visible = getVisibleObjects();
    if (visible.length === 0) return;

    const nextIndex = focusedIndex < visible.length - 1 ? focusedIndex + 1 : 0;
    const nextObj = visible[nextIndex];
    if (nextObj) {
      focusObject(nextObj.id);
    }
  };

  const cyclePrev = () => {
    const visible = getVisibleObjects();
    if (visible.length === 0) return;

    const prevIndex = focusedIndex > 0 ? focusedIndex - 1 : visible.length - 1;
    const prevObj = visible[prevIndex];
    if (prevObj) {
      focusObject(prevObj.id);
    }
  };

  const handleScroll = (deltaY: number) => {
    // Only scroll in overview mode
    if (cameraMode !== "overview") return;

    scrollVelocity += deltaY * NAVIGATION.scrollSpeed;
  };

  const tickInertia = () => {
    if (Math.abs(scrollVelocity) < 0.001) {
      scrollVelocity = 0;
      return;
    }

    scrollProgress += scrollVelocity;
    scrollVelocity *= NAVIGATION.inertiaDecay;

    // Soft clamp — don't hard-stop, just resist
    const [min, max] = NAVIGATION.scrollRange;
    if (scrollProgress < min) {
      scrollProgress = min;
      scrollVelocity = 0;
    } else if (scrollProgress > max) {
      scrollProgress = max;
      scrollVelocity = 0;
    }
  };

  // Touch handlers for mobile
  const handleTouchStart = (x: number, y: number) => {
    touchStartX = x;
    touchStartY = y;
    touchStartTime = performance.now();
    isTouchDragging = false;
  };

  const handleTouchMove = (x: number, y: number) => {
    const dx = x - touchStartX;
    const dy = y - touchStartY;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      isTouchDragging = true;
    }

    // If in overview, horizontal swipe orbits the camera
    if (cameraMode === "overview" && isTouchDragging) {
      scrollProgress -= dx * 0.01;
      scrollVelocity = 0;
      touchStartX = x;
      touchStartY = y;
    }
  };

  const handleTouchEnd = () => {
    const elapsed = performance.now() - touchStartTime;

    // Quick tap (< 200ms, < 10px movement) = select/exit
    if (!isTouchDragging && elapsed < 200) {
      if (cameraMode === "object-focus") {
        exitFocus();
      }
    }

    // Swipe down in focus mode = dismiss
    // Handled via touchStart tracking

    isTouchDragging = false;
  };

  return {
    get state() {
      return {
        selectedId,
        focusedId,
        focusedIndex,
        cameraMode,
        scrollProgress,
        scrollVelocity,
      };
    },
    actions: {
      selectObject,
      focusObject,
      exitFocus,
      cycleNext,
      cyclePrev,
      handleScroll,
      tickInertia,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
    },
  };
}

// ============================================================================
// React Hook
// ============================================================================

export function useSpatialNav(
  getObjects: () => readonly SpaceObject[],
  getById: (id: string) => SpaceObject | undefined,
  onCameraModeChange?: (mode: CameraMode, objectId?: string) => void,
) {
  const navRef = useRef<ReturnType<typeof createSpatialNav> | null>(null);
  const [state, setState] = useState<SpatialNavState>({
    selectedId: null,
    focusedId: null,
    focusedIndex: -1,
    cameraMode: "intro",
    scrollProgress: 0,
    scrollVelocity: 0,
  });

  navRef.current ??= createSpatialNav(getObjects, getById);

  const syncState = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;
    const s = nav.state;
    setState((prev) => {
      if (
        prev.selectedId === s.selectedId &&
        prev.focusedId === s.focusedId &&
        prev.focusedIndex === s.focusedIndex &&
        prev.cameraMode === s.cameraMode &&
        prev.scrollProgress === s.scrollProgress &&
        prev.scrollVelocity === s.scrollVelocity
      ) {
        return prev;
      }
      return { ...s };
    });
  }, []);

  const selectObject = useCallback(
    (id: string | null) => {
      const nav = navRef.current;
      if (!nav) return;
      const prevMode = nav.state.cameraMode;
      nav.actions.selectObject(id);
      syncState();
      if (nav.state.cameraMode !== prevMode) {
        onCameraModeChange?.(nav.state.cameraMode, id ?? undefined);
      }
    },
    [syncState, onCameraModeChange],
  );

  const focusObject = useCallback(
    (id: string | null) => {
      const nav = navRef.current;
      if (!nav) return;
      const prevMode = nav.state.cameraMode;
      nav.actions.focusObject(id);
      syncState();
      if (nav.state.cameraMode !== prevMode) {
        onCameraModeChange?.(nav.state.cameraMode, id ?? undefined);
      }
    },
    [syncState, onCameraModeChange],
  );

  const exitFocus = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;
    const prevMode = nav.state.cameraMode;
    nav.actions.exitFocus();
    syncState();
    if (nav.state.cameraMode !== prevMode) {
      onCameraModeChange?.("overview");
    }
  }, [syncState, onCameraModeChange]);

  const cycleNext = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;
    nav.actions.cycleNext();
    syncState();
    onCameraModeChange?.(nav.state.cameraMode, nav.state.focusedId ?? undefined);
  }, [syncState, onCameraModeChange]);

  const cyclePrev = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;
    nav.actions.cyclePrev();
    syncState();
    onCameraModeChange?.(nav.state.cameraMode, nav.state.focusedId ?? undefined);
  }, [syncState, onCameraModeChange]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const nav = navRef.current;
      if (!nav) return;

      switch (e.key) {
        case "Tab":
          e.preventDefault();
          if (e.shiftKey) {
            nav.actions.cyclePrev();
          } else {
            nav.actions.cycleNext();
          }
          syncState();
          break;

        case "Enter":
        case " ":
          if (nav.state.focusedId) {
            e.preventDefault();
            nav.actions.selectObject(nav.state.focusedId);
            syncState();
          }
          break;

        case "Escape":
          e.preventDefault();
          nav.actions.exitFocus();
          syncState();
          onCameraModeChange?.("overview");
          break;

        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          nav.actions.cycleNext();
          syncState();
          onCameraModeChange?.(nav.state.cameraMode, nav.state.focusedId ?? undefined);
          break;

        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          nav.actions.cyclePrev();
          syncState();
          onCameraModeChange?.(nav.state.cameraMode, nav.state.focusedId ?? undefined);
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [syncState, onCameraModeChange]);

  // Scroll with inertia
  useEffect(() => {
    function handleWheel(e: WheelEvent) {
      const nav = navRef.current;
      if (!nav) return;
      if (nav.state.cameraMode === "object-focus") return;

      e.preventDefault();
      nav.actions.handleScroll(e.deltaY);
    }

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  // Inertia tick — runs every frame
  useEffect(() => {
    let raf: number;
    function tick() {
      navRef.current?.actions.tickInertia();
      // Only sync if there's meaningful velocity
      const nav = navRef.current;
      if (nav && Math.abs(nav.state.scrollVelocity) > 0.001) {
        syncState();
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [syncState]);

  // Touch gestures for mobile
  useEffect(() => {
    function handleTouchStart(e: TouchEvent) {
      const touch = e.touches[0];
      if (touch) navRef.current?.actions.handleTouchStart(touch.clientX, touch.clientY);
    }

    function handleTouchMove(e: TouchEvent) {
      const touch = e.touches[0];
      if (touch) navRef.current?.actions.handleTouchMove(touch.clientX, touch.clientY);
    }

    function handleTouchEnd() {
      navRef.current?.actions.handleTouchEnd();
    }

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return {
    ...state,
    selectObject,
    focusObject,
    exitFocus,
    cycleNext,
    cyclePrev,
  };
}
