
// src/components/snpad/home-page.tsx
"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { MessageCircleQuestion, BarChart, FileText } from "lucide-react";
import React from 'react';
import { GlassmorphismCard } from "@/components/ui/glassmorphism-card";
import { cn } from "@/lib/utils";

interface HomePageProps {
    onActionClick: (id: string, text: string) => void;
}

const pageTransitionVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      filter: "blur(8px)",
      clipPath: direction > 0 ? "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)" : "polygon(0 0, 0 0, 0 100%, 0 100%)"
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      filter: "blur(8px)",
      clipPath: direction < 0 ? "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)" : "polygon(0 0, 0 0, 0 100%, 0 100%)",
      transition: { duration: 0.4, ease: [0.65, 0, 0.35, 1] }
    })
};


const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" }}
}

const cardContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 }}
}

const cardVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 120, damping: 20 }}
}

const ParallaxCard = ({ card, onActionClick }: { card: typeof homeCards[0], onActionClick: HomePageProps['onActionClick']}) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-100, 100], [8, -8]);
    const rotateY = useTransform(x, [-100, 100], [-8, 8]);

    function handleMouse(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set(event.clientX - rect.left - rect.width / 2);
        y.set(event.clientY - rect.top - rect.height / 2);
    }
    
    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }
    
    return (
         <motion.div
            className="w-full" 
            variants={cardVariants}
            onMouseMove={handleMouse}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: "800px" }}
        >
            <GlassmorphismCard
                className="w-full text-left"
                style={{
                    rotateX: rotateX as any,
                    rotateY: rotateY as any,
                }}
                as={motion.button}
                onClick={() => onActionClick(card.id, card.text)} 
                whileHover={{
                    boxShadow: "0 0 20px hsla(var(--primary) / 0.3)",
                    transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.98 }}
            >
                <div className="p-4 flex items-center gap-4 text-foreground">
                    <card.icon className="h-6 w-6 text-primary shrink-0" />
                    <div>
                        <h3 className="font-semibold text-foreground">{card.title}</h3>
                        <p className="text-sm text-muted-foreground">{card.text}</p>
                    </div>
                </div>
            </GlassmorphismCard>
        </motion.div>
    );
};


const homeCards = [
    { id: "consult", title: "Întreabă despre Instalare", icon: MessageCircleQuestion, text: "Cum conectez TV-ul la telefon?" },
    { id: "prices", title: "Planuri de Recompensare", icon: BarChart, text: "Cum câștig mai mult?" },
    { id: "docs", title: "Documentație Tehnică", icon: FileText, text: "Care este codul de invitație?" }
];

export default function HomePage({ onActionClick }: HomePageProps) {
    return (
        <motion.div 
            variants={pageTransitionVariants} 
            custom={-1} 
            initial="enter" 
            animate="center" 
            exit="exit" 
            className="page-container"
        >
            <motion.div variants={headerVariants} className="text-center">
                <img src="https://imgur.com/tyCSEnU.png" alt="SNPAd Logo" className="mx-auto h-12 w-12 rounded-lg drop-shadow-[0_0_15px_hsl(var(--primary)_/_0.5)]" data-ai-hint="abstract logo" />
                <h2 className="text-3xl font-bold mt-3 text-foreground">Bun venit!</h2>
                <p className="text-lg text-muted-foreground mt-1">Sunt asistentul tău virtual SNPad.</p>
            </motion.div>
            <motion.div 
                className="flex-grow flex flex-col justify-center gap-4 mt-6"
                variants={cardContainerVariants}
            >
                {homeCards.map((card) => (
                    <ParallaxCard key={card.id} card={card} onActionClick={onActionClick} />
                ))}
            </motion.div>
        </motion.div>
    );
};
