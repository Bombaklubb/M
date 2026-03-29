import React, { type ComponentPropsWithoutRef, type CSSProperties } from "react"
import { cn } from "../../lib/utils"

export interface ShimmerButtonProps extends ComponentPropsWithoutRef<"button"> {
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
  className?: string
  children?: React.ReactNode
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "#ffffff",
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "16px",
      background = "rgba(0, 0, 0, 1)",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        style={
          {
            "--spread": "90deg",
            "--shimmer-color": shimmerColor,
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--cut": shimmerSize,
            "--bg": background,
          } as CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden border border-white/10 px-6 py-3 whitespace-nowrap text-white",
          "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px",
          "[border-radius:var(--radius)] [background:var(--bg)]",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* shimmer layer */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ borderRadius: "inherit" }}
        >
          <div
            className="animate-shimmer-slide absolute inset-0"
            style={{
              background: `conic-gradient(from 0deg, transparent 0deg, var(--shimmer-color, white) var(--spread, 90deg), transparent var(--spread, 90deg))`,
              animationDuration: "var(--speed, 3s)",
            }}
          />
        </div>

        {children}

        {/* Highlight */}
        <div
          className={cn(
            "absolute inset-0 size-full rounded-[inherit]",
            "shadow-[inset_0_-8px_10px_#ffffff1f]",
            "transform-gpu transition-all duration-300 ease-in-out",
            "group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]",
            "group-active:shadow-[inset_0_-10px_10px_#ffffff3f]"
          )}
        />

        {/* backdrop */}
        <div
          className="absolute inset-[var(--cut,2px)] -z-20 [border-radius:var(--radius)] [background:var(--bg)]"
        />
      </button>
    )
  }
)

ShimmerButton.displayName = "ShimmerButton"
