/**
 * Gesture Manager
 *
 * Recognizes gestures by consuming PointerManager events.
 * No direct DOM listeners — relies on the event bus.
 * Supports touch gestures and keyboard equivalents.
 */

import type {
  GestureType,
  GestureEvent,
  SwipeDirection,
  PointerPosition,
  GestureManagerConfig,
  ExperienceEventType,
} from "./types";
import { experienceEvents } from "./events";
import { GESTURE_DEFAULTS } from "./constants";

// ============================================================================
// Gesture Manager
// ============================================================================

class GestureManagerImpl {
  private config: GestureManagerConfig = { ...GESTURE_DEFAULTS };
  private isActive = false;
  private cleanupFns: (() => void)[] = [];

  // Tap tracking
  private tapStartTime = 0;
  private tapStartPosition: PointerPosition = { x: 0, y: 0, normalizedX: 0, normalizedY: 0 };
  private lastTapTime = 0;
  private tapTimeoutId: ReturnType<typeof setTimeout> | null = null;

  // Long press tracking
  private longPressTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private isLongPress = false;

  // Pinch/zoom tracking
  private initialPinchDistance = 0;
  private initialPinchAngle = 0;
  private isPinching = false;

  // Rotate tracking
  private initialRotateAngle = 0;

  init(config?: Partial<GestureManagerConfig>): void {
    if (this.isActive) return;
    this.config = { ...this.config, ...config };
    if (!this.config.enabled) return;
    this.attachListeners();
    this.isActive = true;
  }

  destroy(): void {
    if (!this.isActive) return;
    for (const cleanup of this.cleanupFns) {
      cleanup();
    }
    this.cleanupFns = [];
    this.clearTimeouts();
    this.isActive = false;
  }

  updateConfig(config: Partial<GestureManagerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  private clearTimeouts(): void {
    if (this.tapTimeoutId) clearTimeout(this.tapTimeoutId);
    if (this.longPressTimeoutId) clearTimeout(this.longPressTimeoutId);
  }

  private attachListeners(): void {
    if (typeof window === "undefined") return;

    // Consume touch events for gesture recognition
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        this.handlePinchStart(e);
        return;
      }
      if (e.touches.length !== 1) return;

      const touch = e.touches[0]!;
      const position: PointerPosition = {
        x: touch.clientX,
        y: touch.clientY,
        normalizedX: window.innerWidth > 0 ? touch.clientX / window.innerWidth : 0,
        normalizedY: window.innerHeight > 0 ? touch.clientY / window.innerHeight : 0,
      };

      this.tapStartTime = Date.now();
      this.tapStartPosition = position;
      this.isLongPress = false;

      // Start long press timer
      this.longPressTimeoutId = setTimeout(() => {
        this.isLongPress = true;
        this.emitGesture("long-press", position, { duration: this.config.longPressDelay });
      }, this.config.longPressDelay);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        this.handlePinchMove(e);
        return;
      }
      if (e.touches.length !== 1) return;

      const touch = e.touches[0]!;
      const position: PointerPosition = {
        x: touch.clientX,
        y: touch.clientY,
        normalizedX: window.innerWidth > 0 ? touch.clientX / window.innerWidth : 0,
        normalizedY: window.innerHeight > 0 ? touch.clientY / window.innerHeight : 0,
      };

