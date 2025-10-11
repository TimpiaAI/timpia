// src/components/new-placeholder-section.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image"; // Am importat componenta Image
import capabilImage from '@/early_acces/capabil.avif'; // Am importat noua imagine

export default function NewPlaceholderSection() {
  return (
    <section className="pt-0 bg-black text-center">
      <motion.div
        className="container mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="relative max-w-5xl mx-auto">
          <Image
            src={capabilImage}
            alt="Diagrama capabilităților angajatului AI"
            width={1200}
            height={800}
            className="rounded-xl w-full h-auto"
            data-ai-hint="ai capabilities diagram"
          />
          {/* Efect de estompare în jos */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10" />
        </div>
      </motion.div>
    </section>
  );
}
