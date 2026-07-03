/**
 * BaseWorld
 *
 * Root component for the Base World foundation.
 * Composes all layers: wrapper, header, background, content, overlay, transition.
 * Every world inherits this structure.
 */

import { useEffect, useCallback } from "react";
import type { BaseWorldProps } from "../types";
import { useBaseWorldStore } from "../state";
import { deriveBaseWorldConfig } from "../config";
import { BaseWorldWrapper } from "./world-wrapper";
import { BaseWorldHeader } from "./world-header";
import { BaseWorldLayout } from "./world-layout";
import { BaseWorldLoader } from "./world-loader";
import { BaseBackgroundLayer } from "../layers/background";
import { BaseContentLayer } from "../layers/content";
import { BaseOverlayLayer } from "../layers/overlay";
import { BaseTransitionLayer } from "../layers/transition";

// ============================================================================
// Component
// ============================================================================

export function BaseWorld({
  children,
  worldId,
  theme,
  definition,
  showHeader = true,
  showBackground = true,
  showOverlays = true,
  enableAccessibility = true,
  onReady,
  onError,
}: BaseWorldProps) {
  const setPhase = useBaseWorldStore((s) => s.setPhase);
  const setTheme = useBaseWorldStore((s) => s.setTheme);
  const setWorldId = useBaseWorldStore((s) => s.setWorldId);

  const config = definition ? deriveBaseWorldConfig(definition) : undefined;

  useEffect(() => {
    if (theme) setTheme(theme);
    if (worldId) setWorldId(worldId);
    setPhase("initializing");
    return () => {
      setPhase("destroying");
    };
  }, [theme, worldId, setTheme, setWorldId, setPhase]);

  const handleReady = useCallback(() => {
    setPhase("ready");
    onReady?.();
  }, [setPhase, onReady]);

  const handleError = useCallback(
    (error: Error) => {
      onError?.(error);
    },
    [onError],
  );

  const handleBack = useCallback(() => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  }, []);

  return (
    <BaseWorldLoader onReady={handleReady} onError={handleError}>
      <BaseWorldWrapper>
        {enableAccessibility && (
          <a
            href="#base-world-main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md"
          >
            Skip to main content
          </a>
        )}

        <BaseTransitionLayer>
          {showBackground && config && (
            <BaseBackgroundLayer
              variant={config.backgroundVariant}
              config={config.background}
              parallax={config.background.parallax}
            />
          )}

          {showHeader && <BaseWorldHeader onBack={handleBack} />}

          <BaseWorldLayout config={config?.layout}>
            <BaseContentLayer>
              <div id="base-world-main" tabIndex={-1}>
                {children}
              </div>
            </BaseContentLayer>
          </BaseWorldLayout>

          {showOverlays && <BaseOverlayLayer />}
        </BaseTransitionLayer>
      </BaseWorldWrapper>
    </BaseWorldLoader>
  );
}
