import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#1d1d1f] text-white",
        secondary:
          "border-transparent bg-[#f5f5f7] text-[#1d1d1f]",
        outline:
          "border border-black/10 text-[#1d1d1f]",
        safe:
          "border-emerald-200/80 bg-emerald-50 text-emerald-700",
        warning:
          "border-amber-200/80 bg-amber-50 text-amber-800",
        danger:
          "border-rose-200/80 bg-rose-50 text-rose-700",
        blue:
          "border-blue-200/80 bg-blue-50 text-[#0071e3]",
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
