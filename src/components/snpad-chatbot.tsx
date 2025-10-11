
// src/components/snpad-chatbot.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Home, HelpCircle, MessageSquare, Phone, Trash2, Sun, Moon, Bot } from "lucide-react";
import useSound from 'use-sound';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Import the child components
import HomePage from "@/components/snpad/home-page";
import ChatPage from "@/components/snpad/chat-page";
import HelpPage from "@/components/snpad/help-page";
import { GlassmorphismCard } from "@/components/ui/glassmorphism-card";

// --- Interfaces & Types ---
export interface Message { // Export for use in child components
  id: string;
  text: string;
  sender: "user" | "bot";
}
type ActiveTab = "home" | "help" | "chat";

// --- Main Chatbot Component ---
export default function SnpadChatbot() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [messageToSend, setMessageToSend] = useState<{ text: string } | null>(null);

  const [playPop] = useSound('/sounds/pop.mp3', { volume: 0.5 });
  const [playMessage] = useSound('/sounds/message.mp3', { volume: 0.7 });
  const [playSend] = useSound('/sounds/send.mp3', { volume: 0.5 });

  useEffect(() => { try { const storedTheme = localStorage.getItem('snpad-theme'); if (storedTheme === 'light' || storedTheme === 'dark') { setTheme(storedTheme); } else { const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; setTheme(prefersDark ? 'dark' : 'light'); } const storedHistory = localStorage.getItem('snpad-chat-history'); if (storedHistory) setMessages(JSON.parse(storedHistory)); let storedSessionId = localStorage.getItem('snpad-session-id'); if (!storedSessionId) { storedSessionId = crypto.randomUUID(); localStorage.setItem('snpad-session-id', storedSessionId); } setSessionId(storedSessionId); } catch (e) { console.error("LocalStorage is not available."); setSessionId(crypto.randomUUID()) } }, []);
  useEffect(() => { const root = document.documentElement; root.classList.remove('light', 'dark'); root.classList.add(theme); try { localStorage.setItem('snpad-theme', theme); } catch (e) {} }, [theme]);
  useEffect(() => { try { if (messages.length > 0) { localStorage.setItem('snpad-chat-history', JSON.stringify(messages)); } else { localStorage.removeItem('snpad-chat-history'); } } catch (e) {} }, [messages]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  const handleTabChange = (tab: ActiveTab) => { playPop(); setActiveTab(tab); };

  const sendMessageToServer = useCallback(async (messageText: string) => { 
    if (!sessionId) return; 
    setIsLoading(true); 
    const webhookUrl = "https://n8n-mui5.onrender.com/webhook/chat_snp"; 
    try { 
      const res = await fetch(webhookUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: messageText, sessionId, client: "SNPAd" }), }); 
      if (!res.ok) throw new Error(`HTTP ${res.status}`); 
      const botReplyText = (await res.json()).reply || "Am primit mesajul, revin imediat."; 
      setMessages(prev => [...prev, { id: crypto.randomUUID(), text: botReplyText, sender: "bot" }]); 
      playMessage(); 
    } catch (err: any) { 
      setMessages(prev => [...prev, { id: crypto.randomUUID(), text: `⚠️ Scuze, a apărut o eroare tehnică.`, sender: 'bot' }]); 
    } finally { 
      setIsLoading(false); 
    } 
  }, [sessionId, playMessage]);

  const handleSendMessage = useCallback(async (text: string) => { 
    const trimmedText = text.trim(); 
    if (!trimmedText || isLoading) return; 
    setMessages(prev => [...prev, { id: crypto.randomUUID(), text: trimmedText, sender: "user" }]); 
    if (activeTab !== 'chat') { setActiveTab('chat'); } 
    setInputValue(""); 
    playSend(); 
    setMessageToSend({ text: trimmedText }); 
  }, [isLoading, activeTab, playSend]);
  
  useEffect(() => {
    if (messageToSend) {
      const timer = setTimeout(() => {
        sendMessageToServer(messageToSend.text);
        setMessageToSend(null);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [messageToSend, sendMessageToServer]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); handleSendMessage(inputValue); };
  const handleClearConversation = () => { const newSessionId = crypto.randomUUID(); setMessages([]); setSessionId(newSessionId); try { localStorage.removeItem('snpad-chat-history'); localStorage.setItem('snpad-session-id', newSessionId); } catch (e) {} setActiveTab("home"); };
  const handleHomeAction = (id: string, text: string) => { handleSendMessage(`Bună! Aș dori mai multe informații despre: ${text}`); };

  return (
    <div className="snpad-chatbot-app">
      <GlassmorphismCard.Filter />
      <div className="data-flow-background"></div>
      <motion.div key="main-app" initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.5}} className="flex flex-col h-full w-full">
        <header className="snpad-header">
            <div className="flex items-center gap-2"><img src="https://imgur.com/tyCSEnU.png" alt="SNPAd Logo" className="w-8 h-8 rounded-md" data-ai-hint="abstract logo"/><h2 className="font-bold text-lg text-foreground">Asistent SNPAd</h2></div>
            <div className="flex items-center gap-1">
              <button onClick={toggleTheme} className="control-button" aria-label="Toggle Theme"><AnimatePresence mode="wait" initial={false}><motion.div key={theme} initial={{y: -20, opacity: 0}} animate={{y: 0, opacity: 1}} exit={{y: 20, opacity: 0}} transition={{duration: 0.2}}>{theme === 'light' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</motion.div></AnimatePresence></button>
              <button onClick={handleClearConversation} className="control-button" aria-label="Clear conversation"><Trash2 className="h-5 w-5" /></button>
            </div>
        </header>
        <main className="snpad-main">
            <AnimatePresence mode="wait">
                {activeTab === 'home' && <HomePage key="home" onActionClick={handleHomeAction} />}
                {activeTab === 'chat' && <ChatPage key="chat" messages={messages} isLoading={isLoading} />}
                {activeTab === 'help' && <HelpPage key="help" handleSendMessage={handleSendMessage} />}
            </AnimatePresence>
        </main>
        {activeTab === 'chat' && (
            <div className="chat-footer">
                <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
                     <AnimatePresence>
                      {messageToSend && (<motion.div className="data-packet" initial={{ x: 0, y: 0, opacity: 1, scale: 1 }} animate={{ y: -300, opacity: 0, scale: 0.5 }} transition={{ duration: 0.8, ease: "circIn" }}><Bot size={16} /></motion.div>)}
                    </AnimatePresence>
                    <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(inputValue); } }} placeholder="Scrie un mesaj..." className="chat-input" disabled={isLoading} />
                    <button type="submit" disabled={isLoading || !inputValue.trim()} className="send-button"><AnimatePresence mode="wait">{isLoading ? <div className="h-5 w-5"/> : <Send className="h-5 w-5" />}</AnimatePresence></button>
                </form>
            </div>
        )}
        <footer className="snpad-footer">
            <div className="nav-bar">
                {[{ id: 'home', label: 'Acasă', icon: Home }, { id: 'chat', label: 'Chat', icon: MessageSquare }, { id: 'help', label: 'Ajutor', icon: HelpCircle },].map(item => (
                  <button key={item.id} onClick={() => handleTabChange(item.id as ActiveTab)} className="nav-button">
                      {activeTab === item.id && (<motion.div layoutId="active-nav-indicator" className="active-nav-indicator" transition={{ type: 'spring', stiffness: 300, damping: 25 }} />)}
                      <item.icon className={`h-6 w-6 relative z-10 transition-colors ${activeTab === item.id ? "text-primary" : "text-muted-foreground"}`} />
                  </button>
                ))}
            </div>
             <div className="text-center text-[10px] text-muted-foreground/80 mt-2 flex items-center justify-center gap-1">Powered by <a href="https://timpia.ro" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary/80 hover:underline flex items-center gap-1"><img src="https://imgur.com/zk1kggM.png" alt="Timpia AI Logo" className="w-3 h-3"/> Timpia AI</a></div>
        </footer>
      </motion.div>
    </div>
  );
}
