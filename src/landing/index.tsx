/**
 * LandingExperience
 *
 * Creative developer portfolio landing page.
 * Preloader -> Hero -> Intro -> About -> Projects -> Expertise -> Process -> Contact -> Footer.
 * Respects prefers-reduced-motion. Keyboard accessible.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { Hero } from "./components/hero";
import { NoiseGrain } from "./components/noise-grain";
import { Navigation } from "./components/navigation";
import { Intro } from "./components/intro";
import { About } from "./components/about";
import { Projects } from "./components/projects";
import { Expertise } from "./components/expertise";
import { Process } from "./components/how-i-work";
import { Contact } from "./components/contact";
import { Footer } from "./components/footer";
import { BackToTop } from "./components/back-to-top";
import { Preloader } from "./components/preloader";
import { useReducedMotion } from "./hooks";
import { PortalExperience } from "./components/portal";
import { CommandPalette, useCommandPalette } from "./components/navigation/command-palette";
import { SECTIONS } from "@/content";

// ============================================================================
// Inner landing — children of PortalExperience, so usePortal is in scope
// ============================================================================

function LandingContent({ onPreloaderDone }: { onPreloaderDone: () => void }) {
  const reducedMotion = useReducedMotion();
  const [loaderDone, setLoaderDone] = useState(reducedMotion);
  const [isReady, setIsReady] = useState(reducedMotion);
  const { isOpen: isCmdOpen, close: closeCmd } = useCommandPalette();

  const handleLoaderComplete = useCallback(() => {
    setLoaderDone(true);
    onPreloaderDone();
  }, [onPreloaderDone]);

  const handleNavigate = useCallback((href: string) => {
    if (href.startsWith("/#")) {
      const section = document.getElementById(href.slice(2));
      section?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = href;
    }
  }, []);

  // Scroll restoration — save position on unmount, restore on mount
  useEffect(() => {
    const saved = sessionStorage.getItem("fm-scroll-position");
    if (saved) {
      const y = Number(saved);
      if (y > 0) {
        requestAnimationFrame(() => {
          window.scrollTo(0, y);
        });
      }
      sessionStorage.removeItem("fm-scroll-position");
    }

    return () => {
      sessionStorage.setItem("fm-scroll-position", String(window.scrollY));
    };
  }, []);

  useEffect(() => {
    if (!loaderDone) return;
    const timer = setTimeout(
      () => {
        setIsReady(true);
      },
      reducedMotion ? 0 : 100,
    );
    return () => clearTimeout(timer);
  }, [loaderDone, reducedMotion]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080706",
        color: "#f5f0e8",
        position: "relative",
        overflow: "hidden",
      }}
      aria-label="Creative Developer — Landing Experience"
    >
      {/* Preloader */}
      {!loaderDone && <Preloader onComplete={handleLoaderComplete} />}

      {/* Hero section */}
      {isReady && <Hero isVisible={isReady} />}

      {/* Content sections */}
      {isReady && (
        <>
          <Intro />
          <About />
          <Projects />
          <Expertise />
          <Process />
          <Contact />
          <Footer />
        </>
      )}

      {/* Film grain overlay */}
      <NoiseGrain />

      {/* Command palette */}
      <CommandPalette isOpen={isCmdOpen} onClose={closeCmd} onNavigate={handleNavigate} />

      {/* Floating back to top */}
      <BackToTop />

      {/* Screen reader announcer */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isReady && SECTIONS.screenReader}
      </div>
    </div>
  );
}

// ============================================================================
// Root — wraps content in PortalExperience, nav rendered outside for fixed positioning
// ============================================================================

export function LandingExperience() {
  const reducedMotion = useReducedMotion();
  const [navReady, setNavReady] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePreloaderDone = useCallback(() => {
    timerRef.current = setTimeout(() => setNavReady(true), 400);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setNavReady(true);
    }
  }, [reducedMotion]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <>
      {/* Navigation — outside PortalExperience so position:fixed works */}
      {navReady && <Navigation />}

      <PortalExperience>
        <LandingContent onPreloaderDone={handlePreloaderDone} />
      </PortalExperience>
    </>
  );
}
