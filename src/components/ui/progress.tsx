
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { motion } from "framer-motion" // Import motion

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-primary/20", // Changed background color
      className
    )}
    {...props}
  >
    {/* Use motion.div for animated indicator */}
    <motion.div
       className="h-full w-full flex-1 bg-primary transition-transform duration-500 ease-out" // Added transition classes
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
       initial={false} // Prevent initial animation on load
       // Animate the translateX property
       animate={{ transform: `translateX(-${100 - (value || 0)}%)` }}
       transition={{ type: "spring", stiffness: 100, damping: 20 }} // Optional: Use spring animation
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
