// src/components/exit-intent-popup.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import ElegantCalendar from './elegant-calendar';
import Image from 'next/image';
import exitAvaImage from '@/early_acces/exit_ava.avif';

export default function ExitIntentPopup() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const hasBeenShown = sessionStorage.getItem('timpia_exit_intent_shown');

        if (hasBeenShown) {
            return; // Don't attach listener if already shown in this session
        }

        const handleMouseLeave = (e: MouseEvent) => {
            // Trigger if mouse leaves the top part of the viewport
            if (e.clientY <= 0) {
                setIsOpen(true);
                sessionStorage.setItem('timpia_exit_intent_shown', 'true');
                // Optional: remove listener after first trigger to be extra safe
                document.removeEventListener('mouseleave', handleMouseLeave);
            }
        };

        const attachListenerTimeout = setTimeout(() => {
            document.addEventListener('mouseleave', handleMouseLeave);
        }, 5000); // 5-second delay

        return () => {
            clearTimeout(attachListenerTimeout);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);


    if (!isOpen) {
        return null;
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Overlay with blur */}
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)} // Close on overlay click
                    />

                    {/* Modal Content */}
                    <motion.div
                        className="relative z-10 w-full max-w-md"
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                    >
                         <motion.div className="relative overflow-visible rounded-2xl border border-white/20 bg-black/70 backdrop-blur-md shadow-2xl">
                             <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-4 right-4 h-8 w-8 text-white/60 hover:text-white z-20"
                                onClick={() => setIsOpen(false)}
                                aria-label="Închide"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                            
                            <div className="px-4 pb-0 pt-8 relative">
                                <ElegantCalendar />
                            </div>
                            
                            {/* Robot Image Container at the bottom */}
                            <motion.div 
                                className="flex justify-center -translate-y-4"
                                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ type: "spring", stiffness: 180, damping: 15, delay: 0.3 }}
                            >
                                <div className="relative">
                                     <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none"/>
                                    <Image
                                        src={exitAvaImage}
                                        alt="Ava, the AI assistant"
                                        width={180}
                                        height={180}
                                        className=""
                                        data-ai-hint="sad angry robot"
                                    />
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
