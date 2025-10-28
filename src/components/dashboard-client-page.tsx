// src/components/dashboard-client-page.tsx
"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { onSnapshot, doc, collection, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { BarChart, Clock, Loader2, Globe, MessageSquare, Briefcase, LayoutGrid, PhoneCall, MessagesSquare, Database, ListOrdered, FileText, Play, Pause, Download, Phone as PhoneIcon, Send, Brain, Link2, UploadCloud, ClipboardList, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Logo from './logo';
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DataTable } from '@/components/data-table';
import { generateDynamicColumns } from '@/components/leads-columns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ColumnDef } from '@tanstack/react-table';

// --- Interfaces ---
interface Transcript {
    id: string;
    timestamp: { seconds: number; nanoseconds: number; } | null;
    transcript: string;
    duration?: number;
    outcome?: string;
    recordingUrl?: string;
    summary?: string;
    call_id: string;
    caller_phone_number?: string;
}

interface ChatMessage {
    id: string;
    timestamp: { seconds: number; nanoseconds: number; } | null;
    message: string;
    country: string;
    platform?: string;
    sessionId?: string;
}

interface SmsLog {
    id: string;
    timestamp: { seconds: number; nanoseconds: number; } | null;
    message: string;
    phoneNumber: string;
}

type GroupedChatMessages = Record<string, ChatMessage[]>;

// A generic lead type to handle dynamic fields
export type Lead = {
  id: string;
  timestamp: { seconds: number; nanoseconds: number; } | null;
  [key: string]: any; // Allow any other string keys
}


interface DashboardData {
    clientName?: string;
    stats?: {
        totalCalls?: number;
        avgDuration?: number;
        totalMessages?: number;
        totalSms?: number;
        lastSmsMessage?: string;
        lastSmsPhoneNumber?: string;
        status?: string;
    };
    callTranscripts?: Transcript[];
    chatMessagesBySession?: GroupedChatMessages;
    allChatMessages?: ChatMessage[];
    leads?: Lead[];
    smsLogs?: SmsLog[];
}

interface TabItem {
    value: string;
    label: string;
    icon: React.ElementType;
}

interface DashboardClientPageProps {
    clientName: string;
    initialData?: DashboardData;
}

// --- Constants ---
const CALL_LIMIT = 200;
const MESSAGE_LIMIT = 4000;
const SMS_LIMIT = 1000;

