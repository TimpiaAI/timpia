// src/components/contact-section.tsx
"use client";

import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import ElegantCalendar from './elegant-calendar'; // Ensure this component exists
import { Sparkles } from '@/components/ui/sparkles'; // Import the Sparkles component

export default function ContactSection() {
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
                    {/* Textul a fost eliminat de aici */}
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
