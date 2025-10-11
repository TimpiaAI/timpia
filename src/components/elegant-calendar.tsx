// src/components/elegant-calendar.tsx
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, User, Mail, Loader2, Check, AlertCircle, ChevronLeft, ChevronRight, Video, Globe, Building, TrendingUp, DollarSign, Send, CheckCircle } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay, isBefore, startOfToday, isSameMonth, parseISO, roundToNearestMinutes, addMinutes, isAfter } from 'date-fns';
import { ro } from 'date-fns/locale';
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { useRouter } from 'next/navigation'; // Import useRouter
import { useFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';


import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { Checkbox } from './ui/checkbox';

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
  impactLevel: z.enum(['extrem', 'semnificativ', 'nesigur'], {
    required_error: "Te rugăm să selectezi o opțiune.",
  }),
});

const step4Schema = z.object({
    budget: z.enum(['sub-1000', '1000-2000', 'peste-2000'], {
        required_error: "Te rugăm să selectezi un buget.",
    }),
});

const bookingSchema = step1Schema.merge(step2Schema).merge(step3Schema).merge(step4Schema);


type BookingFormValues = z.infer<typeof bookingSchema>;

// Animation Variants
const stepVariants = {
    hidden: (direction: number) => ({
        opacity: 0,
        x: direction > 0 ? '50%' : '-50%',
        scale: 0.95
    }),
    visible: {
        opacity: 1,
        x: '0%',
        scale: 1,
        transition: { type: 'spring', stiffness: 200, damping: 25, duration: 0.5 }
    },
    exit: (direction: number) => ({
        opacity: 0,
        x: direction < 0 ? '50%' : '-50%',
        scale: 0.95,
        transition: { duration: 0.3, ease: "easeIn" }
    })
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
};

const timeSlotVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i: number) => ({
        opacity: 1,
        scale: 1,
        transition: { delay: i * 0.04, type: 'spring', stiffness: 200, damping: 15 },
    }),
};

// --- Step Configuration ---
const steps = [
    { id: 1, title: 'Selectează Data', icon: CalendarIcon, fields: [], description: "Alege o zi potrivită pentru discuția noastră." },
    { id: 2, title: 'Selectează Ora', icon: Clock, fields: [], description: "Alege ora la care ești disponibil." },
    { id: 3, title: 'Hai să ne cunoaștem!', icon: User, fields: ['fullName', 'companyEmail','phone', 'companyName', 'companyWebsite'] as const, description: "Completează detaliile de contact." },
    { id: 4, title: 'Impact Estimativ', icon: TrendingUp, fields: ['impactLevel'] as const, description: "Ajută-ne să înțelegem nevoile tale." },
    { id: 5, title: 'Buget Alocat', icon: DollarSign, fields: ['budget'] as const, description: "Selectează bugetul estimativ." },
    { id: 6, title: 'Confirmare Finală', icon: Send, fields: [] as const, description: "Gata! Verifică sumarul și trimite cererea." },
];

function getCookie(name: string): string | undefined {
    if (typeof document === 'undefined') return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
}


