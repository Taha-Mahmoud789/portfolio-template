/**
 * Rendering Pipeline — React Hooks
 */

import { useCallback, useContext, useEffect, useState } from "react";
import { RenderContext } from "../render-context";
import type {
  RenderContextValue,
  UseRendererReturn,
  UseEnvironmentReturn,
  UsePostProcessingReturn,
  ToneMappingMode,
  FogType,
  FogConfig,
  BackgroundType,
} from "../types";
import type { ColorRepresentation } from "three";

// ============================================================================
// Internal — Context Access
// ============================================================================

function useRenderContext(): RenderContextValue {
  const ctx = useContext(RenderContext);
  if (!ctx) {
    throw new Error("useRenderer/useEnvironment/usePostProcessing must be used within <RenderProvider>");
  }
  return ctx;
}

// ============================================================================
// useRenderer
// ============================================================================

export function useRenderer(): UseRendererReturn {
  const { pipeline } = useRenderContext();
  const [state, setState] = useState(pipeline.getRendererState());

  useEffect(() => {
    const id = setInterval(() => {
      setState(pipeline.getRendererState());
    }, 1000);
    return () => clearInterval(id);
  }, [pipeline]);

  const setPixelRatio = useCallback(
    (ratio: number | "auto") => pipeline.setPixelRatio(ratio),
    [pipeline],
  );
  const setToneMapping = useCallback(
    (mode: ToneMappingMode) => pipeline.setToneMapping(mode),
    [pipeline],
  );
  const setToneMappingExposure = useCallback(
    (exposure: number) => pipeline.setExposure(exposure),
    [pipeline],
  );

  return { state, setPixelRatio, setToneMapping, setToneMappingExposure };
}

// ============================================================================
// useEnvironment
// ============================================================================

export function useEnvironment(): UseEnvironmentReturn {
  const { pipeline } = useRenderContext();
  const [state, setState] = useState(pipeline.getEnvironmentState());

  useEffect(() => {
    const id = setInterval(() => {
      setState(pipeline.getEnvironmentState());
    }, 1000);
    return () => clearInterval(id);
  }, [pipeline]);

  const setBackground = useCallback(
    (type: BackgroundType, color: ColorRepresentation) =>
      pipeline.setBackground(type, color),
    [pipeline],
  );
  const setFog = useCallback(
    (type: FogType, config?: Partial<FogConfig>) =>
      pipeline.setFog(type, config),
    [pipeline],
  );

  return { state, setBackground, setFog };
}

// ============================================================================
// usePostProcessing
// ============================================================================

export function usePostProcessing(): UsePostProcessingReturn {
  const { pipeline } = useRenderContext();
  const [state, setState] = useState(pipeline.getPostProcessingState());

  useEffect(() => {
    const id = setInterval(() => {
      setState(pipeline.getPostProcessingState());
    }, 1000);
    return () => clearInterval(id);
  }, [pipeline]);

  const setBloom = useCallback(
    (strength: number, radius: number, threshold: number) =>
      pipeline.setBloom(strength, radius, threshold),
    [pipeline],
  );
  const setBloomEnabled = useCallback(
    (enabled: boolean) => pipeline.setBloomEnabled(enabled),
    [pipeline],
  );
  const setVignetteEnabled = useCallback(
    (enabled: boolean) => pipeline.setVignetteEnabled(enabled),
    [pipeline],
  );
  const setFilmGrainEnabled = useCallback(
    (enabled: boolean) => pipeline.setFilmGrainEnabled(enabled),
    [pipeline],
  );
  const setFXAAEnabled = useCallback(
    (enabled: boolean) => pipeline.setFXAAEnabled(enabled),
    [pipeline],
  );

  return { state, setBloom, setBloomEnabled, setVignetteEnabled, setFilmGrainEnabled, setFXAAEnabled };
}
