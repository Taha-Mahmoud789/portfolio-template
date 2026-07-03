/**
 * Cinematic Camera System — Vector Pool
 *
 * Zero-allocation Vector3/Quaternion pooling for the hot path.
 * Bounded pool size prevents unbounded memory growth.
 */

import { Vector3, Quaternion } from "three";

// ============================================================================
// Vector3 Pool
// ============================================================================

export class Vector3Pool {
  private pool: Vector3[];
  private active: Set<Vector3>;
  private maxSize: number;

  constructor(size: number, maxSize?: number) {
    this.pool = [];
    this.active = new Set();
    this.maxSize = maxSize ?? size * 4;
    for (let i = 0; i < size; i++) {
      this.pool.push(new Vector3());
    }
  }

  acquire(): Vector3 {
    const v = this.pool.pop() ?? new Vector3();
    this.active.add(v);
    return v;
  }

  release(v: Vector3): void {
    if (this.active.has(v)) {
      this.active.delete(v);
      v.set(0, 0, 0);
      if (this.pool.length < this.maxSize) {
        this.pool.push(v);
      }
    }
  }

  releaseAll(): void {
    for (const v of this.active) {
      v.set(0, 0, 0);
      if (this.pool.length < this.maxSize) {
        this.pool.push(v);
      }
    }
    this.active.clear();
  }

  get available(): number {
    return this.pool.length;
  }

  get activeCount(): number {
    return this.active.size;
  }
}

// ============================================================================
// Quaternion Pool
// ============================================================================

export class QuaternionPool {
  private pool: Quaternion[];
  private active: Set<Quaternion>;
  private maxSize: number;

  constructor(size: number, maxSize?: number) {
    this.pool = [];
    this.active = new Set();
    this.maxSize = maxSize ?? size * 4;
    for (let i = 0; i < size; i++) {
      this.pool.push(new Quaternion());
    }
  }

  acquire(): Quaternion {
    const q = this.pool.pop() ?? new Quaternion();
    this.active.add(q);
    return q;
  }

  release(q: Quaternion): void {
    if (this.active.has(q)) {
      this.active.delete(q);
      q.identity();
      if (this.pool.length < this.maxSize) {
        this.pool.push(q);
      }
    }
  }

  releaseAll(): void {
    for (const q of this.active) {
      q.identity();
      if (this.pool.length < this.maxSize) {
        this.pool.push(q);
      }
    }
    this.active.clear();
  }

  get available(): number {
    return this.pool.length;
  }

  get activeCount(): number {
    return this.active.size;
  }
}

// ============================================================================
// Global Pools
// ============================================================================

export const vector3Pool = new Vector3Pool(32, 128);
export const quaternionPool = new QuaternionPool(8, 32);
