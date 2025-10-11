// src/components/playbooks-carousel.tsx
"use client"

import * as React from "react"
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, GraduationCap, FileText, Users, Home, ArrowRight, BarChart, Clock, MessageSquare, Send, Mail, FileCheck, MessageCircle, Wifi, KeyRound, CheckCircle, Bot, Instagram, MessagesSquare, ChevronDown } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile";
import Autoplay from "embla-carousel-autoplay"
import { cn } from "@/lib/utils";
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card'; // Import the new card

// --- Individual Playbook Demo Components ---

export const ColdOutreachDemo = () => {
    const isMobile = useIsMobile();
    const particleCount = isMobile ? 4 : 8;
    const [particlePositions, setParticlePositions] = React.useState<string[]>([]);
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
        setIsClient(true);
        // Ensure this runs only on the client
        if (typeof window !== 'undefined') {
            setParticlePositions(
                Array.from({ length: particleCount }, () => `${Math.random() * 80 + 10}%`)
            );
        }
    }, [particleCount]);


    return (
        <motion.div
            className="h-20 w-full flex items-center justify-center space-x-2 overflow-hidden p-2 relative"
            initial="initial"
            whileHover="hover"
            animate="initial"
        >
            {isClient && !isMobile && (
                <motion.div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-full pointer-events-none"
                    variants={{
                        initial: { opacity: 0 },
                        hover: {
                            opacity: 1,
                            transition: { staggerChildren: 0.03, delayChildren: 0.1 }
                        }
                    }}
                >
                    {particlePositions.map((top, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 rounded-full bg-orange-500/50"
                            style={{ top }}
                            variants={{
                                initial: { x: '0%', opacity: 0 },
                                hover: {
                                    x: '100%',
                                    opacity: [0, 0.6, 0],
                                    transition: { duration: 0.6 + Math.random() * 0.4, ease: 'linear', delay: i * 0.05 }
                                }
                            }}
                        />
                    ))}
                </motion.div>
            )}

            <motion.div variants={{ initial: { x: -30, opacity: 0 }, hover: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 150, damping: 15, delay: 0.1 } } }}>
                <Mail className="h-7 w-7 text-orange-400" />
            </motion.div>
            <motion.div variants={{ initial: { scaleX: 0 }, hover: { scaleX: 1, transition: { delay: 0.2, duration: 0.4 } } }} className="w-6 h-0.5 bg-orange-500/50 rounded-full origin-left" />
            <motion.div variants={{ initial: { opacity: 0, scale: 0.5 }, hover: { opacity: 1, scale: 1, rotate: [0, 15, -10, 0], transition: { type: 'spring', stiffness: 180, damping: 12, delay: 0.4 } } }}>
                <Zap className="h-8 w-8 text-orange-400" />
            </motion.div>
            <motion.div variants={{ initial: { scaleX: 0 }, hover: { scaleX: 1, transition: { delay: 0.5, duration: 0.4 } } }} className="w-6 h-0.5 bg-orange-500/50 rounded-full origin-left" />
            <motion.div variants={{ initial: { x: 30, opacity: 0 }, hover: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 150, damping: 15, delay: 0.7 } } }}>
                <Send className="h-7 w-7 text-orange-400" />
            </motion.div>
        </motion.div>
    );
}

export const TrainingBotDemo = () => (
    <motion.div className="h-20 w-full flex flex-col items-center justify-center space-y-2 overflow-hidden p-2">
        <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
            className="flex items-center gap-1 text-xs bg-white/10 px-2 py-1 rounded-lg text-white/80 shadow-sm"
        >
            <Users className="h-3 w-3 text-blue-400" /> Cum accesez X?
        </motion.div>
        <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
            className="flex items-center gap-1 text-xs bg-blue-500/20 px-2 py-1 rounded-lg text-blue-300 font-medium shadow-sm"
        >
            <motion.div initial={{ scale: 1 }} animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}>
                <GraduationCap className="h-3 w-3" />
            </motion.div>
            Găsești info în documentul Y...
        </motion.div>
    </motion.div>
);

