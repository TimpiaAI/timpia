// src/components/team-member-card.tsx
"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import React from 'react';

interface TeamMemberCardProps {
    name: string;
    title: string;
    imageUrl: string;
    imageHint: string;
    theme: 'primary' | 'accent';
}

export default function TeamMemberCard({
    name,
    title,
    imageUrl,
    imageHint,
    theme
}: TeamMemberCardProps) {

    const themeClasses = {
        primary: {
            gradient: "from-primary/70 via-primary/30 to-transparent",
        },
        accent: {
            gradient: "from-purple-500/70 via-purple-500/30 to-transparent",
        }
    };

    const currentTheme = themeClasses[theme];

    return (
        <motion.div
            className="relative w-full aspect-[3/4] max-w-[300px] mx-auto group overflow-hidden rounded-2xl"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-cover grayscale transition-all duration-500 ease-in-out group-hover:grayscale-0"
                sizes="(min-width: 768px) 18rem, 70vw"
                data-ai-hint={imageHint}
            />
            <div className={cn(
                "absolute inset-0 bg-gradient-to-t to-transparent transition-all duration-500 ease-in-out",
                "from-black/90 via-black/50 group-hover:from-black/70 group-hover:via-black/30"
            )} />
             <div className={cn(
                "absolute inset-0 bg-gradient-to-t opacity-0 group-hover:opacity-60 transition-opacity duration-500",
                currentTheme.gradient
            )} />
            <div className="absolute bottom-0 left-0 p-4 md:p-5 w-full">
                <h3 className="text-xl md:text-2xl font-bold text-white">{name}</h3>
                <p className="text-sm md:text-base text-white/70">{title}</p>
            </div>
        </motion.div>
    );
}
