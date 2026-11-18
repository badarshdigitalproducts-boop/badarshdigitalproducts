"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  label: string;
}

export function AnimatedCounter({
  value,
  suffix = "",
  label,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [hasAnimated, setHasAnimated] = useState(false);
  const [displayNumber, setDisplayNumber] = useState(value); // SSR default is the real value!

  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));

  useEffect(() => {
    // Only animate on client-side when scrolled into view
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
      const controls = animate(motionValue, value, {
        duration: 1.8,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => {
          setDisplayNumber(Math.round(latest));
        },
      });
      return () => controls.stop();
    }
  }, [isInView, hasAnimated, motionValue, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="flex items-baseline justify-center gap-0.5">
        <span className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          {displayNumber.toLocaleString()}
        </span>
        {suffix && (
          <span className="text-2xl font-bold text-accent md:text-3xl">
            {suffix}
          </span>
        )}
      </div>
      <p className="mt-2 text-sm font-medium text-muted">{label}</p>
    </div>
  );
}
