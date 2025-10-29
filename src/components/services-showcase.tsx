"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AppWindow,
  ArrowUpRight,
  Bot,
  Check,
  Command,
  Database,
  Loader2,
  Sparkles,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const Spline = dynamic(
  () => import("@splinetool/react-spline/next").then((mod) => mod.default),
  { ssr: false },
);

type AutomationCardProps = {
  title: string;
  description: string;
  tasks: string[];
  footnote: string;
};

type FluxCardProps = {
  title: string;
  description: string;
};

type AgentsCardProps = {
  title: string;
  description: string;
  codeLines: string[];
};

type ConsultancyCardProps = {
  title: string;
  description: string;
  nodes: string[];
};

function CardShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 p-6 shadow-[0_35px_120px_-70px_rgba(14,116,255,0.55)] backdrop-blur duration-300",
        className,
      )}
    >
      {children}
    </div>
  );
}

function AutomationCard({ title, description, tasks, footnote }: AutomationCardProps) {
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % tasks.length);
    }, 3600);

    return () => window.clearInterval(interval);
  }, [tasks.length]);

  return (
    <CardShell className="border-white/10 bg-[#090c13] shadow-[inset_0px_1px_0px_rgba(255,255,255,0.04)]">
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-white/10 bg-black/30 p-4 shadow-inner">
          <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-wide text-white/60">
            <span>{title}</span>
            <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] text-primary/80">
              RPA Loop
            </span>
          </div>
          <div className="space-y-2">
            {tasks.map((task, index) => {
              const isActive = index === activeIndex;
              const isComplete = !isActive;

              return (
                <motion.div
                  key={task}
                  className="flex items-center justify-between rounded-lg border border-white/5 bg-black/60 px-3 py-2 text-sm text-white/80"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.12 }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white/70">{task}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {isActive ? (
                      <span className="flex items-center gap-1 text-primary">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Processing</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Check className="h-3.5 w-3.5" />
                        <span>Done</span>
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="space-y-3 text-sm text-white/70">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p>{description}</p>
          <div className="flex items-center gap-2 text-xs text-white/50">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
              <WorkflowGlyph />
            </span>
            <span>{footnote}</span>
          </div>
        </div>
      </div>
    </CardShell>
  );
}

function FluxCard({ title, description }: FluxCardProps) {
  const orbitItems = [
    { Icon: Command, radius: 70, duration: 18, delay: 0 },
    { Icon: Database, radius: 90, duration: 24, delay: 0.6 },
    { Icon: Bot, radius: 80, duration: 20, delay: 1.2 },
    { Icon: AppWindow, radius: 108, duration: 28, delay: 1.8 },
  ];

  return (
    <CardShell className="border-white/10 bg-[#070b12] shadow-[inset_0px_1px_0px_rgba(255,255,255,0.04)]">
      <div className="flex flex-col gap-6">
        <div className="relative h-48 overflow-hidden">
          <motion.div
            className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-primary/40 bg-primary/20 backdrop-blur"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="h-7 w-7 text-white" />
            <motion.span
              className="absolute inset-0 rounded-full bg-primary/20"
              animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.25, 1] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {orbitItems.map(({ Icon, radius, duration, delay }, index) => (
            <motion.div
              key={index}
              className="absolute left-1/2 top-1/2 h-0 w-0"
              animate={{ rotate: 360 }}
              transition={{ duration, repeat: Infinity, ease: "linear", delay }}
              style={{ originX: 0.5, originY: 0.5 }}
            >
              <div
                className="flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white/70 shadow-lg"
                style={{ transform: `translate(${radius}px, 0px)` }}
              >
                <Icon className="h-5 w-5" />
              </div>
            </motion.div>
          ))}

          <motion.div
            className="absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_65%)]"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="space-y-3 text-sm text-white/70">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p>{description}</p>
        </div>
      </div>
    </CardShell>
  );
}

