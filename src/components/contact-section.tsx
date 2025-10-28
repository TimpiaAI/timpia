// src/components/contact-section.tsx
"use client";

import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import ElegantCalendar from './elegant-calendar'; // Ensure this component exists
import { Sparkles } from '@/components/ui/sparkles'; // Import the Sparkles component

interface ContactSectionProps {
    heading?: string;
    subheading?: string;
}

export default function ContactSection({ heading, subheading }: ContactSectionProps) {
    return (
        <footer id="contact-section" className="relative w-full pb-12 md:pb-20 bg-black text-foreground overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Sparkles
                    background="transparent"
                    minSize={0.4}
                    maxSize={1.2}
                    particleDensity={30}
                    className="w-full h-full"
                    particleColor="#FFFFFF"
                    opacity={0.8}
                />
            </div>
            <div className="container mx-auto relative z-10 flex flex-col items-center">
                
                <div 
                    className="text-center mb-10"
                >
                    {heading && (
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="text-2xl md:text-3xl font-semibold text-white"
                        >
                            {heading}
                        </motion.h2>
                    )}
                    {subheading && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                            className="mt-4 text-base text-white/70 max-w-2xl mx-auto"
                        >
                            {subheading}
                        </motion.p>
                    )}
                </div>

                <div 
                    className="w-full max-w-lg mx-auto"
                >
                    <ElegantCalendar />
                </div>
            </div>
        </footer>
    );
}
