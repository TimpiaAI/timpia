
// src/components/snpad/help-page.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Phone, ChevronDown } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import React from "react";
import { GlassmorphismCard } from "@/components/ui/glassmorphism-card";
import { cn } from "@/lib/utils";

interface HelpPageProps {
    handleSendMessage: (text: string) => void;
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


const faqData = [
  { q: "Ce este SNPad și cum funcționează?", a: "SNPad este o aplicație care te recompensează cu tokenuri SNP pentru vizionarea de reclame pe Smart TV. Instalezi aplicația, conectezi TV-ul la telefon și începi să câștigi." },
  { q: "Am nevoie de cod de invitație?", a: "**Da, introducerea codului de invitație `EAOMCNHT` este obligatorie** pentru a crea un cont și a folosi aplicația." },
  { q: "Ce TV-uri sunt compatibile?", a: "Sunt compatibile televizoarele **Samsung din 2019+** (doar în România) și **LG din 2016+** (România și Europa)." },
  { q: "Cum pot folosi tokenurile SNP câștigate?", a: "La finalul lunii, tokenurile se convertesc automat în bani reali, pe care îi poți cheltui folosind un card pe care îl vei primi." },
];

const faqListVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } }
};
const faqItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 150, damping: 20 } }
};

const FaqItem = ({ faq, handleSendMessage }: { faq: typeof faqData[0], handleSendMessage: (text: string) => void; }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <motion.div className="w-full" variants={faqItemVariants}>
            <GlassmorphismCard
              className={cn(
                "hover:border-primary/50 transition-all duration-300",
                isOpen ? "border-primary/50" : "border-white/20"
              )}
            >
                <div className="p-1">
                    <motion.button
                        className="w-full text-sm text-left text-foreground list-none p-3 font-semibold group-hover:text-primary transition-colors cursor-pointer flex justify-between items-center"
                        onClick={() => setIsOpen(!isOpen)}
                        whileTap={{ scale: 0.98 }}
                    >
                        {faq.q}
                        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="transform transition-transform duration-300">
                            <ChevronDown size={16} />
                        </motion.div>
                    </motion.button>
                    <AnimatePresence initial={false}>
                        {isOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className="overflow-hidden"
                            >
                                <div className="px-4 pb-4 text-muted-foreground text-sm leading-relaxed help-page-content">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                                        strong: ({node, ...props}) => <strong className="font-semibold text-primary" {...props} />
                                    }}>{faq.a}</ReactMarkdown>
                                    <button className="h-auto p-0 mt-2 text-primary hover:text-primary/80 font-semibold" onClick={() => handleSendMessage(faq.q)}>Întreabă AI-ul despre asta</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </GlassmorphismCard>
        </motion.div>
    );
}

export default function HelpPage({ handleSendMessage }: HelpPageProps) {
    return (
        <motion.div 
            variants={pageTransitionVariants} 
            custom={1}
            initial="enter" 
            animate="center" 
            exit="exit" 
            className="page-container"
        >
            <h2 className="text-2xl font-bold mb-4 text-foreground">Întrebări Frecvente</h2>
            <div className="flex-grow overflow-y-auto -mx-6 px-6">
                <motion.div className="w-full space-y-2" variants={faqListVariants} initial="hidden" animate="visible">
                    {faqData.map((faq, index) => (
                        <FaqItem key={index} faq={faq} handleSendMessage={handleSendMessage} />
                    ))}
                </motion.div>
            </div>
            <div className="mt-6 pt-4 border-t border-border text-center">
                <p className="text-sm text-muted-foreground mb-2">Nu ai găsit ce căutai?</p>
                <div className="flex items-center justify-center gap-3">
                    <button className="flex items-center justify-center gap-2 h-10 px-4 py-2 bg-transparent border border-input text-foreground hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium transition-colors" onClick={() => window.open('tel:0700123456')}>
                        <Phone className="mr-2 h-4 w-4"/> Sună un agent
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
