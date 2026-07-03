/**
 * Rendering Pipeline — React Provider
 *
 * Creates and manages the lifecycle of a RenderPipeline.
 * Canvas is mounted via ref, pipeline binds to it.
 */

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { RenderPipeline } from "./render-pipeline";
import { RenderContext } from "./render-context";
import type {
  RenderPipelineConfig,
  RenderPipelineState,
  RenderPipelineRef,
  RenderContextValue,
} from "./types";

// ============================================================================
// Props
// ============================================================================

export interface RenderProviderProps {
  readonly config?: Partial<RenderPipelineConfig>;
  readonly autoStart?: boolean;
  readonly children: ReactNode;
  readonly onReady?: (pipeline: RenderPipeline) => void;
}

// ============================================================================
// Provider
// ============================================================================

export function RenderProvider({
  config,
  autoStart = true,
  children,
  onReady,
}: RenderProviderProps): ReactNode {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pipelineRef = useRef<RenderPipeline | null>(null);
  const [state, setState] = useState<RenderPipelineState>({
    isInitialized: false,
    isRunning: false,
    quality: config?.quality ?? "high",
    fps: 0,
    frameTime: 0,
    drawCalls: 0,
    triangles: 0,
    textures: 0,
    geometries: 0,
  });

  const refApiRef = useRef<RenderPipelineRef | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const pipeline = new RenderPipeline({
      ...config,
      renderer: {
        ...config?.renderer,
        canvas: canvasRef.current,
      },
    });

    pipelineRef.current = pipeline;
    pipeline.initialize();

    refApiRef.current = pipeline.getRef();
    setState(pipeline.getState());

    if (autoStart) {
      pipeline.start();
    }

    onReady?.(pipeline);

    return () => {
      pipeline.dispose();
      pipelineRef.current = null;
      refApiRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue: RenderContextValue = {
    pipeline: refApiRef.current!,
    state,
  };

  return (
    <RenderContext.Provider value={contextValue}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
      {children}
    </RenderContext.Provider>
  );
}