// --- Components ---
const StatCard = ({ icon: Icon, title, value, unit, limit, description, status }: { icon: React.ElementType, title: string, value: string | number, unit?: string, limit?: number, description?: string, status?: string }) => {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    const progressValue = limit && numericValue ? (numericValue / limit) * 100 : 0;
    
    const getStatusColor = (status: string | undefined) => {
        switch (status?.toLowerCase()) {
            case 'activ':
                return 'text-green-500';
            case 'ofertă trimisă':
                return 'text-blue-500';
            case 'lead calificat':
                return 'text-yellow-500';
            default:
                return 'text-muted-foreground';
        }
    };

    return (
        <motion.div
            className="bg-card p-5 rounded-xl shadow-md border border-border/20 flex flex-col justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 15 }}
        >
            <div>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                            <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">{title}</p>
                            <p className="text-2xl font-bold text-foreground">
                                {value} <span className="text-lg font-medium text-muted-foreground">{unit}</span>
                            </p>
                        </div>
                    </div>
                     {status && (
                        <div className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusColor(status)} bg-opacity-10`}>
                            {status}
                        </div>
                    )}
                </div>
                 {description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
            </div>
            {limit !== undefined && (
                <div className="mt-4">
                     <Progress value={progressValue} className="h-2" />
                     <p className="text-xs text-right text-muted-foreground mt-1.5">
                         {numericValue.toLocaleString('ro-RO')} / {limit.toLocaleString('ro-RO')}
                     </p>
                </div>
            )}
        </motion.div>
    );
};

const formatFlexibleTimestamp = (input: any) => {
    if (!input) return 'N/A';

    let date: Date | null = null;

    if (typeof input === 'object') {
        const seconds =
            typeof input.seconds === 'number'
                ? input.seconds
                : typeof input._seconds === 'number'
                    ? input._seconds
                    : undefined;
        const nanoseconds =
            typeof input.nanoseconds === 'number'
                ? input.nanoseconds
                : typeof input._nanoseconds === 'number'
                    ? input._nanoseconds
                    : 0;
        if (seconds !== undefined) {
            date = new Date(seconds * 1000 + Math.floor(nanoseconds / 1_000_000));
        }
    }

    if (!date && (typeof input === 'string' || typeof input === 'number')) {
        const parsed = new Date(input);
        if (!Number.isNaN(parsed.getTime())) {
            date = parsed;
        }
    }

    if (!date || Number.isNaN(date.getTime())) return 'N/A';

    return new Intl.DateTimeFormat('ro-RO', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date);
};

const formatTimestamp = (ts: Transcript['timestamp']) => formatFlexibleTimestamp(ts);

const TranscriptCard = ({ transcript }: { transcript: Transcript }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));
            }
        }
    };
    
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    let details = `Durată: ${transcript.duration || 'N/A'}s | Rezultat: ${transcript.outcome || 'N/A'}`;
    if (transcript.caller_phone_number) {
        details += ` | Apelant: ${transcript.caller_phone_number}`;
    }


    return (
        <Accordion type="single" collapsible className="w-full bg-card rounded-lg shadow-sm border border-border/15">
            <AccordionItem value={transcript.id} className="border-b-0">
                <AccordionTrigger className="px-4 py-3 hover:no-underline text-left">
                     <div className="flex-grow">
                        <p className="font-mono text-sm text-primary font-semibold truncate">Apel ID: {transcript.call_id}</p>
                        <p className="text-xs text-muted-foreground mt-1">{details} | {formatTimestamp(transcript.timestamp)}</p>
                     </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 space-y-4">
                    {transcript.recordingUrl && (
                        <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-md border">
                            <audio ref={audioRef} src={transcript.recordingUrl} className="hidden" preload="metadata"/>
                            <button onClick={togglePlay} className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
                                {isPlaying ? <Pause className="h-5 w-5"/> : <Play className="h-5 w-5"/>}
                            </button>
                            <span className="text-sm font-medium">Redare Înregistrare</span>
                            <a href={transcript.recordingUrl} download={`inregistrare_${transcript.call_id}.mp3`} target="_blank" rel="noopener noreferrer" className="ml-auto p-2 text-muted-foreground hover:text-foreground">
                                <Download className="h-5 w-5"/>
                            </a>
                        </div>
                    )}
                    {transcript.summary && (
                        <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><ListOrdered className="h-4 w-4"/> Sumar Apel</h4>
                            <div className="text-sm text-foreground/90 bg-muted/30 p-3 rounded-md italic whitespace-pre-wrap">
                                {transcript.summary}
                            </div>
                        </div>
                    )}
                     <div>
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><FileText className="h-4 w-4"/> Transcriere Completă</h4>
                        <div className="text-sm text-foreground/90 whitespace-pre-wrap font-mono text-[13px] leading-relaxed max-h-60 overflow-y-auto bg-muted/30 p-3 rounded-md">
                           {transcript.transcript || "Transcriere indisponibilă."}
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
};

const formatChatTimestamp = (ts: ChatMessage['timestamp']) => formatFlexibleTimestamp(ts);

const ParticipantBadge = ({ label }: { label: 'client' | 'ai' }) => (
    <span
        className={cn(
            'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide',
            label === 'client'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                : 'bg-primary/10 text-primary'
        )}
    >
        {label === 'client' ? 'Client' : 'AI'}
    </span>
);

const MarkdownBubble = ({ content }: { content: string }) => (
    <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:mt-0 prose-headings:mb-1 prose-p:my-1 prose-ul:my-1 prose-ol:my-1">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
);

const parseMessageSegments = (raw: string, fallback: 'client' | 'ai') => {
    const segments: { role: 'client' | 'ai'; content: string }[] = [];
    if (!raw) return segments;

    const regex = /(?:^|\n)\s*(Client|AI)\s*:\s*/gi;
    let match: RegExpExecArray | null;
    let lastIndex = 0;
    let currentRole: 'client' | 'ai' = fallback;
    let sawPrefix = false;

    while ((match = regex.exec(raw)) !== null) {
        const preceding = raw.slice(lastIndex, match.index).trim();
        if (preceding) {
            segments.push({ role: currentRole, content: preceding });
        }
        currentRole = match[1].toLowerCase() === 'client' ? 'client' : 'ai';
        lastIndex = regex.lastIndex;
        sawPrefix = true;
    }

    const tail = raw.slice(lastIndex).trim();
    if (tail) {
        segments.push({ role: sawPrefix ? currentRole : fallback, content: tail });
    }

    if (!segments.length && raw.trim()) {
        segments.push({ role: fallback, content: raw.trim() });
    }

    return segments;
};

const ConversationCard = ({ sessionId, messages }: { sessionId: string; messages: ChatMessage[] }) => {
    const firstMessage = messages[0];
    const country = firstMessage?.country || 'N/A';
    const platform = firstMessage?.platform || 'N/A';

    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={sessionId} className="border border-border/15 rounded-3xl bg-card/60 backdrop-blur">
                <AccordionTrigger className="px-6 py-4 hover:no-underline text-left">
                    <div className="flex flex-wrap items-center justify-between gap-3 w-full">
                        <div className="min-w-0">
                            <p className="font-semibold text-sm text-foreground truncate">Sesiune {sessionId}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {messages.length} mesaje · {platform} · {country}
                            </p>
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                            Ultima activitate<br />
                            {formatChatTimestamp(messages[messages.length - 1]?.timestamp)}
                        </div>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 space-y-3">
                    <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-1">
                        {messages.map((msg, index) => {
                            const fallbackRole: 'client' | 'ai' = index % 2 === 0 ? 'client' : 'ai';
                            const segments = parseMessageSegments(msg.message ?? '', fallbackRole);
                            return segments.map((segment, segIndex) => (
                                <div
                                    key={`${msg.id}-${segIndex}`}
                                    className={cn(
                                        'rounded-2xl border border-border/20 px-4 py-3 shadow-sm transition',
                                        segment.role === 'client'
                                            ? 'bg-emerald-500/5'
                                            : 'bg-primary/5'
                                    )}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <ParticipantBadge label={segment.role} />
                                        <span className="text-[11px] text-muted-foreground">
                                            {formatChatTimestamp(msg.timestamp)}
                                        </span>
                                    </div>
                                    <div className="mt-2 text-foreground text-sm">
                                        <MarkdownBubble content={segment.content} />
                                    </div>
                                </div>
                            ));
                        })}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

const SmsLogCard = ({ smsLog }: { smsLog: SmsLog }) => {
const formatSmsTimestamp = (ts: SmsLog['timestamp']) => formatFlexibleTimestamp(ts);

    return (
        <div className="bg-card p-4 rounded-lg shadow-sm border border-border/15">
            <div className="flex justify-between items-start text-xs text-muted-foreground mb-2">
                <p className="font-semibold text-primary">Destinatar: {smsLog.phoneNumber}</p>
                <p>{formatSmsTimestamp(smsLog.timestamp)}</p>
            </div>
            <p className="text-sm text-foreground/90">{smsLog.message}</p>
        </div>
    );
};


const CountryChart = ({ messages }: { messages: ChatMessage[] }) => {
    const countryData = useMemo(() => {
        const counts = messages.reduce((acc, msg) => {
            const country = msg.country || "Necunoscută";
            acc[country] = (acc[country] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(counts)
            .map(([country, count]) => ({ country, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }, [messages]);

    if (!messages || messages.length === 0) return (
         <div className="bg-card p-5 rounded-xl shadow-md border border-border/20 h-[300px] flex items-center justify-center text-muted-foreground">
            <Globe className="h-8 w-8 mr-2"/> Nu există date despre țări.
        </div>
    );

    return (
        <div className="bg-card p-5 rounded-xl shadow-md border border-border/20 h-[300px]">
             <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-foreground">
                <Globe className="h-5 w-5 text-primary"/> Origine Mesaje (Top 5 Țări)
            </h3>
            <ChartContainer config={{ count: { label: "Mesaje", color: "hsl(var(--primary))" } }} className="w-full h-[200px]">
                <ResponsiveContainer>
                    <RechartsBarChart data={countryData} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="country" type="category" tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} width={80} />
                        <Tooltip
                            cursor={{fill: 'hsl(var(--muted))'}}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={4} barSize={20} />
                    </RechartsBarChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
    );
};

const PlatformChart = ({ messages }: { messages: ChatMessage[] }) => {
    const platformData = useMemo(() => {
        const counts = messages.reduce((acc, msg) => {
            const platform = msg.platform || "Necunoscută";
            acc[platform] = (acc[platform] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(counts)
            .map(([platform, count]) => ({ platform, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }, [messages]);

    if (!messages || messages.length === 0) return (
        <div className="bg-card p-5 rounded-xl shadow-md border border-border/20 h-[300px] flex items-center justify-center text-muted-foreground">
            <Briefcase className="h-8 w-8 mr-2"/> Nu există date despre platforme.
        </div>
    );

    return (
        <div className="bg-card p-5 rounded-xl shadow-md border border-border/20 h-[300px]">
             <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-foreground">
                <Briefcase className="h-5 w-5 text-primary"/> Origine Mesaje (Top 5 Platforme)
            </h3>
            <ChartContainer config={{ count: { label: "Mesaje", color: "hsl(var(--chart-2))" } }} className="w-full h-[200px]">
                <ResponsiveContainer>
                    <RechartsBarChart data={platformData} margin={{}}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="platform" tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                        <YAxis hide />
                        <Tooltip
                            cursor={{fill: 'hsl(var(--muted))'}}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={4} />
                    </RechartsBarChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
    );
};

const ModeBadge = ({ step }: { step: number }) => (
    <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
        Mod {step}
    </span>
);

const TrainingCard = ({
    step,
    icon: Icon,
    title,
    description,
    children,
}: {
    step: number;
    icon: React.ElementType;
    title: string;
    description: string;
    children: React.ReactNode;
}) => (
    <Card className="h-full border border-border/40 shadow-sm transition hover:shadow-md">
        <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-4">
                <ModeBadge step={step} />
                <Icon className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">{description}</p>
        </CardHeader>
        <CardContent className="space-y-4">{children}</CardContent>
    </Card>
);


// --- Main Page Component ---
export default function DashboardClientPage({ clientName, initialData }: DashboardClientPageProps) {
    const [data, setData] = useState<DashboardData>(initialData ?? {});
    const [isLoading, setIsLoading] = useState(!initialData);
    const [dynamicLeadColumns, setDynamicLeadColumns] = useState<ColumnDef<Lead>[]>([]);
    const { toast } = useToast();

    const normalizedClientName = useMemo(() => clientName.replace(/[\s_-]/g, '').toLowerCase(), [clientName]);
    const isMarketManager = normalizedClientName === 'marketmanager';
    const webhookUrl = 'https://n8n-mui5.onrender.com/webhook/9ce8d3aa-6843-4c15-ba89-7d610083d709';

    const [websiteUrl, setWebsiteUrl] = useState('');
    const [websiteNotes, setWebsiteNotes] = useState('');
    const [isSubmittingUrl, setIsSubmittingUrl] = useState(false);
    const [trainingFile, setTrainingFile] = useState<File | null>(null);
    const [isSubmittingFile, setIsSubmittingFile] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [trainingText, setTrainingText] = useState('');
    const [isSubmittingText, setIsSubmittingText] = useState(false);
    const [activeTab, setActiveTab] = useState<string>('overview');

    useEffect(() => {
        setActiveTab('overview');
    }, [clientName]);

    useEffect(() => {
        if (initialData) {
            setData(prev => ({
                ...prev,
                ...initialData,
                allChatMessages: initialData.allChatMessages ?? initialData.chatMessages ?? prev.allChatMessages ?? [],
            }));
            setIsLoading(false);
        }
    }, [initialData]);

    const tabItems = useMemo<TabItem[]>(() => {
        if (isMarketManager) {
            return [
                { value: 'overview', label: 'Rezumat', icon: LayoutGrid },
                { value: 'leads', label: 'Bază Date Clienți', icon: Database },
                { value: 'messages', label: 'Mesaje Chat', icon: MessagesSquare },
                { value: 'training', label: 'Antrenează', icon: Brain },
            ];
        }

        return [
            { value: 'overview', label: 'Rezumat', icon: LayoutGrid },
            { value: 'leads', label: 'Bază Date Clienți', icon: Database },
            { value: 'calls', label: 'Apeluri', icon: PhoneCall },
            { value: 'messages', label: 'Mesaje Chat', icon: MessagesSquare },
            { value: 'sms', label: 'SMS-uri', icon: Send },
        ];
    }, [isMarketManager]);

    const tabGridClass = isMarketManager ? "md:grid-cols-4" : "md:grid-cols-5";
    const defaultCollections = useMemo(
        () => (isMarketManager ? ['leads', 'chatMessages'] : ['leads', 'callTranscripts', 'chatMessages', 'smsLogs']),
        [isMarketManager]
    );

    const handleWebsiteSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!websiteUrl.trim()) {
            toast({ title: 'Adresă web necesară', description: 'Introdu o adresă web completă înainte de a trimite.', variant: 'destructive' });
            return;
        }

        setIsSubmittingUrl(true);
        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientId: clientName,
                    sourceType: 'website',
                    url: websiteUrl.trim(),
                    notes: websiteNotes.trim() || undefined,
                }),
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || 'Trimiterea URL-ului a eșuat.');
            }

            toast({ title: 'URL trimis', description: 'Adresa web a fost transmisă pentru antrenarea chatbot-ului.' });
            setWebsiteUrl('');
            setWebsiteNotes('');
        } catch (error: any) {
            console.error('MarketManager URL submit error:', error);
            toast({ title: 'Eroare la trimitere', description: error.message || 'Nu am putut trimite URL-ul.', variant: 'destructive' });
        } finally {
            setIsSubmittingUrl(false);
        }
    };

    const handleFileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!trainingFile) {
            toast({ title: 'Selectează un fișier', description: 'Alege un fișier PDF, Word sau Excel de încărcat.', variant: 'destructive' });
            return;
        }

        setIsSubmittingFile(true);
        try {
            const formData = new FormData();
            formData.append('clientId', clientName);
            formData.append('sourceType', 'file');
            formData.append('file', trainingFile);
            const fileExtension = trainingFile.name.split('.').pop()?.toLowerCase() ?? '';
            formData.append('originalFilename', trainingFile.name);
            if (fileExtension) {
                formData.append('fileExtension', fileExtension);
            }

            const response = await fetch(webhookUrl, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || 'Încărcarea fișierului a eșuat.');
            }

            toast({ title: 'Fișier trimis', description: `${trainingFile.name} a fost transmis pentru antrenare.` });
            setTrainingFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error: any) {
            console.error('MarketManager file submit error:', error);
            toast({ title: 'Eroare la încărcare', description: error.message || 'Nu am putut trimite fișierul.', variant: 'destructive' });
        } finally {
            setIsSubmittingFile(false);
        }
    };

    const handleTextSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!trainingText.trim()) {
            toast({ title: 'Text necesar', description: 'Adaugă conținutul pe care vrei să îl învețe chatbot-ul.', variant: 'destructive' });
            return;
        }

        setIsSubmittingText(true);
        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientId: clientName,
                    sourceType: 'text',
                    content: trainingText.trim(),
                }),
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || 'Trimiterea textului a eșuat.');
            }

            toast({ title: 'Conținut trimis', description: 'Textul a fost transmis pentru antrenare.' });
            setTrainingText('');
        } catch (error: any) {
            console.error('MarketManager text submit error:', error);
            toast({ title: 'Eroare la trimitere', description: error.message || 'Nu am putut trimite textul.', variant: 'destructive' });
        } finally {
            setIsSubmittingText(false);
        }
    };

    useEffect(() => {
        // Fetch all data for the client on initial load
        const fetchAllData = async () => {
            if (!initialData) {
                setIsLoading(true);
            }
            try {
                const response = await fetch('/api/get-client-data', {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        clientName,
                        collections: defaultCollections,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Failed to fetch data: ${response.statusText}`);
                }
                
                const fetchedData = await response.json();
                const normalizedData: DashboardData = {
                    ...fetchedData,
                    allChatMessages: fetchedData.allChatMessages ?? fetchedData.chatMessages ?? [],
                };
                setData(normalizedData);

                // Dynamically generate columns based on the fetched lead data
                if (normalizedData.leads && normalizedData.leads.length > 0) {
                    setDynamicLeadColumns(generateDynamicColumns(normalizedData.leads));
                }

            } catch (error) {
                console.error("Error fetching client data:", error);
                setData(prev => ({
                    clientName,
                    ...prev,
                }));
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchAllData();

        // Setup real-time listeners for updates
        const unsubDoc = onSnapshot(doc(db, 'ClientDashboard', clientName), (doc) => {
            if (doc.exists()) setData(prev => ({ ...prev, ...doc.data() }));
        });
        
        const unsubLeads = onSnapshot(query(collection(db, 'ClientDashboard', clientName, 'leads'), orderBy('timestamp', 'desc')), (snapshot) => {
            const leads = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Lead));
            setData(prev => ({ ...prev, leads }));
            if (leads.length > 0) {
                setDynamicLeadColumns(generateDynamicColumns(leads));
            }
        });

        // Add other listeners as needed (calls, messages, etc.)
        const unsubCalls = !isMarketManager
            ? onSnapshot(query(collection(db, 'ClientDashboard', clientName, 'callTranscripts'), orderBy('timestamp', 'desc')), (snapshot) => {
                setData(prev => ({ ...prev, callTranscripts: snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Transcript)) }));
            })
            : null;

        const unsubMessages = onSnapshot(query(collection(db, 'ClientDashboard', clientName, 'chatMessages'), orderBy('timestamp', 'desc')), (snapshot) => {
            setData(prev => ({ ...prev, allChatMessages: snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ChatMessage)) }));
        });

        const unsubSms = !isMarketManager
            ? onSnapshot(query(collection(db, 'ClientDashboard', clientName, 'smsLogs'), orderBy('timestamp', 'desc')), (snapshot) => {
                setData(prev => ({ ...prev, smsLogs: snapshot.docs.map(d => ({ id: d.id, ...d.data() } as SmsLog)) }));
            })
            : null;


        return () => {
            unsubDoc();
            unsubLeads();
            if (unsubCalls) unsubCalls();
            unsubMessages();
            if (unsubSms) unsubSms();
        };

    }, [clientName, initialData, isMarketManager, defaultCollections]);
    
    const chatMessagesBySession = useMemo(() => {
        if (!data.allChatMessages) return {};
        const grouped = data.allChatMessages.reduce((acc, msg) => {
            const sessionId = msg.sessionId || 'unknown_session';
            if (!acc[sessionId]) acc[sessionId] = [];
            acc[sessionId].push(msg);
            return acc;
        }, {} as GroupedChatMessages);

        Object.keys(grouped).forEach(sessionId => {
            grouped[sessionId].sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0));
        });
        return grouped;
    }, [data.allChatMessages]);

    const calculatedAvgDuration = useMemo(() => {
        if (!data.callTranscripts || data.callTranscripts.length === 0) {
            return 0;
        }
        const validDurations = data.callTranscripts
            .map(t => t.duration)
            .filter((d): d is number => typeof d === 'number' && d > 0);
        
        if (validDurations.length === 0) {
            return 0;
        }

        const sum = validDurations.reduce((acc, curr) => acc + curr, 0);
        return Math.round(sum / validDurations.length);
    }, [data.callTranscripts]);


    if (isLoading) {
        return (
          <div className="flex justify-center items-center h-screen flex-col gap-4">
             <Loader2 className="h-8 w-8 animate-spin text-primary"/>
             <p className="text-muted-foreground">Se încarcă dashboard-ul pentru {clientName}...</p>
          </div>
        );
    }
    
    const smsDescription = data.stats?.lastSmsMessage && data.stats?.lastSmsPhoneNumber
        ? `Ultimul SMS: "${data.stats.lastSmsMessage.substring(0, 30)}..." la ${data.stats.lastSmsPhoneNumber}`
        : "Niciun SMS trimis recent.";

    const overviewStats = isMarketManager
        ? [
            {
                icon: MessagesSquare,
                title: 'Total mesaje procesate',
                value: data.allChatMessages?.length ?? 0,
                description: 'Conversații gestionate de MarketManager.',
            },
            {
                icon: Database,
                title: 'Lead-uri colectate',
                value: data.leads?.length ?? 0,
                description: 'Contacte generate direct din chat.',
            },
            {
                icon: Brain,
                title: 'Moduri de antrenare',
                value: 3,
                description: 'URL, document și text manual disponibile.',
            },
        ]
        : [
            {
                icon: PhoneIcon,
                title: 'Total Apeluri Procesate',
                value: data.stats?.totalCalls || 0,
                limit: CALL_LIMIT,
                status: data.stats?.status,
            },
            {
                icon: MessageSquare,
                title: 'Total Mesaje Chat',
                value: data.stats?.totalMessages || 0,
                limit: MESSAGE_LIMIT,
            },
            {
                icon: Send,
                title: 'Total SMS Trimise',
                value: data.stats?.totalSms || 0,
                limit: SMS_LIMIT,
                description: smsDescription,
            },
            {
                icon: Clock,
                title: 'Durată Medie Apel',
                value: calculatedAvgDuration,
                unit: 'sec',
                description: 'Calculată pe ultimele apeluri.',
            },
        ];

    const statGridClass = isMarketManager ? 'lg:grid-cols-3' : 'lg:grid-cols-4';


    return (
        <div className="p-4 sm:p-6 md:p-8">
            <header className="mb-10">
                <div className="relative overflow-hidden rounded-3xl border border-border/20 bg-gradient-to-br from-primary/15 via-background to-background">
                    <div className="absolute left-16 top-0 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
                    <div className="absolute right-10 -bottom-12 h-40 w-40 rounded-full bg-emerald-300/20 blur-3xl" />
                    <div className="relative flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background/80 shadow-inner">
                                <Logo width={30} height={30} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs uppercase tracking-wider text-muted-foreground">Panou client</p>
                                <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
                                    Bun venit, {data.clientName || clientName}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Ai la dispoziție analize în timp real și un centru de antrenare dedicat.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                            {isMarketManager && (
                                <Button
                                    variant="outline"
                                    className="bg-background/80"
                                    onClick={() => setActiveTab('training')}
                                >
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Antrenează acum
                                </Button>
                            )}
                            <Button asChild variant="ghost" className="text-muted-foreground">
                                <Link href="/">Înapoi la site</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className={cn("grid w-full grid-cols-2 max-w-3xl mx-auto mb-8", tabGridClass)}>
                        {tabItems.map(({ value, label, icon: Icon }) => (
                            <TabsTrigger
                                key={value}
                                value={value}
                                className="flex items-center justify-center gap-2"
                            >
                                <Icon className="h-4 w-4" />
                                {label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    
                    <TabsContent value="overview">
                        <div className="space-y-8">
                             <section>
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><BarChart className="h-5 w-5"/> Statistici Generale</h2>
                                <div className={cn('grid grid-cols-1 sm:grid-cols-2 gap-4', statGridClass)}>
                                    {overviewStats.map((stat) => (
                                        <StatCard
                                            key={stat.title}
                                            icon={stat.icon}
                                            title={stat.title}
                                            value={stat.value}
                                            unit={stat.unit}
                                            limit={stat.limit}
                                            description={stat.description}
                                            status={stat.status}
                                        />
                                    ))}
                                </div>
                                {isMarketManager && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="mt-4 inline-flex items-center gap-2"
                                        onClick={() => setActiveTab('training')}
                                    >
                                        <Sparkles className="h-4 w-4" />
                                        Deschide modul de antrenare
                                    </Button>
                                )}
                            </section>

                            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <CountryChart messages={data.allChatMessages || []} />
                                <PlatformChart messages={data.allChatMessages || []} />
                            </section>
                        </div>
                    </TabsContent>

                    {isMarketManager && (
                        <TabsContent value="training">
                            <section className="space-y-8">
                                <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/15 via-background to-background p-6 sm:p-8 shadow-sm">
                                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                                                <Brain className="h-6 w-6 text-primary" />
                                                Antrenează chatbot-ul MarketManager
                                            </h2>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Trimite câte un singur tip de informație pe rând prin unul dintre cele trei moduri disponibile.
                                            </p>
                                        </div>
                                        <span className="inline-flex items-center rounded-full border border-primary/30 bg-background/70 px-4 py-1 text-xs font-semibold text-primary">
                                            Client: {clientName}
                                        </span>
                                    </div>
                                    <ul className="mt-4 space-y-2 text-sm text-foreground/80 list-disc list-inside">
                                        <li>Mod URL: trimite pagina principală sau o secțiune bogată în conținut.</li>
                                        <li>Mod Document: adaugă PDF, Word, Excel ori CSV cu informații detaliate.</li>
                                        <li>Mod Text: lipește rapid scripturi, proceduri sau descrieri importante.</li>
                                    </ul>
                                </div>

                                <div className="grid gap-6 lg:grid-cols-3">
                                    <TrainingCard
                                        step={1}
                                        icon={Link2}
                                        title="Trimite o adresă web (obligatoriu)"
                                        description="Vom parcurge automat pagina pentru a extrage conținutul relevant."
                                    >
                                        <form onSubmit={handleWebsiteSubmit} className="space-y-4">
                                            <div className="space-y-3">
                                                <div className="space-y-2">
                                                    <Label htmlFor="training-url">Adresă URL completă</Label>
                                                    <Input
                                                        id="training-url"
                                                        type="url"
                                                        inputMode="url"
                                                        required
                                                        placeholder="https://marketmanager.ro/pagina"
                                                        value={websiteUrl}
                                                        onChange={(event) => setWebsiteUrl(event.target.value)}
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        Include protocolul (https://) și verifică faptul că pagina este publică.
                                                    </p>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="training-url-notes">Mențiuni (opțional)</Label>
                                                    <Textarea
                                                        id="training-url-notes"
                                                        placeholder="Ex.: Pagina conține tutoriale pentru modulul de inventar."
                                                        value={websiteNotes}
                                                        onChange={(event) => setWebsiteNotes(event.target.value)}
                                                        rows={3}
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        Descrie pe scurt ce conținut trimite URL-ul sau modul în care dorești să fie folosit.
                                                    </p>
                                                </div>
                                            </div>
                                            <Button type="submit" className="w-full" disabled={isSubmittingUrl}>
                                                {isSubmittingUrl ? 'Se trimite...' : 'Trimite URL-ul'}
                                            </Button>
                                        </form>
                                    </TrainingCard>

                                    <TrainingCard
                                        step={2}
                                        icon={UploadCloud}
                                        title="Încarcă un fișier"
                                        description="Adaugă documente operaționale, oferte, fișe tehnice sau rapoarte exportate."
                                    >
                                        <form onSubmit={handleFileSubmit} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="training-file">Alege fișierul</Label>
                                                <Input
                                                    id="training-file"
                                                    type="file"
                                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
                                                    ref={fileInputRef}
                                                    onChange={(event) => setTrainingFile(event.target.files?.[0] || null)}
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    Format acceptat: PDF, DOCX, XLSX sau CSV. Trimite câte un fișier per sesiune.
                                                </p>
                                                {trainingFile && (
                                                    <div className="rounded-md bg-muted/40 px-3 py-2 text-xs text-foreground/80">
                                                        <p className="font-medium">{trainingFile.name}</p>
                                                        <p>{(trainingFile.size / 1024).toFixed(1)} KB</p>
                                                    </div>
                                                )}
                                            </div>
                                            <Button type="submit" className="w-full" disabled={isSubmittingFile}>
                                                {isSubmittingFile ? 'Se încarcă...' : 'Trimite fișierul'}
                                            </Button>
                                        </form>
                                    </TrainingCard>

                                    <TrainingCard
                                        step={3}
                                        icon={ClipboardList}
                                        title="Adaugă conținut manual"
                                        description="Ideal pentru fragmente scurte: răspunsuri standard, mesaje de vânzări sau proceduri interne."
                                    >
                                        <form onSubmit={handleTextSubmit} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="training-text">Textul pe care îl învață chatbot-ul</Label>
                                                <Textarea
                                                    id="training-text"
                                                    placeholder="Copiază aici descrieri de produse, proceduri sau alte informații utile..."
                                                    minLength={20}
                                                    rows={6}
                                                    value={trainingText}
                                                    onChange={(event) => setTrainingText(event.target.value)}
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    Recomandare: divizează conținutul în paragrafe logice pentru acuratețe mai bună.
                                                </p>
                                            </div>
                                            <Button type="submit" className="w-full" disabled={isSubmittingText}>
                                                {isSubmittingText ? 'Se trimite...' : 'Trimite textul'}
                                            </Button>
                                        </form>
                                    </TrainingCard>
                                </div>
                            </section>
                        </TabsContent>
                    )}

                    <TabsContent value="leads">
                        <section>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Database className="h-5 w-5"/> Lead-uri Colectate</h2>
                            {data.leads && data.leads.length > 0 && dynamicLeadColumns.length > 0 ? (
                                <DataTable columns={dynamicLeadColumns} data={data.leads} />
                            ) : (
                                <div className="text-center py-12 bg-card border border-dashed rounded-lg">
                                    <Database className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <p className="mt-4 text-muted-foreground">Niciun lead colectat.</p>
                                </div>
                            )}
                        </section>
                    </TabsContent>
                    
                    {!isMarketManager && (
                        <TabsContent value="calls">
                            <section>
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><ListOrdered className="h-5 w-5"/> Istoric Apeluri</h2>
                                {data.callTranscripts && data.callTranscripts.length > 0 ? (
                                    <div className="space-y-4">
                                        {data.callTranscripts.map(transcript => (
                                            <TranscriptCard key={transcript.id} transcript={transcript} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-card border border-dashed rounded-lg">
                                        <PhoneCall className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <p className="mt-4 text-muted-foreground">Niciun apel înregistrat.</p>
                                    </div>
                                )}
                            </section>
                        </TabsContent>
                    )}

                    <TabsContent value="messages">
                        <section>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><MessagesSquare className="h-5 w-5"/> Ultimele Conversații Chatbot</h2>
                            {chatMessagesBySession && Object.keys(chatMessagesBySession).length > 0 ? (
                                <div className="space-y-4">
                                    {Object.entries(chatMessagesBySession)
                                        .sort(([_, messagesA], [__, messagesB]) => (messagesB[messagesB.length - 1].timestamp?.seconds || 0) - (messagesA[messagesA.length - 1].timestamp?.seconds || 0))
                                        .map(([sessionId, messages]) => (
                                        <ConversationCard key={sessionId} sessionId={sessionId} messages={messages} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-card border border-dashed rounded-lg">
                                    <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <p className="mt-4 text-muted-foreground">Niciun mesaj înregistrat.</p>
                                </div>
                            )}
                        </section>
                    </TabsContent>

                    {!isMarketManager && (
                        <TabsContent value="sms">
                            <section>
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Send className="h-5 w-5"/> Jurnal SMS-uri Trimise</h2>
                                {data.smsLogs && data.smsLogs.length > 0 ? (
                                    <div className="space-y-3">
                                        {data.smsLogs.map(log => (
                                            <SmsLogCard key={log.id} smsLog={log} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-card border border-dashed rounded-lg">
                                        <Send className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <p className="mt-4 text-muted-foreground">Niciun SMS înregistrat.</p>
                                    </div>
                                )}
                            </section>
                        </TabsContent>
                    )}

                </Tabs>
            </main>
        </div>
    );
}
