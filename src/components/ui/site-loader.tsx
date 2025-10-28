"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import animationData from '@/animations/Live chatbot.json';

const LOTTIE_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js';

declare global {
  interface Window {
    lottie?: {
      loadAnimation: (params: Record<string, unknown>) => { destroy: () => void };
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
        existingScript.addEventListener('error', () => reject(new Error('Failed to load lottie-web script.')), {
          once: true,
        });
        return;
      }

      const script = document.createElement('script');
      script.src = LOTTIE_CDN;
      script.async = true;
      script.addEventListener('load', () => resolve(), { once: true });
      script.addEventListener('error', () => reject(new Error('Failed to load lottie-web script.')), {
        once: true,
      });
      document.body.appendChild(script);
    });
  }

  await window.__lottieLoaderPromise;
}

const STATUS_STEPS = [
  { threshold: 0, label: 'Spinning up cores' },
  { threshold: 20, label: 'Linking AI copilots' },
  { threshold: 45, label: 'Syncing knowledge base' },
  { threshold: 70, label: 'Preparing live chat' },
  { threshold: 90, label: 'Final polish' },
  { threshold: 100, label: 'Ready' },
] as const;

export default function SiteLoader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(6);
  const [statusLabel, setStatusLabel] = useState(STATUS_STEPS[0].label);
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    let animation: { destroy: () => void } | undefined;
    let cancelled = false;

    if (prefersReducedMotion) {
      return;
    }

    ensureLottieScript()
      .then(() => {
        if (!cancelled && containerRef.current && window.lottie) {
          animation = window.lottie.loadAnimation({
            container: containerRef.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData,
          });

          const svg = containerRef.current.querySelector('svg');
          if (svg) {
            svg.style.width = '100%';
            svg.style.height = '100%';
            svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
          }
        }
      })
      .catch(() => {
        /* ignore load failures gracefully */
      });

    return () => {
      cancelled = true;
      animation?.destroy();
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    let rafId: number | null = null;
    let lastTime = performance.now();

    const smoothIncrement = (time: number) => {
      const delta = Math.min(48, time - lastTime);
      lastTime = time;

      setProgress((prev) => {
        if (prev >= 96) return prev;
        const easeFactor = 1 - prev / 100;
        const increment = (delta / 16.67) * (prefersReducedMotion ? 1.2 : 1.65) * easeFactor;
        return Math.min(prev + increment, 96);
      });

      rafId = window.requestAnimationFrame(smoothIncrement);
    };

    rafId = window.requestAnimationFrame(smoothIncrement);

    const handleComplete = () => {
      setProgress(100);
    };

    if (document.readyState === 'complete') {
      handleComplete();
    } else {
      window.addEventListener('load', handleComplete, { once: true });
    }

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('load', handleComplete);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    const current = STATUS_STEPS.reduce((acc, step) => (progress >= step.threshold ? step : acc), STATUS_STEPS[0]);
    setStatusLabel(current.label);
  }, [progress]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex min-h-screen w-full items-center justify-center bg-black"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.12),transparent_55%),radial-gradient(circle_at_bottom,rgba(147,51,234,0.1),transparent_60%)]" />
      <div className="relative z-10 flex w-full max-w-lg flex-col items-center px-6 text-white">
        <div className="relative mx-auto flex h-52 w-52 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-[0_30px_120px_rgba(147,51,234,0.35)] backdrop-blur">
          <div
            ref={containerRef}
            aria-label="Preparing the Timpia experience"
            className="h-[160px] w-[160px]"
          />

          <div className="pointer-events-none absolute inset-0 animate-pulse rounded-full bg-gradient-to-tr from-violet-400/25 via-transparent to-fuchsia-400/30 blur-3xl" />
        </div>

        <div className="mt-12 w-full max-w-md space-y-4">
          <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="relative h-full rounded-full bg-gradient-to-r from-violet-400 via-purple-500 to-fuchsia-500 shadow-[0_8px_32px_rgba(147,51,234,0.45)] transition-[width] duration-200 ease-out"
              style={{ width: `${progress}%` }}
            >
              <span className="absolute inset-y-0 right-0 w-8 translate-x-1/2 rounded-full bg-white/60 blur-lg" />
              <span className="absolute inset-0 animate-[shimmer_1.8s_linear_infinite] bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.32),transparent)] mix-blend-screen" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-white/60 sm:text-sm">
            <span>{statusLabel}</span>
            <span>{Math.floor(progress)}%</span>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 backdrop-blur-xl" />
    </div>
  );
}
