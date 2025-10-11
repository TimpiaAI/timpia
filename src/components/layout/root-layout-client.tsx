
// src/components/layout/root-layout-client.tsx
"use client";

import React, { useState, useEffect } from 'react';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { Toaster } from '@/components/ui/toaster';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import ExitIntentPopup from '@/components/exit-intent-popup';
import { FirebaseClientProvider } from '@/firebase';
import WhatsAppPopup from '@/components/WhatsAppPopup'; // Restored
import ChatPopup from '@/components/chat-popup'; // Restored
import AttentionGrabber from '@/components/attention-grabber'; // Restored
import { AffiliateTracker } from '@/components/affiliate-tracker';

interface RootLayoutClientProps {
  children: React.ReactNode;
}

export function RootLayoutClient({ children }: RootLayoutClientProps) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // State for chat popup

  useEffect(() => {
    setIsClient(true);
  }, []);

  const showHeaderFooter = isClient && !pathname.startsWith('/dashboard') && !pathname.startsWith('/snpad') && !pathname.startsWith('/demos');

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 5,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };
  
  const handleToggleChat = () => {
    setIsChatOpen(prev => !prev);
  };

  return (
    <FirebaseClientProvider>
      <AffiliateTracker />
      <div className="relative z-10 flex flex-col">
        {showHeaderFooter && <SiteHeader />}
        <main className="flex-grow flex flex-col">
          <motion.div
            key={pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            className="flex flex-col flex-grow"
          >
            {children}
          </motion.div>
        </main>
        {showHeaderFooter && <SiteFooter />}
        <Toaster />
        
        {/* Chat Components Section - Temporarily hidden */}
        {/*
        {showHeaderFooter && (
          <>
            <ExitIntentPopup />
            <WhatsAppPopup />
            <div className="fixed bottom-5 right-5 z-40">
                <AnimatePresence>
                    {!isChatOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1, transition: { delay: 1, type: "spring", stiffness: 150 } }}
                            exit={{ opacity: 0, scale: 0.8 }}
                        >
                            <AttentionGrabber onClick={handleToggleChat} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
             <AnimatePresence>
                {isChatOpen && <ChatPopup onClose={handleToggleChat} />}
            </AnimatePresence>
          </>
        )}
        */}
      </div>
    </FirebaseClientProvider>
  );
}
