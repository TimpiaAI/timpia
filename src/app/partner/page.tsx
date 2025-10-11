// src/app/partner/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Sparkles } from '@/components/ui/sparkles';
import { Loader2, Copy, Check, Share2, Link as LinkIcon, Gift } from 'lucide-react';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';

const affiliateSchema = z.object({
  name: z.string().min(3, { message: 'Numele trebuie să aibă cel puțin 3 caractere.' }),
  email: z.string().email({ message: 'Introduceți o adresă de email validă.' }),
});

type AffiliateFormValues = z.infer<typeof affiliateSchema>;

const stepVariants = {
  hidden: (direction: number) => ({ opacity: 0, x: direction > 0 ? '50%' : '-50%' }),
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 200, damping: 25 } },
  exit: (direction: number) => ({ opacity: 0, x: direction < 0 ? '50%' : '-50%', transition: { duration: 0.2 } }),
};

export default function PartnerPage() {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [affiliateLink, setAffiliateLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [direction, setDirection] = useState(1);
  const [siteUrl, setSiteUrl] = useState('');

  useEffect(() => {
    // Ensure this runs only on the client
    setSiteUrl(window.location.origin);
  }, []);

  const form = useForm<AffiliateFormValues>({
    resolver: zodResolver(affiliateSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const generateAffiliateCode = (name: string) => {
    const sanitizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    return `${sanitizedName.substring(0, 8)}${randomSuffix}`;
  };

  const onSubmit = async (values: AffiliateFormValues) => {
    setIsSubmitting(true);
    if (!firestore) {
      toast({ title: 'Eroare', description: 'Conexiunea la baza de date a eșuat.', variant: 'destructive' });
      setIsSubmitting(false);
      return;
    }

    try {
        // Check if email already exists
        const affiliatesRef = collection(firestore, 'affiliates');
        const q = query(affiliatesRef, where("email", "==", values.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            toast({ title: 'Cont Existent', description: 'Există deja un cont de afiliat cu acest email.', variant: 'destructive' });
            // Optionally, log them in or show their existing link
            const existingData = querySnapshot.docs[0].data();
            setAffiliateLink(`${siteUrl}/c/${existingData.affiliateCode}`);
            setDirection(1);
            setStep(2);
            setIsSubmitting(false);
            return;
        }

        const affiliateCode = generateAffiliateCode(values.name);
        
        await addDoc(collection(firestore, 'affiliates'), {
            ...values,
            affiliateCode,
            createdAt: serverTimestamp(),
        });
        
        setAffiliateLink(`${siteUrl}/c/${affiliateCode}`);
        setDirection(1);
        setStep(2);
    } catch (error: any) {
      toast({
        title: 'Eroare la creare',
        description: error.message || 'Nu am putut crea contul de afiliat. Încearcă din nou.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(affiliateLink);
    setIsCopied(true);
    toast({ title: 'Copiat!', description: 'Link-ul de afiliat a fost copiat în clipboard.' });
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const handleShare = () => {
      if (navigator.share) {
          navigator.share({
              title: 'Devino Partener Timpia AI',
              text: `Folosește link-ul meu pentru a beneficia de cele mai bune oferte la soluții AI personalizate de la Timpia AI!`,
              url: affiliateLink,
          });
      } else {
          handleCopy();
      }
  };

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Sparkles
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={25}
          className="w-full h-full"
          particleColor="hsl(var(--primary))"
        />
      </div>

      <GlassmorphismCard className="relative z-10 w-full max-w-md">
        <div className="p-6 md:p-8 min-h-[420px] flex flex-col justify-center">
            <AnimatePresence mode="wait" custom={direction}>
                {step === 1 && (
                    <motion.div
                        key="step1"
                        custom={direction}
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="w-full flex flex-col text-center"
                    >
                         <Gift className="h-10 w-10 text-primary mx-auto mb-4" />
                         <h1 className="font-bold text-2xl mb-2">Devino Partener Timpia AI</h1>
                         <p className="text-sm text-white/70 mb-6">Câștigă 15% comision pentru fiecare client adus care achiziționează un serviciu.</p>
                         <Form {...form}>
                             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-left">
                                <FormField control={form.control} name="name" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white/80">Nume</FormLabel>
                                        <FormControl><Input placeholder="Numele tău complet" {...field} className="form-input-glass" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                 <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white/80">Email</FormLabel>
                                        <FormControl><Input type="email" placeholder="adresa@email.com" {...field} className="form-input-glass" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <Button type="submit" size="lg" className="w-full group bg-primary hover:bg-primary/90 text-white font-bold h-12" disabled={isSubmitting}>
                                    {isSubmitting ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : ( <>Creează Link de Afiliat <LinkIcon className="ml-2 h-4 w-4" /></>)}
                                </Button>
                             </form>
                         </Form>
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
                        className="w-full flex flex-col text-center"
                    >
                        <Check className="h-12 w-12 text-green-400 mx-auto mb-4 p-2 bg-green-500/10 rounded-full border border-green-500/30" />
                        <h2 className="font-bold text-2xl mb-2">Link-ul tău este gata!</h2>
                        <p className="text-sm text-white/70 mb-6">Distribuie acest link unic pentru a începe să câștigi comisioane.</p>
                        
                        <div className="relative mb-4">
                            <Input
                                type="text"
                                readOnly
                                value={affiliateLink}
                                className="form-input-glass pr-12 h-12 text-center"
                            />
                            <Button variant="ghost" size="icon" className="absolute top-1/2 right-2 -translate-y-1/2 h-9 w-9 text-white/70" onClick={handleCopy}>
                                {isCopied ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
                            </Button>
                        </div>

                        <Button size="lg" className="w-full group bg-primary hover:bg-primary/90 text-white font-bold h-12" onClick={handleShare}>
                            Distribuie Acum <Share2 className="ml-2 h-4 w-4" />
                        </Button>
                         <p className="text-xs text-white/50 mt-4">Vei primi un email de confirmare cu detaliile contului tău.</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </GlassmorphismCard>
      
       <style jsx global>{`
          .form-input-glass {
              background-color: rgba(0, 0, 0, 0.3);
              color: white;
              border-color: rgba(255, 255, 255, 0.3);
          }
          .form-input-glass::placeholder {
              color: rgba(255, 255, 255, 0.6);
          }
          .form-input-glass:focus {
              border-color: hsl(var(--primary));
              box-shadow: 0 0 0 1px hsl(var(--primary));
          }
      `}</style>
    </div>
  );
}
