// src/components/ui/interactive-timeline.tsx
"use client";
import {
  useScroll,
  useTransform,
  motion,
  useInView,
  useAnimation,
  animate,
} from "framer-motion";
import type { LucideIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-is-mobile";

export interface TimelineEntry {
  id: number;
  title: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  content: React.ReactNode;
  date: string;
  category: string;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

export const InteractiveTimeline = ({ data }: { data: TimelineEntry[] }) => {
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const contentHeightRef = useRef<HTMLDivElement>(null);

  const [contentHeight, setContentHeight] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (contentHeightRef.current) {
      const updateHeight = () => {
        setContentHeight(contentHeightRef.current!.scrollHeight);
      };
      updateHeight();

      const resizeObserver = new ResizeObserver(updateHeight);
      resizeObserver.observe(contentHeightRef.current);

      const mutationObserver = new MutationObserver(updateHeight);
      mutationObserver.observe(contentHeightRef.current, {
        childList: true,
        subtree: true,
      });

      return () => {
        resizeObserver.disconnect();
        mutationObserver.disconnect();
      };
    }
  }, [data]);

  const { scrollYProgress } = useScroll({
    target: timelineContainerRef,
    offset: ["start 20%", "end 80%"],
  });

  const linePathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const lineOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.95, 1],
    [0, 1, 1, 0]
  );

  const sectionVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  return (
    <div
      className="w-full bg-background dark:bg-neutral-950/70 font-sans relative py-12 md:py-20 overflow-hidden"
      ref={timelineContainerRef}
    >
      <div
        ref={contentHeightRef}
        className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div
          className="absolute left-6 md:left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-primary/20 to-transparent z-0"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          }}
        >
          <motion.div
            className="absolute inset-x-0 top-0 w-full bg-gradient-to-b from-primary/60 via-primary to-purple-600 rounded-full shadow-[0_0_12px_2px_hsl(var(--primary)/0.5)]"
            style={{
              scaleY: linePathLength,
              opacity: lineOpacity,
              height: contentHeight > 0 ? `${contentHeight}px` : "100%",
              transformOrigin: "top",
            }}
          />
        </div>

        <motion.div variants={sectionVariants} initial="hidden" animate="visible">
          {data.map((item, index) => {
            const ItemIcon = item.icon;
            const itemRef = useRef<HTMLDivElement>(null);
            const isInView = useInView(itemRef, {
              once: true,
              amount: isMobile ? 0.2 : 0.3,
            });

            return (
              <motion.div
                key={index}
                ref={itemRef}
                className="relative flex items-start mb-16 md:mb-24 last:mb-0"
                variants={itemVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                <motion.div
                  className={cn(
                    "absolute left-6 md:left-8 top-1 transform -translate-x-1/2 flex-shrink-0 z-10",
                    "flex items-center justify-center w-12 h-12 rounded-full shadow-xl border-2",
                    item.iconBgColor || "bg-primary/10",
                    item.iconColor
                      ? item.iconColor.replace("text-", "border-")
                      : "border-primary"
                  )}
                  initial={{ scale: 0, rotate: -45 }}
                  animate={isInView ? { scale: 1, rotate: 0 } : {}}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2,
                  }}
                >
                  <motion.div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      item.iconBgColor
                        ? item.iconBgColor.replace("/10", "/20")
                        : "bg-primary/20"
                    )}
                    initial={{ scale: 0.5 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 12,
                      delay: 0.3,
                    }}
                  >
                    <ItemIcon
                      className={cn("w-5 h-5", item.iconColor || "text-primary")}
                    />
                  </motion.div>
                </motion.div>

                <div className="pl-[calc(1.5rem+1.5rem+0.75rem)] md:pl-[calc(2rem+1.5rem+1.5rem)] w-full">
                  <motion.h3
                    className={cn(
                      "text-xl md:text-2xl lg:text-3xl font-bold mb-3 tracking-tight",
                      item.iconColor || "text-primary"
                    )}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut",
                      delay: 0.3,
                    }}
                  >
                    {item.title}
                  </motion.h3>
                  <motion.div
                    className="prose dark:prose-invert prose-sm md:prose-base max-w-none bg-card/60 dark:bg-neutral-900/60 border border-border/40 dark:border-neutral-800/70 rounded-xl p-4 md:p-6 shadow-lg backdrop-blur-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut",
                      delay: 0.45,
                    }}
                  >
                    {item.content}
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};
