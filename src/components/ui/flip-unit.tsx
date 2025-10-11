"use client";
import { AnimatePresence, motion } from "framer-motion";

interface FlipUnitProps {
  value: number;
  label: string;
}

export const FlipUnit = ({ value, label }: FlipUnitProps) => {
  const displayValue = String(value).padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-1 sm:gap-1.5">
      <div className="relative w-14 h-16 sm:w-16 sm:h-20 md:w-20 md:h-24 bg-black/40 rounded-lg shadow-xl overflow-hidden font-mono">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={displayValue}
            initial={{ y: "-100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 25, duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-bold text-white"
          >
            {displayValue}
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 h-1/2 bg-black/20" />
        <div className="absolute inset-x-0 top-1/2 h-px bg-black/50" />
      </div>
      <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-white/60 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
};
