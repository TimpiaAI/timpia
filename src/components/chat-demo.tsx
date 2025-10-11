
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Sparkles, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface Product {
  name: string;
  imageUrl: string;
  dataAiHint: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  products?: Product[];
}

const ProductCard = ({ product }: { product: Product }) => (
  <div className="w-36 flex-shrink-0">
    <div className="overflow-hidden rounded-lg bg-background dark:bg-zinc-800 shadow-md border border-border/20 transition-all duration-300 hover:shadow-lg hover:border-primary/50">
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={144}
        height={144}
        className="h-28 w-full object-cover"
        data-ai-hint={product.dataAiHint}
      />
      <div className="p-2 text-center">
        <h4 className="truncate text-xs font-semibold text-foreground">{product.name}</h4>
        <div className="mt-2 text-xs h-7 w-full inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground">
          Vezi detalii
        </div>
      </div>
    </div>
  </div>
);


// Constante definite pentru lizibilitate și mentenanță
const SIMULATION_START_DELAY_MS = 500;
const SIMULATION_MESSAGE_INTERVAL_MS = 250;
const SIMULATION_LOOP_DELAY_MS = 5000; // Delay before restarting the simulation

// Funcție ajutătoare pentru a crea un delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Funcție ajutătoare pentru a crea obiecte Message
const createMessageObject = (text: string, sender: 'user' | 'bot', products?: Product[]): Message => ({
  id: crypto.randomUUID(),
  text,
  sender,
  products,
});

