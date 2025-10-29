"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AppWindow,
  Bot,
  Check,
  Command,
  Database,
  Loader2,
  Sparkles,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import type { Variants } from "framer-motion";

const cardBaseClass =
  "expertise-card relative overflow-hidden rounded-3xl bg-[rgba(9,12,20,0.85)] p-6 sm:p-8 backdrop-blur-2xl transition-colors duration-300";

export function ExpertiseShowcase() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.35 });
  const [sectionActive, setSectionActive] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  const automationTasks = useMemo(
    () => [
      {
        label: "Automatizare taskuri zilnice",
        accentClass: "bg-emerald-400",
      },
      {
        label: "Sincronizare rapoarte și notificări",
        accentClass: "bg-sky-400",
      },
      {
        label: "Monitorizare KPI-uri în timp real",
        accentClass: "bg-indigo-400",
      },
    ],
    [],
  );

  const [activeAutomationTask, setActiveAutomationTask] = useState(0);

  useEffect(() => {
    if (!sectionActive) {
      setActiveAutomationTask(0);
      return;
    }

    const interval = window.setInterval(() => {
      setActiveAutomationTask((prev) => (prev + 1) % automationTasks.length);
    }, 2600);

    return () => window.clearInterval(interval);
  }, [automationTasks.length, sectionActive]);

  const codeLines = useMemo(
    () => [
      'const agent = createAgent({',
      '  name: "Ava",',
      '  tone: "calm",',
      '  channels: ["web", "whatsapp"],',
      '});',
      '',
      'agent.assignTasks(["qualify_leads", "book_meetings"]);',
    ],
    [],
  );

  const fullCodeText = useMemo(() => codeLines.join("\n"), [codeLines]);
  const [displayedCode, setDisplayedCode] = useState("");

  useEffect(() => {
    if (!sectionActive) {
      setDisplayedCode("");
      return;
    }

    let frame: ReturnType<typeof setTimeout>;
    let index = 0;

    const type = () => {
      if (index <= fullCodeText.length) {
        setDisplayedCode(fullCodeText.slice(0, index));
        index += 1;
        frame = setTimeout(type, 36);
      } else {
        frame = setTimeout(() => {
          index = 0;
          setDisplayedCode("");
          frame = setTimeout(type, 480);
        }, 1600);
      }
    };

    frame = setTimeout(type, 160);

    return () => clearTimeout(frame);
  }, [fullCodeText, sectionActive]);

  const renderedCodeLines = useMemo(
    () => displayedCode.split("\n"),
    [displayedCode],
  );

  const scrapingSignals = useMemo(
    () => ["Tendințe piață", "Prețuri competitori", "Alertă mențiuni"],
    [],
  );
  const [activeSignal, setActiveSignal] = useState(0);

  useEffect(() => {
    if (!sectionActive) {
      setActiveSignal(0);
      return;
    }

    const interval = window.setInterval(() => {
      setActiveSignal((prev) => (prev + 1) % scrapingSignals.length);
    }, 2200);

    return () => window.clearInterval(interval);
  }, [scrapingSignals.length, sectionActive]);

  useEffect(() => {
    if (isInView) {
      setSectionActive(true);
      setHasAnimated(true);
    }
  }, [isInView]);

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 36 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40, rotateX: -12 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.25, 0.8, 0.25, 1],
      },
    }),
  };

  return (
    <motion.section
      ref={containerRef}
      className="relative overflow-hidden pb-16 sm:pb-20 lg:pb-24"
      variants={sectionVariants}
      initial="hidden"
      animate={hasAnimated ? "visible" : "hidden"}
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/40 via-black/60 to-black/80 opacity-85" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1 text-xs font-semibold tracking-[0.3em] text-white/70">
          SERVICII
        </span>
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">
          Câteva din <span className="italic text-white/70">expertizele noastre..</span>
        </h2>
        <p className="text-base text-white/70 sm:text-lg">
          Dezvoltăm software menit să ducă afacerea ta la următorul nivel
        </p>
      </div>

      <div className="relative mx-auto mt-12 max-w-6xl px-4">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 xl:auto-rows-[minmax(260px,1fr)]">
          <motion.article
            className={`${cardBaseClass} md:col-span-2`}
            variants={cardVariants}
            custom={0}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap gap-3 text-xs text-white/70">
                <span className="rounded-full bg-white/10 px-3 py-1">
                  Postări Social Media
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1">
                  Tracking Angajat
                </span>
              </div>
              <div className="rounded-2xl bg-black/30 p-4">
                <div className="flex flex-col gap-3">
                  {automationTasks.map((task, index) => {
                    const isActive = index === activeAutomationTask;
                    const isComplete = index < activeAutomationTask;

                    return (
                      <div
                        key={task.label}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-300 ${
                          isActive
                            ? "bg-[rgba(16,24,38,0.75)]"
                            : "bg-[rgba(10,14,24,0.35)] opacity-80"
                        }`}
                      >
                        <span
                          className={`flex h-2.5 w-2.5 rounded-full ${task.accentClass}`}
                        />
                        <span className="flex-1 text-left text-xs text-white/70">
                          {task.label}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-white/60">
                          {isActive ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin text-sky-300" />
                              <span className="text-sky-300">Rulează</span>
                            </>
                          ) : isComplete ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-300" />
                              <span className="text-emerald-300">Finalizat</span>
                            </>
                          ) : (
                            <span>În coadă</span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-3 text-left text-white/70">
                <h3 className="text-2xl font-semibold text-white">Automatizări / RPA</h3>
                <p>
                  Oferim procese scalate și automatizări conectate într-o singură platformă
                  construită doar pentru afacerea ta.
                </p>
              </div>
            </div>
          </motion.article>

          <motion.article
            className={cardBaseClass}
            variants={cardVariants}
            custom={1}
          >
            <div className="flex h-full flex-col justify-between gap-6">
              <motion.div
                className="relative flex h-56 items-center justify-center"
                animate={{ rotate: sectionActive ? 0 : -6 }}
                transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
              >
                <motion.div
                  className="flux-core relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 backdrop-blur"
                  animate={{
                    scale: sectionActive ? [1, 1.08, 1] : 1,
                  }}
                  transition={{
                    repeat: sectionActive ? Infinity : 0,
                    duration: 3.2,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles className="h-7 w-7 text-white" />
                  <motion.span
                    className="flux-core-glow absolute inset-0 rounded-full bg-primary/20"
                    animate={{
                      opacity: sectionActive ? [0.35, 0.8, 0.35] : 0.35,
                    }}
                    transition={{
                      repeat: sectionActive ? Infinity : 0,
                      duration: 3.2,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
                <motion.div
                  className="flux-orbits absolute h-48 w-48"
                  animate={{ rotate: sectionActive ? 360 : 0 }}
                  transition={{
                    repeat: sectionActive ? Infinity : 0,
                    duration: 20,
                    ease: "linear",
                  }}
                >
                  <motion.div className="absolute left-1/2 top-2 -translate-x-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white/70">
                    <Command className="h-5 w-5" />
                  </motion.div>
                  <motion.div className="absolute bottom-4 left-0 flex h-12 w-12 -translate-x-3 items-center justify-center rounded-full bg-black/50 text-white/70">
                    <Database className="h-5 w-5" />
                  </motion.div>
                  <motion.div className="absolute right-0 top-6 flex h-12 w-12 translate-x-3 items-center justify-center rounded-full bg-black/50 text-white/70">
                    <Bot className="h-5 w-5" />
                  </motion.div>
                  <motion.div className="absolute bottom-2 right-1/2 flex h-12 w-12 translate-x-1/2 items-center justify-center rounded-full bg-black/50 text-white/70">
                    <AppWindow className="h-5 w-5" />
                  </motion.div>
                </motion.div>
              </motion.div>

              <div className="space-y-3 text-left text-white/70">
                <h3 className="text-2xl font-semibold text-white">Fluxuri Custom</h3>
                <p>
                  Scalăm și digitalizăm concepte prin fluxuri de lucru inteligente care
                  automatizează procese complexe, cu mai mulți pași, între instrumente și
                  platforme.
                </p>
              </div>
            </div>
          </motion.article>

          <motion.article
            className={cardBaseClass}
            variants={cardVariants}
            custom={2}
          >
            <div className="flex h-full flex-col justify-between gap-5 text-left text-white/70">
              <div className="rounded-2xl bg-black/35 p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-white/50">
                    <span>Scraping WEB/AI</span>
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/60">
                      Live Feed
                    </span>
                  </div>
                  <div className="space-y-1">
                    {scrapingSignals.map((label, index) => {
                      const isActive = index === activeSignal;

                      return (
                        <div
                          key={label}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs transition-colors duration-300 ${
                            isActive
                              ? "bg-emerald-500/10"
                              : "bg-white/5 opacity-85"
                          }`}
                        >
                          <span className="h-2 w-2 rounded-full bg-emerald-400" />
                          <span className="text-white/70">{label}</span>
                          <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] uppercase ${isActive ? "bg-emerald-500/20 text-emerald-200" : "bg-white/10 text-white/60"}`}>
                            activ
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-white">Scraping WEB/AI</h3>
                <p>Îți colectăm rapid și inteligent informații prețioase în timp real.</p>
              </div>
            </div>
          </motion.article>

          <motion.article
            className={cardBaseClass}
            variants={cardVariants}
            custom={3}
          >
            <div className="flex h-full flex-col gap-5 text-left text-white/70">
              <div className="rounded-2xl bg-black/35 p-4 font-mono text-sm text-emerald-100/90">
                <div className="mb-3 flex items-center justify-between text-xs text-white/40">
                  <span className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-red-500" />
                    <span className="flex h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    <span className="ml-3 text-white/60">agents.ts</span>
                  </span>
                  <span className="rounded-full bg-white/5 px-3 py-0.5 text-[10px] uppercase tracking-wide">
                    Code
                  </span>
                </div>
                <div className="h-40 overflow-hidden rounded-xl bg-black/60 px-4 py-3">
                  {renderedCodeLines.map((line, index) => (
                    <div key={`${line}-${index}`} className="flex gap-3">
                      <span className="w-6 select-none text-right text-xs text-white/20">
                        {index + 1}
                      </span>
                      <span className="whitespace-pre text-xs text-emerald-100/85">
                        {line}
                      </span>
                    </div>
                  ))}
                  <div className="flex gap-3">
                    <span className="w-6 select-none text-right text-xs text-white/20">
                      {renderedCodeLines.length + 1}
                    </span>
                    <span className="inline-block h-4 w-0.5 bg-emerald-300 animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-white">Agenți AI</h3>
                <p>Îți creăm agenți AI personalizați care se integrează perfect între platforme.</p>
              </div>
            </div>
          </motion.article>

          <motion.article
            className={cardBaseClass}
            variants={cardVariants}
            custom={4}
          >
            <div className="flex h-full flex-col justify-between gap-6 text-left text-white/70">
              <div className="relative h-40 overflow-hidden rounded-2xl bg-black/35">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-24 w-24 rounded-full bg-white/5" />
                  <div className="absolute h-36 w-36 rounded-full bg-white/5 opacity-40" />
                  <div className="absolute h-16 w-16 rounded-full opacity-70" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center gap-10 text-sm text-white/60">
                  <span>Strategie</span>
                  <span>Sisteme</span>
                  <span>Procese</span>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-white">Consultanță Business</h3>
                <p>Găsim soluții creative la problemele tale tehnice cu ajutorul AI.</p>
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </motion.section>
  );
}

export default ExpertiseShowcase;