export const PlanGeneratorDemo = () => (
    <motion.div className="h-20 w-full flex items-center justify-center space-x-3 overflow-hidden p-2">
        <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, type: 'spring', stiffness: 150 }}>
            <FileText className="h-7 w-7 text-indigo-400" />
        </motion.div>
        <motion.div className="relative h-8 w-8">
            <motion.svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <motion.path
                    d="M 8 12 l 3 3 l 6 -6"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
                    className="text-indigo-400"
                />
            </motion.svg>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9, type: 'spring', stiffness: 150 }}>
            <FileCheck className="h-8 w-8 text-indigo-400" />
        </motion.div>
    </motion.div>
);

export const ClientOnboardingDemo = () => (
    <motion.div className="h-20 w-full flex items-center justify-center space-x-2 overflow-hidden p-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, type: 'spring', stiffness: 120 }}>
            <Users className="h-6 w-6 text-teal-400" />
        </motion.div>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 0.3 }} className="w-4 h-0.5 bg-teal-500/50 rounded-full origin-left" />
        <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, type: 'spring', stiffness: 120 }}>
            <FileText className="h-5 w-5 text-teal-400" />
        </motion.div>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.7, duration: 0.3 }} className="w-4 h-0.5 bg-teal-500/50 rounded-full origin-left" />
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9, type: 'spring', stiffness: 120 }}>
            <CheckCircle className="h-6 w-6 text-teal-400" />
        </motion.div>
    </motion.div>
);

export const AirbnbGuestBotDemo = () => (
    <motion.div className="h-20 w-full flex flex-col items-center justify-center space-y-1.5 overflow-hidden p-2">
        <motion.div
            initial={{ opacity: 0, x: 25, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
            className="flex items-center gap-1 text-xs bg-white/10 px-2 py-1 rounded-lg text-white/80 self-end shadow-sm"
        >
            Care e parola Wi-Fi? <Wifi className="h-3 w-3 text-rose-400" />
        </motion.div>
        <motion.div
            initial={{ opacity: 0, x: -25, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
            className="flex items-center gap-1 text-xs bg-rose-500/20 px-2 py-1 rounded-lg text-rose-300 font-medium self-start shadow-sm"
        >
            <KeyRound className="h-3 w-3" /> Parola este TimpiaGuest123!
        </motion.div>
    </motion.div>
);

export const RagChatbotMultiPlatformDemo = () => {
    const platforms = [
        { name: "WhatsApp", icon: MessagesSquare, color: "text-green-400", userBubble: "bg-green-600 text-white", botBubble: "bg-gray-700 text-white/90" },
        { name: "Instagram", icon: Instagram, color: "text-pink-400", userBubble: "bg-gradient-to-r from-pink-500 to-purple-500 text-white", botBubble: "bg-gray-700 text-white/90" },
        { name: "Telegram", icon: Send, color: "text-sky-400", userBubble: "bg-sky-500 text-white", botBubble: "bg-gray-700 text-white/90" },
    ];

    return (
        <div className="h-auto w-full flex flex-col md:flex-row items-stretch justify-around gap-3 p-2 overflow-hidden">
            {platforms.map((platform, idx) => (
                <motion.div
                    key={platform.name}
                    className={`flex-1 p-2 rounded-lg border border-white/20 bg-white/5 min-w-[100px] max-w-[150px] md:max-w-none`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + idx * 0.2, type: 'spring', stiffness: 100 }}
                >
                    <div className="flex items-center gap-1 mb-1.5">
                        <platform.icon className={`h-3.5 w-3.5 ${platform.color}`} />
                        <span className={`text-[10px] font-semibold ${platform.color}`}>{platform.name}</span>
                    </div>
                    <div className="space-y-1">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + idx * 0.2, duration: 0.3 }}
                            className={`text-[9px] p-1 rounded-md ${platform.userBubble} self-start max-w-[85%] ml-auto rounded-br-none`}
                        >
                            Întrebare client...
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + idx * 0.2, duration: 0.3 }}
                            className={`text-[9px] p-1 rounded-md ${platform.botBubble} self-end max-w-[85%] rounded-bl-none`}
                        >
                            Răspuns AI... <CheckCircle className="inline h-2.5 w-2.5 text-green-400 ml-0.5" />
                        </motion.div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};


// --- Playbook Data ---
const playbooks = [
  {
    slug: "rag-chatbot-omnichannel",
    title: "RAG Chatbot Omni-Channel",
    icon: Bot,
    demoComponent: RagChatbotMultiPlatformDemo,
    description: "AI inteligent ce răspunde pe WhatsApp, Instagram & Telegram, antrenat pe datele tale specifice.",
    impact: "Acoperire Multi-Platformă 24/7",
    kpiIcon: Wifi,
    color: "text-sky-400", 
    cta: "Descoperă Omni-Chat",
    isSpecial: true, 
  },
  {
    slug: "cold-outreach",
    title: "Cold Outreach AI",
    icon: Zap,
    demoComponent: ColdOutreachDemo,
    description: "Personalizează email-uri B2B la scară folosind date contextuale.",
    impact: "+317% CTR",
    kpiIcon: BarChart,
    color: "text-orange-400",
    cta: "Activează Outreach",
  },
  {
    slug: "training-bot",
    title: "Asistent Onboarding",
    icon: GraduationCap,
    demoComponent: TrainingBotDemo,
    description: "Răspunde instant la întrebări din documentația internă a angajaților.",
    impact: "-2 ore / angajat",
    kpiIcon: Clock,
     color: "text-blue-400",
     cta: "Activează Training",
  },
  {
    slug: "plan-generator",
    title: "Generator de Conținut",
    icon: FileText,
    demoComponent: PlanGeneratorDemo,
    description: "Creează draft-uri pentru articole, planuri sau postări social media.",
    impact: "Draft în 30 sec",
    kpiIcon: Clock,
     color: "text-indigo-400",
     cta: "Activează Generator",
  },
  {
    slug: "client-onboarding",
    title: "Onboarding Automatizat",
    icon: Users,
    demoComponent: ClientOnboardingDemo,
    description: "Colectează date, trimite contracte și notificări automat.",
    impact: "-80% fricțiune",
    kpiIcon: BarChart,
     color: "text-teal-400",
     cta: "Activează Onboarding",
  },
  {
    slug: "airbnb-guest-bot",
    title: "Asistent Oaspeți",
    icon: Home,
    demoComponent: AirbnbGuestBotDemo,
    description: "Răspunde la întrebări frecvente pe WhatsApp/Telegram.",
    impact: "-90% întrebări",
    kpiIcon: MessageSquare,
     color: "text-rose-400",
     cta: "Activează Asistent",
  },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.2, duration: 0.6, ease: "easeOut" } }
};

const itemVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: "spring", damping: 15, stiffness: 90 } }
};