function AgentsCard({ title, description, codeLines }: AgentsCardProps) {
  const fullText = useMemo(() => codeLines.join("\n"), [codeLines]);
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let frame: ReturnType<typeof setTimeout>;
    let index = 0;

    const type = () => {
      if (index <= fullText.length) {
        setDisplayed(fullText.slice(0, index));
        index += 1;
        frame = setTimeout(type, 40);
      } else {
        frame = setTimeout(() => {
          index = 0;
          setDisplayed("");
          frame = setTimeout(type, 400);
        }, 1600);
      }
    };

    frame = setTimeout(type, 300);

    return () => {
      window.clearTimeout(frame);
    };
  }, [fullText]);

  const renderedLines = useMemo(() => displayed.split("\n"), [displayed]);

  return (
    <CardShell className="border-white/10 bg-[#06070d] shadow-[inset_0px_1px_0px_rgba(255,255,255,0.04)]">
      <div className="flex flex-col gap-5">
        <div className="rounded-xl border border-white/10 bg-black/40">
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-3 text-xs text-white/50">
            <span className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-red-500" />
              <span className="flex h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="ml-3">agents.py</span>
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wide">
              Code
            </span>
          </div>
          <div className="h-44 overflow-hidden rounded-b-xl bg-black/60 px-4 py-4 font-mono text-sm text-emerald-100/90">
            {renderedLines.map((line, index) => (
              <div key={`${line}-${index}`} className="flex gap-3">
                <span className="w-6 select-none text-right text-xs text-white/20">
                  {index + 1}
                </span>
                <span className="whitespace-pre text-emerald-100/90">{line}</span>
              </div>
            ))}
            <div className="flex gap-3">
              <span className="w-6 select-none text-right text-xs text-white/20">
                {renderedLines.length + 1}
              </span>
              <motion.span
                className="inline-block h-4 w-0.5 bg-emerald-300"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.9, repeat: Infinity }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 text-sm text-white/70">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p>{description}</p>
        </div>
      </div>
    </CardShell>
  );
}

function ConsultancyCard({ title, description, nodes }: ConsultancyCardProps) {
  const fallbackLabels = ["Strategie", "Marketing", "Operațiuni"];
  const graphLabels = fallbackLabels.map((fallback, index) => nodes[index] ?? fallback);

  return (
    <CardShell className="border-white/10 bg-[#07090f] shadow-[inset_0px_1px_0px_rgba(255,255,255,0.04)]">
      <div className="flex flex-col gap-6">
        <div className="relative h-44 overflow-hidden rounded-xl border border-white/5 bg-black/30">
          <Spline scene="https://prod.spline.design/UG8mZ8c5-VShDzap/scene.splinecode" />
        </div>

        <div className="space-y-3 text-sm text-white/70">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p>{description}</p>
          <div className="flex flex-wrap gap-2 text-xs text-white/50">
            {graphLabels.map((label) => (
              <span
                key={label}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </CardShell>
  );
}

function WorkflowGlyph() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v3" />
      <path d="M12 18v3" />
      <rect x="7" y="6" width="10" height="6" rx="2" />
      <path d="M7 18h10" />
    </svg>
  );
}

export function ServicesShowcase() {
  const t = useTranslations("home.services");

  const eyebrow = t("eyebrow");
  const title = t("title");
  const subtitle = t("subtitle");
  const footnote = t("footnote");

  const automationTasks = Array.from({ length: 2 }, (_, index) =>
    t(`cards.0.tasks.${index}`),
  );
  const codeLines = Array.from({ length: 5 }, (_, index) =>
    t(`cards.2.code.${index}`),
  );
  const consultancyNodes = Array.from({ length: 3 }, (_, index) =>
    t(`cards.3.nodes.${index}`),
  );

  const cards = useMemo(
    () => [
      {
        key: "automation",
        render: () => (
          <AutomationCard
            title={t("cards.0.title")}
            description={t("cards.0.description")}
            tasks={automationTasks}
            footnote={footnote}
          />
        ),
      },
      {
        key: "flows",
        render: () => (
          <FluxCard title={t("cards.1.title")} description={t("cards.1.description")} />
        ),
      },
      {
        key: "agents",
        render: () => (
          <AgentsCard
            title={t("cards.2.title")}
            description={t("cards.2.description")}
            codeLines={codeLines}
          />
        ),
      },
      {
        key: "consultancy",
        render: () => (
          <ConsultancyCard
            title={t("cards.3.title")}
            description={t("cards.3.description")}
            nodes={consultancyNodes}
          />
        ),
      },
    ],
    [automationTasks, codeLines, consultancyNodes, footnote, t],
  );

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black via-[#05070c] to-black" />
      <div className="absolute left-1/2 top-8 -z-10 h-[420px] w-[95vw] -translate-x-1/2 rounded-[36px] bg-[#0c101b] blur-[140px] opacity-70" />

      <div className="px-4 sm:px-6 lg:px-0">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          variants={fadeIn}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-medium uppercase tracking-wide text-primary/90">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>{eyebrow}</span>
          </span>
          <h2 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-base text-white/70 sm:text-lg">{subtitle}</p>
        </motion.div>

        <motion.div
          className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, visible: {} }}
          transition={{ staggerChildren: 0.1 }}
        >
          {cards.map(({ key, render }, index) => (
            <motion.div
              key={key}
              className="h-full"
              variants={fadeIn}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              {render()}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default ServicesShowcase;
