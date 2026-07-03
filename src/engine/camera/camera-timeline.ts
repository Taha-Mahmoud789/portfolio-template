/**
 * Cinematic Camera System — Camera Timeline
 *
 * Keyframe-based timeline system for camera sequences.
 * Supports playback, pause, resume, loop, and interruption.
 *
 * Keyframe `time` is normalized 0-1 (0 = start, 1 = end of sequence).
 * Sequence duration is in seconds. Interpolation maps normalized time → absolute time.
 *
 * Pre-allocates all interpolation vectors — zero allocations in the hot path.
 */

import { Vector3 } from "three";
import type { CameraKeyframe, CameraSequence, TimelineState, EasingName } from "./types";
import { getEasing } from "./math";

// ============================================================================
// Timeline Interpolation Result
// ============================================================================

export interface TimelineFrame {
  position: Vector3;
  lookAt: Vector3;
  fov: number;
}

// ============================================================================
// Camera Timeline
// ============================================================================

export class CameraTimeline {
  private sequence: CameraSequence | null;
  private currentTime: number;
  private isPlaying: boolean;
  private isPaused: boolean;
  private onComplete: (() => void) | null;

  // Pre-allocated interpolation vectors (zero per-frame allocations)
  private _resultPosition: Vector3;
  private _resultLookAt: Vector3;

  constructor() {
    this.sequence = null;
    this.currentTime = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.onComplete = null;
    this._resultPosition = new Vector3();
    this._resultLookAt = new Vector3();
  }

  // --------------------------------------------------------------------------
  // Lifecycle
  // --------------------------------------------------------------------------

  initialize(): void {
    this.reset();
  }

  update(delta: number): TimelineFrame | null {
    if (!this.sequence || !this.isPlaying || this.isPaused) return null;

    this.currentTime += delta;

    if (this.currentTime >= this.sequence.duration) {
      if (this.sequence.loop) {
        this.currentTime = this.currentTime % this.sequence.duration;
      } else {
        this.currentTime = this.sequence.duration;
        this.isPlaying = false;
        this.onComplete?.();
        return this.interpolate(this.sequence.duration);
      }
    }

    return this.interpolate(this.currentTime);
  }

  dispose(): void {
    this.sequence = null;
    this.onComplete = null;
  }

  // --------------------------------------------------------------------------
  // Playback Control
  // --------------------------------------------------------------------------

  play(sequence: CameraSequence, onComplete?: () => void): void {
    this.sequence = sequence;
    this.currentTime = 0;
    this.isPlaying = true;
    this.isPaused = false;
    this.onComplete = onComplete ?? null;
  }

  pause(): void {
    if (this.isPlaying) {
      this.isPaused = true;
    }
  }

  resume(): void {
    if (this.isPlaying && this.isPaused) {
      this.isPaused = false;
    }
  }

  stop(): void {
    this.isPlaying = false;
    this.isPaused = false;
    this.currentTime = 0;
  }

  seek(time: number): void {
    if (!this.sequence) return;
    this.currentTime = Math.max(0, Math.min(time, this.sequence.duration));
  }

  seekToProgress(progress: number): void {
    if (!this.sequence) return;
    this.currentTime = progress * this.sequence.duration;
  }

  reset(): void {
    this.currentTime = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.sequence = null;
    this.onComplete = null;
  }

  // --------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------

  getState(): TimelineState {
    return {
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      currentTime: this.currentTime,
      progress: this.sequence ? this.currentTime / this.sequence.duration : 0,
      currentKeyframeIndex: this.sequence ? this.findKeyframeIndex(this.currentTime) : 0,
      sequenceName: this.sequence?.name ?? null,
    };
  }

  isFinished(): boolean {
    return !this.isPlaying && !this.isPaused && this.currentTime > 0;
  }

  // --------------------------------------------------------------------------
  // Interpolation (zero allocations)
  // --------------------------------------------------------------------------

