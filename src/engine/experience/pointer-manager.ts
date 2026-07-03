/**
 * Pointer Manager
 *
 * Tracks pointer position, velocity, hover, drag, and magnetic targets.
 * Single source of truth for all pointer events.
 * Includes keyboard gesture equivalents for accessibility.
 * Caches magnetic target bounding rects for performance.
 */

import type {
  PointerPosition,
  PointerVelocity,
  MagneticTarget,
  DragState,
  PointerButton,
  PointerManagerConfig,
  CachedRect,
  GestureType,
  GestureEvent,
  SwipeDirection,
  ExperienceEventType,
} from "./types";
import { useExperienceStore } from "./store";
import { experienceEvents } from "./events";
import { POINTER_DEFAULTS, DEFAULT_POINTER_VELOCITY, KEYBOARD_GESTURES, PERFORMANCE } from "./constants";

// ============================================================================
// Pointer Manager
// ============================================================================

class PointerManagerImpl {
  private config: PointerManagerConfig = { ...POINTER_DEFAULTS };
  private positionHistory: { x: number; y: number; time: number }[] = [];
  private magneticTargets = new Map<string, MagneticTarget>();
  private activeMagneticTarget: MagneticTarget | null = null;
  private magneticRectRefreshTimer: ReturnType<typeof setInterval> | null = null;
  private dragState: DragState = {
    isDragging: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    deltaX: 0,
    deltaY: 0,
    velocity: DEFAULT_POINTER_VELOCITY,
  };
  private lastMoveTime = 0;
  private isTracking = false;
  private cleanupFns: (() => void)[] = [];

  init(config?: Partial<PointerManagerConfig>): void {
    if (this.isTracking) return;
    this.config = { ...this.config, ...config };
    this.attachListeners();
    this.attachKeyboardGestures();
    if (this.config.magnetic) {
      this.startMagneticRectRefresh();
    }
    this.isTracking = true;
  }

  destroy(): void {
    if (!this.isTracking) return;
    for (const cleanup of this.cleanupFns) {
      cleanup();
    }
    this.cleanupFns = [];
    this.positionHistory = [];
    this.magneticTargets.clear();
    if (this.magneticRectRefreshTimer) {
      clearInterval(this.magneticRectRefreshTimer);
    }
    this.isTracking = false;
  }

