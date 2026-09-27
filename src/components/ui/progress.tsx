"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorColor?: string;
  autoColorByScore?: boolean;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value = 0, indicatorColor, autoColorByScore = false, ...props }, ref) => {
  const scoreVal = value || 0;

  // Apple-style color thresholds: Green < 30, Yellow 30-70, Red > 70
  let dynamicIndicatorColor = "bg-[#0071e3]";
  if (autoColorByScore) {
    if (scoreVal < 30) {
      dynamicIndicatorColor = "bg-cyan-500"; // Safe Cyan
    } else if (scoreVal <= 70) {
      dynamicIndicatorColor = "bg-violet-500"; // Warning Violet
    } else {
      dynamicIndicatorColor = "bg-fuchsia-500"; // Danger Fuchsia
    }
  }

  const activeColor = indicatorColor || dynamicIndicatorColor;

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-3 w-full overflow-hidden rounded-full bg-black/[0.06] p-0.5",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 rounded-full transition-all duration-700 ease-out shadow-sm",
          activeColor
        )}
        style={{ transform: `translateX(-${100 - scoreVal}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
