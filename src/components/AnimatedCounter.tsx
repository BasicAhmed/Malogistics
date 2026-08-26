"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export default function AnimatedCounter({
  target,
  suffix = "",
  decimals = 0,
  duration = 1200,
}: {
  target: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    let frame: number;
    const step = (t: number) => {
      if (start === null) start = t;
      const progress = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, target, duration]);

  return (
    <span ref={ref}>
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
