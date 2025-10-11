"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

/**
 * Hook personalizat pentru a detecta click-urile în afara unui element specificat.
 * @param {React.RefObject<HTMLDivElement>} ref - Referința la elementul care trebuie monitorizat.
 * @param {(event: MouseEvent | TouchEvent) => void} handler - Funcția care va fi executată la un click în exterior.
 */
function useOnClickOutside(ref: React.RefObject<HTMLDivElement>, handler: (event: MouseEvent | TouchEvent) => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

// Interfață pentru props-urile componentei
interface WhatsAppPopupProps {
  phoneNumber?: string;
  agentName?: string;
  agentStatus?: string;
  agentImage?: string;
  welcomeMessage?: string;
  ctaText?: string;
  prefilledMessage?: string;
  whatsappLogoUrl?: string;
}

/**
 * O componentă modernă și responsivă pentru un pop-up de chat WhatsApp, cu o temă mov-gradient.
 * Se afișează ca o filă verticală pe partea stângă a ecranului. Acum este ascunsă pe mobil.
 */
export default function WhatsAppPopup({
  phoneNumber = "40787578482",
  agentName = "Pica Ovidiu",
agentStatus = "Online",
agentImage = "https://i.imgur.com/5wZ4s2Y.jpg",
welcomeMessage = "Află cum poți automatiza afacerea ta 👇",
ctaText = "Scrie mesaj",
prefilledMessage = "Salut! Vreau o consultanță rapidă pentru automatizarea afacerii mele.",
whatsappLogoUrl = "https://i.imgur.com/SUZCOGS.png",

}: WhatsAppPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCallout, setShowCallout] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const calloutTimerRef = useRef<NodeJS.Timeout | null>(null);

  useOnClickOutside(wrapperRef, () => setIsOpen(false));
  
  useEffect(() => {
    const mountTimer = setTimeout(() => setIsMounted(true), 1500);
    return () => clearTimeout(mountTimer);
  }, []);

  useEffect(() => {
    if (isMounted) {
      calloutTimerRef.current = setTimeout(() => {
        if (!isOpen) { 
          setShowCallout(true);
        }
      }, 120000); 
    }

    return () => {
      if (calloutTimerRef.current) {
        clearTimeout(calloutTimerRef.current);
      }
    };
  }, [isMounted, isOpen]);

  useEffect(() => {
    if (isOpen && showCallout) {
      setShowCallout(false);
    }
  }, [isOpen, showCallout]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    
    const headerEl = document.querySelector('header');
    const originalBodyPaddingRight = document.body.style.paddingRight;
    const originalHeaderPaddingRight = headerEl ? headerEl.style.paddingRight : '0px';

    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      if (headerEl) {
        headerEl.style.paddingRight = `${scrollbarWidth}px`;
      }
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = originalBodyPaddingRight;
      if (headerEl) {
        headerEl.style.paddingRight = originalHeaderPaddingRight;
      }
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = originalBodyPaddingRight;
      if (headerEl) {
        headerEl.style.paddingRight = originalHeaderPaddingRight;
      }
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    prefilledMessage
  )}`;

  return (
    <>
      <style>{`
        @property --angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }

        @keyframes rotate-glow {
          from { --angle: 0deg; }
          to { --angle: 360deg; }
        }

        .animated-glow-border {
          background: conic-gradient(from var(--angle), transparent 35%, #a855f7, #6366f1, transparent 65%);
          animation: rotate-glow 8s linear infinite;
        }
      `}</style>
      
      {isMounted && (
        <motion.div
          ref={wrapperRef}
          initial={{ x: "-150%" }}
          animate={{ x: "0%" }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 20,
          }}
          className="hidden sm:flex fixed top-1/2 left-0 -translate-y-1/2 z-50 items-center font-sans"
        >
          <motion.div 
            className="relative flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <div className="absolute -inset-0.5 rounded-r-2xl animated-glow-border opacity-75 blur-md -z-10 group-hover:opacity-100 group-hover:blur-lg transition-all duration-300"></div>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Contactează-ne pe WhatsApp"
              className={`relative flex items-center gap-2 text-white font-bold rounded-r-xl shadow-2xl cursor-pointer 
                        py-2 pl-1.5 pr-1 sm:py-3 sm:pl-3 sm:pr-2 sm:gap-3 
                        bg-black/50 ${isOpen ? 'backdrop-blur-2xl' : 'backdrop-blur-lg'}
                        border-t border-r border-b border-white/20
                        transition-all duration-300 ease-in-out`}
              style={{
                writingMode: "vertical-rl",
                transformOrigin: "left center",
                willChange: "transform",
              }}
            >
              <img
                src={whatsappLogoUrl}
                alt="WhatsApp Icon"
                className="w-4 h-4 sm:w-6 sm:h-6"
                style={{ transform: "rotate(180deg)" }}
              />
              <span className="text-xs sm:text-sm" style={{ transform: "rotate(180deg)" }}>
                WhatsApp
              </span>
            </button>
            
            <AnimatePresence>
              {showCallout && (
                <motion.div
                  className="absolute left-full ml-5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10, transition: { duration: 0.2 } }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  <div className="relative whitespace-nowrap rounded-lg bg-black/30 backdrop-blur-2xl border border-purple-500/40 px-4 py-2 text-sm font-semibold text-white shadow-lg">
                    <div
                      className="absolute right-full top-1/2 -translate-y-1/2 h-0 w-0
                                  border-t-[6px] border-t-transparent
                                  border-b-[6px] border-b-transparent
                                  border-r-[8px] border-r-purple-500/40"
                    ></div>
                    Ai o întrebare?
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence>
            {isOpen && (
                <motion.div
                  className="absolute bottom-auto left-full right-auto w-[90vw] max-w-[350px] ml-3
                            rounded-2xl p-4 shadow-2xl z-50
                            bg-black/30 backdrop-blur-2xl border border-purple-500/40"
                  style={{ transformOrigin: "left center" }} // FIX: Moved transformOrigin to style prop
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    transition: { type: "spring", stiffness: 300, damping: 25 },
                  }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={agentImage}
                          alt={agentName}
                          className="w-12 h-12 rounded-full border-2 border-white/20 shadow-lg"
                          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = `https://placehold.co/48x48/8b5cf6/ffffff?text=${agentName.charAt(0)}`;
                          }}
                        />
                        <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-gray-800 animate-pulse"></span>
                      </div>
                      <div>
                        <p className="text-md font-semibold leading-tight text-white">{agentName}</p>
                        <p className="text-sm text-green-400">{agentStatus}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      aria-label="Închide fereastra de chat"
                      className="p-1 text-gray-300 hover:bg-white/10 hover:text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-4 text-md text-gray-200 bg-white/5 p-3 rounded-lg relative border border-white/10">
                    <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-1.5 h-8 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full"></div>
                    {welcomeMessage}
                  </div>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center justify-center gap-2.5 w-full text-md font-bold bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 rounded-lg transition-transform transform hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500"
                  >
                    <img src={whatsappLogoUrl} alt="" className="w-6 h-6" />
                    {ctaText}
                  </a>
                </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </>
  );
}
