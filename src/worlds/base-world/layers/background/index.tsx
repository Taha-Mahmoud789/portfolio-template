/**
 * Background Layer
 *
 * Renders the world background based on variant type.
 * Supports gradient, image, video, mesh, particle, canvas, and three.js.
 * Zero world-specific styling — all visual properties come from config.
 */

import { createContext, useContext, useMemo } from "react";
import type { WorldBackground } from "@/engine/world/types";
import type {
  BaseBackgroundLayerProps,
  BaseBackgroundContextValue,
  BaseBackgroundVariant,
} from "../../types";
import { DEFAULT_BACKGROUND_CONFIG } from "../../constants";

// ============================================================================
// Context
// ============================================================================

const BaseBackgroundContext = createContext<BaseBackgroundContextValue>({
  variant: "gradient",
  config: DEFAULT_BACKGROUND_CONFIG,
  isLoaded: false,
});

export function useBaseBackgroundContext(): BaseBackgroundContextValue {
  return useContext(BaseBackgroundContext);
}

// ============================================================================
// Background Renderer
// ============================================================================

function BackgroundRenderer({
  variant,
  config,
}: {
  variant: BaseBackgroundVariant;
  config: WorldBackground;
}) {
  switch (variant) {
    case "gradient":
      return (
        <div
          className="absolute inset-0"
          style={{
            background: config.value,
            backgroundColor: config.fallbackColor,
          }}
          aria-hidden="true"
        />
      );

    case "image":
      return (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${config.value})`,
            backgroundColor: config.fallbackColor,
          }}
          aria-hidden="true"
        />
      );

    case "video":
      return (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={config.value}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
      );

    case "mesh":
    case "particle":
    case "canvas":
    case "three":
      return (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: config.fallbackColor }}
          aria-hidden="true"
          data-background-variant={variant}
        />
      );

    case "none":
    default:
      return (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: config.fallbackColor }}
          aria-hidden="true"
        />
      );
  }
}

// ============================================================================
// Overlay Renderer
// ============================================================================

function OverlayRenderer({ overlay }: { overlay?: WorldBackground["overlay"] }) {
  if (!overlay || overlay.opacity === 0) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundColor: overlay.color,
        opacity: overlay.opacity,
        mixBlendMode: overlay.blendMode as React.CSSProperties["mixBlendMode"],
      }}
      aria-hidden="true"
    />
  );
}

// ============================================================================
// Component
// ============================================================================

export function BaseBackgroundLayer({
  className = "",
  variant = "gradient",
  config = DEFAULT_BACKGROUND_CONFIG,
  parallax = false,
}: BaseBackgroundLayerProps) {
  const value = useMemo<BaseBackgroundContextValue>(
    () => ({
      variant,
      config: config as WorldBackground,
      isLoaded: true,
    }),
    [variant, config],
  );

  return (
    <BaseBackgroundContext.Provider value={value}>
      <div
        className={`absolute inset-0 overflow-hidden ${className}`}
        data-background-variant={variant}
        data-parallax={parallax ? "true" : undefined}
        role="presentation"
      >
        <BackgroundRenderer variant={variant} config={config as WorldBackground} />
        <OverlayRenderer overlay={config.overlay} />
      </div>
    </BaseBackgroundContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useBaseBackground(): BaseBackgroundContextValue {
  return useBaseBackgroundContext();
}
