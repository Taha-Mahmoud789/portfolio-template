/**
 * Navigation Error Handling
 *
 * Components and utilities for handling navigation errors,
 * including 404 pages and route loading failures.
 */

import { Component, type ReactNode, type ErrorInfo } from "react";
import { useRouteError, isRouteErrorResponse, Link } from "react-router";

// ============================================================================
// Route Error Boundary
// ============================================================================

interface RouteErrorBoundaryProps {
  children: ReactNode;
  /** Fallback UI rendered when an error is caught */
  fallback?: ReactNode;
  /** Callback invoked when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface RouteErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary for route-level errors.
 * Catches errors from route loaders and components using
 * getDerivedStateFromError / componentDidCatch.
 */
export class RouteErrorBoundary extends Component<
  RouteErrorBoundaryProps,
  RouteErrorBoundaryState
> {
  constructor(props: RouteErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): RouteErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--color-foreground)]">
            Something went wrong
          </h2>
          <p className="mb-6 max-w-md text-[var(--color-foreground-muted)]">
            {this.state.error?.message ?? "An unexpected error occurred."}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="inline-flex items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-background-subtle)]"
            >
              Try Again
            </button>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-primary-foreground)] transition-colors hover:bg-[var(--color-primary-hover)]"
            >
              Back to Home
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// Not Found Page
// ============================================================================

interface NotFoundPageProps {
  /** Custom title */
  title?: string;
  /** Custom message */
  message?: string;
  /** Custom action element */
  action?: ReactNode;
}

/**
 * Default 404 page component.
 * Renders a styled not-found page with a link back to home.
 */
export function NotFoundPage({
  title = "404",
  message = "The page you are looking for does not exist.",
  action,
}: NotFoundPageProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-6xl font-bold tracking-tighter text-[var(--color-foreground)]">
        {title}
      </h1>
      <p className="mb-8 max-w-md text-lg text-[var(--color-foreground-muted)]">
        {message}
      </p>
      {action ?? (
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-md bg-[var(--color-primary)] px-6 py-3 text-sm font-medium text-[var(--color-primary-foreground)] transition-colors hover:bg-[var(--color-primary-hover)]"
        >
          Back to Home
        </Link>
      )}
    </div>
  );
}

// ============================================================================
// Route Error Display
// ============================================================================

interface RouteErrorDisplayProps {
  /** Custom title */
  title?: string;
  /** Custom message */
  message?: string;
}

/**
 * Displays route loading errors with a retry option.
 */
export function RouteErrorDisplay({
  title = "Something went wrong",
  message = "Failed to load this page. Please try again.",
}: RouteErrorDisplayProps) {
  const error = useRouteError();

  let errorMessage = message;
  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || message;
  } else if (error instanceof Error) {
    errorMessage = error.message || message;
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--color-foreground)]">
        {title}
      </h2>
      <p className="mb-6 max-w-md text-[var(--color-foreground-muted)]">
        {errorMessage}
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-background-subtle)]"
        >
          Try Again
        </button>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-primary-foreground)] transition-colors hover:bg-[var(--color-primary-hover)]"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
