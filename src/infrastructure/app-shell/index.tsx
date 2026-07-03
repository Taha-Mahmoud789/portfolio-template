/**
 * App Shell
 *
 * Outermost application wrapper. Handles initialization and global
 * keyboard accessibility. Does NOT compose providers or track scroll —
 * those are handled by LenisProvider and the provider tree.
 *
 * Responsibilities:
 * - GSAP plugin registration (side-effect import)
 * - Body class management
 * - Global keyboard navigation (Escape to blur)
 */

import { useEffect, type ReactNode } from "react";
import "@/animation/gsap-setup";
import { useKeyboardNavigation } from "@/hooks/use-accessibility";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  useAppInitialization();
  useKeyboardNavigation();

  return <>{children}</>;
}

function useAppInitialization() {
  useEffect(() => {
    document.body.classList.add("app-loaded");
  }, []);
}
