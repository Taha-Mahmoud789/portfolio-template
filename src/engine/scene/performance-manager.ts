/**
 * Performance Manager
 *
 * Monitors FPS, memory, GPU, draw calls, and future adaptive quality.
 */

import type { WebGLRenderer } from "three";
import type {
  Manager,
  PerformanceManagerConfig,
  PerformanceManagerState,
  PerformanceMetrics,
  PerformanceQuality,
} from "./types";
import { PERFORMANCE_DEFAULTS } from "./constants";

// ============================================================================
// PerformanceManager
// ============================================================================

export class PerformanceManager implements Manager {
  private config: PerformanceManagerConfig;
  private state: PerformanceManagerState;
  private frameCount = 0;
  private lastTime = 0;
  private monitorTimer: ReturnType<typeof setInterval> | null = null;
  private renderer: WebGLRenderer | null = null;

  constructor(config?: Partial<PerformanceManagerConfig>) {
    this.config = { ...PERFORMANCE_DEFAULTS, ...config };
    this.state = {
      metrics: {
        fps: 60,
        frameTime: 16.67,
        drawCalls: 0,
        triangles: 0,
        geometries: 0,
        textures: 0,
        programs: 0,
        memoryUsage: 0,
      },
      quality: "high",
      isThrottled: false,
    };
  }

  // --------------------------------------------------------------------------
  // Lifecycle
  // --------------------------------------------------------------------------

  initialize(): void {
    this.lastTime = performance.now();
    this.monitorTimer = setInterval(() => {
      this.collectMetrics();
    }, this.config.monitorInterval);
  }

  update(_delta: number): void {
    this.frameCount++;
  }

  dispose(): void {
    if (this.monitorTimer !== null) {
      clearInterval(this.monitorTimer);
      this.monitorTimer = null;
    }
  }

  // --------------------------------------------------------------------------
  // Public API
  // --------------------------------------------------------------------------

  getState(): PerformanceManagerState {
    return this.state;
  }

  getMetrics(): PerformanceMetrics {
    return this.state.metrics;
  }

  getQuality(): PerformanceQuality {
    return this.state.quality;
  }

  setRenderer(renderer: WebGLRenderer): void {
    this.renderer = renderer;
  }

  setQuality(quality: PerformanceQuality): void {
    this.state = { ...this.state, quality };
  }

  isLowPerformance(): boolean {
    return this.state.metrics.fps < this.config.lowFPSThreshold;
  }

  // --------------------------------------------------------------------------
  // Internal
  // --------------------------------------------------------------------------

  private collectMetrics(): void {
    const now = performance.now();
    const elapsed = now - this.lastTime;
    const fps = elapsed > 0 ? (this.frameCount / elapsed) * 1000 : 60;
    const frameTime = this.frameCount > 0 ? elapsed / this.frameCount : 16.67;

    const info = this.renderer?.info;
    const memory = (performance as { memory?: { usedJSHeapSize?: number } }).memory;

    const metrics: PerformanceMetrics = {
      fps: Math.round(fps),
      frameTime: Math.round(frameTime * 100) / 100,
      drawCalls: info?.render.calls ?? 0,
      triangles: info?.render.triangles ?? 0,
      geometries: info?.memory.geometries ?? 0,
      textures: info?.memory.textures ?? 0,
      programs: info?.programs?.length ?? 0,
      memoryUsage: memory?.usedJSHeapSize ? Math.round(memory.usedJSHeapSize / 1048576) : 0,
    };

    let quality: PerformanceQuality = "high";
    if (this.config.enableAdaptiveQuality) {
      if (fps < this.config.lowFPSThreshold) {
        quality = "low";
      } else if (fps < this.config.highFPSThreshold) {
        quality = "medium";
      } else {
        quality = "high";
      }
    }

    this.state = {
      metrics,
      quality,
      isThrottled: fps < this.config.lowFPSThreshold,
    };

    this.frameCount = 0;
    this.lastTime = now;
  }
}

// ============================================================================
// Factory
// ============================================================================

export function createPerformanceManager(
  config?: Partial<PerformanceManagerConfig>,
): PerformanceManager {
  return new PerformanceManager(config);
}
