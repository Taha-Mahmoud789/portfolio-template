/**
 * Rendering Pipeline — Device Utilities
 *
 * Device detection, GPU capabilities, and quality recommendations.
 */

import type { QualityLevel } from "../types";

// ============================================================================
// Device Detection
// ============================================================================

export function isMobile(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function isTablet(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
}

export function isLowEndDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & { hardwareConcurrency?: number; deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  return cores <= 4 || memory <= 4;
}

export function getMaxPixelRatio(): number {
  if (typeof window === "undefined") return 1;
  if (isMobile()) return 1.5;
  if (isLowEndDevice()) return 1.5;
  return Math.min(window.devicePixelRatio, 2);
}

// ============================================================================
// GPU Capabilities
// ============================================================================

export interface GPUCapabilities {
  readonly isWebGL2: boolean;
  readonly maxTextureSize: number;
  readonly maxVertexUniforms: number;
  readonly renderer: string;
  readonly vendor: string;
}

export function getGPUCapabilities(gl: WebGLRenderingContext): GPUCapabilities {
  const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
  return {
    isWebGL2: typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext,
    maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE) as number,
    maxVertexUniforms: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS) as number,
    renderer: debugInfo ? (gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string) : "unknown",
    vendor: debugInfo ? (gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) as string) : "unknown",
  };
}

// ============================================================================
// Quality Recommendation
// ============================================================================

export function recommendQuality(): QualityLevel {
  if (typeof navigator === "undefined") return "high";

  if (isMobile()) return "low";
  if (isTablet()) return "medium";
  if (isLowEndDevice()) return "medium";

  const nav = navigator as Navigator & { hardwareConcurrency?: number; deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 8;

  if (cores >= 8 && memory >= 8) return "ultra";
  if (cores >= 4 && memory >= 4) return "high";
  return "medium";
}

// ============================================================================
// Frame Budget
// ============================================================================

export function getFrameBudget(quality: QualityLevel): number {
  switch (quality) {
    case "low":
      return 32;
    case "medium":
      return 20;
    case "high":
      return 16.67;
    case "ultra":
      return 16.67;
  }
}

export function isFrameBudgetExceeded(frameTime: number, quality: QualityLevel): boolean {
  return frameTime > getFrameBudget(quality) * 1.5;
}
