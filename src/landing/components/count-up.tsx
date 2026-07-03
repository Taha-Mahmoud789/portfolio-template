import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

interface CountUpProps {
  target: number;
  suffix: string;
  trigger: boolean;
}

export function CountUp({ target, suffix, trigger }: CountUpProps) {
  const [value, setValue] = useState(0);
  const hasAnimated = useRef(false);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!trigger || hasAnimated.current) return;
    hasAnimated.current = true;

    const obj = { val: 0 };
    tweenRef.current = gsap.to(obj, {
      val: target,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        setValue(Math.round(obj.val));
      },
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, [trigger, target]);

  return (
    <span>
      {String(value)}
      {suffix}
    </span>
  );
}
