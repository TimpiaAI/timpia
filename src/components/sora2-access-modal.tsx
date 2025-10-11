
// src/components/sora2-access-modal.tsx
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Mail, ArrowRight, Share2, Loader2, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { GlassmorphismCard } from './ui/glassmorphism-card';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

const emailSchema = z.object({
  email: z.string().email({ message: 'Te rugăm să introduci o adresă de email validă.' }),
  agreement: z.boolean().refine(val => val === true, {
    message: 'Trebuie să fii de acord pentru a continua.',
  }),
});

type EmailFormValues = z.infer<typeof emailSchema>;

const stepVariants = {
  hidden: (direction: number) => ({ opacity: 0, x: direction > 0 ? 50 : -50 }),
  visible: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction < 0 ? 50 : -50 }),
};

export default function Sora2AccessModal() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const methods = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
      agreement: false,
    },
  });

  const handleNextStep = async (values: EmailFormValues) => {
    setIsSubmitting(true);
    try {
      // Send email to webhook
      const webhookUrl = "https://n8n-mui5.onrender.com/webhook/sora2";
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: values.email }),
      });

      if (!response.ok) {
        throw new Error('A apărut o eroare la trimiterea datelor. Încearcă din nou.');
      }
      
      // If successful, move to the next step
      setDirection(1);
      setStep(2);

    } catch (error: any) {
      toast({
        title: "Eroare",
        description: error.message || "Nu am putut contacta serverul.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShareConfirmation = () => {
    setDirection(1);
    setIsSubmitting(true);
    // Simulate verification
    setTimeout(() => {
      setStep(3);
      // Redirect after a delay
      setTimeout(() => {
        router.push('https://formbiz.biz/');
      }, 1500);
    }, 2000);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Timpia AI Video',
      text: 'Uite un video interesant despre AI!',
      url: 'https://vm.tiktok.com/ZNdtBHJcv/',
    };

    // Check if navigator.share is supported
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log('Partajare reușită!');
        handleShareConfirmation();
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
             toast({
                title: "Partajare anulată",
                description: "Trebuie să partajezi link-ul pentru a continua.",
                variant: "destructive",
            });
        } else {
             // Fallback for other errors
             navigator.clipboard.writeText(shareData.url);
             toast({
                title: "Link Copiat!",
                description: "Partajarea a eșuat, dar am copiat link-ul pentru tine. Distribuie-l manual pentru a continua.",
             });
             handleShareConfirmation();
        }
      }
    } else {
      // Fallback for desktop browsers that do not support navigator.share
      navigator.clipboard.writeText(shareData.url);
      toast({
        title: "Link Copiat!",
        description: "Funcția de partajare nu este disponibilă pe desktop. Am copiat link-ul în clipboard. Distribuie-l pentru a continua.",
      });
      handleShareConfirmation();
    }
  };
  
  return (
    <GlassmorphismCard>
      <div className="p-6 md:p-8 text-white min-h-[380px] flex flex-col">
        <AnimatePresence mode="wait" custom={direction}>
          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full flex flex-col justify-center text-center h-full"
            >
              <Mail className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-2">Pasul 1: Introdu Email-ul</h3>
              <p className="text-sm text-white/70 mb-6">Introdu adresa ta de email. Te voi tine la curent cu noutati AI.</p>
              <form onSubmit={methods.handleSubmit(handleNextStep)} className="flex flex-col gap-4">
                <Input
                  {...methods.register('email')}
                  placeholder="adresa.ta@email.com"
                  className="h-12 text-center text-base bg-black/30 text-white placeholder:text-white/60 border-white/30 focus:border-primary focus:ring-primary"
                  disabled={isSubmitting}
                />
                {methods.formState.errors.email && <p className="text-xs text-red-400">{methods.formState.errors.email.message}</p>}
                
                <div className="flex items-center space-x-2 justify-center">
                    <Controller
                        name="agreement"
                        control={methods.control}
                        render={({ field }) => (
                            <Checkbox
                                id="agreement"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="border-white/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                        )}
                    />
                    <Label htmlFor="agreement" className="text-xs text-white/70">
                        Sunt de acord cu preluarea și primirea de newslettere.
                    </Label>
                </div>
                 {methods.formState.errors.agreement && <p className="text-xs text-red-400 -mt-2">{methods.formState.errors.agreement.message}</p>}


                <Button type="submit" size="lg" className="w-full group bg-primary hover:bg-primary/90 text-white font-bold h-12" disabled={isSubmitting}>
                   {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Continuă <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full flex flex-col justify-center text-center h-full"
            >
              <Share2 className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-2">Pasul 2: Partajează Video-ul</h3>
              <p className="text-sm text-white/70 mb-6">Dă share la acest video cu un prieten care este interesat de AI pentru a debloca accesul.</p>
              <Button onClick={handleShare} size="lg" className="w-full group bg-primary hover:bg-primary/90 text-white font-bold h-12">
                Partajează Acum <Share2 className="ml-2 h-4 w-4 transition-transform group-hover:rotate-12" />
              </Button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full flex flex-col justify-center items-center text-center h-full"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                <Loader2 className="h-12 w-12 text-primary mx-auto mb-5 animate-spin" />
                <h3 className="font-bold text-xl mb-2">Se verifică...</h3>
                <p className="text-sm text-white/70">Aproape gata. Te redirecționăm...</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassmorphismCard>
  );
}
