/**
 * App
 *
 * Composes the provider tree and layout structure.
 * Each layer has a single responsibility:
 *
 *   AppShell              — initialization, GSAP, keyboard nav
 *     ErrorBoundary       — root error boundary
 *       ThemeEngineProvider — theme engine (CSS variables, reduced motion)
 *         LenisProvider   — smooth scrolling, scroll position tracking
 *           BrowserRouter — routing context
 *             NavigationProvider — navigation state, transitions, scroll restoration
 *               Suspense    — lazy route loading
 *                 RootLayout — semantic HTML structure
 *                   AppRouter — route definitions
 *
 * Business logic (pages, components) lives outside this file.
 */

import { Suspense } from "react";
import { BrowserRouter } from "react-router";
import { AppShell, ErrorBoundary } from "@/infrastructure";
import { ThemeEngineProvider, NavigationProvider } from "@/engine";
import { LenisProvider } from "@/providers/lenis-provider";
import { RootLayout } from "@/layouts";
import { SuspenseFallback } from "@/components/shared/suspense-fallback";
import { AppRouter } from "@/router/routes";
import { ProjectTransitionOverlay } from "@/landing/components/project-transition-overlay";

export function App() {
  return (
    <AppShell>
      <ErrorBoundary boundaryId="root">
        <ThemeEngineProvider preload>
          <LenisProvider>
            <BrowserRouter>
              <NavigationProvider>
                <Suspense fallback={<SuspenseFallback />}>
                  <RootLayout>
                    <AppRouter />
                  </RootLayout>
                  <ProjectTransitionOverlay />
                </Suspense>
              </NavigationProvider>
            </BrowserRouter>
          </LenisProvider>
        </ThemeEngineProvider>
      </ErrorBoundary>
    </AppShell>
  );
}
