import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ShimmerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  background?: string;
  className?: string;
}

export function ShimmerButton({
  children,
  background = "linear-gradient(135deg, #6366f1, #8b5cf6)",
  className,
  style,
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex items-center justify-center gap-2",
        "cursor-pointer overflow-hidden whitespace-nowrap",
        "px-6 py-3.5 font-bold text-white text-base",
        "rounded-2xl border-0",
        "transform-gpu transition-all duration-200 ease-out",
        "hover:-translate-y-0.5 active:translate-y-px",
        "disabled:cursor-not-allowed",
        className
      )}
      style={{
        background,
        ...style,
      }}
      {...props}
    >
      {/* Shimmer sweep */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
      >
        <span
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)",
            transition: "transform 0.7s ease-in-out",
          }}
        />
      </span>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}
