// src/components/call-agent.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PhoneCall, Send, Loader2, Info, Phone as PhoneIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { cn } from '@/lib/utils';


const phoneSchema = z.object({
  phone: z.string().min(10, { message: 'Numărul de telefon trebuie să aibă cel puțin 10 cifre.' }).regex(/^[0-9+]+$/, { message: 'Introduceți un număr de telefon valid (doar cifre și +).' }),
});

type PhoneFormValues = z.infer<typeof phoneSchema>;

export default function CallAgent() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: '' },
  });

  const onSubmit = async (data: PhoneFormValues) => {
    setIsLoading(true);
    setIsSuccess(false);

    try {
      // **IMPORTANT**: Replace this with your actual webhook endpoint
      const webhookUrl = "https://n8n-mui5.onrender.com/webhook/demo-agent";
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: data.phone }),
      });

      if (!response.ok) {
        throw new Error('A apărut o eroare. Vă rugăm să încercați din nou.');
      }

      toast({
        title: "Apel în curs!",
        description: "Agentul nostru AI te va suna în câteva secunde.",
      });
      setIsSuccess(true);
      form.reset();

    } catch (error: any) {
      toast({
        title: "Eroare",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const demoPhoneNumber = "+40 (373) 818 005";

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.2 } },
  };

  const cardVariants = {
      hidden: { opacity: 0, y: 30, scale: 0.95 },
      visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 15, duration: 0.7 } },
  };


  return (
    <motion.section 
        id="call-agent-demo" 
        className="py-16 md:py-24 bg-secondary/20 section-divider relative overflow-hidden"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
    >
      <GlassmorphismCard.Filter />
       {/* Background decorative elements */}
       <div aria-hidden="true" className="absolute inset-0 -z-10">
          <motion.div
              className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[100px] opacity-40 animate-pulse-slow"
              style={{ animationDelay: '0.5s' }}
          />
          <motion.div
              className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[120px] opacity-30 animate-pulse-slow"
              style={{ animationDelay: '1s' }}
          />
       </div>

      <div className="container">
        <motion.div
            variants={cardVariants}
            whileHover={{ y: -5, scale: 1.01, transition: { type: 'spring', stiffness: 200, damping: 15 } }}
        >
          <GlassmorphismCard className="max-w-xl mx-auto">
             <div className="p-6 md:p-8 relative z-10 text-white">
                <div className="text-center mb-6">
                    <div className="inline-flex p-3 bg-white/10 rounded-full border border-white/20 mb-3 mx-auto shadow-lg">
                      <PhoneCall className="h-8 w-8 text-purple-300"/>
                    </div>
                    <h2 className="text-2xl font-bold">Testează Agentul Vocal AI</h2>
                    <p className="text-sm text-white/70 mt-1">Primești un apel de la agentul nostru AI instant sau sună tu.</p>
                </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                         <FormLabel className="sr-only">Număr de telefon</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="Introdu numărul tău de telefon..."
                            className="h-12 text-center text-base bg-black/30 text-white placeholder:text-white/60 border-white/30 hover:border-white/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
                            {...field}
                          />
                        </FormControl>
                         <FormMessage className="text-xs text-red-400 text-center" />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" size="lg" className="w-full group bg-gradient-to-r from-primary to-purple-600 hover:shadow-lg hover:shadow-primary/40 transform hover:-translate-y-0.5 transition-all duration-300 relative animate-button-glow text-base" disabled={isLoading}>
                     <span className="relative z-10 flex items-center">
                        {isLoading ? (
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                          <Send className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        )}
                        Sună-mă acum
                     </span>
                  </Button>
                </form>
              </Form>
              
              <div className="flex items-center my-6">
                <div className="flex-grow border-t border-white/20"></div>
                <span className="flex-shrink mx-4 text-xs font-medium text-white/60">SAU</span>
                <div className="flex-grow border-t border-white/20"></div>
              </div>

              <Button variant="outline" size="lg" className="w-full group bg-transparent border-white/30 text-white/90 hover:bg-white/10 hover:border-white/50 hover:text-white transition-all text-base" asChild>
                <a href={`tel:${demoPhoneNumber.replace(/[\s()]/g, '')}`}>
                  <PhoneIcon className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                  Apelează tu AI-ul <span className="font-mono ml-2 text-purple-300">{demoPhoneNumber}</span>
                </a>
              </Button>

              <AnimatePresence>
                {isSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="mt-4 flex items-center justify-center gap-2 text-sm text-green-300 bg-green-500/10 p-3 rounded-md border border-green-500/20"
                    >
                        <Info className="h-4 w-4" />
                        Apelul a fost inițiat. Răspunde la numărul necunoscut.
                    </motion.div>
                )}
              </AnimatePresence>
             </div>
          </GlassmorphismCard>
        </motion.div>
      </div>
    </motion.section>
  );
}
