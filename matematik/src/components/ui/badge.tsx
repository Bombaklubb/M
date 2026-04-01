import * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
}

const badgeVariants = {
  default: "bg-primary-600/20 text-primary-300 border-primary-500/30",
  secondary: "bg-white/10 text-white/70 border-white/20",
  destructive: "bg-danger-500/20 text-danger-300 border-danger-500/30",
  outline: "border border-white/20 text-white/70",
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
