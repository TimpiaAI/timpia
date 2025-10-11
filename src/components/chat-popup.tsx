"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, Home, HelpCircle, MessageSquare, Phone, Trash2, X, TrendingUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import useSound from 'use-sound';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-is-mobile";
import Logo from '@/components/logo';

const popSoundPath = '/sounds/pop.mp3';
const messageSoundPath = '/sounds/message.mp3';

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

interface ChatPopupProps {
    onClose: () => void;
}

type ActiveTab = "home" | "help" | "chat";

const faqData = [
  {
    q: "Ce este un Chatbot RAG și cum mă ajută?",
    a: "Este un AI avansat care răspunde folosind STRICT informațiile din documentele tale (PDF-uri, website). Beneficiul principal este că oferă răspunsuri precise, specifice afacerii tale, și elimină 'halucinațiile' sau informațiile incorecte.",
  },
  {
    q: "Cât de repede se poate implementa?",
    a: "Procesul este foarte rapid. Putem avea un chatbot complet funcțional, antrenat pe datele tale și integrat pe website-ul tău, în mai puțin de 48 de ore de la primirea materialelor necesare.",
  },
  {
    q: "Pe ce platforme funcționează?",
    a: "Chatbot-ul poate fi integrat pe website-ul tău, WhatsApp, Messenger sau Telegram. Oferim soluții flexibile pentru a fi prezent acolo unde sunt și clienții tăi.",
  },
  {
    q: "Ce este un Voice Agent?",
    a: "Este un robot telefonic inteligent care poate prelua apeluri, răspunde la întrebări frecvente și califica clienți, funcționând 24/7. Acesta reduce încărcarea echipei de suport și asigură că niciun apel important nu este pierdut.",
  },
];

const normalizeLineBreaks = (text: string) => text.replace(/\r?\n/g, "  \n");

const pageVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, x: -30, transition: { duration: 0.2, ease: 'easeIn' } },
};
  
const messageVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, type: "spring", stiffness: 120, damping: 14 }},
};

const HomePage = ({ inputValue, onInputChange, handleFormSubmit, isLoading, handleSendMessage }: {
    inputValue: string;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
    handleSendMessage: (text: string) => void;
}) => {
    const popularQuestions = [
        "Cat de sigur este AI-ul?",
        "Care sunt prețurile?",
        "De ce un chatbot?",
    ];

    return (
        <motion.div variants={pageVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col h-full text-left p-6">
            <h2 className="text-4xl font-bold text-foreground">Salut 👋</h2>
            <p className="text-xl text-muted-foreground mt-1 mb-6">Cu ce te putem ajuta?</p>
            <div className="bg-primary/10 backdrop-blur-md border border-primary/30 p-4 rounded-xl text-primary-foreground shadow-lg flex-grow flex flex-col">
                <motion.div
                    className="flex items-center gap-2 text-xs font-medium mb-3 text-foreground/80"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                >
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span>Răspundem imediat</span>
                </motion.div>

                {/* Frequently Asked Questions Section */}
                <div className="flex-grow space-y-2 mb-4">
                    <h4 className="text-sm font-semibold text-foreground/90 flex items-center gap-2 mb-2"><TrendingUp className="h-4 w-4"/>Întrebări frecvente</h4>
                    {popularQuestions.map((q, i) => (
                        <motion.button
                            key={i}
                            className="w-full text-left text-sm text-foreground/90 bg-background/20 dark:bg-black/20 hover:bg-background/40 dark:hover:bg-black/40 p-2.5 rounded-md transition-colors duration-200"
                            onClick={() => handleSendMessage(q)}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                        >
                            {q}
                        </motion.button>
                    ))}
                </div>

                <form onSubmit={handleFormSubmit} className="flex items-center gap-2 mt-auto">
                    <Input
                      value={inputValue}
                      onChange={onInputChange}
                      placeholder="Sau scrie aici mesajul tău..."
                      className="flex-grow bg-black/30 dark:bg-black/20 text-white placeholder:text-white/70 border border-white/50 h-11 focus-visible:ring-2 focus-visible:ring-white/80 rounded-md"
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()} className="h-11 w-11 shrink-0 bg-primary/20 hover:bg-primary/30 text-white backdrop-blur-md border border-primary/40">
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </Button>
                </form>
            </div>
        </motion.div>
    );
};