  updateConfig(config: Partial<PointerManagerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // --- Magnetic Targets ---

  addMagneticTarget(target: MagneticTarget): void {
    // Cache initial bounding rect
    const rect = target.element.getBoundingClientRect();
    target.cachedRect = this.cacheRect(rect);
    this.magneticTargets.set(target.id, target);
  }

  removeMagneticTarget(id: string): void {
    const target = this.magneticTargets.get(id);
    if (target) {
      if (this.activeMagneticTarget?.id === id) {
        target.onRelease?.();
        this.activeMagneticTarget = null;
      }
      this.magneticTargets.delete(id);
    }
  }

  // --- Drag ---

  getDragState(): DragState {
    return { ...this.dragState };
  }

  // --- Keyboard Gestures ---

  private attachKeyboardGestures(): void {
    if (typeof window === "undefined") return;

    const onKeyDown = (e: KeyboardEvent) => {
      const store = useExperienceStore.getState();
      if (store.reducedMotion) return;

      // Ignore if focused on input elements
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      const position = store.pointerPosition;

      // Tap (Enter/Space)
      if (KEYBOARD_GESTURES.tap.includes(e.key as typeof KEYBOARD_GESTURES.tap[number])) {
        e.preventDefault();
        this.emitGesture("tap", position, { source: "keyboard" });
        return;
      }

      // Swipe gestures (Arrow keys)
      const swipeMap: [string[], GestureType, SwipeDirection][] = [
        [Array.from(KEYBOARD_GESTURES.swipeUp), "swipe", "up"],
        [Array.from(KEYBOARD_GESTURES.swipeDown), "swipe", "down"],
        [Array.from(KEYBOARD_GESTURES.swipeLeft), "swipe", "left"],
        [Array.from(KEYBOARD_GESTURES.swipeRight), "swipe", "right"],
      ];

      for (const [keys, gestureType, direction] of swipeMap) {
        if (keys.includes(e.key)) {
          e.preventDefault();
          this.emitGesture(gestureType, position, {
            source: "keyboard",
            direction,
          });
          return;
        }
      }

      // Zoom gestures
      if ((KEYBOARD_GESTURES.zoomIn as readonly string[]).includes(e.key)) {
        e.preventDefault();
        this.emitGesture("zoom", position, { source: "keyboard", scale: 1.1 });
        return;
      }

      if ((KEYBOARD_GESTURES.zoomOut as readonly string[]).includes(e.key)) {
        e.preventDefault();
        this.emitGesture("zoom", position, { source: "keyboard", scale: 0.9 });
        return;
      }
    };

    window.addEventListener("keydown", onKeyDown, { passive: false });
    this.cleanupFns.push(() => window.removeEventListener("keydown", onKeyDown));
  }

  private emitGesture(
    type: GestureType,
    position: PointerPosition,
    data: Partial<Omit<GestureEvent, "type" | "timestamp" | "position">> = {}
  ): void {
    const event = {
      type,
      timestamp: Date.now(),
      position,
      source: "keyboard" as const,
      ...data,
    };
    experienceEvents.emit(`gesture:${type}` as ExperienceEventType, event);
  }

  // --- Magnetic Rect Refresh ---

  private startMagneticRectRefresh(): void {
    this.magneticRectRefreshTimer = setInterval(() => {
      this.refreshMagneticRects();
    }, PERFORMANCE.magneticRectRefreshInterval);
  }

  private refreshMagneticRects(): void {
    for (const [, target] of this.magneticTargets) {
      const rect = target.element.getBoundingClientRect();
      target.cachedRect = this.cacheRect(rect);
    }
  }

  private cacheRect(rect: DOMRect): CachedRect {
    return {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2,
    };
  }

  // --- Internal ---

  private attachListeners(): void {
    if (typeof window === "undefined") return;

    const onMove = (e: PointerEvent) => {
      const now = Date.now();
      if (now - this.lastMoveTime < this.config.moveThrottle) return;
      this.lastMoveTime = now;

      const position = this.getPositionFromEvent(e);
      const velocity = this.calculateVelocity(position.x, position.y, now);

      useExperienceStore.getState().setPointerPosition(position);
      useExperienceStore.getState().setPointerVelocity(velocity);

      this.checkMagneticTargets(position);
      this.updateDrag(position);

      experienceEvents.emit("input:pointer-move", { position, velocity, originalEvent: e });
    };

    const onDown = (e: PointerEvent) => {
      const position = this.getPositionFromEvent(e);
      const button = this.getButton(e);

      useExperienceStore.getState().setInteractionState("pressed");
      useExperienceStore.getState().setPointerCount(
        useExperienceStore.getState().pointerCount + 1
      );

      this.dragState = {
        isDragging: false,
        startX: position.x,
        startY: position.y,
        currentX: position.x,
        currentY: position.y,
        deltaX: 0,
        deltaY: 0,
        velocity: DEFAULT_POINTER_VELOCITY,
      };

      experienceEvents.emit("input:pointer-down", { position, button, originalEvent: e });
    };

    const onUp = (e: PointerEvent) => {
      const position = this.getPositionFromEvent(e);
      const button = this.getButton(e);
      const store = useExperienceStore.getState();

      store.setPointerCount(Math.max(0, store.pointerCount - 1));
      if (store.pointerCount === 0) {
        store.setInteractionState("idle");
      }

      if (this.dragState.isDragging) {
        this.dragState.isDragging = false;
        experienceEvents.emit("pointer:drag-end", { ...this.dragState, originalEvent: e });
      }

      experienceEvents.emit("input:pointer-up", { position, button, originalEvent: e });
    };

    const onLeave = (e: PointerEvent) => {
      const position = this.getPositionFromEvent(e);
      useExperienceStore.getState().setPointerPosition({ x: 0, y: 0, normalizedX: 0.5, normalizedY: 0.5 });
      useExperienceStore.getState().setPointerVelocity(DEFAULT_POINTER_VELOCITY);
      experienceEvents.emit("input:pointer-leave", { position, originalEvent: e });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });

    this.cleanupFns.push(
      () => window.removeEventListener("pointermove", onMove),
      () => window.removeEventListener("pointerdown", onDown),
      () => window.removeEventListener("pointerup", onUp),
      () => window.removeEventListener("pointerleave", onLeave)
    );
  }

