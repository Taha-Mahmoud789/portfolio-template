import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useGsapTimeline() {
  const timeline = useRef(gsap.timeline());
  return timeline.current;
}

export function useGsapScrollTrigger(
  callback: (self: ScrollTrigger) => void,
  deps: unknown[] = [],
): React.RefObject<HTMLElement | null> {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => callback(trigger),
    });

    return () => {
      trigger.kill();
    };
  }, deps);

  return ref;
}
