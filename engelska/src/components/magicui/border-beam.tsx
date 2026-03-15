"use client";

import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  anchor?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

export function BorderBeam({
  className,
  size = 200,
  duration = 15,
  anchor = 90,
  borderWidth = 2.5,
  colorFrom = "#6366f1",
  colorTo = "#a855f7",
  delay = 0,
}: BorderBeamProps) {
  return (
    <div
      style={
        {
          "--size": size,
          "--duration": duration,
          "--anchor": anchor,
          "--border-width": borderWidth,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--delay": `-${delay}s`,
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent]",
        "[background:linear-gradient(#ffffff,#ffffff)_padding-box,conic-gradient(from_calc(var(--anchor)*1deg),#0000_0%,var(--color-from)_20%,var(--color-to)_50%,#0000_70%)_border-box]",
        "dark:[background:linear-gradient(#1e1e2e,#1e1e2e)_padding-box,conic-gradient(from_calc(var(--anchor)*1deg),#0000_0%,var(--color-from)_20%,var(--color-to)_50%,#0000_70%)_border-box]",
        "animate-border-beam",
        className
      )}
    />
  );
}
