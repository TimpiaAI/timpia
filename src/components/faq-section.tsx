// src/components/faq-section.tsx
"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import laptopImage from '../early_acces/laptop.avif';
import { faqData } from '@/lib/faq-data'; // Import data from the new file
import type { WithContext, FAQPage } from 'schema-dts';

// Generate the FAQPage schema based on the imported data
const faqSchema: WithContext<FAQPage> = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqData.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};


export default function FaqSection() {
    return (
        <section className="bg-black text-white py-16 md:py-24">
             {/* Inject the FAQ schema into the page */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <Image
                        src={laptopImage}
                        alt="Dashboard mockup pe un laptop"
                        width={1200}
                        height={900}
                        className="rounded-xl shadow-2xl"
                        data-ai-hint="dashboard mockup laptop"
                    />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Ai intrebari?</h2>
                    <p className="text-lg text-gray-400 mb-8">
                        Suport clienți, agenți vocali, sisteme AI... multe cuvinte care te pot face confuz. Suntem aici să îți răspundem la întrebările frecvente.
                    </p>
                    <Accordion type="single" collapsible className="w-full space-y-3">
                        {faqData.map(item => (
                            <AccordionItem key={item.value} value={item.value} className="bg-black/30 border border-gray-800 rounded-lg hover:border-primary/50 transition-colors">
                                <AccordionTrigger className="p-4 text-left font-semibold text-base hover:no-underline">{item.question}</AccordionTrigger>
                                <AccordionContent className="px-4 pb-4 text-gray-300 text-sm">
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </motion.div>
            </div>
        </section>
    );
}
