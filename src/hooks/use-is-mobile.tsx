
// src/hooks/use-is-mobile.tsx
"use client";

import * as React from "react";

const MOBILE_BREAKPOINT = 768; // Standard mobile breakpoint (Tailwind's md)

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window === "undefined") {
      setIsMobile(false); // Default to false or handle as needed on server
      return;
    }

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Initial check
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    // Add event listener
    mql.addEventListener("change", onChange);

    // Cleanup listener on component unmount
    return () => mql.removeEventListener("change", onChange);
  }, []); // Empty dependency array ensures this runs once on mount (client-side)

  return isMobile === undefined ? false : isMobile; // Return false during SSR or initial undefined state
}
