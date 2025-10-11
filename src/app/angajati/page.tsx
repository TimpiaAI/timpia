// src/app/angajati/page.tsx
"use client"; // Adăugat pentru a permite utilizarea componentelor client-side precum framer-motion

import Image from 'next/image';
import { motion } from 'framer-motion';
import { EmployeeCarousel } from '@/components/employee-carousel';

// Metadata a fost eliminată deoarece nu poate fi exportată dintr-o componentă "use client".
// Aceasta poate fi adăugată în layout-ul principal sau într-un layout specific dacă este necesar.

export default function AngajatiPage() {
  return (
    // Container principal cu fundal întunecat și care ocupă tot ecranul
    <div className="bg-black text-white min-h-screen w-full overflow-x-hidden">
        <div className="flex flex-col items-center justify-center pt-24 pb-12 md:pb-16 px-4">
            <motion.div
                className="text-center max-w-4xl mx-auto"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                Singurii angajați care nu dorm
                </h1>
                <p className="mt-4 text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                Scalează, eficientizează și salvează timpul companiei tale cu un angajat AI 100% personalizabil.
                </p>
            </motion.div>

            {/* Container pentru imagine cu efect de fade */}
            <motion.div
                className="relative mt-10 md:mt-16 w-full max-w-6xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
                {/* Efect de fade sus */}
                <div className="absolute top-0 left-0 w-full h-16 md:h-24 bg-gradient-to-b from-black to-transparent z-10" />
                
                <Image
                src="/early_acces/hero.avif"
                alt="Trei roboți prietenoși reprezetând angajații AI"
                width={1920}
                height={1080}
                className="rounded-xl shadow-2xl shadow-primary/20"
                data-ai-hint="three robots"
                />

                {/* Efect de fade jos */}
                <div className="absolute bottom-0 left-0 w-full h-16 md:h-24 bg-gradient-to-t from-black to-transparent z-10" />
            </motion.div>
        </div>
        
        {/* Secțiunea Carusel nou adăugată */}
        <section className="py-10">
            <EmployeeCarousel />
        </section>

        {/* Secțiunea nou adăugată cu robot și text */}
        <section className="py-12 md:py-20 flex flex-col items-center justify-center px-4">
            <motion.div
                className="relative w-full max-w-lg md:max-w-xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {/* Efect de fade sus */}
                <div className="absolute top-0 left-0 w-full h-24 md:h-32 bg-gradient-to-b from-black to-transparent z-10" />

                <Image
                    src="/early_acces/romania.avif"
                    alt="Robot AI Timpia"
                    width={1024}
                    height={768}
                    className="rounded-xl"
                    data-ai-hint="friendly robot mascot"
                />

                {/* Efect de fade jos */}
                <div className="absolute bottom-0 left-0 w-full h-24 md:h-32 bg-gradient-to-t from-black to-transparent z-10" />
            </motion.div>

            <motion.div
                className="text-center max-w-md md:max-w-xl mx-auto -mt-16 md:-mt-24 relative z-20"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            >
                 <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-tight">
                     Timpia.ro, primii angajați AI din România personalizați și creați special pentru compania ta, făcând munca o distracție
                </h2>
                 <p className="mt-4 text-base text-white/70">
                    Absolvenții oricărei universități
                </p>
            </motion.div>
        </section>
    </div>
  );
}
