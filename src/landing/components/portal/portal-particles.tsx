/**
 * PortalParticles
 *
 * Orbiting particles that accelerate and spiral inward during portal transition.
 * Phase-aware: orbit → speed up → inward spiral → disperse.
 * Uses rAF for 60 FPS, GPU-accelerated transforms.
 */

import { useEffect, useRef, useMemo, useState } from "react";
import { useReducedMotion } from "../../hooks";

interface Particle {
  angle: number;
  radius: number;
  size: number;
  speed: number;
  baseOpacity: number;
  blur: number;
  hue: number;
  trailLength: number;
}

function useViewportRadius() {
  const [radius, setRadius] = useState(() =>
    typeof window !== "undefined"
      ? Math.min(window.innerWidth, window.innerHeight) * 0.5
      : 400,
  );
  useEffect(() => {
    const onResize = () =>
      setRadius(Math.min(window.innerWidth, window.innerHeight) * 0.5);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return radius;
}

export function PortalParticles({ phase, count = 24 }: { phase: string; count?: number }) {
  const reducedMotion = useReducedMotion();
  const viewportRadius = useViewportRadius();
  const rafRef = useRef<number>(0);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const trailMapRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const startTimeRef = useRef(0);
  const phaseRef = useRef(phase);

  const active =
    phase !== "idle" &&
    phase !== "cancelled" &&
    phase !== "darkening" &&
    phase !== "glowing" &&
    phase !== "exiting";

  const data = useMemo<Particle[]>(() => {
    const baseR = viewportRadius * 0.45;
    return Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2 + Math.random() * 0.4,
      radius: baseR * (0.5 + Math.random() * 0.8),
      size: 1.2 + Math.random() * 2.8,
      speed: 0.1 + Math.random() * 0.22,
      baseOpacity: 0.25 + Math.random() * 0.55,
      blur: Math.random() > 0.4 ? 0.5 + Math.random() * 2 : 0,
      hue: 225 + Math.random() * 45,
      trailLength: 2 + Math.floor(Math.random() * 4),
    }));
  }, [count, viewportRadius]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    if (!active || reducedMotion) return;

    startTimeRef.current = performance.now();

    const animate = (time: number) => {
      const elapsed = (time - startTimeRef.current) / 1000;
      const currentPhase = phaseRef.current;
      const isExpanding = currentPhase === "portal-expand";
      const isCameraPush = currentPhase === "camera-push";

      const speedMult = isExpanding ? 4.5 : isCameraPush ? 2 : 1;

      const elements = particlesRef.current;
      const len = Math.min(elements.length, data.length);
      for (let i = 0; i < len; i++) {
        const el = elements[i];
        const p = data[i];
        if (!el || !p) continue;

        const { angle: pAngle, speed: pSpeed, radius: pRadius, baseOpacity: pBaseOpacity } = p;

        const angle = pAngle + elapsed * pSpeed * speedMult;
        const fadeIn = Math.min(elapsed / 1.0, 1);

        let currentRadius: number;
        let opacityFactor: number;
        let sizeScale: number;

        if (isExpanding) {
          const t = Math.min(Math.max(elapsed - 1.2, 0) / 1.2, 1);
          currentRadius = pRadius * (0.3 + t * 2.0) * (1 - t * 0.4);
          opacityFactor = Math.max(0, 1 - t * 1.2);
          sizeScale = 1 + t * 1.5;
        } else {
          const t = Math.min(elapsed / 2, 1);
          currentRadius = pRadius * (1 - t * 0.2);
          opacityFactor = fadeIn;
          sizeScale = 1;
        }

        const x = Math.cos(angle) * currentRadius;
        const y = Math.sin(angle) * currentRadius;

        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${sizeScale.toFixed(2)})`;
        el.style.opacity = (pBaseOpacity * opacityFactor).toFixed(2);

        // Update trail positions
        for (let ti = 0; ti < p.trailLength; ti++) {
          const key = `${String(i)}-${String(ti)}`;
          const trailEl = trailMapRef.current.get(key);
          if (!trailEl) continue;
          const trailAngle = pAngle + (elapsed - (ti + 1) * 0.04) * pSpeed * speedMult;
          const trailFade = Math.max(0, opacityFactor * (1 - (ti + 1) * 0.25));
          const tx = Math.cos(trailAngle) * currentRadius * (1 - (ti + 1) * 0.02);
          const ty = Math.sin(trailAngle) * currentRadius * (1 - (ti + 1) * 0.02);
          trailEl.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${(sizeScale * 0.6).toFixed(2)})`;
          trailEl.style.opacity = (pBaseOpacity * trailFade * 0.4).toFixed(2);
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, reducedMotion, data]);

  useEffect(() => {
    if (!active) cancelAnimationFrame(rafRef.current);
  }, [active]);

  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 0,
        height: 0,
        zIndex: 103,
        pointerEvents: "none",
      }}
    >
      {data.map((p, i) => (
        <div key={`pp-${String(i)}`} style={{ position: "absolute" }}>
          {/* Trails */}
          {Array.from({ length: p.trailLength }, (_, t) => (
            <div
              key={`trail-${String(t)}`}
              ref={(el) => { if (el) trailMapRef.current.set(`${String(i)}-${String(t)}`, el); }}
              style={{
                position: "absolute",
                width: p.size * 0.6,
                height: p.size * 0.6,
                borderRadius: "50%",
                background: `hsla(${String(p.hue)}, 65%, 72%, 0.5)`,
                filter: `blur(${String(p.blur + 1)}px)`,
                opacity: 0,
              }}
            />
          ))}
          {/* Main particle */}
          <div
            ref={(el) => { if (el) particlesRef.current[i] = el; }}
            style={{
              position: "absolute",
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: `hsla(${String(p.hue)}, 70%, 75%, 0.9)`,
              filter: p.blur > 0 ? `blur(${String(p.blur)}px)` : "none",
              opacity: 0,
              boxShadow: i % 4 === 0
                ? `0 0 8px hsla(${String(p.hue)}, 80%, 70%, 0.5)`
                : "none",
            }}
          />
        </div>
      ))}
    </div>
  );
}
