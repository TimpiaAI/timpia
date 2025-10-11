// src/app/sora2/page.tsx
"use client";

import { motion } from "framer-motion";
import Sora2AccessModal from "@/components/sora2-access-modal";
import { Sparkles } from "@/components/ui/sparkles";

export default function Sora2Page() {
  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Sparkles
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={25}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold max-w-4xl mx-auto text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
          Acces Exclusiv Sora 2
        </h1>
        <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
          Primește coduri de invitație nelimitate pentru cel mai nou model de video generation AI.
        </p>
      </motion.div>

      <motion.div
        className="relative z-10 mt-10 w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
      >
        <Sora2AccessModal />
      </motion.div>
    </div>
  );
}