// Componenta Demo Chat Îmbunătățită
export default function ChatDemo() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const viewportRef = useRef<null | HTMLDivElement>(null);
  const isSimulatingRef = useRef(false);
  const key = useRef(0); // Add a key to force re-mount and re-run useEffect

  const simulateChat = useCallback(async () => {
    if (isSimulatingRef.current) return;
    isSimulatingRef.current = true;

    setIsBotTyping(false);
    setMessages([]);
    await sleep(SIMULATION_START_DELAY_MS);

    const conversationScript: Array<{
      sender: 'user' | 'bot',
      text: string,
      delay: number,
      typing?: boolean,
      products?: Product[]
    }> = [
      { sender: 'user', text: 'Nu știu ce să aleg, îmi place culoarea roz...', delay: 400 },
      { 
        sender: 'bot', 
        text: 'Iti recomand aceste produse 👇😊', 
        delay: 1500, 
        typing: true, 
        products: [
            { name: "Geantă Chic Roz", imageUrl: "https://i.imgur.com/M2GCuOE.png", dataAiHint: "pink handbag" },
            { name: "Pantofi Eleganți", imageUrl: "https://i.imgur.com/yAzGZpD.png", dataAiHint: "pink shoes" },
            
        ]
      },
    ];

    for (const msg of conversationScript) {
      if (!isSimulatingRef.current) break; // Check if simulation was cancelled

      await sleep(msg.delay);
      if (!isSimulatingRef.current) break;

      if (msg.typing) {
        setIsBotTyping(true);
        await sleep(Math.max(0, msg.delay - 400));
        setIsBotTyping(false);
        await sleep(400);
      }
      
      setMessages(prev => [...prev, createMessageObject(msg.text, msg.sender, msg.products)]);
      
      await sleep(SIMULATION_MESSAGE_INTERVAL_MS);
    }

    // Wait before looping
    if (isSimulatingRef.current) {
        await sleep(SIMULATION_LOOP_DELAY_MS);
        isSimulatingRef.current = false;
        key.current += 1; // Increment key to trigger re-render and restart simulation
    }
  }, [setMessages, setIsBotTyping]);
  
  // This useEffect hook now controls the simulation loop by watching the key ref
  useEffect(() => {
    simulateChat();
    // Cleanup function to stop simulation if component unmounts
    return () => {
      isSimulatingRef.current = false;
    };
  }, [simulateChat, key.current]);


  useEffect(() => {
    const viewport = viewportRef.current;
    if (viewport) {
      requestAnimationFrame(() => {
        const scrollElement = viewport.querySelector(':scope > div'); 
        if (scrollElement) {
          viewport.scrollTo({ top: scrollElement.scrollHeight, behavior: 'smooth' });
        }
      });
    }
  }, [messages, isBotTyping]);

  const messageVariants = {
    hidden: (sender: 'user' | 'bot') => ({
      opacity: 0,
      x: sender === 'user' ? 30 : -30,
      scale: 0.9,
    }),
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 120, damping: 15, duration: 0.5 }
    },
    exit: {
      opacity: 0,
      scale: 0.85,
      transition: { duration: 0.2 }
    }
  };
  
  const productCarouselVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const headerBotIconVariants = {
    initial: { rotate: 0, scale: 1 },
    hover: { rotate: [0, 15, -10, 15, 0], scale: 1.2, transition: { duration: 0.5, ease: "easeInOut" } }
  };

  return (
    <Card key={key.current} className="text-left bg-gradient-to-br from-background/80 to-secondary/50 backdrop-blur-sm h-[350px] md:h-[400px] flex flex-col border-none shadow-none overflow-hidden rounded-xl">
      <CardHeader className="p-3 border-b border-border/30 flex-row items-center justify-between bg-background/70">
        <motion.div 
          className="flex items-center gap-2"
          initial="initial"
          whileHover="hover"
        >
          <motion.div variants={headerBotIconVariants}>
            <Bot className="h-6 w-6 text-primary" /> 
          </motion.div>
          <CardTitle className="text-base font-semibold">Demo Chatbot Timpia AI</CardTitle>
        </motion.div>
        <div className="flex items-center space-x-1.5">
          {[ "bg-red-500", "bg-yellow-500", "bg-green-500"].map((color, i) => (
            <motion.div
              key={i}
              className={`w-2.5 h-2.5 ${color} rounded-full opacity-80`}
              whileHover={{ scale: 1.5, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            />
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-grow p-0 overflow-hidden">
        <ScrollArea className="h-full w-full p-4" viewportRef={viewportRef} aria-live="polite">
          <motion.div
            layout
            className="space-y-3 text-sm"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  layout
                  className="flex flex-col gap-2" // Each message block is a flex column
                >
                  {/* Text bubble */}
                  <motion.div
                    variants={messageVariants}
                    custom={msg.sender}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={cn("flex items-start gap-2.5", msg.sender === 'user' ? 'justify-end' : 'justify-start')}
                  >
                    {msg.sender === 'bot' && <Bot className="h-5 w-5 text-primary mt-0.5 shrink-0" />}
                    <div
                      className={cn(
                        "max-w-[85%] rounded-xl shadow-md text-sm px-3.5 py-2.5",
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-muted text-foreground rounded-bl-none'
                      )}
                    >
                      {msg.text}
                    </div>
                    {msg.sender === 'user' && <User className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />}
                  </motion.div>

                  {/* Product carousel, rendered separately */}
                  {msg.sender === 'bot' && msg.products && (
                    <motion.div
                      variants={productCarouselVariants}
                      initial="hidden"
                      animate="visible"
                      className="pl-8 w-full"
                    >
                      <div className="flex space-x-3 overflow-x-auto pb-2 -ml-2 pl-2">
                        {msg.products.map((p, i) => (
                          <ProductCard key={i} product={p} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            
            <AnimatePresence>
              {isBotTyping && (
                <motion.div
                  key="typing-indicator"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }}
                  exit={{ opacity: 0, y: 5, transition: { duration: 0.2 } }}
                  className="flex justify-start"
                >
                  <div className="flex items-center space-x-1.5 bg-muted rounded-lg px-3 py-2.5 shadow-sm">
                    {[0, 0.15, 0.3].map(delay => (
                       <motion.div 
                         key={delay}
                         className="w-2 h-2 bg-muted-foreground rounded-full" 
                         animate={{ y: [0, -3.5, 0] }} 
                         transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut", delay }} 
                       />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="p-3 border-t border-border/30 bg-background/70">
        <div className="text-center w-full text-xs text-muted-foreground font-medium">
            Demo interactiv. Reîncărcare automată...
        </div>
      </CardFooter>
    </Card>
  );
}
