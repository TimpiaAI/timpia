
"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";

type CombinedProps = HTMLMotionProps<"div"> & React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties & HTMLMotionProps<"div">["style"];
    as?: React.ElementType; // To render as 'div', 'button', 'a', etc.
};

const GlassmorphismCard: React.FC<CombinedProps> = ({
  children,
  className = "",
  style = {},
  as: Component = "div",
  ...props
}) => {
  const cardStyle = {
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
    transition: "all 0.3s ease",
    ...style,
  };

  return (
    <Component
      className={cn(
        "relative flex font-semibold overflow-hidden text-black cursor-pointer transition-all duration-300 rounded-2xl",
        className
      )}
      style={cardStyle}
      {...props} // Pass down all other props including motion props
    >
      {/* Glass Layers */}
      <div
        className="absolute inset-0 z-0 overflow-hidden rounded-inherit"
        style={{
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
          filter: "url(#glass-distortion)",
          isolation: "isolate",
        }}
      />
      <div
        className="absolute inset-0 z-10 rounded-inherit"
        style={{ background: "rgba(25, 25, 30, 0.5)" }}
      />
      <div
        className="absolute inset-0 z-20 rounded-inherit overflow-hidden"
        style={{
          boxShadow:
            "inset 1px 1px 0px 0 rgba(255, 255, 255, 0.1), inset -1px -1px 0px 0 rgba(255, 255, 255, 0.05)",
        }}
      />

      {/* Content */}
      <div className="relative z-30 w-full">{children}</div>
    </Component>
  );
};

const GlassmorphismFilter: React.FC = () => (
  <svg style={{ position: 'absolute', width: 0, height: 0 }}>
    <filter
      id="glass-distortion"
      x="0%"
      y="0%"
      width="100%"
      height="100%"
      filterUnits="objectBoundingBox"
    >
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.005 0.01"
        numOctaves="1"
        seed="20"
        result="turbulence"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="turbulence"
        scale="20"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  </svg>
);

GlassmorphismCard.Filter = GlassmorphismFilter;

export { GlassmorphismCard };
