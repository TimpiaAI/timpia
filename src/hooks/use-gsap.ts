"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    gsap?: any;
    ScrollTrigger?: any;
    _gsapLoader?: Promise<void>;
  }
}

const GSAP_SRC = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
const SCROLL_TRIGGER_SRC = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js";

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);

    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
        return;
      }

      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

export function useGsap() {
  const [gsapInstance, setGsapInstance] = useState<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const assignInstance = () => {
      const instance = window.gsap;
      const scrollTrigger = window.ScrollTrigger;

      if (instance && scrollTrigger) {
        instance.registerPlugin(scrollTrigger);
        setGsapInstance(instance);
      }
    };

    if (window.gsap && window.ScrollTrigger) {
      assignInstance();
      return;
    }

    window._gsapLoader ??= (async () => {
      await loadScript(GSAP_SRC);
      await loadScript(SCROLL_TRIGGER_SRC);
    })();

    let cancelled = false;

    window._gsapLoader
      .then(() => {
        if (!cancelled) {
          assignInstance();
        }
      })
      .catch((error) => {
        console.warn("GSAP failed to load", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return gsapInstance;
}