export default function PlaybooksCarousel() {
  const [emblaApi, setEmblaApi] = React.useState<CarouselApi>()
  const [openPlaybookSlug, setOpenPlaybookSlug] = React.useState<string | null>(null);
  const isMobile = useIsMobile();
  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })
  )

  React.useEffect(() => {
    // When switching between mobile and desktop, reset the open state
    setOpenPlaybookSlug(null);
  }, [isMobile]);

  const scrollToContactForm = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault();
    const contactSection = document.getElementById('request-quote');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
        window.location.href = '/#request-quote';
    }
  };


  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/20 dark:from-background dark:to-gray-900/50 section-divider">
      <div className="container">
        <motion.h2
          className="text-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Descoperă Playbook-urile Noastre
        </motion.h2>
         <motion.p
           className="text-center mb-12 md:mb-16 text-lg text-muted-foreground max-w-2xl mx-auto"
           initial={{ opacity: 0, y: -10 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, amount: 0.5 }}
           transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
           >
             Soluții AI pre-antrenate pentru diverse scenarii de business, gata de implementare rapidă pentru rezultate imediate.
         </motion.p>

        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
         <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[autoplayPlugin.current]}
            setApi={setEmblaApi}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {playbooks.map((playbook, index) => {
                const isExpanded = isMobile && openPlaybookSlug === playbook.slug;
                
                const handleToggleExpand = (e: React.MouseEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpenPlaybookSlug(isExpanded ? null : playbook.slug);
                };

                return (
                <CarouselItem 
                    key={playbook.slug} 
                    className={`pl-4 
                        ${playbook.isSpecial 
                            ? 'md:basis-3/4 lg:basis-2/3 xl:basis-3/5' 
                            : 'md:basis-1/2 lg:basis-1/3'
                        }`
                    }
                >
                  <motion.div 
                    className="p-1 h-full" 
                    variants={itemVariants}
                    transition={playbook.isSpecial ? { type: "spring", damping: 12, stiffness: 80, delay: 0.1 * index } : { type: "spring", damping: 15, stiffness: 90, delay: 0.1 * index }}
                  >
                     <GlassmorphismCard 
                        className={cn(
                            `h-full flex flex-col group transition-all duration-300 ease-out`,
                            playbook.isSpecial ? "border-sky-400/50 ring-2 ring-sky-500/30" : "border-white/20",
                            !isMobile && 'cursor-pointer'
                        )}
                    >
                         <Link href={!isMobile ? "/#request-quote" : '#!'} onClick={!isMobile ? scrollToContactForm : (e) => e.preventDefault()} className="flex flex-col h-full text-white">
                           <div className={cn("items-start text-left p-6 border-b border-white/10 transition-colors duration-300", playbook.isSpecial ? "bg-gradient-to-br from-sky-500/20 via-transparent to-purple-600/15" : "bg-white/5")}>
                             <div className="flex justify-between items-start w-full mb-3">
                                <motion.div 
                                    className="p-3 rounded-full bg-black/30 border border-white/20 shadow-lg inline-block transition-transform duration-300 group-hover:scale-110 group-hover:shadow-primary/20"
                                    whileHover={{ rotate: playbook.isSpecial ? [0, 5, -5, 5, 0] : 0 }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                >
                                   <playbook.icon className={`h-7 w-7 ${playbook.color} ${playbook.isSpecial ? 'group-hover:animate-pulse-fast' : ''}`} strokeWidth={1.5}/>
                                </motion.div>
                                <div className={`flex items-center text-xs font-bold ${playbook.color} bg-black/40 border border-current/30 rounded-full px-3 py-1.5 shadow-sm`}>
                                    <playbook.kpiIcon className="h-4 w-4 mr-1.5" />
                                    {playbook.impact}
                                </div>
                             </div>
                              <h3 className={`text-xl font-semibold transition-colors ${playbook.isSpecial ? 'text-2xl text-sky-300 group-hover:text-sky-200' : 'group-hover:text-primary'}`}>{playbook.title}</h3>
                           </div>
                          <div className="p-6 flex-grow flex flex-col">
                             <p className={`text-white/70 text-sm leading-relaxed mb-4 ${playbook.isSpecial ? 'text-base' : ''}`}>{playbook.description}</p>
                             
                              <AnimatePresence initial={false}>
                                {(isExpanded || !isMobile) && (
                                  <motion.div
                                    key="demo-content"
                                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                    animate={{ height: "auto", opacity: 1, marginTop: isMobile ? "1rem" : "auto" }}
                                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    className="overflow-hidden"
                                  >
                                    <div className={`mt-auto border-t border-dashed ${playbook.isSpecial ? 'border-sky-500/30' : 'border-white/20'} pt-4 min-h-[90px] flex items-center justify-center`}>
                                      <playbook.demoComponent />
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                           </div>
                           <div 
                            className={cn(
                                "p-4 border-t mt-auto transition-colors",
                                playbook.isSpecial ? 'border-sky-500/20 bg-sky-900/20 group-hover:bg-sky-900/30' : 'border-white/10 bg-black/20 group-hover:bg-black/30'
                            )}
                            >
                             {isMobile ? (
                                <button
                                    className="w-full flex items-center justify-between text-sm font-medium text-primary"
                                    onClick={handleToggleExpand}
                                    aria-expanded={isExpanded}
                                >
                                    <span>{isExpanded ? "Închide Animația" : "Vezi Animația"}</span>
                                    <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                </button>
                            ) : (
                                <div className={`flex items-center justify-between w-full text-sm font-medium ${playbook.isSpecial ? 'text-sky-300 group-hover:text-sky-200' : 'text-primary'}`}>
                                    <span>{playbook.cta}</span>
                                    <Send className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                                </div>
                            )}
                           </div>
                         </Link>
                     </GlassmorphismCard>
                   </motion.div>
                </CarouselItem>
                )
              })}
            </CarouselContent>
            <CarouselPrevious className="ml-[-50px] hidden xl:inline-flex bg-background/70 border-border/50 hover:bg-accent" />
            <CarouselNext className="mr-[-50px] hidden xl:inline-flex bg-background/70 border-border/50 hover:bg-accent" />
          </Carousel>
        </motion.div>

         <motion.div
             className="text-center mt-12"
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true, amount: 0.5 }}
             transition={{ delay: 0.3, duration: 0.5 }}
            >
                <Button variant="outline" asChild>
                    <Link href="/servicii" className="group">
                        Vezi toate serviciile noastre
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </Button>
         </motion.div>

      </div>
    </section>
  )
}
