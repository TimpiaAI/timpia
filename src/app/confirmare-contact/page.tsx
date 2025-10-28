// src/app/confirmare-contact/page.tsx
"use client";

export const dynamic = 'force-dynamic';

import React, { useEffect, useState, Suspense } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, CalendarDays, Mail } from "lucide-react";
import Script from "next/script";
import { format, parse } from 'date-fns';
import { ro } from 'date-fns/locale';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Sparkles } from '@/components/ui/sparkles';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import confirmareImage from '@/early_acces/confirmare.avif';
import Confetti from '@/components/ui/confetti';

const contentVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.8,
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

function ConfirmationDetails() {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');
  const timeParam = searchParams.get('time');
  const googleCalendarLink = searchParams.get('gcal_link');


  let formattedDate = "Dată neconfirmată";
  let dayOfWeek = "Ziua";
  let dayOfMonth = "";
  let monthName = "";
  if (dateParam) {
    try {
      const parsedDate = parse(dateParam, 'yyyy-MM-dd', new Date());
      dayOfWeek = format(parsedDate, 'eeee', { locale: ro });
      // Capitalize first letter
      dayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
      
      formattedDate = format(parsedDate, 'd MMMM yyyy', { locale: ro });
      dayOfMonth = format(parsedDate, 'd');
      monthName = format(parsedDate, 'MMM', { locale: ro });
    } catch (e) {
      console.error("Invalid date format:", dateParam);
    }
  }

  return (
    <>
      <Script id="fb-lead-tracking" strategy="afterInteractive">
        {`
          if (window.fbq) {
            fbq('track', 'Lead');
          }
        `}
      </Script>
      <div className="container py-16 md:py-20 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <motion.div
          className="w-full max-w-xl mx-auto"
          variants={contentVariants}
          initial="hidden"
          animate="visible"
        >
          <GlassmorphismCard className="shadow-2xl border-primary/20 rounded-2xl backdrop-blur-md">
            <CardContent className="p-8 md:p-10 text-center text-white">
              <motion.div
                  className="mb-6 inline-block relative"
                  variants={itemVariants}
              >
                 <Image
                    src={confirmareImage}
                    alt="Imagine de confirmare cu un robot prietenos"
                    width={200} 
                    height={200}
                    className="w-auto h-auto max-h-[160px] md:max-h-[200px]"
                    data-ai-hint="friendly robot confirmation"
                />
              </motion.div>

              <motion.h1 
                  variants={itemVariants} 
                  className="text-3xl md:text-4xl font-bold mb-4 text-white"
              >
                Programarea ta este confirmată!
              </motion.h1>

                {dateParam && timeParam && (
                    <motion.div
                        variants={itemVariants}
                        className="my-8"
                    >
                         <p className="text-sm text-white/70 mb-4">Data și ora programării</p>
                         <div className="max-w-xs mx-auto">
                            <div className="bg-black/20 rounded-lg p-4 border border-white/20 flex items-center justify-center gap-4">
                                <div className="flex flex-col items-center justify-center bg-white/90 text-black rounded-lg w-16 h-16 shrink-0 font-bold">
                                    <span className="text-xs uppercase tracking-wider">{monthName}</span>
                                    <span className="text-3xl -mt-1">{dayOfMonth}</span>
                                </div>
                                <div className="text-left">
                                     <h3 className="font-semibold text-white/90 capitalize">{dayOfWeek}</h3>
                                     <div className="flex items-center gap-2 text-sm text-white/70 mt-1">
                                        <Clock className="h-4 w-4"/>
                                        <span>{timeParam}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
              
                <motion.ul 
                    variants={itemVariants} 
                    className="space-y-3 text-base text-white/80 mb-8 text-left max-w-lg mx-auto"
                >
                    <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-1 shrink-0"/>
                        <span>Ai primit un email cu detaliile întâlnirii pentru a adăuga evenimentul în calendar.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-1 shrink-0"/>
                        <span>În sub 24 de ore, vei fi apelat de unul dintre colegii noștri pentru a înțelege exact nevoia ta.</span>
                    </li>
                </motion.ul>
              
                <motion.div variants={itemVariants}>
                    <Separator className="my-8 bg-white/20" />
                    <p className="text-sm text-white/70 mb-4">Ce poți face acum?</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                         <Button variant="outline" asChild className="bg-transparent border-white/30 text-white/90 hover:bg-white/10 hover:border-white/50 hover:text-white">
                           <a href="mailto:contact@timpia.ro">
                                <Mail className="mr-2 h-4 w-4"/> Deschide Email
                           </a>
                        </Button>
                    </div>
                </motion.div>
            </CardContent>
          </GlassmorphismCard>
        </motion.div>
      </div>
    </>
  );
}

// New client-only wrapper for animations and effects
const ConfirmationClientContent = () => {
    const [isAnimating, setIsAnimating] = useState(true);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAnimating(false);
        }, 1400); // Should match animation duration
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
                <Sparkles
                    background="transparent"
                    minSize={0.4}
                    maxSize={1.2}
                    particleDensity={10}
                    className="w-full h-full"
                    particleColor="rgba(255, 255, 255, 0.3)"
                />
            </div>
            <AnimatePresence>
                {isAnimating && (
                    <motion.div
                        key="circle-wipe"
                        className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-md origin-center"
                        initial={{ clipPath: "circle(150% at 50% 50%)" }}
                        animate={{ clipPath: "circle(0% at 50% 50%)", transition: { duration: 1.4, ease: [0.76, 0, 0.24, 1] } }}
                        onAnimationComplete={() => {
                            const el = document.querySelector('[data-circle-wipe="true"]');
                            if (el) (el as HTMLElement).style.display = 'none';
                        }}
                        data-circle-wipe="true"
                    />
                )}
            </AnimatePresence>
            <Confetti />
            {/* The content that uses searchParams must be wrapped in Suspense */}
            <Suspense fallback={<div>Loading...</div>}>
              <ConfirmationDetails />
            </Suspense>
        </>
    );
};

export default function ConfirmationPage() {
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div className="bg-black min-h-screen relative">
            {isClient ? (
                <ConfirmationClientContent />
            ) : (
                // Render a static fallback on the server to prevent hydration errors
                 <div className="container py-16 md:py-20 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
                    <p className="text-white">Se încarcă confirmarea...</p>
                </div>
            )}
        </div>
    );
}