  private getPositionFromEvent(e: PointerEvent): PointerPosition {
    return {
      x: e.clientX,
      y: e.clientY,
      normalizedX: window.innerWidth > 0 ? e.clientX / window.innerWidth : 0,
      normalizedY: window.innerHeight > 0 ? e.clientY / window.innerHeight : 0,
    };
  }

  private getButton(e: PointerEvent): PointerButton {
    switch (e.button) {
      case 0: return "primary";
      case 1: return "middle";
      case 2: return "secondary";
      case 3: return "back";
      case 4: return "forward";
      default: return "none";
    }
  }

  private calculateVelocity(x: number, y: number, time: number): PointerVelocity {
    this.positionHistory.push({ x, y, time });

    if (this.positionHistory.length > this.config.velocitySampleSize) {
      this.positionHistory.shift();
    }

    if (this.positionHistory.length < 2) {
      return DEFAULT_POINTER_VELOCITY;
    }

    const first = this.positionHistory[0]!;
    const last = this.positionHistory[this.positionHistory.length - 1]!;
    const dt = Math.max(last.time - first.time, 1);

    const vx = (last.x - first.x) / dt;
    const vy = (last.y - first.y) / dt;
    const magnitude = Math.sqrt(vx * vx + vy * vy);
    const angle = Math.atan2(vy, vx);

    return { x: vx, y: vy, magnitude, angle };
  }

  private checkMagneticTargets(position: PointerPosition): void {
    if (!this.config.magnetic) return;

    let closest: MagneticTarget | null = null;
    let closestDist = Infinity;

    for (const [, target] of this.magneticTargets) {
      const rect = target.cachedRect;
      if (!rect) continue;

      const dist = Math.sqrt(
        (position.x - rect.centerX) ** 2 + (position.y - rect.centerY) ** 2
      );

      if (dist < target.radius && dist < closestDist) {
        closest = target;
        closestDist = dist;
      }
    }

    if (closest && closest !== this.activeMagneticTarget) {
      this.activeMagneticTarget?.onRelease?.();
      this.activeMagneticTarget = closest;
      closest.onMagnetize?.();
      experienceEvents.emit("pointer:magnetize", { target: closest, distance: closestDist });
    } else if (!closest && this.activeMagneticTarget) {
      this.activeMagneticTarget.onRelease?.();
      experienceEvents.emit("pointer:release", { target: this.activeMagneticTarget });
      this.activeMagneticTarget = null;
    }
  }

  private updateDrag(position: PointerPosition): void {
    if (!this.config.drag) return;

    const state = this.dragState;
    if (!state.isDragging) {
      const dx = position.x - state.startX;
      const dy = position.y - state.startY;
      if (Math.sqrt(dx * dx + dy * dy) > 5) {
        state.isDragging = true;
        useExperienceStore.getState().setInteractionState("dragging");
        experienceEvents.emit("pointer:drag-start", { ...state });
      }
    }

    if (state.isDragging) {
      state.currentX = position.x;
      state.currentY = position.y;
      state.deltaX = position.x - state.startX;
      state.deltaY = position.y - state.startY;
      experienceEvents.emit("pointer:drag-move", { ...state });
    }
  }
}

export const PointerManager = new PointerManagerImpl();

export function createPointerManager(): PointerManagerImpl {
  return new PointerManagerImpl();
}
