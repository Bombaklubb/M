"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

function useNumberAnimation(
  value: number,
  duration: number = 800,
  onUpdate: (v: number) => void
) {
  const startRef = useRef<number | null>(null);
  const prevRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = prevRef.current;
    const end = value;
    startRef.current = null;

    const animate = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const current = Math.round(start + (end - start) * eased);
      onUpdate(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        prevRef.current = end;
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration, onUpdate]);
}

interface NumberTickerProps {
  value: number;
  className?: string;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

export function NumberTicker({
  value,
  className,
  duration = 800,
  prefix = "",
  suffix = "",
}: NumberTickerProps) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useNumberAnimation(value, duration, (v) => {
    if (spanRef.current) {
      spanRef.current.textContent = `${prefix}${v.toLocaleString("sv-SE")}${suffix}`;
    }
  });

  return (
    <span
      ref={spanRef}
      className={cn("tabular-nums", className)}
    >
      {prefix}{value.toLocaleString("sv-SE")}{suffix}
    </span>
  );
}
