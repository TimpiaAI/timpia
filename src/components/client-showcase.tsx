
"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import type { ClientShowcaseItem } from "@/lib/client-showcase-data";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-is-mobile";

// Updated ShowcaseImageContainer to handle both images and videos
const ShowcaseImageContainer = ({ item }: { item: ClientShowcaseItem }) => {
    // Check if the src is a YouTube embed link
    const isVideo = item.imageSrc.includes("youtube.com/embed");

    return (
        <motion.div
            className="relative h-full w-full overflow-hidden rounded-xl group"
        >
            {isVideo ? (
                <iframe
                    src={`${item.imageSrc}?autoplay=1&mute=1&loop=1&playlist=${item.imageSrc.split('/').pop()?.split('?')[0]}&controls=0&showinfo=0&rel=0`}
                    title={item.clientName}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full object-contain object-center"
                ></iframe>
            ) : (
                <Image
                    src={item.imageSrc}
                    alt={item.clientName}
                    fill
                    draggable={false}
                    className="object-contain object-center transition-transform duration-300 group-hover:scale-105"
                    sizes="(min-width: 1024px) 24vw, 80vw"
                    data-ai-hint={item.imageHint}
                />
            )}
        </motion.div>
    );
};


interface ClientShowcaseProps {
    clients: ClientShowcaseItem[];
}

export function ClientShowcase({ clients }: ClientShowcaseProps) {
    const [active, setActive] = useState(0);
    const showcaseRef = useRef(null);
    const isInView = useInView(showcaseRef, { once: true, amount: 0.2 });

    const handleNext = useCallback(() => {
        setActive((prev) => (prev + 1) % clients.length);
    }, [clients.length]);

    const handlePrev = () => {
        setActive((prev) => (prev - 1 + clients.length) % clients.length);
    };

    const currentClient = clients[active];

    const textVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1], // easeOutExpo
                staggerChildren: 0.2,
            },
        },
    };

    const childVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
    };


    return (
        <motion.div 
            ref={showcaseRef}
            className="w-full mx-auto antialiased font-sans py-12 md:py-20 overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            <motion.div 
                className="container relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center min-h-[550px]"
                variants={childVariants}
            >
                {/* Image Showcase */}
                <div className="relative w-full aspect-[1/1] max-w-xl mx-auto overflow-hidden group">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active}
                            initial={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.15}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipeThreshold = 50;
                                if (offset.x < -swipeThreshold) {
                                    handleNext();
                                } else if (offset.x > swipeThreshold) {
                                    handlePrev();
                                }
                            }}
                            className="absolute inset-0 cursor-grab active:cursor-grabbing"
                        >
                            <ShowcaseImageContainer
                                item={currentClient}
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Text Content */}
                <div className="flex justify-between flex-col py-4 w-full text-center lg:text-left h-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active}
                            variants={textVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <p className="text-sm font-semibold text-primary mb-2">
                                {currentClient.industry}
                            </p>
                            <h3 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
                                {currentClient.clientName}
                            </h3>
                            <motion.p className="text-muted-foreground leading-relaxed min-h-[70px] md:min-h-[100px]">
                                {currentClient.description.split(" ").map((word, index) => (
                                    <motion.span
                                        key={index}
                                        initial={{ filter: "blur(8px)", opacity: 0 }}
                                        animate={{ filter: "blur(0px)", opacity: 1 }}
                                        transition={{ duration: 0.25, delay: 0.03 * index }}
                                        className="inline-block"
                                    >
                                        {word}&nbsp;
                                    </motion.span>
                                ))}
                            </motion.p>

                             {currentClient.results && currentClient.results.length > 0 && (
                                <motion.div 
                                    className="mt-4 pt-4 border-t border-border/20"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
                                >
                                    <p className="text-sm font-semibold text-foreground mb-3">Rezultate Cheie:</p>
                                    <div className="grid grid-cols-2 gap-4 text-left">
                                        {currentClient.results.map((result, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <result.icon className={`h-8 w-8 shrink-0 ${result.color}`} />
                                                <div>
                                                    <p className={`text-2xl font-bold ${result.color}`}>{result.value}</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">{result.text}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Controls */}
                    <div className="flex gap-3 pt-8 justify-center lg:justify-start">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handlePrev}
                            className="h-12 w-12 rounded-full"
                            aria-label="Previous client"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleNext}
                            className="h-12 w-12 rounded-full"
                            aria-label="Next client"
                        >
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                        {currentClient.link && currentClient.link !== "#" && (
                            <Button
                                asChild
                                size="lg"
                                className="h-12 flex-1 max-w-xs group bg-gradient-to-r from-primary to-purple-600 text-primary-foreground hover:shadow-lg"
                            >
                                <a href={currentClient.link} target="_blank" rel="noopener noreferrer">
                                    Vezi Proiectul
                                    <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
