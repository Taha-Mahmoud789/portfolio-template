/**
 * Loading Boundary
 *
 * Thin Suspense wrapper. No slow-load detection UI — that's dev noise.
 * If you need loading UX, build it in the consuming component.
 */

import { Suspense, type ReactNode } from "react";

interface LoadingBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function LoadingBoundary({ children, fallback }: LoadingBoundaryProps) {
  return <Suspense fallback={fallback ?? null}>{children}</Suspense>;
}