// Main Component
export default function ElegantCalendar() {
    const { toast } = useToast();
    const { firestore } = useFirebase();
    const router = useRouter(); // Initialize router
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [bookedSlots, setBookedSlots] = useState<Record<string, string[]>>({});
    const [isFetchingSlots, setIsFetchingSlots] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [direction, setDirection] = useState(1);
    const [view, setView] = useState<'date' | 'time' | 'details' | 'impact' | 'budget' | 'success'>('date');
    const [timeZone, setTimeZone] = useState("Local Time");
    const [currentTime, setCurrentTime] = useState("--:--"); // State for client-side time
    const [isTransitioning, setIsTransitioning] = useState(false); // For circle wipe animation


    const firstDayOfMonth = startOfMonth(currentMonth);
    const lastDayOfMonth = endOfMonth(currentMonth);
    
    const today = startOfToday();
    const maxDate = addMonths(today, 2);

    const methods = useForm<BookingFormValues>({
        resolver: zodResolver(bookingSchema),
        mode: "onChange",
        defaultValues: {
            fullName: '',
            phone: '',
            companyEmail: '',
            companyName: '',
            companyWebsite: '',
        }
    });

     const fetchBookedSlots = useCallback(async () => {
        setIsFetchingSlots(true);
        try {
            const response = await fetch('https://n8n-mui5.onrender.com/webhook/80e572db-53d5-4549-9b6a-8d2714d177ca', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'get_events' }) 
            });
            if (!response.ok) throw new Error('Network response was not ok');
            
            const responseText = await response.text();
            if (!responseText) {
                setBookedSlots({});
                setIsFetchingSlots(false);
                return;
            }
            
            const events = JSON.parse(responseText);

            const slots: Record<string, string[]> = {};
            if (Array.isArray(events)) {
                 events.forEach((event: any) => {
                    if (event.start?.dateTime && event.end?.dateTime) {
                        let currentTime = parseISO(event.start.dateTime);
                        const endTime = parseISO(event.end.dateTime);
                        
                        currentTime = roundToNearestMinutes(currentTime, { nearestTo: 30 });

                        while (isBefore(currentTime, endTime)) {
                            const dateKey = format(currentTime, 'yyyy-MM-dd');
                            const timeSlot = format(currentTime, 'HH:mm');

                            if (!slots[dateKey]) {
                                slots[dateKey] = [];
                            }
                            if (!slots[dateKey].includes(timeSlot)) {
                                slots[dateKey].push(timeSlot);
                            }
                            currentTime = addMinutes(currentTime, 30);
                        }
                    }
                });
            }
            setBookedSlots(slots);
        } catch (error) {
            console.error("Failed to fetch events:", error);
            toast({ title: 'Eroare', description: 'Nu am putut prelua evenimentele existente.', variant: 'destructive' });
        } finally {
            setIsFetchingSlots(false);
        }
    }, [toast]);
    
    useEffect(() => { 
        try { 
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone; 
            const friendlyTZ = tz.replace(/_/g, ' '); 
            setTimeZone(`${friendlyTZ}`); 
        } catch (e) { 
            console.warn("Could not determine timezone."); 
        }
        
        // Set time only on the client side
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
        }, 1000);
        
        fetchBookedSlots(); 
        
        return () => clearInterval(timer);
    }, [fetchBookedSlots]);

    const daysInMonth = useMemo(() => eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth }), [firstDayOfMonth, lastDayOfMonth]);
    const startingDayIndex = getDay(firstDayOfMonth) === 0 ? 6 : getDay(firstDayOfMonth) - 1;

    const generateTimeSlots = useCallback((date: Date): string[] => {
        const dayOfWeek = getDay(date);
        if (dayOfWeek === 0 || dayOfWeek === 6) return []; 
        const slots: string[] = [];
        for (let hour = 15; hour < 20; hour++) {
            slots.push(`${String(hour).padStart(2, '0')}:00`);
            slots.push(`${String(hour).padStart(2, '0')}:30`);
        }
        return [...new Set(slots)].sort();
    }, []);

    const isDayFullyBooked = useCallback((day: Date) => {
        const dateKey = format(day, 'yyyy-MM-dd');
        const allPossibleSlots = generateTimeSlots(day);
        if (allPossibleSlots.length === 0) return true;
        
        const bookedSlotsForDay = bookedSlots[dateKey] || [];
        return allPossibleSlots.every(slot => bookedSlotsForDay.includes(slot));
    }, [bookedSlots, generateTimeSlots]);

    const handleDateSelect = (day: Date) => {
        if (isBefore(day, startOfToday()) && !isSameDay(day, startOfToday())) return;
        if(isDayFullyBooked(day)) return;
        setDirection(1);
        setSelectedDate(day);
        setView('time');
    };

    const handleTimeSelect = (time: string) => {
        setDirection(1);
        setSelectedTime(time);
        setView('details');
    };

    const handleBack = (targetView: 'date' | 'time' | 'details' | 'impact' | 'budget') => {
        setDirection(-1);
        setView(targetView);
    };
    
    const onSubmit = async (values: BookingFormValues) => {
        if (!selectedDate || !selectedTime || !firestore) return;
        setIsSubmitting(true);
        setIsTransitioning(true);

        try {
            const affiliateCode = getCookie('affiliateCode');
            const bookingDateTime = new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}`);

            const n8nPayload = {
                date: format(selectedDate, 'yyyy-MM-dd'),
                startTime: selectedTime,
                durationMinutes: 60,
                ...values
            };

            const firestorePayload: any = {
                ...values,
                bookingDate: bookingDateTime,
                createdAt: serverTimestamp(),
            };

            if (affiliateCode) {
                firestorePayload.affiliateCode = affiliateCode;
                 await addDoc(collection(firestore, 'referrals'), {
                    affiliateCode: affiliateCode,
                    referredUserName: values.fullName,
                    referredUserEmail: values.companyEmail,
                    bookingDate: bookingDateTime,
                    createdAt: serverTimestamp(),
                });
            }

            const response = await fetch('https://n8n-mui5.onrender.com/webhook/event', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(n8nPayload),
            });
            const responseData = await response.json();
            if (!response.ok) {
                 throw new Error(responseData.error || 'A apărut o eroare la salvarea programării.');
            }
            const googleCalLink = responseData[0]?.htmlLink;
            await new Promise(resolve => setTimeout(resolve, 1400));
            const dateParam = format(selectedDate, 'yyyy-MM-dd');
            const timeParam = selectedTime;
            let redirectUrl = `/confirmare-contact?date=${dateParam}&time=${timeParam}`;
            if (googleCalLink) {
                redirectUrl += `&gcal_link=${encodeURIComponent(googleCalLink)}`;
            }
            router.push(redirectUrl);
        } catch (error: any) {
            console.error("Failed to submit booking:", error);
            toast({ title: 'Eroare', description: error.message, variant: 'destructive' });
            setIsSubmitting(false); 
            setIsTransitioning(false);
        }
    };
    
    const renderStandardField = (name: keyof BookingFormValues, label: string, placeholder: string, type: string = "text", fieldClassName?: string) => (
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
                                className={cn(
                                    "h-11 text-base bg-black/20 text-white placeholder:text-white/50 transition-colors duration-200 border rounded-lg",
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

    const handleNext = async () => {
        setDirection(1);
        let fieldsToValidate: (keyof BookingFormValues)[] = [];
        
        if (view === 'details') {
            fieldsToValidate = ['fullName', 'companyEmail', 'phone', 'companyName', 'companyWebsite'];
        } else if (view === 'impact') {
            fieldsToValidate = ['impactLevel'];
        }

        const isValid = await methods.trigger(fieldsToValidate.filter(f => Object.keys(methods.getValues()).includes(f)));

        if (isValid) {
            if (view === 'details') setView('impact');
            else if (view === 'impact') setView('budget');
        } else {
             const errors = methods.formState.errors;
             const firstErrorKey = Object.keys(errors).find(key => fieldsToValidate.includes(key as any));
             if(firstErrorKey) toast({ title: "Câmp invalid", description: errors[firstErrorKey as keyof BookingFormValues]?.message, variant: "destructive", duration: 3000 });
        }
    };


    const isTimeSlotBooked = (date: Date, time: string) => {
        const dateString = format(date, 'yyyy-MM-dd');
        return bookedSlots[dateString]?.includes(time);
    };

    const canGoBack = !isSameMonth(currentMonth, today);
    const canGoForward = !isSameMonth(currentMonth, maxDate);

    const handlePreviousMonth = () => canGoBack && setCurrentMonth(subMonths(currentMonth, 1));
    const handleNextMonth = () => canGoForward && setCurrentMonth(addMonths(currentMonth, 1));

    return (
        <div className="w-full max-w-lg mx-auto relative">
             <AnimatePresence>
                {isTransitioning && (
                    <motion.div
                        key="circle-wipe-in"
                        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md origin-center"
                        initial={{ clipPath: "circle(0% at 50% 100%)" }}
                        animate={{ clipPath: "circle(150% at 50% 100%)", transition: { duration: 1.4, ease: [0.76, 0, 0.24, 1] } }}
                    />
                )}
            </AnimatePresence>
             <motion.div 
                className="bg-black/30 backdrop-blur-md rounded-2xl border border-gray-700 shadow-2xl shadow-primary/10 overflow-hidden relative flex flex-col min-h-[640px]"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            >
                <FormProvider {...methods}>
                 <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <div className="p-6 text-left">
                        <p className="text-sm text-white/60">Timpia AI Team</p>
                        <h2 className="text-3xl font-bold text-white mt-1">Aplică pentru propriul tău angajat AI</h2>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-2 text-white/60 mt-4 text-sm">
                            <div className="flex items-center gap-2"><Clock className="h-4 w-4" /><span>30 min</span></div>
                            <div className="flex items-center gap-2"><Video className="h-4 w-4" /><span>Detalii conferință web la confirmare</span></div>
                        </div>
                        <div className="text-white/80 text-sm mt-6 space-y-2">
                            <p>Programează o discuție și hai să vedem cum îți putem transforma afacerea.</p>
                        </div>
                    </div>

                    <hr className="border-gray-700"/>
                    
                    <div className="relative overflow-hidden flex flex-col min-h-[420px]">
                        <AnimatePresence mode="wait" custom={direction}>
                            {view === 'date' && (
                                <motion.div key="date-view" custom={direction} variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="p-6">
                                    <h3 className="text-lg font-semibold text-center mb-4 text-white">Selectează o dată</h3>
                                    <div className="flex justify-between items-center mb-4">
                                        <Button
                                            type="button"
                                            aria-label="Luna precedentă"
                                            variant="ghost"
                                            size="icon"
                                            onClick={handlePreviousMonth}
                                            disabled={!canGoBack}
                                        >
                                            <ChevronLeft />
                                        </Button>
                                        <h4 className="text-lg font-semibold text-center capitalize text-white">{format(currentMonth, 'MMMM yyyy', { locale: ro })}</h4>
                                        <Button
                                            type="button"
                                            aria-label="Luna următoare"
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleNextMonth}
                                            disabled={!canGoForward}
                                        >
                                            <ChevronRight />
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-2">
                                        {['L', 'M', 'Mi', 'J', 'V', 'S', 'D'].map(day => <div key={day}>{day}</div>)}
                                    </div>
                                    <div className="grid grid-cols-7 gap-1">
                                        {Array.from({ length: startingDayIndex }).map((_, i) => <div key={`empty-${i}`} />)}
                                        {daysInMonth.map((day, i) => {
                                            const isPast = isBefore(day, today);
                                            const fullyBooked = isDayFullyBooked(day);
                                            const isDisabled = isPast || fullyBooked;

                                            return (
                                                <motion.button
                                                    key={i} type="button" disabled={isDisabled} onClick={() => handleDateSelect(day)}
                                                    className={cn( "h-10 w-10 rounded-full flex items-center justify-center text-sm transition-colors duration-200", isDisabled ? "text-gray-600 cursor-not-allowed" : "text-white", !isDisabled && "hover:bg-primary/20", isSameDay(day, selectedDate || new Date(0)) && "bg-primary text-white font-bold" )}
                                                    whileHover={{ scale: isDisabled ? 1 : 1.1 }} whileTap={{ scale: isDisabled ? 1 : 0.95 }}
                                                >
                                                    {format(day, 'd')}
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                            {view === 'time' && selectedDate && (
                                <motion.div key="time-view" custom={direction} variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="p-6 flex flex-col h-full">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Button
                                            type="button"
                                            aria-label="Înapoi la selectarea datei"
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 -ml-2"
                                            onClick={() => handleBack('date')}
                                        >
                                            <ChevronLeft />
                                        </Button>
                                        <div><h3 className="font-semibold text-white">Selectează ora</h3><p className="text-primary text-sm font-bold capitalize">{format(selectedDate, 'eeee, d MMMM', { locale: ro })}</p></div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 flex-grow overflow-y-auto">
                                        {isFetchingSlots ? <div className="col-span-3 flex justify-center items-center h-32"><Loader2 className="animate-spin text-primary"/></div> : generateTimeSlots(selectedDate).map((time, i) => (
                                            <motion.button key={time} type="button" custom={i} variants={timeSlotVariants} initial="hidden" animate="visible" disabled={isTimeSlotBooked(selectedDate, time)} onClick={() => handleTimeSelect(time)}
                                                className={cn( "p-3 rounded-lg border text-sm font-semibold transition-all h-11", isTimeSlotBooked(selectedDate, time) ? "bg-gray-800 text-gray-600 border-gray-700 cursor-not-allowed line-through" : "bg-gray-900 border-gray-700 hover:bg-primary hover:text-white hover:border-primary" )}>
                                                {time}
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                             {view === 'details' && (
                                <motion.div key="details-view" custom={direction} variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Button
                                            type="button"
                                            aria-label="Înapoi la selectarea orei"
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 -ml-2"
                                            onClick={() => handleBack('time')}
                                        >
                                            <ChevronLeft />
                                        </Button>
                                        <h3 className="font-semibold text-white">Hai să ne cunoaștem!</h3>
                                    </div>
                                    <div className="space-y-4">
                                        {renderStandardField('fullName', 'Numele complet', 'Ex: Andrei Popescu')}
                                        {renderStandardField('companyEmail', 'Adresa de email', 'Ex: andrei@firma.ro', 'email')}
                                        {renderStandardField('phone', 'Nr. de telefon', 'Ex: 0722123456', 'tel')}
                                        {renderStandardField('companyName', 'Numele companiei', 'Ex: NovaTech SRL')}
                                        <Button type="button" onClick={handleNext} className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11">Continuă</Button>
                                    </div>
                                </motion.div>
                            )}
                             {view === 'impact' && (
                                <motion.div key="impact-view" custom={direction} variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Button
                                            type="button"
                                            aria-label="Înapoi la detalii"
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 -ml-2"
                                            onClick={() => handleBack('details')}
                                        >
                                            <ChevronLeft />
                                        </Button>
                                        <h3 className="font-semibold flex items-center gap-2 text-white"><TrendingUp className="h-5 w-5 text-primary"/>Impact estimat</h3>
                                    </div>
                                     <FormField control={methods.control} name="impactLevel" render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel className="text-white/90">Cât de mult crezi că îți va ajuta un angajat AI afacerea?</FormLabel>
                                            <FormControl>
                                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                                                    {[
                                                        {value: "extrem", label: "Extrem de mult"},
                                                        {value: "semnificativ", label: "Destul de semnificativ"},
                                                        {value: "nesigur", label: "Nu știu exact"},
                                                    ].map((item) => (
                                                        <motion.div key={item.value} whileHover={{scale: 1.02}}>
                                                            <Label htmlFor={`impact-${item.value}`} className={cn(
                                                                "flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                                field.value === item.value ? "border-primary bg-primary/10" : "border-gray-700 bg-gray-900 hover:border-primary/50"
                                                            )}>
                                                                <span className="font-semibold text-white/90">{item.label}</span>
                                                                <div className="h-6 w-6 rounded-full border-2 border-gray-600 flex items-center justify-center shrink-0">
                                                                    {field.value === item.value && <motion.div initial={{scale:0}} animate={{scale:1}} className="h-3 w-3 rounded-full bg-primary"/>}
                                                                </div>
                                                                <RadioGroupItem value={item.value} id={`impact-${item.value}`} className="sr-only" />
                                                            </Label>
                                                        </motion.div>
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage className="text-red-400 text-xs"/>
                                        </FormItem>
                                    )} />
                                     <Button type="button" onClick={handleNext} className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11 mt-4">Continuă</Button>
                                </motion.div>
                            )}
                             {view === 'budget' && (
                                <motion.div key="budget-view" custom={direction} variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="p-6">
                                     <div className="flex items-center gap-2 mb-4">
                                        <Button
                                            type="button"
                                            aria-label="Înapoi la impact estimat"
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 -ml-2"
                                            onClick={() => handleBack('impact')}
                                        >
                                            <ChevronLeft />
                                        </Button>
                                        <h3 className="font-semibold flex items-center gap-2 text-white"><DollarSign className="h-5 w-5 text-primary"/>Buget</h3>
                                    </div>
                                    <FormField control={methods.control} name="budget" render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel className="text-white/90">Care este bugetul alocat pentru a-ți scala afacerea prin automatizări?</FormLabel>
                                            <FormControl>
                                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                                                    {[
                                                        {value: "sub-1000", label: "sub 1000 EUR"},
                                                        {value: "1000-2000", label: "1000–2000 EUR"},
                                                        {value: "peste-2000", label: "peste 2000 EUR"},
                                                    ].map((item) => (
                                                         <motion.div key={item.value} whileHover={{scale: 1.02}}>
                                                            <Label htmlFor={`budget-${item.value}`} className={cn(
                                                                "flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                                field.value === item.value ? "border-primary bg-primary/10" : "border-gray-700 bg-gray-900 hover:border-primary/50"
                                                            )}>
                                                                <span className="font-semibold text-white/90">{item.label}</span>
                                                                <div className="h-6 w-6 rounded-full border-2 border-gray-600 flex items-center justify-center shrink-0">
                                                                    {field.value === item.value && <motion.div initial={{scale:0}} animate={{scale:1}} className="h-3 w-3 rounded-full bg-primary"/>}
                                                                </div>
                                                                <RadioGroupItem value={item.value} id={`budget-${item.value}`} className="sr-only" />
                                                            </Label>
                                                        </motion.div>
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage className="text-red-400 text-xs"/>
                                        </FormItem>
                                    )} />
                                     <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11 mt-6">
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : <div className="flex items-center gap-2"><Send className="h-4 w-4"/>Confirmă Programarea</div>}
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </form>
                </FormProvider>
                 <div className="p-4 border-t border-gray-700">
                    <div className="flex items-center justify-center text-sm text-white/60 gap-2"><Globe className="h-4 w-4" /><span>{timeZone} ({currentTime})</span></div>
                 </div>
            </motion.div>
        </div>
    );
}
