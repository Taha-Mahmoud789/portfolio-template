/**
 * Input Manager
 *
 * Centralizes keyboard and wheel input events.
 * Pointer events are handled exclusively by PointerManager.
 * Uses passive listeners for performance.
 */

import type { InputDevice, InputEvent, InputEventType, ModifierState, PointerPosition } from "./types";
import { experienceEvents } from "./events";
import { INPUT_DEFAULTS } from "./constants";
import type { ExperienceEventType, InputManagerConfig } from "./types";

/** Map InputEventType to ExperienceEventType */
const INPUT_EVENT_MAP: Record<InputEventType, ExperienceEventType> = {
  keydown: "input:key-down",
  keyup: "input:key-up",
  wheel: "input:wheel",
  blur: "input:blur",
  focus: "input:focus",
};

// ============================================================================
// Input Manager
// ============================================================================

class InputManagerImpl {
  private config: InputManagerConfig = { ...INPUT_DEFAULTS };
  private isListening = false;
  private cleanupFns: (() => void)[] = [];

  init(config?: Partial<InputManagerConfig>): void {
    if (this.isListening) return;
    this.config = { ...this.config, ...config };
    this.attachListeners();
    this.isListening = true;
  }

  destroy(): void {
    if (!this.isListening) return;
    for (const cleanup of this.cleanupFns) {
      cleanup();
    }
    this.cleanupFns = [];
    this.isListening = false;
  }

  updateConfig(config: Partial<InputManagerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  private attachListeners(): void {
    if (typeof window === "undefined") return;

    // Keyboard events
    if (this.config.keyboard) {
      this.addListener(window, "keydown", "keydown", "keyboard");
      this.addListener(window, "keyup", "keyup", "keyboard");
    }

    // Wheel events (trackpad/mouse scroll)
    if (this.config.wheel) {
      this.addListener(window, "wheel", "wheel", "trackpad", this.config.passive);
    }

    // Focus/blur for keyboard context
    this.addListener(window, "blur", "blur", "keyboard");
    this.addListener(window, "focus", "focus", "keyboard");
  }

  private addListener(
    target: EventTarget,
    domEvent: string,
    inputType: InputEventType,
    device: InputDevice,
    passive = true
  ): void {
    const handler = (e: Event) => {
      const inputEvent = this.normalizeEvent(e, inputType, device);
      const eventType = INPUT_EVENT_MAP[inputType];
      experienceEvents.emit(eventType, inputEvent);
    };

    const options = passive ? { passive: true, capture: false } : { capture: false };
    target.addEventListener(domEvent, handler, options);

    this.cleanupFns.push(() => {
      target.removeEventListener(domEvent, handler, options);
    });
  }

  private normalizeEvent(e: Event, type: InputEventType, device: InputDevice): InputEvent {
    const position = this.extractPosition(e);
    const modifiers = this.extractModifiers(e);

    return {
      type,
      device,
      timestamp: Date.now(),
      originalEvent: e,
      position,
      modifiers,
    };
  }

  private extractPosition(_e: Event): PointerPosition {
    // Keyboard events don't have position — return last known position from store
    return { x: 0, y: 0, normalizedX: 0.5, normalizedY: 0.5 };
  }

  private extractModifiers(e: Event): ModifierState {
    const keyboardEvent = e as KeyboardEvent;
    return {
      shift: keyboardEvent.shiftKey ?? false,
      ctrl: keyboardEvent.ctrlKey ?? false,
      alt: keyboardEvent.altKey ?? false,
      meta: keyboardEvent.metaKey ?? false,
    };
  }
}

export const InputManager = new InputManagerImpl();

export function createInputManager(): InputManagerImpl {
  return new InputManagerImpl();
}
