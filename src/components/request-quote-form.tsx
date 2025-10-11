// src/components/request-quote-form.tsx
"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter

import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Loader2, Send, Zap, Briefcase, Building, ArrowLeft, ArrowRight, PartyPopper, User, Info, ShieldCheck, Clock, CheckCircle, Bot, PhoneCall, Users, GraduationCap, Home, Mail, Code, FileText, BookOpen, BarChart3, PhoneIncoming, DollarSign, Database, Package } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { GlassmorphismCard } from "@/components/ui/glassmorphism-card";


// --- Zod Schemas ---
const step1Schema = z.object({
  fullName: z.string().min(2, { message: "Numele trebuie să aibă cel puțin 2 caractere." }),
  phone: z.string().min(10, { message: "Numărul de telefon trebuie să aibă cel puțin 10 cifre." }),
  companyEmail: z.string().email({ message: "Introduceți o adresă de email validă." }),
});

const step2Schema = z.object({
  companyName: z.string().min(2, { message: "Numele companiei trebuie să aibă cel puțin 2 caractere." }),
  companyWebsite: z.string().url({ message: "Introduceți un URL valid (ex: https://domeniu.ro)." }).optional().or(z.literal("")),
});

const step3Schema = z.object({
  standardPackage: z.enum(['omnichannel', 'support360']).optional(),
  services: z.array(z.string()).optional(),
  otherDetails: z.string().max(500, { message: "Maxim 500 caractere permise." }).optional(),
});

// Create the base schema by merging
const baseQuoteFormSchema = step1Schema.merge(step2Schema).merge(step3Schema);

// The final, complete schema with refinement for the entire form
const quoteFormSchema = baseQuoteFormSchema.refine(
    (data) => data.standardPackage || (data.services && data.services.length > 0), {
    message: "Trebuie să selectați fie un pachet standard, fie cel puțin un serviciu.",
    path: ['services'],
});


type QuoteFormValues = z.infer<typeof quoteFormSchema>;


// --- Step Configuration ---
const steps = [
    { id: 1, title: 'Contact Inițial', schema: step1Schema, icon: User, fields: ['fullName', 'companyEmail','phone'] as const, description: "Să începem cu datele tale de contact." },
    { id: 2, title: 'Despre Companie', schema: step2Schema, icon: Building, fields: ['companyName', 'companyWebsite'] as const, description: "Spune-ne puțin despre firma ta." },
    { id: 3, title: 'Soluții AI Căutate', schema: step3Schema, icon: Zap, fields: ['standardPackage', 'services', 'otherDetails'] as const, description: "Ce te interesează cel mai mult să automatizezi?" },
    { id: 4, title: 'Confirmare Finală', icon: PartyPopper, fields: [] as const, description: "Gata! Verifică sumarul și trimite cererea." }, // Success step
];

// --- Service & Options Data ---
const servicesList = [
    { id: 'rag-chatbot', label: 'Chatbot Inteligent (RAG)', icon: Bot, description: "Răspunsuri automate bazate pe documentele tale." },
    { id: 'voice-agent', label: 'Agent Vocal Conversațional', icon: PhoneCall, description: "Preluare și calificare apeluri automate." },
    { id: 'cold-outreach', label: 'Playbook: Outreach B2B', icon: Mail, description: "Personalizarea automată a email-urilor de vânzare." },
    { id: 'training-bot', label: 'Playbook: Asistent Onboarding', icon: GraduationCap, description: "Instruirea rapidă și asistată a angajaților noi." },
    { id: 'client-onboarding', label: 'Playbook: Onboarding Clienți', icon: Users, description: "Automatizarea procesului de primire a clienților noi." },
    { id: 'airbnb-guest-bot', label: 'Playbook: Asistent Oaspeți', icon: Home, description: "Răspunsuri automate pentru chiriașii tăi." },
    { id: 'custom-automation', label: 'Automatizare Custom', icon: Zap, description: "Dezvoltăm soluții AI personalizate nevoilor tale." },
    { id: 'api-integration', label: 'Integrare API / Sisteme', icon: Code, description: "Conectare cu CRM/ERP sau alte platforme." },
];

