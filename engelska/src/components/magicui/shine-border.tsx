import { cn } from "@/lib/utils";
import type { ReactNode, CSSProperties } from "react";

interface ShineBorderProps {
  children: ReactNode;
  className?: string;
  borderRadius?: number;
  borderWidth?: number;
  duration?: number;
  color?: string | string[];
}

export function ShineBorder({
  children,
  className,
  borderRadius = 16,
  borderWidth = 2,
  duration = 14,
  color = ["#6366f1", "#a855f7", "#ec4899"],
}: ShineBorderProps) {
  const gradient = Array.isArray(color)
    ? `conic-gradient(from var(--shine-angle, 0deg), transparent 0%, ${color.join(", ")}, transparent 60%)`
    : `conic-gradient(from var(--shine-angle, 0deg), transparent 0%, ${color}, transparent 60%)`;

  return (
    <div
      style={
        {
          "--border-radius": `${borderRadius}px`,
          "--border-width": `${borderWidth}px`,
          "--shine-duration": `${duration}s`,
          "--shine-gradient": gradient,
        } as CSSProperties
      }
      className={cn(
        "relative overflow-hidden",
        "before:absolute before:inset-0 before:rounded-[var(--border-radius)]",
        "before:[background:var(--shine-gradient)]",
        "before:[animation:gradient_var(--shine-duration)_linear_infinite]",
        "before:opacity-60",
        "p-[var(--border-width)] rounded-[var(--border-radius)]",
        className
      )}
    >
      <div className="relative z-10 rounded-[calc(var(--border-radius)-var(--border-width))] h-full w-full">
        {children}
      </div>
    </div>
  );
}
