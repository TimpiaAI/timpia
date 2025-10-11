
"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { motion } from 'framer-motion';

import { cn } from "@/lib/utils"

// Define the props for the custom Slider, including thumbClassName
interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  thumbClassName?: string;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps // Use the defined SliderProps
>(({ className, value, thumbClassName: customThumbClassName, ...props }, ref) => {
  // Explicitly remove thumbClassName from props to be spread to SliderPrimitive.Root
  // All other props in `...props` are valid for SliderPrimitive.Root
  const { ...rootProps } = props;

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center group",
        props.disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer",
        className
      )}
      value={value}
      {...rootProps} // Spread only the valid Radix props
    >
      <SliderPrimitive.Track className="relative h-2.5 w-full grow overflow-hidden rounded-full bg-primary/20 shadow-inner">
        <motion.div
          className="absolute h-full bg-gradient-to-r from-primary to-purple-600 rounded-full"
          initial={false}
          animate={{ width: `${((value?.[0] ?? 0 - (props.min ?? 0)) / ((props.max ?? 100) - (props.min ?? 0))) * 100}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 25, duration: 0.4 }}
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb asChild>
          <motion.div
          className={cn(
              "block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              props.disabled && "pointer-events-none opacity-80",
              customThumbClassName // Apply the destructured customThumbClassName here for styling the thumb
          )}
          whileHover={!props.disabled ? { scale: 1.2, boxShadow: "0 0 0 6px hsla(var(--primary)/0.3)" } : {}}
          whileTap={!props.disabled ? { scale: 1.1, cursor: 'grabbing' } : {}}
          transition={{ type: "spring", stiffness: 350, damping: 15 }}
          />
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
