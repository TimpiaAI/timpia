// src/components/about-us-content.tsx
"use client";

import { motion } from 'framer-motion';
import { ExternalLink, Handshake, Lightbulb, ShieldCheck, Zap, Sparkles, Code, Check } from 'lucide-react';
import React from 'react';
import Link from 'next/link';

import TestimonialsSection from '@/components/testimonials-section';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { Button } from '@/components/ui/button';
import { GradualSpacing } from '@/components/ui/gradual-spacing';
import { clientShowcaseData } from '@/lib/client-showcase-data';
import { ClientShowcase } from '@/components/client-showcase';
import { VelocityScroll } from '@/components/ui/scroll-based-velocity';
import TeamMemberCard from './team-member-card';


const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.95 },
  visible: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } },
};

const valuesData = [
    {
        icon: Lightbulb,
        title: "Inovație Continuă",
        description: "Explorăm constant noi tehnologii pentru a oferi soluții AI de avangardă, eficiente și etice."
    },
    {
        icon: Handshake,
        title: "Parteneriat Real",
        description: "Construim relații pe termen lung, bazate pe încredere și suport dedicat, pentru succesul comun."
    },
    {
        icon: ShieldCheck,
        title: "Transparență Totală",
        description: "Comunicăm deschis despre procese, costuri și capabilități, asigurând o colaborare onestă."
    }
];

const teamData = [
    {
        name: "Pică Ovidiu",
        title: "Fondator & Expert AI",
        imageUrl: "https://i.imgur.com/2c0zUp6.png",
        imageHint: "male portrait",
        theme: 'primary' as const,
    },
    {
        name: "Neacșu Rada",
        title: "Administrator & Partener Strategic",
        imageUrl: "https://i.imgur.com/pza3THk.png",
        imageHint: "female portrait",
        theme: 'accent' as const,
    }
];


// Final CTA Component redesigned with glassmorphism
const FinalCtaSection = () => {
    const scrollToContactForm = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
        e.preventDefault();
        const contactSection = document.getElementById('request-quote');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.location.href = '/#request-quote';
        }
    };
    
    const ctaContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.3 }
        }
    };

    const ctaItemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 100, damping: 15 }
        }
    };

    return (
        <section className="py-20 md:py-24 relative overflow-hidden">
             <div className="container mx-auto relative z-10">
                 <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={ctaContainerVariants}
                 >
                    <GlassmorphismCard className="w-full max-w-4xl mx-auto">
                        <div className="p-8 md:p-12 text-center text-white">
                            <motion.h2
                                className="font-bold text-3xl md:text-4xl tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300"
                                variants={ctaItemVariants}
                            >
                               Sunteți gata să vă scalați afacerea?
                            </motion.h2>

                             <motion.p
                                className="text-white/70 mb-8 max-w-xl mx-auto text-lg"
                                variants={ctaItemVariants}
                             >
                                 Contactează-ne pentru o discuție personalizată despre cum Timpia AI vă poate ajuta să atingeți obiectivele de business.
                             </motion.p>
                             <motion.div variants={ctaItemVariants}>
                                 <Button
                                     size="lg"
                                     asChild
                                     className="group bg-white text-black hover:bg-gray-200 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 relative"
                                 >
                                     <button onClick={scrollToContactForm}>
                                         <span className="relative z-10 flex items-center">
                                             Solicită Ofertă Gratuită <Zap className="ml-2.5 h-5 w-5 text-purple-600" />
                                         </span>
                                     </button>
                                 </Button>
                             </motion.div>
                        </div>
                    </GlassmorphismCard>
                 </motion.div>
             </div>
        </section>
    );
};



export default function AboutUsContent() {
    
    return (
        <div className="overflow-x-clip">
            <section id="about-us-content" className="relative py-20 md:py-28 bg-gradient-to-b from-background to-secondary/20 dark:from-background dark:to-black/20 section-divider">
                <div className="absolute inset-0 z-0 pointer-events-none opacity-20 dark:opacity-10">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                <motion.div
                    className="container mx-auto text-center relative z-10"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={containerVariants}
                >
                     <motion.div
                        className="mb-4"
                        variants={itemVariants}
                    >
                         <GradualSpacing
                            text="Noi Suntem Timpia AI"
                            className="font-bold text-4xl md:text-5xl lg:text-6xl text-foreground tracking-tight"
                            highlightWords={[
                                { word: "Timpia AI", className: "text-primary" }
                            ]}
                            framerProps={{
                                hidden: { opacity: 0, x: -10 },
                                visible: { opacity: 1, x: 0 },
                            }}
                            delayMultiple={0.05}
                            duration={0.3}
                        />
                    </motion.div>

                    <motion.p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-16 md:mb-24" variants={itemVariants}>
                        Suntem o echipă de tineri antreprenori pasionați, dedicați să aducem inovație, transparență și rezultate reale în fiecare parteneriat.
                    </motion.p>
                    
                    {/* Team Section */}
                    <motion.div 
                        className="max-w-5xl mx-auto"
                        variants={itemVariants}
                     >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center justify-center">
                            {teamData.map((member, index) => (
                                <TeamMemberCard 
                                    key={index}
                                    name={member.name}
                                    title={member.title}
                                    imageUrl={member.imageUrl}
                                    imageHint={member.imageHint}
                                    theme={member.theme}
                                />
                            ))}
                        </div>
                    </motion.div>


                    {/* Mission & Values Section */}
                    <motion.div 
                        className="mt-20 md:mt-32 max-w-5xl mx-auto"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={containerVariants}
                    >
                        <motion.h2 className="text-3xl md:text-4xl font-bold mb-4" variants={itemVariants}>
                            Misiunea și Valorile Noastre
                        </motion.h2>
                        <motion.p className="text-lg md:text-xl text-muted-foreground mb-12" variants={itemVariants}>
                            Democratizăm accesul la soluții AI avansate, oferind companiilor unelte transparente, etice și eficiente pentru a concura pe piața globală.
                        </motion.p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                            {valuesData.map((value, index) => {
                                const Icon = value.icon;
                                return (
                                    <motion.div
                                        key={value.title}
                                        variants={itemVariants}
                                        whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300 } }}
                                    >
                                        <GlassmorphismCard>
                                             <div className="relative h-full flex flex-col items-center text-center p-6 text-white">
                                                <div className="p-3 mb-4 rounded-full bg-white/10 border border-white/20">
                                                    <Icon className="h-8 w-8 text-purple-300"/>
                                                </div>
                                                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                                                <p className="text-sm text-white/70">{value.description}</p>
                                            </div>
                                        </GlassmorphismCard>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </motion.div>
            </section>
            
             <section className="py-16 md:py-24">
                <VelocityScroll 
                    text="Povești de Succes ale Clienților" 
                    default_velocity={2} 
                    className="font-bold text-3xl md:text-5xl text-foreground/80 dark:text-white/80 tracking-tighter" 
                />
            </section>

            <ClientShowcase clients={clientShowcaseData} />

            <TestimonialsSection />

            <FinalCtaSection />
        </div>
    );
}