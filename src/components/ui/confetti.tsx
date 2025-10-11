// src/components/ui/confetti.tsx
"use client";

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const colors = ["#8A2BE2", "#4B0082", "#9370DB", "#BA55D3", "#8A2BE2", "#FFFFFF"];

interface Piece {
    id: number;
    x: number;
    y: number;
    initialAngle: number;
    radius: number;
    color: string;
    duration: number;
}

const ConfettiPiece = ({ id, x, y, initialAngle, radius, color, duration }: Piece) => {
    return (
        <motion.div
            className="absolute"
            initial={{
                x: 0,
                y: 0,
                opacity: 1,
            }}
            style={{
                top: '50%',
                left: '50%',
                width: '8px',
                height: '16px',
                backgroundColor: color,
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            }}
            animate={{
                x: Math.cos(initialAngle) * radius,
                y: Math.sin(initialAngle) * radius,
                rotate: 360 + Math.random() * 360,
                opacity: 0,
            }}
            transition={{
                duration: duration,
                ease: "easeOut",
            }}
        />
    );
};

const Confetti = () => {
    const [pieces, setPieces] = useState<Piece[]>([]);
    const [isVisible, setIsVisible] = useState(false);

    const generatePieces = useCallback(() => {
        return Array.from({ length: 150 }).map((_, i) => ({
            id: i,
            x: 0, // x and y start at 0, relative to center
            y: 0,
            initialAngle: (Math.random() * 2 * Math.PI), // Full circle
            radius: 100 + Math.random() * (Math.min(window.innerWidth, window.innerHeight) / 1.5), // Explode outwards
            color: colors[i % colors.length],
            duration: 1.5 + Math.random() * 2,
        }));
    }, []);
    
    useEffect(() => {
        // Ensure this effect runs only on the client
        const startTimer = setTimeout(() => {
            setIsVisible(true);
            setPieces(generatePieces());
        }, 800); // Delay explosion to sync with circle wipe

        const stopTimer = setTimeout(() => {
            setIsVisible(false);
        }, 4000); // End animation after 4 seconds

        return () => {
            clearTimeout(startTimer);
            clearTimeout(stopTimer);
        };
    }, [generatePieces]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[300] overflow-hidden">
            <AnimatePresence>
                {isVisible && pieces.map(piece => <ConfettiPiece key={piece.id} {...piece} />)}
            </AnimatePresence>
        </div>
    );
};

export default Confetti;
