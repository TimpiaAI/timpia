"use client";

import { useEffect, useRef, useState } from 'react';
import animationData from '@/animations/Scene.json';

const LOTTIE_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js';

type LottieAnimation = {
  destroy: () => void;
  goToAndStop: (value: number, isFrame?: boolean) => void;
  goToAndPlay: (value: number, isFrame?: boolean) => void;
  play: () => void;
  stop: () => void;
  totalFrames: number;
  addEventListener: (eventName: string, callback: () => void) => void;
  removeEventListener: (eventName: string, callback: () => void) => void;
};

declare global {
  interface Window {
    lottie?: {
      loadAnimation: (params: Record<string, unknown>) => LottieAnimation;
    };
    __lottieLoaderPromise?: Promise<void>;
  }
}

async function ensureLottieScript() {
  if (typeof window === 'undefined') return;

  if (window.lottie) return;

  if (!window.__lottieLoaderPromise) {
    window.__lottieLoaderPromise = new Promise<void>((resolve, reject) => {
      const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${LOTTIE_CDN}"]`);
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(), { once: true });
        existingScript.addEventListener('error', () => reject(new Error('Failed to load lottie-web script.')), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = LOTTIE_CDN;
      script.async = true;
      script.addEventListener('load', () => resolve(), { once: true });
      script.addEventListener('error', () => reject(new Error('Failed to load lottie-web script.')), { once: true });
      document.body.appendChild(script);
    });
  }

  await window.__lottieLoaderPromise;
}

export function HeroLottie() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<LottieAnimation | null>(null);
  const targetFrameRef = useRef(0);
  const displayedFrameRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isAnimationReady, setIsAnimationReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    if ('addEventListener' in mediaQuery) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // @ts-expect-error - Safari < 14 fallback
      mediaQuery.addListener(handleChange);
    }
    return () => {
      if ('removeEventListener' in mediaQuery) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // @ts-expect-error - Safari < 14 fallback
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  useEffect(() => {
    let animation: LottieAnimation | null = null;
    let cancelled = false;
    let onDomLoaded: (() => void) | undefined;
    let didAttachListener = false;

    setIsAnimationReady(false);

    const teardownAnimation = () => {
      if (animation && onDomLoaded) {
        animation.removeEventListener('DOMLoaded', onDomLoaded);
      }
      animation?.destroy();
      if (animationRef.current === animation) {
        animationRef.current = null;
      }
      targetFrameRef.current = 0;
      displayedFrameRef.current = 0;
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };

    ensureLottieScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.lottie) return;

        animationRef.current?.destroy();
        animationRef.current = null;

        animation = window.lottie.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop: false,
          autoplay: false,
          animationData,
        });

        animationRef.current = animation;

        onDomLoaded = () => {
          if (cancelled) return;

          const svg = containerRef.current?.querySelector('svg');
          if (svg) {
            svg.style.width = '100%';
            svg.style.height = '100%';
            svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
          }

          animation?.goToAndStop(0, true);
          targetFrameRef.current = 0;
          displayedFrameRef.current = 0;
          setIsAnimationReady(true);

          if (prefersReducedMotion) {
            animation?.stop();
          }

          if (didAttachListener && animation && onDomLoaded) {
            animation.removeEventListener('DOMLoaded', onDomLoaded);
            didAttachListener = false;
          }
        };

        const maybeLoaded = animation as unknown as { isLoaded?: boolean };
        if (maybeLoaded?.isLoaded) {
          onDomLoaded();
        } else {
          animation.addEventListener('DOMLoaded', onDomLoaded);
          didAttachListener = true;
        }
      })
      .catch(() => {
        /* Ignore load failures gracefully */
      });

    return () => {
      cancelled = true;
      teardownAnimation();
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion || !isAnimationReady) return;

    if (!animationRef.current || !containerRef.current) return;

    const step = () => {
      const animation = animationRef.current;
      if (!animation) {
        rafIdRef.current = null;
        return;
      }

      const target = targetFrameRef.current;
      const current = displayedFrameRef.current;
      const next = current + (target - current) * 0.08;
      const isSettled = Math.abs(next - target) <= 0.18;

      const frameToRender = isSettled ? target : next;
      displayedFrameRef.current = frameToRender;
      animation.goToAndStop(Math.max(0, frameToRender), true);

      if (!isSettled) {
        rafIdRef.current = window.requestAnimationFrame(step);
      } else {
        rafIdRef.current = null;
      }
    };

    const queueStep = () => {
      if (rafIdRef.current === null) {
        rafIdRef.current = window.requestAnimationFrame(step);
      }
    };

    const updateTarget = () => {
      if (!animationRef.current || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const start = viewportHeight;
      const end = -rect.height;
      const progress = (start - rect.top) / (start - end || 1);
      const clampedProgress = Math.max(0, Math.min(1, progress));

      const totalFrames = Math.max(animationRef.current.totalFrames - 1, 0);
      const easedProgress = Math.pow(clampedProgress, 2.1);
      targetFrameRef.current = easedProgress * totalFrames;

      queueStep();
    };

    updateTarget();

    window.addEventListener('scroll', updateTarget, { passive: true });
    window.addEventListener('resize', updateTarget);
    window.addEventListener('orientationchange', updateTarget);

    return () => {
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      window.removeEventListener('scroll', updateTarget);
      window.removeEventListener('resize', updateTarget);
      window.removeEventListener('orientationchange', updateTarget);
    };
  }, [isAnimationReady, prefersReducedMotion]);

  return (
    <div className="relative w-full overflow-hidden">
      <div
        ref={containerRef}
        aria-label="Animated overview of Timpia platform"
        className="w-full aspect-[16/9] min-h-[240px] sm:min-h-[320px] md:min-h-[360px] lg:min-h-[420px]"
      />
    </div>
  );
}

export default HeroLottie;
