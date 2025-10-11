
"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

// This component is a simple wrapper around motion.div
// to ensure that any motion component used in Server Components
// is explicitly marked as a client component if it needs client-side interactivity.
// For simple initial animations, motion.div can often be used directly in Server Components.
// However, this wrapper provides a clear boundary.

export const MotionDiv = (props: HTMLMotionProps<"div">) => {
  return <motion.div {...props} />;
};
