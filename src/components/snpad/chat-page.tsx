
// src/components/snpad/chat-page.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message } from "@/components/snpad-chatbot";
import { User, Bot } from "lucide-react";

interface ChatPageProps {
    messages: Message[];
    isLoading: boolean;
}

const pageVariants = {
    hidden: { opacity: 0, scale: 0.98, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 25 } },
    exit: { opacity: 0, scale: 0.98, y: -10, transition: { type: "spring", stiffness: 260, damping: 25, duration: 0.2 } },
};
  
const messageVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, type: "spring", stiffness: 150, damping: 15 }},
};

const ThinkingIndicator = () => (
    <motion.div 
        key="thinking-indicator" 
        initial={{ opacity: 0, y: 10, scale: 0.9 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.9 }} 
        className="flex flex-col items-center justify-center p-4"
    >
       <div className="relative w-20 h-20">
            <motion.div 
                className="absolute inset-0 bg-primary/20 rounded-full blur-xl" 
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }} 
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }} 
            />
            <motion.div className="absolute inset-2 bg-primary/10 rounded-full border-2 border-primary/30" />
            {[...Array(3)].map((_, i) => (
                <motion.div 
                    key={i} 
                    className="absolute inset-0" 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 4 + i * 2, repeat: Infinity, ease: 'linear', delay: i * 0.3 }}
                >
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_hsl(var(--primary))]`}/>
                </motion.div>
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
                <Bot className="h-8 w-8 text-primary" />
            </div>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4">Analizez cererea...</p>
    </motion.div>
);

export default function ChatPage({ messages, isLoading }: ChatPageProps) {
    const viewportRef = useRef<HTMLDivElement>(null);
    useEffect(() => { const vp = viewportRef.current; if (!vp) return; requestAnimationFrame(() => { const scrollContainer = vp.querySelector('div'); if (scrollContainer) { vp.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' }); } }); }, [messages, isLoading]);
    
    return (
        <motion.div variants={pageVariants} initial="hidden" animate="visible" exit="exit" className="page-container chat-page-container">
            <div className="flex-grow p-4 overflow-y-auto" ref={viewportRef}>
                <AnimatePresence>
                    <motion.div layout className="space-y-4">
                        {messages.map((msg) => (
                            <motion.div 
                                key={msg.id} 
                                layout="position" 
                                variants={messageVariants} 
                                initial="hidden" 
                                animate="visible" 
                                className={`flex items-start gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                                {msg.sender === "bot" && <div className="bot-message-glow" />}
                                <div className={`relative prose prose-sm dark:prose-invert prose-p:my-0 max-w-[85%] rounded-2xl px-4 py-2.5 shadow-md leading-relaxed ${msg.sender === "user" ? "bg-primary text-white rounded-br-lg" : "bg-muted text-foreground rounded-bl-lg"}`}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                                </div>
                                {msg.sender === "user" && <User className="h-6 w-6 text-muted-foreground mt-1 shrink-0 p-1 bg-muted rounded-full" />}
                            </motion.div>
                        ))}
                        {isLoading && <ThinkingIndicator />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
};
