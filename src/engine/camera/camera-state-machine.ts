/**
 * Cinematic Camera System — State Machine
 *
 * Tracks camera state and enforces valid transitions.
 * Invalid transitions throw errors to catch bugs early.
 */

import type { CameraState } from "./types";
import { VALID_CAMERA_TRANSITIONS } from "./types";

// ============================================================================
// Camera State Machine
// ============================================================================

export class CameraStateMachine {
  private state: CameraState;
  private previousState: CameraState;
  private stateHistory: CameraState[];
  private maxHistory: number;

  constructor(initialState: CameraState = "idle") {
    this.state = initialState;
    this.previousState = initialState;
    this.stateHistory = [initialState];
    this.maxHistory = 10;
  }

  // --------------------------------------------------------------------------
  // Public API
  // --------------------------------------------------------------------------

  getState(): CameraState {
    return this.state;
  }

  getPreviousState(): CameraState {
    return this.previousState;
  }

  getStateHistory(): readonly CameraState[] {
    return this.stateHistory;
  }

  canTransitionTo(target: CameraState): boolean {
    const valid = VALID_CAMERA_TRANSITIONS[this.state];
    return valid.includes(target);
  }

  transitionTo(target: CameraState): void {
    if (!this.canTransitionTo(target)) {
      throw new Error(
        `Invalid camera state transition: ${this.state} → ${target}. ` +
          `Valid transitions: ${VALID_CAMERA_TRANSITIONS[this.state].join(", ")}`,
      );
    }

    this.previousState = this.state;
    this.state = target;

    this.stateHistory.push(target);
    if (this.stateHistory.length > this.maxHistory) {
      this.stateHistory.shift();
    }
  }

  /**
   * Force a state transition without validation.
   * Use only for reset/recovery scenarios.
   */
  forceState(target: CameraState): void {
    this.previousState = this.state;
    this.state = target;
    this.stateHistory.push(target);
    if (this.stateHistory.length > this.maxHistory) {
      this.stateHistory.shift();
    }
  }

  isState(state: CameraState): boolean {
    return this.state === state;
  }

  isAnyOf(...states: CameraState[]): boolean {
    return states.includes(this.state);
  }

  isIdle(): boolean {
    return this.state === "idle";
  }

  isMoving(): boolean {
    return this.state === "moving";
  }

  isTransitioning(): boolean {
    return this.state === "transitioning";
  }

  isFocused(): boolean {
    return this.state === "focused";
  }

  isLocked(): boolean {
    return this.state === "locked";
  }

  isDisabled(): boolean {
    return this.state === "disabled";
  }

  reset(): void {
    this.state = "idle";
    this.previousState = "idle";
    this.stateHistory = ["idle"];
  }

  dispose(): void {
    this.stateHistory = [];
  }
}
