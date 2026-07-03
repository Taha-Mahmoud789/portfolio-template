/**
 * LandingExperience
 *
 * Premium cinematic landing page.
 * Preloader → Logo reveal → Progress → Page reveal → Hero animation.
 * Respects prefers-reduced-motion. Keyboard accessible. 60 FPS target.
 */

import { useState, useEffect, useCallback } from "react";
import { Hero } from "./components/hero";
import { NoiseGrain } from "./components/noise-grain";
import { Navigation } from "./components/navigation";
import { About } from "./components/about";
import { Stats } from "./components/stats";
import { Projects } from "./components/projects";
import { Expertise } from "./components/expertise";
import { HowIWork } from "./components/how-i-work";
import { WhyWorkWithMe } from "./components/why-work-with-me";
import { CTA } from "./components/cta";
import { Contact } from "./components/contact";
import { Footer } from "./components/footer";
import { BackToTop } from "./components/back-to-top";
import { Preloader } from "./components/preloader";
import { CustomCursor } from "./components/custom-cursor";
import { useReducedMotion } from "./hooks";
import { PortalExperience, usePortal } from "./components/portal";

// ============================================================================
// Inner landing — children of PortalExperience, so usePortal is in scope
// ============================================================================

function LandingContent() {
  const reducedMotion = useReducedMotion();
  const [loaderDone, setLoaderDone] = useState(reducedMotion);
  const [isReady, setIsReady] = useState(reducedMotion);
  const { activate: activatePortal } = usePortal();

  const handleLoaderComplete = useCallback(() => {
    setLoaderDone(true);
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
    const timer = setTimeout(() => {
      setIsReady(true);
    }, reducedMotion ? 0 : 100);
    return () => clearTimeout(timer);
  }, [loaderDone, reducedMotion]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#040508",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
      aria-label="Frontend Multiverse — Landing Experience"
    >
      {/* Preloader */}
      {!loaderDone && <Preloader onComplete={handleLoaderComplete} />}

      {/* Navigation */}
      {isReady && <Navigation onExploreWorlds={activatePortal} />}

      {/* Hero section */}
      {isReady && <Hero isVisible={isReady} onExploreWorlds={activatePortal} />}

      {/* Content sections */}
      {isReady && (
        <>
          <About />
          <Stats />
          <Projects />
          <Expertise />
          <HowIWork />
          <WhyWorkWithMe />
          <CTA />
          <Contact />
          <Footer />
        </>
      )}

      {/* Film grain overlay */}
      <NoiseGrain />

      {/* Custom cursor */}
      <CustomCursor />

      {/* Floating back to top */}
      <BackToTop />

      {/* Screen reader announcer */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {isReady && "Welcome to the Frontend Multiverse. Scroll to explore."}
      </div>
    </div>
  );
}

// ============================================================================
// Root — wraps everything in PortalExperience
// ============================================================================

export function LandingExperience() {
  return (
    <PortalExperience>
      <LandingContent />
    </PortalExperience>
  );
}
