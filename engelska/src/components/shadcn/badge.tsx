import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold transition-all shadow-[0_2px_0_0_rgba(0,0,0,0.1),inset_0_1px_2px_0_rgba(255,255,255,0.5)]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        success: "bg-emerald-100 text-emerald-700 border border-emerald-200",
        warning: "bg-amber-100 text-amber-700 border border-amber-200",
        destructive: "bg-destructive/10 text-destructive border border-destructive/20",
        outline: "border border-border text-foreground bg-background",
        jungle: "bg-jungle-100 text-jungle-700 border border-jungle-200",
        city: "bg-city-100 text-city-700 border border-city-200",
        global: "bg-global-100 text-global-700 border border-global-200",
        summit: "bg-summit-100 text-summit-700 border border-summit-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
