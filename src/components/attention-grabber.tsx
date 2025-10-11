
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MessageSquare } from 'lucide-react';
import { usePathname } from 'next/navigation';

const SESSION_STORAGE_KEY = 'timpia_chat_callout_shown';

interface AttentionGrabberProps {
    onClick: () => void;
}

// Contextual & Randomized prompts based on URL hash for single-page app structure
const proactivePrompts = {
    '/#solutii-section': [
        "Curios despre angajații noștri AI?",
        "Pot oferi detalii despre soluții?",
    ],
    '/#faq-section': [
        "Ai întrebări despre tehnologie?",
        "Pot clarifica ceva pentru tine?",
    ],
    '/#contact-section': [
        "Gata să programezi un demo?",
        "Ai nevoie de ajutor cu formularul?",
    ],
    default: [
        "Ai nevoie de ajutor?",
        "Pot să te ajut cu ceva?",
        "Ai o întrebare rapidă?",
    ],
};

const AttentionGrabber = ({ onClick }: AttentionGrabberProps) => {
    const [showCallout, setShowCallout] = useState(false);
    const [promptText, setPromptText] = useState("Ai nevoie de ajutor?");
    const pathname = usePathname();
    const [hash, setHash] = useState('');

    useEffect(() => {
        // Function to update hash based on scroll position
        const handleScroll = () => {
            const sections = document.querySelectorAll('section[id]');
            let currentSectionId = '';
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                    currentSectionId = `#${section.id}`;
                }
            });
            setHash(currentSectionId);
        };
        
        // Also handle hash changes from URL
        const handleHashChange = () => {
            setHash(window.location.hash);
        };

        // Set initial hash
        handleHashChange();
        
        window.addEventListener('hashchange', handleHashChange);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const hasBeenShown = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (hasBeenShown) {
            return;
        }

        const timer = setTimeout(() => {
            const currentHash = hash || (window.location.hash);
            const pathKey = (currentHash in proactivePrompts) ? currentHash as keyof typeof proactivePrompts : 'default';
            const prompts = proactivePrompts[pathKey];
            const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
            setPromptText(randomPrompt);
            setShowCallout(true);
            try {
                sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
            } catch (error) {
                console.warn("Could not write to sessionStorage:", error);
            }
        }, 8000); // 8 seconds delay

        return () => clearTimeout(timer);
    }, [hash, pathname]);

    const handleButtonClick = () => {
        if (showCallout) {
            setShowCallout(false);
        }
        onClick();
    };

    const calloutVariants = {
        hidden: { opacity: 0, x: 10, scale: 0.9 },
        visible: { opacity: 1, x: 0, scale: 1 },
        exit: { opacity: 0, x: 10, scale: 0.9 }
    };
    
    return (
        <div className="relative">
            <AnimatePresence>
                {showCallout && (
                    <motion.div
                        variants={calloutVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ type: "spring", stiffness: 150, damping: 20 }}
                        className="absolute right-full bottom-1/2 translate-y-1/2 mr-4 w-max pointer-events-none"
                    >
                        <div className="relative bg-background/80 backdrop-blur-md text-sm font-semibold px-4 py-2 rounded-xl shadow-lg border border-primary/30 text-foreground">
                            {promptText}
                            <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-l-8 border-l-background/80" style={{ filter: 'blur(0.5px)' }}/>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <motion.div
                whileHover={{ scale: 1.1 }}
                className="relative"
            >
                <motion.div
                    className="absolute -inset-1.5 bg-gradient-to-r from-primary/50 to-purple-600/50 rounded-full blur-lg opacity-60"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.4, 0.7, 0.4],
                    }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                    }}
                />
                <Button
                    onClick={handleButtonClick}
                     className={cn(
                        "relative z-10 group h-16 w-16 rounded-full p-0 shadow-lg text-primary-foreground",
                        "bg-primary hover:bg-primary/90",
                        "transition-all duration-300 ease-out hover:shadow-xl hover:shadow-primary/30"
                     )}
                    aria-label="Deschide chat"
                >
                     <motion.div
                        animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                     >
                        <MessageSquare className="h-8 w-8" />
                     </motion.div>
                </Button>
            </motion.div>
        </div>
    );
};
AttentionGrabber.displayName = "AttentionGrabber";

export default AttentionGrabber;
