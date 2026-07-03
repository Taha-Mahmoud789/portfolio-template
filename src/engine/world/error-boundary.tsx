/**
 * World Error Boundary
 *
 * Error boundary that isolates world rendering errors.
 * Prevents one world's error from crashing the entire app.
 */

import { Component, type ErrorInfo, type ReactNode } from "react";
import type { WorldErrorBoundaryProps, WorldErrorBoundaryState } from "./types";

export class WorldErrorBoundary extends Component<
  WorldErrorBoundaryProps,
  WorldErrorBoundaryState
> {
  constructor(props: WorldErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): WorldErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { worldId, onError } = this.props;
    console.error(`[WorldErrorBoundary] Error in world "${worldId}":`, error, errorInfo);
    onError?.(error, worldId);
  }

  reset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      const { fallback } = this.props;

      if (fallback) {
        if (typeof fallback === "function") {
          const FallbackComponent = fallback;
          return <FallbackComponent error={this.state.error!} reset={this.reset} />;
        }
        return fallback;
      }

      return (
        <div role="alert" className="flex min-h-[50vh] items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">Failed to load world</h2>
            <p className="mt-2 text-sm text-foreground-muted">
              An error occurred while rendering this world.
            </p>
            <button
              onClick={this.reset}
              className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
