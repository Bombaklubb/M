import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
}

export function BorderBeam({
  className,
  size = 200,
  duration = 15,
  delay = 0,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
}: BorderBeamProps) {
  return (
    <div
      style={
        {
          "--size": size,
          "--duration": duration,
          "--delay": `-${delay}s`,
          "--color-from": colorFrom,
          "--color-to": colorTo,
        } as CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width,2)*1px)_solid_transparent]",
        "[background:linear-gradient(var(--angle,0deg),var(--color-from),var(--color-to))_border-box]",
        "[mask:linear-gradient(#fff_0_0)_padding-box,linear-gradient(#fff_0_0)]",
        "[mask-composite:xor]",
        "animate-[border-beam_calc(var(--duration)*1s)_var(--delay)_linear_infinite]",
        className,
      )}
    />
  );
}