const ChatPage = ({ messages, isLoading }: {
    messages: Message[];
    isLoading: boolean;
}) => {
    const viewportRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const vp = viewportRef.current;
        if (!vp) return;
        
        requestAnimationFrame(() => {
          const scrollContainer = vp.querySelector('div');
          if (scrollContainer) {
            vp.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' });
          }
        });
      }, [messages, isLoading]);

    return (
     <motion.div variants={pageVariants} initial="hidden" animate="visible" exit="exit" className="h-full flex flex-col bg-black/30 backdrop-blur-lg" style={{ background: 'radial-gradient(circle at top, hsl(var(--secondary) / 0.1), hsl(var(--background)/0.5))' }}>
        <ScrollArea className="flex-grow p-4" viewportRef={viewportRef}>
            <AnimatePresence>
                <motion.div layout className="space-y-3.5">
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            layout="position"
                            variants={messageVariants}
                            initial="hidden"
                            animate="visible"
                            className={cn(
                                "flex items-start gap-2.5",
                                msg.sender === "user" ? "justify-end" : "justify-start"
                            )}
                        >
                            {msg.sender === "bot" && <Bot className="h-5 w-5 text-primary mt-1 shrink-0" />}
                            <div
                                className={cn(
                                    "max-w-[85%] rounded-xl px-3.5 py-2 shadow-sm text-sm",
                                    msg.sender === "user"
                                        ? "bg-primary text-primary-foreground rounded-br-none"
                                        : "bg-muted text-foreground rounded-bl-none"
                                )}
                            >
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                            </div>
                            {msg.sender === "user" && <User className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />}
                        </motion.div>
                    ))}
                     {isLoading && (
                      <motion.div
                          key="typing-indicator"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex justify-start"
                      >
                          <div className="flex items-center space-x-1 bg-muted rounded-lg px-3 py-2.5 shadow-sm">
                              {[0, 0.1, 0.2].map(delay => (
                                  <motion.div
                                      key={delay}
                                      className="w-2 h-2 bg-muted-foreground rounded-full"
                                      animate={{ y: [0, -3, 0] }}
                                      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay }}
                                  />
                              ))}
                          </div>
                      </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>
        </ScrollArea>
     </motion.div>
    )
};

