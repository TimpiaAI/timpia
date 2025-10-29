"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Lightbulb, Map, Rocket, Sparkles } from "lucide-react";
import { motion, useInView } from "framer-motion";
import type { Variants } from "framer-motion";

const tabsBaseClass =
  "flex-1 rounded-2xl bg-white/5 px-4 py-2 text-xs font-semibold tracking-[0.18em] uppercase text-white/60 transition-colors duration-300";

type Step = {
  id: number;
  label: string;
  title: string;
  description: string;
  highlights: string[];
  highlightProgress: number[];
  metrics: number[];
  accent: string;
  icon: typeof Lightbulb;
};

export function ProcessJourney() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.35 });
  const [hasAnimated, setHasAnimated] = useState(false);

  const steps = useMemo<Step[]>(
    () => [
      {
        id: 1,
        label: "STEP 1",
        title: "Descoperim procesul tău",
        description: "Cartografiem procesele actuale și identificăm blocajele critice.",
        highlights: ["Audit complet", "Diagnoză blocaje", "Roadmap prioritizat"],
        highlightProgress: [0.9, 0.7, 0.6],
        metrics: [1, 0.7, 0.5],
        accent: "from-sky-500/30 via-purple-500/20 to-transparent",
        icon: Lightbulb,
      },
      {
        id: 2,
        label: "STEP 2",
        title: "Idei & arhitectură inovatoare",
        description: "Prototipăm experiența și desenăm arhitectura integrată alături de echipa ta.",
        highlights: ["Workshop-uri UX", "Plan de integrare", "Blueprint tehnic"],
        highlightProgress: [0.85, 0.8, 0.7],
        metrics: [0.75, 1, 0.8],
        accent: "from-indigo-500/30 via-blue-500/20 to-transparent",
        icon: Map,
      },
      {
        id: 3,
        label: "STEP 3",
        title: "Implementare pe nevoile tale",
        description: "Implementăm soluția, o integrăm în ecosistem și optimizăm după lansare.",
        highlights: ["Dezvoltare & QA", "Migrare controlată", "Go-live asistat"],
        highlightProgress: [0.95, 0.85, 0.75],
        metrics: [0.8, 0.75, 1],
        accent: "from-emerald-500/30 via-teal-500/20 to-transparent",
        icon: Rocket,
      },
    ],
    [],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const activeStep = steps[activeIndex];
  const StepIcon = activeStep.icon;

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 36 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 36 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.25, 0.8, 0.25, 1] },
    },
  };

  const metricSpring = { type: "spring", stiffness: 160, damping: 20 };
  const chipSpring = { type: "spring", stiffness: 170, damping: 22 };

  useEffect(() => {
    if (isInView) {
      setHasAnimated(true);
    }
  }, [isInView]);

  return (
    <motion.section
      ref={containerRef}
      className="relative overflow-hidden pb-20 sm:pb-24"
      variants={sectionVariants}
      initial="hidden"
      animate={hasAnimated ? "visible" : "hidden"}
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/35 via-black/55 to-black/80 opacity-80" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1 text-xs font-semibold tracking-[0.35em] text-white/70">
          PROCESUL NOSTRU
        </span>
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">
          Simplu <span className="italic text-white/70">&amp; Smart</span>
        </h2>
        <p className="text-base text-white/70 sm:text-lg">
          Vezi rapid ce livrăm în fiecare etapă și cum arată progresul real.
        </p>
      </div>

      <div className="relative mx-auto mt-12 w-full max-w-6xl px-4">
        <motion.div
          className="rounded-[32px] bg-black/40 p-6 backdrop-blur-xl"
          variants={cardVariants}
          initial="hidden"
          animate={hasAnimated ? "visible" : "hidden"}
        >
          <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:gap-3">
              {steps.map((step, index) => {
                const isActive = index === activeIndex;

                return (
                  <motion.button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`${tabsBaseClass} ${
                      isActive ? "bg-white/15 text-white shadow-lg shadow-white/10" : "text-white/45"
                    }`}
                  >
                    <span>{step.label}</span>
                    <span
                      className={`mt-2 block text-[9px] tracking-[0.12em] ${
                        isActive ? "text-white/70" : "text-white/35"
                      }`}
                    >
                      {step.title}
                    </span>
                  </motion.button>
                );
              })}
            </div>
            <div className="text-xs text-white/50">
              Selectează pașii pentru a vedea detaliile fiecărei etape.
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center">
            <motion.div
              key={`visual-${activeStep.id}`}
              className="process-visual relative aspect-[4/3] w-full rounded-[28px] bg-[#060910]/80 p-6"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.25, 0.8, 0.25, 1] }}
            >
              <div
                className={`absolute inset-x-6 top-6 h-40 rounded-2xl bg-gradient-to-br ${activeStep.accent} p-5`}
              >
                <div className="mb-6 flex items-center justify-between text-xs text-white/60">
                  <span>Panoramă procese</span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase">
                    Live sync
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-[10px] text-white/60">
                  {["Procese", "Platforme", "Rezultat"].map((label, idx) => {
                    const completion = Math.round((activeStep.metrics[idx] ?? 1) * 100);

                    return (
                      <div key={label} className="space-y-1">
                        <div className="rounded-md bg-black/20 px-2 py-1 text-[9px] uppercase tracking-[0.25em]">
                          {label}
                        </div>
                        <div className="relative h-14 overflow-hidden rounded-md bg-black/30">
                          <motion.div
                            key={`${activeIndex}-${idx}`}
                            className="h-full rounded-md bg-gradient-to-r from-white/60 via-white/30 to-white/5"
                            initial={{ scaleX: 0 }}
                            animate={{
                              scaleX: isInView ? activeStep.metrics[idx] ?? 1 : 0,
                            }}
                            transition={metricSpring}
                            style={{ originX: 0 }}
                          />
                          <span className="absolute inset-y-0 right-3 flex items-center text-[11px] font-semibold text-white/75">
                            {completion}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="absolute bottom-8 left-1/2 w-[85%] max-w-[420px] -translate-x-1/2 rounded-2xl bg-black/60 p-5 text-sm text-white/70 backdrop-blur">
                <div className="mb-4 flex items-center justify-between text-xs text-white/60">
                  <span>Sisteme prioritare</span>
                  <span className="flex items-center gap-1 text-[10px] uppercase">
                    <Sparkles className="h-3.5 w-3.5 text-violet-300" />
                    AI Scoring
                  </span>
                </div>
                <div className="space-y-2">
                  {activeStep.highlights.map((highlight, index) => {
                    const chipPercent = Math.round(
                      (activeStep.highlightProgress[index] ?? 1) * 100,
                    );

                    return (
                      <div
                        key={`${highlight}-${activeStep.id}`}
                        className="flex items-center gap-3 rounded-lg bg-black/40 px-3 py-2 text-xs"
                      >
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        <span className="text-white/80">{highlight}</span>
                        <div className="ml-auto h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
                          <motion.div
                            key={`${activeIndex}-chip-${index}`}
                            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-400"
                            initial={{ scaleX: 0 }}
                            animate={{
                              scaleX: isInView ? activeStep.highlightProgress[index] ?? 1 : 0,
                            }}
                            transition={chipSpring}
                            style={{ originX: 0 }}
                          />
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-200">
                          {chipPercent}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            <motion.div
              key={`text-${activeStep.id}`}
              className="process-copy flex flex-col gap-6 text-left"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.25, 0.8, 0.25, 1] }}
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70">
                <StepIcon className="h-5 w-5" />
              </div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.5em] text-white/40">
                {activeStep.label}
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-white sm:text-3xl">
                  {activeStep.title}
                </h3>
                <p className="mt-3 text-base text-white/70">{activeStep.description}</p>
              </div>
              <ul className="space-y-3 text-sm text-white/65">
                {activeStep.highlights.map((item) => (
                  <li
                    key={`list-${activeStep.id}-${item}`}
                    className="flex items-start gap-3 rounded-2xl bg-white/5 px-4 py-3 backdrop-blur"
                  >
                    <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-white/70">
                      <StepIcon className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-white/80">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default ProcessJourney;