const standardPackages = [
    { id: 'omnichannel', label: 'Chatbot OmniChannel', description: "Comunicare unificată pe web, WhatsApp și Messenger." },
    { id: 'support360', label: 'Suport 360°', description: "Soluție completă de suport prin chat și voce." },
];

const introSteps = [
    { text: "Analizăm cererea ta în detaliu.", icon: CheckCircle },
    { text: "Te contactăm telefonic pentru a stabili nevoile exacte.", icon: CheckCircle },
    { text: "Programăm o prezentare live, gratuită și fără obligații.", icon: CheckCircle },
];


// --- Animation Variants ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 15, duration: 0.6 } }
};

const checkboxItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { delay: i * 0.07, type: 'spring', stiffness: 180, damping: 14 }
    })
};

const stepVariants = {
    hidden: (direction: number) => ({
        x: direction > 0 ? 80 : -80,
        opacity: 0,
        filter: "blur(5px)",
        scale: 0.98
    }),
    visible: {
        x: 0,
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
        transition: { type: "spring", stiffness: 110, damping: 20, duration: 0.7 }
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 80 : -80,
        opacity: 0,
        filter: "blur(5px)",
        scale: 0.98,
        transition: { duration: 0.3, ease: "anticipate" }
    })
};

// --- Main Component ---
export default function RequestQuoteForm() {
    const { toast } = useToast();
    const router = useRouter(); // Initialize router
    const [formStarted, setFormStarted] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [direction, setDirection] = useState(1);
    const cardRef = useRef<HTMLDivElement>(null);
    const controls = useAnimation(); // Controls for card shake animation

    const methods = useForm<QuoteFormValues>({
        resolver: zodResolver(quoteFormSchema), // Use the full schema for the final validation
        mode: 'onTouched',
    });

    const selectedPackage = methods.watch('standardPackage');
    
    useEffect(() => {
      if (selectedPackage) {
        methods.setValue('services', []);
      }
    }, [selectedPackage, methods]);


    // Effect to manage body class for preventing scroll during animations or modal states
    useEffect(() => {
        if (isLoading) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
        return () => document.body.classList.remove('overflow-hidden');
    }, [isLoading]);


    // --- Field Rendering Helpers ---
     const renderStandardField = (name: keyof QuoteFormValues, label: string, placeholder: string, type: string = "text", fieldClassName?: string) => (
        <motion.div variants={itemVariants}>
            <FormField control={methods.control} name={name}
                render={({ field, fieldState }) => (
                    <FormItem className="space-y-1.5">
                        <FormLabel
                            htmlFor={name}
                            className={cn(
                                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                                fieldState.invalid ? "text-red-400" : "text-white/90"
                            )}
                        >
                            {label}
                        </FormLabel>
                        <FormControl>
                            <Input
                                id={name}
                                placeholder={placeholder}
                                type={type}
                                {...field}
                                value={field.value as string || ''}
                                className={cn(
                                    "h-11 text-base bg-black/20 text-white placeholder:text-white/50 transition-colors duration-200 border rounded-md",
                                    fieldState.invalid ? "border-red-500/70 focus-visible:ring-red-500/50" : "border-white/20 hover:border-white/40 focus:border-white/60 focus-visible:ring-primary/50",
                                    fieldClassName
                                )}
                                aria-invalid={fieldState.invalid}
                            />
                        </FormControl>
                        <FormMessage className="text-xs pt-1 text-red-400" />
                    </FormItem>
                )}
            />
        </motion.div>
    );

    // --- Navigation Handlers ---
    const handleNext = async () => {
        const currentStepConfig = steps[currentStep - 1];
        if (!currentStepConfig) return;

        const isFinalStep = currentStep === steps.length - 1;

        // On the final step, validate all fields before submitting
        const fieldsToValidate = isFinalStep
            ? (Object.keys(baseQuoteFormSchema.shape) as (keyof QuoteFormValues)[])
            : (currentStepConfig.fields as (keyof QuoteFormValues)[]);

        const isValid = await methods.trigger(fieldsToValidate);

        if (!isValid) {
            controls.start({
                x: [0, -6, 6, -6, 6, 0],
                transition: { duration: 0.45, ease: "easeInOut" }
            });
            const errors = methods.formState.errors;
            const firstErrorKey = Object.keys(errors)[0] as keyof QuoteFormValues | undefined;

            if (firstErrorKey) {
                toast({
                    title: "🤔 Câmp Invalid",
                    description: errors[firstErrorKey]?.message as string,
                    variant: "destructive",
                    duration: 3000,
                });
            }
            return;
        }

        setDirection(1);
        if (isFinalStep) { // Final step before success -> Submit
            methods.handleSubmit(onSubmit)();
        } else if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
            if (cardRef.current) {
                cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setDirection(-1);
            setCurrentStep(currentStep - 1);
            if (cardRef.current) {
                cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    // --- Form Submission ---
     async function onSubmit(values: QuoteFormValues) {
         setIsLoading(true);
         setSubmissionError(null);
         console.log("Submitting quote request:", values);

          // Updated Webhook URL
         const webhookUrl = "https://n8n-mui5.onrender.com/webhook/contact";

         try {
             const payload = {
                 fullName: values.fullName,
                 companyEmail: values.companyEmail,
                 phone: values.phone,
                 companyName: values.companyName,
                 companyWebsite: values.companyWebsite || '',
                 standardPackage: values.standardPackage || 'N/A',
                 services: values.services || [],
                 otherDetails: values.otherDetails || '',
             };

             console.log("Payload being sent:", payload);

             await new Promise(resolve => setTimeout(resolve, 1500));

             const response = await fetch(webhookUrl, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(payload),
             });

             if (!response.ok) {
                 let errorMessage = `HTTP error! Staatus: ${response.status} - ${response.statusText}`;
                 try {
                     const errorData = await response.json();
                     errorMessage = errorData.message || JSON.stringify(errorData);
                 } catch (e) {
                     try { errorMessage = await response.text(); } catch (e2) { /* Ignore */ }
                 }
                 throw new Error(errorMessage);
             }

             const responseData = await response.json();
             console.log("Webhook response successful:", responseData);
             
             // On success, redirect to the confirmation page
             router.push('/confirmare-contact');

         } catch (error) {
             console.error("Failed to submit form:", error);
             const errorMessage = error instanceof Error ? error.message : 'A apărut o eroare necunoscută.';
             setSubmissionError(`Eroare la trimitere: ${errorMessage}. Te rugăm să încerci din nou sau să ne contactezi direct.`);
             toast({
                 title: "❌ Oops! Ceva n-a mers bine...",
                 description: `Nu am putut trimite cererea. Eroare: ${errorMessage}. Reîncearcă sau contactează-ne.`,
                 variant: "destructive",
                 duration: 7000,
             });
             controls.start({
                 x: [0, -6, 6, -6, 6, 0],
                 transition: { duration: 0.45, ease: "easeInOut" }
             });
         } finally {
             setIsLoading(false);
         }
     }

    // --- Step Content Rendering ---
    const renderStepContent = () => {
        switch (currentStep) {
             case 1:
                return (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                        {renderStandardField('fullName', 'Nume complet', 'Ex: Andrei Popescu')}
                        {renderStandardField('companyEmail', 'Email companie', 'Ex: andrei@firma.ro', 'email')}
                        {renderStandardField('phone', 'Telefon', 'Ex: 0722123456', 'tel')}
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                         {renderStandardField('companyName', 'Numele companiei', 'Ex: NovaTech SRL')}
                         {renderStandardField('companyWebsite', 'Website companie (opțional)', 'Ex: https://companie.ro', 'url')}
                    </motion.div>
                );
            case 3:
                 return (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
                         <motion.div variants={itemVariants}>
                             <FormField
                                control={methods.control}
                                name="standardPackage"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel className="text-base font-semibold text-white">Alege un pachet standard (Opțional)</FormLabel>
                                        <FormControl>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {standardPackages.map(pkg => (
                                                    <motion.div key={pkg.id} whileHover={{ scale: 1.03 }} className="h-full">
                                                        <Label
                                                            htmlFor={`pkg-${pkg.id}`}
                                                            className={cn(
                                                                "flex flex-col items-start p-4 rounded-lg border-2 cursor-pointer transition-all h-full",
                                                                field.value === pkg.id
                                                                    ? "border-primary bg-primary/10"
                                                                    : "border-white/20 bg-black/20 hover:border-primary/50"
                                                            )}
                                                        >
                                                            <div className="flex justify-between w-full items-center">
                                                                <span className="font-semibold text-sm text-white/90">{pkg.label}</span>
                                                                <Checkbox
                                                                    id={`pkg-${pkg.id}`}
                                                                    checked={field.value === pkg.id}
                                                                    onCheckedChange={(checked) => {
                                                                        field.onChange(checked ? pkg.id : undefined);
                                                                    }}
                                                                    className="h-5 w-5 border-white/50 text-primary data-[state=checked]:border-primary"
                                                                />
                                                            </div>
                                                            <p className="text-xs text-white/60 mt-1">{pkg.description}</p>
                                                        </Label>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </motion.div>
                        
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/20" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-black/30 px-2 text-white/60">SAU</span>
                            </div>
                        </div>

                        <motion.div variants={itemVariants} className={cn(selectedPackage && "opacity-40 pointer-events-none")}>
                            <FormField control={methods.control} name="services"
                                render={({ fieldState }) => (
                                    <FormItem className="mb-6">
                                        <div className="mb-4">
                                            <FormLabel className="text-base font-semibold text-white">...configurează-ți propriul pachet</FormLabel>
                                             {fieldState.error && !selectedPackage && <FormMessage className="text-xs pt-1 text-red-400"/>}
                                        </div>
                                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                             {servicesList.map((item, index) => (
                                                <FormField key={item.id} control={methods.control} name="services"
                                                    render={({ field }) => (
                                                         <motion.div
                                                            custom={index}
                                                            variants={checkboxItemVariants}
                                                             initial="hidden"
                                                             animate="visible"
                                                             whileHover={{ scale: 1.02, zIndex: 1 }}
                                                             transition={{ type: 'spring', stiffness: 300 }}
                                                        >
                                                             <FormItem className={cn(
                                                                 "flex flex-row items-start space-x-3 space-y-0 bg-black/20 p-4 rounded-lg border border-white/20 hover:border-primary/60 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md h-full relative overflow-hidden group",
                                                                 field.value?.includes(item.id) && "border-primary/80 bg-primary/10 ring-1 ring-primary/60"
                                                             )}>
                                                                  <motion.div
                                                                     className="absolute top-2 right-2 opacity-0 group-has-[:checked]:opacity-100 transition-opacity duration-300"
                                                                      initial={{ scale: 0.5 }}
                                                                      animate={{ scale: field.value?.includes(item.id) ? 1 : 0.5 }}
                                                                      transition={{ type: 'spring', stiffness: 250, damping: 15 }}
                                                                  >
                                                                     <CheckCircle className="h-5 w-5 text-primary" />
                                                                  </motion.div>
                                                                 <FormControl>
                                                                     <Checkbox
                                                                        checked={field.value?.includes(item.id)}
                                                                         onCheckedChange={(checked) => {
                                                                            if (selectedPackage) return;
                                                                            return checked
                                                                                ? field.onChange([...(field.value || []), item.id])
                                                                                : field.onChange(field.value?.filter(value => value !== item.id))
                                                                        }}
                                                                        className="absolute opacity-0 peer border-white/50"
                                                                        id={`service-${item.id}`}
                                                                        disabled={!!selectedPackage}
                                                                     />
                                                                 </FormControl>
                                                                  <Label htmlFor={`service-${item.id}`} className={cn("flex-grow flex items-start gap-3", !!selectedPackage ? "cursor-not-allowed" : "cursor-pointer")}>
                                                                     <item.icon className="h-6 w-6 text-primary/90 shrink-0 mt-0.5 group-has-[:checked]:animate-pulse-slow"/>
                                                                     <div className="flex-grow">
                                                                         <span className="font-semibold text-sm text-white/90 leading-tight">{item.label}</span>
                                                                         <p className="text-xs text-white/60 font-normal mt-1">{item.description}</p>
                                                                     </div>
                                                                  </Label>
                                                             </FormItem>
                                                         </motion.div>
                                                     )}
                                                 />
                                             ))}
                                         </div>
                                     </FormItem>
                                )}
                            />
                         </motion.div>
                         <motion.div variants={itemVariants}>
                             <FormField control={methods.control} name="otherDetails"
                                 render={({ field, fieldState }) => (
                                     <FormItem className="space-y-1.5">
                                         <Label
                                             htmlFor="otherDetails"
                                             className={cn("text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70", fieldState.invalid ? "text-red-400" : "text-white/90")}
                                            >
                                             Alte detalii / obiective (opțional)
                                         </Label>
                                          <FormControl>
                                             <Textarea
                                                 id="otherDetails"
                                                 placeholder="Ex: Integrare cu Salesforce, automatizare calificări lead-uri..."
                                                  className="min-h-[120px] resize-none bg-black/20 text-white placeholder:text-white/50 border rounded-md border-white/20 hover:border-white/40 focus:border-white/60 focus-visible:ring-primary/50 text-base pt-3 px-3"
                                                 {...field}
                                                 aria-invalid={fieldState.invalid}
                                             />
                                         </FormControl>
                                          <FormMessage className="text-xs pt-1" />
                                     </FormItem>
                                 )}
                             />
                         </motion.div>
                     </motion.div>
                );
            // This case is now handled by the redirect, but kept as a fallback.
            case 4:
                return (
                    <motion.div
                        key="success-step"
                        className="text-center flex flex-col items-center justify-center min-h-[450px] py-10 px-6"
                        initial={{ opacity: 0, scale: 0.8, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8, type: 'spring', stiffness: 100, damping: 15 }}
                    >
                         <motion.h2
                            className="text-3xl md:text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400"
                         >
                            Redirecționare...
                         </motion.h2>
                     </motion.div>
                );
            default: return null;
        }
    };
    
    // --- Initial Screen Content ---
    const renderIntroScreen = () => (
        <motion.div
          key="intro-screen"
          className="text-center flex flex-col items-center justify-center p-6 sm:p-8 min-h-[450px] text-white"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            Solicită un <span className="font-montserrat text-primary">demo</span> gratuit
          </motion.h2>
          
          <motion.ul 
            className="space-y-3 text-left max-w-md mx-auto mb-10"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
            }}
          >
            {introSteps.map((step, index) => (
              <motion.li key={index} className="flex items-start gap-3" variants={itemVariants}>
                <step.icon className="h-5 w-5 text-green-400 mt-1 shrink-0" />
                <span className="text-white/80 text-base">{step.text}</span>
              </motion.li>
            ))}
          </motion.ul>
    
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
          >
            <Button
              onClick={() => setFormStarted(true)}
              size="lg"
              className="group shadow-lg hover:shadow-primary/40 transform hover:-translate-y-0.5 transition-all duration-300 px-8 py-7 text-lg bg-white text-black hover:bg-gray-200"
            >
              Continuă <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </motion.div>
      );

    const progressValue = Math.min(((currentStep -1) / (steps.length - 1)) * 100, 100);
    const CurrentStepIcon = steps[currentStep - 1]?.icon || Zap;

    // --- Component Return ---
    return (
       <div id="request-quote-form-container" className="w-full max-w-2xl mx-auto">
          <motion.div
            ref={cardRef}
             animate={controls}
           >
           <GlassmorphismCard>
                 {formStarted && currentStep < steps.length && (
                    <CardHeader className="relative z-10 p-6 border-b border-white/10 bg-black/20">
                        <div className="flex items-center justify-between mb-3">
                            <motion.span
                                key={`title-${currentStep}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="text-lg font-semibold text-primary flex items-center gap-2"
                            >
                                 <motion.div
                                     key={`icon-${currentStep}`}
                                     initial={{ scale: 0.7, rotate: -30, opacity: 0 }}
                                     animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                     transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
                                >
                                    <CurrentStepIcon className="h-5 w-5" />
                                </motion.div>
                                {steps[currentStep - 1]?.title}
                            </motion.span>
                            <span className="text-xs font-semibold text-white/60 tabular-nums">Pasul {currentStep} / {steps.length - 1}</span>
                        </div>
                        <Progress value={progressValue} className="h-1.5 bg-white/10 [&>div]:bg-primary" />
                         <AnimatePresence mode="wait">
                            <motion.p
                                key={`desc-${currentStep}`}
                                initial={{ opacity: 0, height: 0, y: 5 }}
                                animate={{ opacity: 1, height: 'auto', y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -5 }}
                                transition={{ duration: 0.3, delay: 0.15 }}
                                className="text-xs text-white/60 mt-2"
                            >
                                {steps[currentStep - 1]?.description}
                            </motion.p>
                        </AnimatePresence>
                    </CardHeader>
                )}

                <FormProvider {...methods}>
                    <form onSubmit={(e) => { e.preventDefault(); }}>
                        <CardContent className={cn(
                            "relative z-10 pt-8 pb-8 px-6 sm:px-8 overflow-hidden",
                            !formStarted && "p-0 pt-0 pb-0",
                             currentStep === 1 && formStarted && "min-h-[300px] sm:min-h-[320px]",
                             currentStep === 2 && formStarted && "min-h-[300px] sm:min-h-[320px]",
                             currentStep === 3 && formStarted && "min-h-[600px] sm:min-h-[650px]",
                             currentStep === 4 && formStarted && "min-h-[450px] sm:min-h-[500px]"
                        )}>
                             <AnimatePresence mode="wait">
                                {!formStarted ? renderIntroScreen() : (
                                    <motion.div
                                        key={currentStep}
                                        custom={direction}
                                        variants={stepVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                    >
                                        {renderStepContent()}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </CardContent>

                        {formStarted && currentStep < steps.length && (
                            <CardFooter className="relative z-10 flex justify-between pt-6 pb-6 px-6 sm:px-8 border-t border-white/10 bg-black/20">
                                <motion.div
                                    initial={{ opacity: currentStep === 1 ? 0 : 1 }}
                                    animate={{ opacity: currentStep === 1 ? 0 : 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                     <Button
                                         type="button"
                                         variant="outline"
                                         size="lg"
                                         onClick={handleBack}
                                         disabled={currentStep === 1 || isLoading}
                                         className={cn(
                                             buttonVariants({ variant: "outline", size: "lg" }),
                                             "transition-all text-white/80 hover:text-white group border-white/20 bg-white/5 hover:bg-white/10",
                                             currentStep === 1 && "opacity-0 pointer-events-none"
                                         )}
                                         aria-hidden={currentStep === 1}
                                     >
                                         <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-0.5" /> Înapoi
                                      </Button>
                                </motion.div>
                                 <Button
                                     type="button"
                                     disabled={isLoading}
                                     onClick={handleNext}
                                     className={cn(
                                         buttonVariants({ size: 'lg' }),
                                         "group relative overflow-hidden text-black shadow-lg hover:shadow-primary/40 transform transition-all duration-300 ease-out font-semibold",
                                         isLoading ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-white hover:bg-gray-200",
                                         "hover:-translate-y-0.5"
                                     )}
                                  >
                                     <span className="relative z-10 flex items-center">
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Procesare...
                                            </>
                                        ) : currentStep === steps.length - 1 ? (
                                            <>
                                                <Send className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" /> Trimite Cererea
                                            </>
                                        ) : (
                                            <>
                                                Continuă <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </>
                                        )}
                                    </span>
                                </Button>
                            </CardFooter>
                        )}
                    </form>
                </FormProvider>
            </GlassmorphismCard>
          </motion.div>

            {submissionError && !isLoading && (
                <motion.div
                    className="mt-5 text-center text-sm text-red-400 bg-red-500/10 p-3 rounded-md border border-red-500/50 flex items-center justify-center gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Info className="h-4 w-4" /> {submissionError}
                </motion.div>
            )}
             {formStarted && currentStep < steps.length && (
                <motion.div
                    className="mt-8 space-y-3"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    transition={{ delayChildren: 0.6 }}
                >
                    <motion.div
                        variants={itemVariants}
                         className="flex items-center justify-center text-xs text-white/60 space-x-2 bg-black/20 px-3 py-1.5 rounded-full border border-dashed border-emerald-500/40 max-w-[280px] mx-auto shadow-inner shadow-emerald-500/10"
                    >
                        <Clock className="h-4 w-4 text-emerald-400 animate-pulse-slow" />
                        <span>Răspuns garantat în <strong className="text-white/80 font-semibold">~6h</strong> lucrătoare</span>
                    </motion.div>
                     <motion.div
                        variants={itemVariants}
                        className="text-center text-xs text-white/60 flex items-center justify-center gap-2"
                    >
                        <ShieldCheck className="h-4 w-4 text-green-500" /> Date 100% securizate. Conform GDPR.
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
