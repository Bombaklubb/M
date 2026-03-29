import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-base font-bold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border-3 border-transparent shadow-[0_4px_0_0_rgba(0,0,0,0.2),0_6px_12px_-2px_rgba(0,0,0,0.15),inset_0_2px_4px_0_rgba(255,255,255,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_rgba(0,0,0,0.2),0_10px_20px_-2px_rgba(0,0,0,0.2)] active:translate-y-0.5 active:shadow-[0_1px_0_0_rgba(0,0,0,0.2)]",
        secondary:
          "bg-white text-foreground border-3 border-indigo-200 shadow-[0_3px_0_0_rgba(99,102,241,0.2),0_4px_8px_-2px_rgba(99,102,241,0.1),inset_0_2px_4px_0_rgba(255,255,255,0.8)] hover:-translate-y-0.5 active:translate-y-px",
        outline:
          "border-2 border-border bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "px-6 py-3.5",
        sm: "px-4 py-2 text-sm rounded-xl",
        lg: "px-8 py-4 text-lg rounded-2xl",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
