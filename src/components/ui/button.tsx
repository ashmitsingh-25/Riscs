import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-apple-blue/40 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[#0071e3] text-white hover:bg-[#0077ed] shadow-sm hover:shadow",
        apple:
          "bg-[#1d1d1f] text-white hover:bg-[#2d2d2f] shadow-sm",
        secondary:
          "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed] border border-black/5",
        outline:
          "border border-black/15 bg-white/80 hover:bg-black/5 text-[#1d1d1f] backdrop-blur-sm",
        ghost:
          "hover:bg-black/5 text-[#1d1d1f]",
        danger:
          "bg-[#ff453a] text-white hover:bg-[#e0382f] shadow-sm",
        safe:
          "bg-[#30d158] text-white hover:bg-[#28b84c] shadow-sm",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-full px-3.5 text-xs",
        lg: "h-13 rounded-full px-8 text-base font-semibold",
        icon: "h-10 w-10 rounded-full",
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