const HelpPage = ({ handleSendMessage }: {
    handleSendMessage: (text: string) => void;
}) => {
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    return (
      <motion.div variants={pageVariants} initial="hidden" animate="visible" exit="exit" className="h-full flex flex-col p-6">
          <h2 className="text-2xl font-bold mb-4">Întrebări Frecvente</h2>
          <ScrollArea className="flex-grow -mx-6 px-6" viewportRef={scrollAreaRef}>
              <Accordion type="single" collapsible className="w-full space-y-2" onValueChange={(value) => {
                   if (value === `item-${faqData.length - 1}`) {
                      setTimeout(() => {
                          scrollAreaRef.current?.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
                      }, 150);
                  }
              }}>
                  {faqData.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`} className="border-b-0 rounded-lg bg-muted/50 dark:bg-muted/10 transition-colors duration-200 shadow-sm hover:shadow-md border border-border/20 hover:border-primary/20">
                          <AccordionTrigger className="text-sm text-left hover:no-underline px-4 py-3 font-semibold group">
                              <span className="group-hover:text-primary transition-colors">{faq.q}</span>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 text-sm text-muted-foreground leading-relaxed pt-0 pb-3">
                              <p>{faq.a}</p>
                              <Button variant="link" size="sm" className="h-auto p-0 mt-2 text-primary hover:text-primary/80" onClick={() => handleSendMessage(faq.q)}>
                                  Întreabă AI-ul despre asta
                              </Button>
                          </AccordionContent>
                      </AccordionItem>
                  ))}
              </Accordion>
          </ScrollArea>
           <div className="mt-6 pt-4 border-t text-center">
              <p className="text-sm text-muted-foreground mb-2">Nu ai gasit ce cautai?</p>
              <div className="flex items-center justify-center gap-3">
                 <Button variant="outline" asChild>
                     <a href={`tel:${"0787578482"}`}>
                         <Phone className="mr-2 h-4 w-4"/> Sună un agent
                     </a>
                  </Button>
              </div>
          </div>
      </motion.div>
    );
};

export default function ChatPopup({ onClose }: ChatPopupProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messageToSend, setMessageToSend] = useState<{ text: string } | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const [playPop] = useSound(popSoundPath, { volume: 0.5 });
  const [playMessage] = useSound(messageSoundPath, { volume: 0.7 });

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('timpia-chat-history');
      if (storedHistory) {
        setMessages(JSON.parse(storedHistory));
      }

      let storedSessionId = localStorage.getItem('timpia-chat-session');
      if (!storedSessionId) {
        storedSessionId = crypto.randomUUID();
        localStorage.setItem('timpia-chat-session', storedSessionId);
      }
      setSessionId(storedSessionId);
    } catch (error) {
      console.error("Could not access localStorage:", error);
      if (!sessionId) {
        setSessionId(crypto.randomUUID());
      }
    }
  }, [sessionId]);

  useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem('timpia-chat-history', JSON.stringify(messages));
      } else {
        localStorage.removeItem('timpia-chat-history');
      }
    } catch (error) {
      console.error("Could not write to localStorage:", error);
    }
  }, [messages]);

  const sendMessageToServer = useCallback(
    async (messageText: string) => {
      if (!sessionId || isLoading) return;
      setIsLoading(true);

      const webhookUrl = "https://n8n-mui5.onrender.com/webhook/timpiachat"; 
      try {
        const res = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-api-key": "varza" },
          body: JSON.stringify({ message: messageText, sessionId }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const botReplyText = normalizeLineBreaks((await res.json()).reply || "Am primit mesajul, revin imediat.");
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), text: botReplyText, sender: "bot" }]);
        if (playMessage) playMessage();
      } catch (err: any) {
        toast({ title: "Eroare Rețea", description: "Nu am putut comunica cu serverul.", variant: "destructive" });
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), text: `⚠️ Scuze, a apărut o problemă tehnică.`, sender: 'bot' }]);
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId, isLoading, toast, playMessage]
  );

  const handleSendMessage = useCallback((text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText || isLoading) return;

    setMessages(prev => [...prev, { id: crypto.randomUUID(), text: trimmedText, sender: "user" }]);
    if (activeTab !== 'chat') {
      setActiveTab('chat');
       if (playPop) playPop();
    }
    setInputValue("");
    setMessageToSend({ text: trimmedText });
  }, [isLoading, activeTab, playPop]);
  
  useEffect(() => {
    if (messageToSend) {
        const timer = setTimeout(() => {
            sendMessageToServer(messageToSend.text);
            setMessageToSend(null);
        }, 500); // 500ms delay to allow UI to transition
        return () => clearTimeout(timer);
    }
  }, [messageToSend, sendMessageToServer]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  const handleClearConversation = () => {
    const newSessionId = crypto.randomUUID();
    setMessages([]);
    setSessionId(newSessionId);
    try {
      localStorage.removeItem('timpia-chat-history');
      localStorage.setItem('timpia-chat-session', newSessionId);
    } catch (error) {
      console.error("Could not clear localStorage:", error);
    }
    setActiveTab("home");
    toast({ title: "Conversație ștearsă", description: "Puteți începe o nouă conversație." });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className={cn(
        "fixed bottom-5 right-5 z-50 flex flex-col overflow-hidden rounded-2xl border border-border/20 shadow-2xl",
        isMobile ? "w-[calc(100vw-2.5rem)] h-[min(75vh,600px)]" : "w-[380px] h-[600px]",
        "bg-background/80 backdrop-blur-xl"
      )}
    >
      <header className="p-3 shrink-0 flex items-center justify-between border-b bg-background/50">
          <div className="flex items-center gap-2">
              <Logo width={28} height={28} />
              <h2 className="font-semibold text-base">Timpia AI</h2>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={handleClearConversation} aria-label="Clear conversation">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={onClose} aria-label="Close chat">
                <X className="h-5 w-5" />
            </Button>
          </div>
      </header>

      <main className="flex-grow overflow-hidden relative">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
                <HomePage 
                    key="home"
                    inputValue={inputValue}
                    onInputChange={handleInputChange}
                    handleFormSubmit={handleFormSubmit}
                    isLoading={isLoading}
                    handleSendMessage={handleSendMessage}
                />
            )}
            {activeTab === 'chat' && (
                 <ChatPage
                    key="chat"
                    messages={messages}
                    isLoading={isLoading}
                />
            )}
            {activeTab === 'help' && (
                <HelpPage key="help" handleSendMessage={handleSendMessage} />
            )}
          </AnimatePresence>
      </main>

      {/* Render chat input only on chat tab */}
      <AnimatePresence>
      {activeTab === 'chat' && (
            <motion.footer 
                className="p-3 bg-background border-t"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
            >
                <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
                     <Input
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Scrie un răspuns..."
                        className="flex-grow bg-muted border-none h-10 focus-visible:ring-1 focus-visible:ring-ring"
                        disabled={isLoading}
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()} className="h-10 w-10 shrink-0">
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </Button>
                </form>
            </motion.footer>
        )}
        </AnimatePresence>


      <footer className="p-2 shrink-0 mt-auto bg-background/50 border-t">
          <div className="flex justify-around items-center bg-muted/50 p-1 rounded-xl">
              {(
                [
                    { id: 'home', label: 'Acasă', icon: Home },
                    { id: 'help', label: 'Ajutor', icon: HelpCircle },
                    { id: 'chat', label: 'Chat', icon: MessageSquare },
                ] as const
              ).map(item => (
                <button
                    key={item.id}
                    onClick={() => {
                        setActiveTab(item.id);
                        if (playPop) playPop();
                    }}
                    className={cn(
                      "relative flex-1 flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        activeTab === item.id ? "text-primary" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                >
                    {activeTab === item.id && (
                          <motion.div
                            layoutId="active-nav-indicator"
                            className="absolute inset-0 bg-primary/10 rounded-lg"
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                          />
                    )}
                    <item.icon className="h-5 w-5 relative z-10"/>
                    <span className="relative z-10">{item.label}</span>
                </button>
              ))}
          </div>
          <div className="text-center text-[10px] text-muted-foreground/80 mt-2 flex items-center justify-center gap-1">
              Powered by <a href="https://timpia.ro" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary/80 hover:underline flex items-center gap-1"><Logo width={12} height={12}/> Timpia AI</a>
          </div>
      </footer>
    </motion.div>
  );
}