      // Cancel long press if moved too far
      const dx = position.x - this.tapStartPosition.x;
      const dy = position.y - this.tapStartPosition.y;
      if (Math.sqrt(dx * dx + dy * dy) > this.config.tapThreshold) {
        this.clearTimeouts();
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      this.clearTimeouts();

      if (this.isPinching) {
        this.isPinching = false;
        return;
      }

      if (this.isLongPress) {
        this.isLongPress = false;
        return;
      }

      if (e.changedTouches.length === 0) return;

      const touch = e.changedTouches[0]!;
      const position: PointerPosition = {
        x: touch.clientX,
        y: touch.clientY,
        normalizedX: window.innerWidth > 0 ? touch.clientX / window.innerWidth : 0,
        normalizedY: window.innerHeight > 0 ? touch.clientY / window.innerHeight : 0,
      };

      const elapsed = Date.now() - this.tapStartTime;
      const dx = position.x - this.tapStartPosition.x;
      const dy = position.y - this.tapStartPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Swipe
      if (distance > this.config.swipeThreshold && elapsed < this.config.swipeTimeout) {
        const direction = this.getSwipeDirection(dx, dy);
        this.emitGesture("swipe", position, {
          direction,
          velocity: distance / elapsed,
        });
        return;
      }

      // Tap
      if (distance < this.config.tapThreshold && elapsed < this.config.tapTimeout) {
        const now = Date.now();
        const isDoubleTap = now - this.lastTapTime < this.config.tapTimeout * 2;

        if (isDoubleTap) {
          this.emitGesture("double-tap", position);
          this.lastTapTime = 0;
        } else {
          this.lastTapTime = now;
          this.tapTimeoutId = setTimeout(() => {
            this.emitGesture("tap", position);
          }, this.config.tapTimeout);
        }
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    this.cleanupFns.push(
      () => window.removeEventListener("touchstart", onTouchStart),
      () => window.removeEventListener("touchmove", onTouchMove),
      () => window.removeEventListener("touchend", onTouchEnd)
    );
  }

  private handlePinchStart(e: TouchEvent): void {
    if (e.touches.length !== 2) return;
    const [t1, t2] = [e.touches[0]!, e.touches[1]!];
    this.initialPinchDistance = this.getDistance(t1, t2);
    this.initialPinchAngle = this.getAngle(t1, t2);
    this.isPinching = true;

    // Also detect rotation start
    this.initialRotateAngle = this.initialPinchAngle;
  }

  private handlePinchMove(e: TouchEvent): void {
    if (e.touches.length !== 2 || !this.isPinching) return;
    const [t1, t2] = [e.touches[0]!, e.touches[1]!];

    const currentDistance = this.getDistance(t1, t2);
    const currentAngle = this.getAngle(t1, t2);

    const scale = currentDistance / this.initialPinchDistance;
    const rotation = currentAngle - this.initialRotateAngle;

    const midpoint = {
      x: (t1.clientX + t2.clientX) / 2,
      y: (t1.clientY + t2.clientY) / 2,
    };
    const position: PointerPosition = {
      x: midpoint.x,
      y: midpoint.y,
      normalizedX: window.innerWidth > 0 ? midpoint.x / window.innerWidth : 0,
      normalizedY: window.innerHeight > 0 ? midpoint.y / window.innerHeight : 0,
    };

    // Pinch (scale < 1) or Zoom (scale > 1)
    if (Math.abs(scale - 1) > this.config.pinchThreshold) {
      const gestureType: GestureType = scale < 1 ? "pinch" : "zoom";
      this.emitGesture(gestureType, position, { scale });
    }

    // Rotate
    if (Math.abs(rotation) > this.config.rotateThreshold) {
      this.emitGesture("rotate", position, { rotation });
      this.initialRotateAngle = currentAngle;
    }
  }

  private getDistance(t1: Touch, t2: Touch): number {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private getAngle(t1: Touch, t2: Touch): number {
    return Math.atan2(t2.clientY - t1.clientY, t2.clientX - t1.clientX) * (180 / Math.PI);
  }

  private getSwipeDirection(dx: number, dy: number): SwipeDirection {
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? "right" : "left";
    }
    return dy > 0 ? "down" : "up";
  }

  private emitGesture(
    type: GestureType,
    position: PointerPosition,
    data: Partial<Omit<GestureEvent, "type" | "timestamp" | "position" | "source">> & { source?: "touch" | "keyboard" } = {}
  ): void {
    const event: GestureEvent = {
      type,
      timestamp: Date.now(),
      position,
      source: "touch",
      ...data,
    };

    experienceEvents.emit(`gesture:${type}` as ExperienceEventType, event);
    // NOTE: No phantom pointer-move emission — gesture events are separate
  }
}

export const GestureManager = new GestureManagerImpl();

export function createGestureManager(): GestureManagerImpl {
  return new GestureManagerImpl();
}
