// src/components/marketing-expert-section.tsx
"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Target, Lightbulb, Filter, TrendingUp, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import avaImage from '@/early_acces/ava.avif';
import { Button } from './ui/button';

const capabilityIcons = [Target, Lightbulb, TrendingUp, Filter];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
};

const imageVariants = {
    initial: { y: 0 },
    animate: {
        y: [-5, 5, -5],
        transition: {
            duration: 8,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror"
        }
    }
}


interface MarketingExpertSectionProps {
  heading: string;
  subtitle: string;
  items: string[];
  ctaLabel: string;
}

export default function MarketingExpertSection({
  heading,
  subtitle,
  items,
  ctaLabel,
}: MarketingExpertSectionProps) {
    const scrollToContactForm = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
        e.preventDefault();
        const contactSection = document.getElementById('contact-section');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.location.href = '/#contact-section';
        }
    };

    return (
        <section className="relative py-12 md:py-16 bg-black text-white overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black to-transparent z-20 pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />

            <motion.div 
                className="container mx-auto"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={containerVariants}
            >
                {/* Title and Subtitle for Mobile View */}
                <div className="text-center lg:hidden mb-8">
                     <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        {heading}
                    </h2>
                    <p className="text-lg text-white/70 max-w-xl mx-auto">
                        {subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side - Image */}
                    <motion.div 
                        className="relative flex justify-center lg:justify-start"
                        variants={itemVariants}
                    >
                        <motion.div
                           variants={imageVariants}
                           initial="initial"
                           animate="animate"
                           className="relative w-full max-w-md"
                        >
                             <Image
                                src={avaImage}
                                alt="Ava - AI Marketing Manager"
                                width={1080}
                                height={1920}
                                className="relative rounded-2xl w-full h-auto"
                                sizes="(min-width: 1024px) 28rem, 90vw"
                                data-ai-hint="female robot marketing"
                                priority
                            />
                            {/* Pronounced blur effect at the bottom */}
                            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent pointer-events-none z-10"></div>
                        </motion.div>
                    </motion.div>

                    {/* Right Side - Content */}
                    <motion.div 
                        className="flex flex-col"
                        variants={itemVariants}
                    >
                        {/* Title and Subtitle for Desktop View */}
                        <div className="hidden lg:block text-center">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                {heading}
                            </h2>
                            <p className="text-lg text-white/70 mx-auto">
                                {subtitle}
                            </p>
                        </div>
                        
                         <div className="relative w-full mx-auto lg:mx-0 mt-8">
                             <div className="space-y-4 text-left">
                                {items.map((text, index) => {
                                    const Icon = capabilityIcons[index % capabilityIcons.length];
                                    return (
                                    <motion.div
                                        key={index}
                                        className="flex items-start gap-4 bg-black/30 p-4 rounded-3xl border border-gray-800"
                                        variants={itemVariants}
                                    >
                                        <Icon className="h-6 w-6 text-primary mt-0.5 shrink-0" />
                                        <span className="text-base text-white/80">{text}</span>
                                    </motion.div>
                                )})}
                            </div>
                             <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
                        </div>
                        
                        <div className="mt-4 text-center w-full">
                             <Button asChild variant="link" className="group text-white/70 hover:text-white transition-all w-auto text-base" onClick={(e) => scrollToContactForm(e)}>
                                 <Link href="#contact-section">
                                    {ctaLabel}
                                     <ChevronDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