  private interpolate(time: number): TimelineFrame {
    if (!this.sequence || this.sequence.keyframes.length === 0) {
      return {
        position: this._resultPosition.set(0, 0, 0),
        lookAt: this._resultLookAt.set(0, 0, 0),
        fov: 60,
      };
    }

    const keyframes = this.sequence.keyframes;
    const duration = this.sequence.duration;

    if (keyframes.length === 1) {
      const kf = keyframes[0];
      if (!kf) {
        return {
          position: this._resultPosition.set(0, 0, 0),
          lookAt: this._resultLookAt.set(0, 0, 0),
          fov: 60,
        };
      }
      return {
        position: this._resultPosition.set(kf.position[0], kf.position[1], kf.position[2]),
        lookAt: this._resultLookAt.set(kf.lookAt[0], kf.lookAt[1], kf.lookAt[2]),
        fov: kf.fov,
      };
    }

    // Find surrounding keyframes (normalized time → absolute time)
    let startIndex = 0;
    for (let i = 0; i < keyframes.length - 1; i++) {
      const kf = keyframes[i];
      if (kf && time >= kf.time * duration) {
        startIndex = i;
      }
    }

    const endIndex = Math.min(startIndex + 1, keyframes.length - 1);
    const startKF = keyframes[startIndex];
    const endKF = keyframes[endIndex];

    if (!startKF || !endKF) {
      return {
        position: this._resultPosition.set(0, 0, 0),
        lookAt: this._resultLookAt.set(0, 0, 0),
        fov: 60,
      };
    }

    // Compute local t (0-1 between keyframes)
    const startT = startKF.time * duration;
    const endT = endKF.time * duration;
    const span = endT - startT;
    const localT = span > 0 ? (time - startT) / span : 0;

    // Apply easing
    const easing = getEasing(endKF.easing);
    const easedT = easing(Math.max(0, Math.min(1, localT)));

    // Interpolate position (reuse pre-allocated vectors)
    this._resultPosition.set(
      startKF.position[0] + (endKF.position[0] - startKF.position[0]) * easedT,
      startKF.position[1] + (endKF.position[1] - startKF.position[1]) * easedT,
      startKF.position[2] + (endKF.position[2] - startKF.position[2]) * easedT,
    );

    // Interpolate lookAt
    this._resultLookAt.set(
      startKF.lookAt[0] + (endKF.lookAt[0] - startKF.lookAt[0]) * easedT,
      startKF.lookAt[1] + (endKF.lookAt[1] - startKF.lookAt[1]) * easedT,
      startKF.lookAt[2] + (endKF.lookAt[2] - startKF.lookAt[2]) * easedT,
    );

    // Interpolate FOV
    const fov = startKF.fov + (endKF.fov - startKF.fov) * easedT;

    return { position: this._resultPosition, lookAt: this._resultLookAt, fov };
  }

  private findKeyframeIndex(time: number): number {
    if (!this.sequence) return 0;
    const keyframes = this.sequence.keyframes;
    const duration = this.sequence.duration;
    for (let i = keyframes.length - 1; i >= 0; i--) {
      const kf = keyframes[i];
      if (kf && time >= kf.time * duration) {
        return i;
      }
    }
    return 0;
  }
}

// ============================================================================
// Sequence Builder
// ============================================================================

export function createSequence(
  name: string,
  keyframes: CameraKeyframe[],
  options?: { loop?: boolean; duration?: number },
): CameraSequence {
  return {
    name,
    keyframes: keyframes.sort((a, b) => a.time - b.time),
    loop: options?.loop ?? false,
    duration: options?.duration ?? 10,
  };
}

export function createKeyframe(
  time: number,
  position: readonly [number, number, number],
  lookAt: readonly [number, number, number],
  fov: number,
  easing: EasingName = "easeInOut",
): CameraKeyframe {
  return { time, position, lookAt, fov, easing };
}
