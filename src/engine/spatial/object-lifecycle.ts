/**
 * Spatial Object System — Lifecycle
 *
 * State machine for spatial object lifecycle.
 * Validates transitions to catch bugs early.
 * O(1) transition lookup via Set.
 * Never exposes internal state — only exposes status and transition capability.
 */

import type { ObjectStatus } from "./types";
import { VALID_TRANSITIONS } from "./types";

// ============================================================================
// Object Lifecycle
// ============================================================================

export class ObjectLifecycle {
  private status: ObjectStatus;

  constructor() {
    this.status = "idle";
  }

  // --------------------------------------------------------------------------
  // Public API
  // --------------------------------------------------------------------------

  getStatus(): ObjectStatus {
    return this.status;
  }

  canTransition(to: ObjectStatus): boolean {
    return VALID_TRANSITIONS.get(this.status)?.has(to) ?? false;
  }

  transition(to: ObjectStatus): void {
    if (!this.canTransition(to)) {
      throw new Error(`Invalid lifecycle transition: ${this.status} → ${to}`);
    }
    this.status = to;
  }

  /**
   * Batch transition through a sequence of states.
   * Validates each step. Returns final status.
   * Used for initialize() which goes idle→registered→loaded→...→mounted.
   */
  transitionSequence(sequence: readonly ObjectStatus[]): ObjectStatus {
    for (const next of sequence) {
      this.transition(next);
    }
    return this.status;
  }

  /**
   * Force transition — bypasses validation.
   * Use only for dispose/cleanup when state may be corrupted.
   */
  forceTransition(to: ObjectStatus): void {
    this.status = to;
  }

  isAlive(): boolean {
    return (
      this.status !== "idle" &&
      this.status !== "destroyed" &&
      this.status !== "disposing" &&
      this.status !== "disposed"
    );
  }

  isActive(): boolean {
    return (
      this.status === "mounted" ||
      this.status === "updating" ||
      this.status === "suspending" ||
      this.status === "resuming"
    );
  }

  isDisposing(): boolean {
    return (
      this.status === "destroying" ||
      this.status === "destroyed" ||
      this.status === "disposing" ||
      this.status === "disposed"
    );
  }
}
