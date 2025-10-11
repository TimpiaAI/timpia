// src/components/dashboard-client-page.tsx
"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { onSnapshot, doc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { BarChart, Clock, Loader2, Globe, MessageSquare, Briefcase, LayoutGrid, PhoneCall, MessagesSquare, Database, ListOrdered, FileText, Play, Pause, Download, Phone as PhoneIcon, Send } from 'lucide-react';
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

interface DashboardClientPageProps {
    clientName: string;
    accessKey: string; 
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

const TranscriptCard = ({ transcript }: { transcript: Transcript }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const formatTimestamp = (ts: Transcript['timestamp']) => {
        if (!ts) return 'Dată indisponibilă';
        return new Date(ts.seconds * 1000).toLocaleString('ro-RO');
    };

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

const ConversationCard = ({ sessionId, messages }: { sessionId: string; messages: ChatMessage[] }) => {
    const formatTimestamp = (ts: ChatMessage['timestamp']) => {
        if (!ts) return 'Dată indisponibilă';
        return new Date(ts.seconds * 1000).toLocaleString('ro-RO');
    };

    const firstMessage = messages[0];
    const country = firstMessage?.country || 'N/A';
    const platform = firstMessage?.platform || 'N/A';

    return (
        <Accordion type="single" collapsible className="w-full bg-card rounded-lg shadow-sm border border-border/15">
            <AccordionItem value={sessionId} className="border-b-0">
                <AccordionTrigger className="px-4 py-3 hover:no-underline text-left">
                     <div className="flex-grow">
                        <p className="font-mono text-sm text-primary font-semibold truncate">Sesiune: {sessionId}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {messages.length} mesaje | {platform} | {country} | Ultima activitate: {formatTimestamp(messages[messages.length - 1].timestamp)}
                        </p>
                     </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                     <div className="space-y-2 max-h-96 overflow-y-auto border-t pt-3 prose prose-sm dark:prose-invert max-w-none prose-img:rounded-md prose-img:max-w-xs prose-p:my-1">
                        {messages.map(msg => (
                            <div key={msg.id} className="text-sm text-foreground/90 whitespace-pre-wrap font-mono text-[13px] leading-relaxed border-b border-dashed border-border/10 pb-2 last:border-b-0">
                                <span className="text-muted-foreground text-[11px] block">{formatTimestamp(msg.timestamp)}</span>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {msg.message}
                                </ReactMarkdown>
                            </div>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
};

const SmsLogCard = ({ smsLog }: { smsLog: SmsLog }) => {
    const formatTimestamp = (ts: SmsLog['timestamp']) => {
        if (!ts) return 'Dată indisponibilă';
        return new Date(ts.seconds * 1000).toLocaleString('ro-RO');
    };

    return (
        <div className="bg-card p-4 rounded-lg shadow-sm border border-border/15">
            <div className="flex justify-between items-start text-xs text-muted-foreground mb-2">
                <p className="font-semibold text-primary">Destinatar: {smsLog.phoneNumber}</p>
                <p>{formatTimestamp(smsLog.timestamp)}</p>
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


// --- Main Page Component ---
export default function DashboardClientPage({ clientName, accessKey }: DashboardClientPageProps) {
    const [data, setData] = useState<DashboardData>({});
    const [isLoading, setIsLoading] = useState(true);
    const [dynamicLeadColumns, setDynamicLeadColumns] = useState<ColumnDef<Lead>[]>([]);

    useEffect(() => {
        // Fetch all data for the client on initial load
        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/get-client-data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        clientName,
                        key: accessKey, // Use the key passed from the server component
                        collections: ['leads', 'callTranscripts', 'chatMessages', 'smsLogs'],
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Failed to fetch data: ${response.statusText}`);
                }
                
                const fetchedData = await response.json();
                setData(fetchedData);

                // Dynamically generate columns based on the fetched lead data
                if (fetchedData.leads && fetchedData.leads.length > 0) {
                    setDynamicLeadColumns(generateDynamicColumns(fetchedData.leads));
                }

            } catch (error) {
                console.error("Error fetching client data:", error);
                setData({ clientName, stats: { totalCalls: 0, totalMessages: 0, avgDuration: 0, totalSms: 0 } });
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
        const unsubCalls = onSnapshot(query(collection(db, 'ClientDashboard', clientName, 'callTranscripts'), orderBy('timestamp', 'desc')), (snapshot) => {
            setData(prev => ({ ...prev, callTranscripts: snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Transcript)) }));
        });
        const unsubMessages = onSnapshot(query(collection(db, 'ClientDashboard', clientName, 'chatMessages'), orderBy('timestamp', 'desc')), (snapshot) => {
            setData(prev => ({ ...prev, allChatMessages: snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ChatMessage)) }));
        });
        const unsubSms = onSnapshot(query(collection(db, 'ClientDashboard', clientName, 'smsLogs'), orderBy('timestamp', 'desc')), (snapshot) => {
            setData(prev => ({ ...prev, smsLogs: snapshot.docs.map(d => ({ id: d.id, ...d.data() } as SmsLog)) }));
        });


        return () => {
            unsubDoc();
            unsubLeads();
            unsubCalls();
            unsubMessages();
            unsubSms();
        };

    }, [clientName, accessKey]);
    
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


    return (
        <div className="p-4 sm:p-6 md:p-8">
            <header className="flex justify-between items-center mb-8">
                 <div className="flex items-center gap-3">
                    <Logo width={32} height={32}/>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Dashboard Client</h1>
                        <p className="text-muted-foreground">{data.clientName || clientName}</p>
                    </div>
                </div>
                <Link href="/" className="text-sm text-primary hover:underline">Înapoi la site</Link>
            </header>

            <main>
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 max-w-3xl mx-auto mb-8">
                        <TabsTrigger value="overview"><LayoutGrid className="h-4 w-4 mr-2"/>Rezumat</TabsTrigger>
                        <TabsTrigger value="leads"><Database className="h-4 w-4 mr-2"/>Bază Date Clienți</TabsTrigger>
                        <TabsTrigger value="calls"><PhoneCall className="h-4 w-4 mr-2"/>Apeluri</TabsTrigger>
                        <TabsTrigger value="messages"><MessagesSquare className="h-4 w-4 mr-2"/>Mesaje Chat</TabsTrigger>
                        <TabsTrigger value="sms"><Send className="h-4 w-4 mr-2"/>SMS-uri</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview">
                        <div className="space-y-8">
                             <section>
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><BarChart className="h-5 w-5"/> Statistici Generale</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <StatCard icon={PhoneIcon} title="Total Apeluri Procesate" value={data.stats?.totalCalls || 0} limit={CALL_LIMIT} status={data.stats?.status} />
                                    <StatCard icon={MessageSquare} title="Total Mesaje Chat" value={data.stats?.totalMessages || 0} limit={MESSAGE_LIMIT} />
                                    <StatCard icon={Send} title="Total SMS Trimise" value={data.stats?.totalSms || 0} limit={SMS_LIMIT} description={smsDescription} />
                                    <StatCard icon={Clock} title="Durată Medie Apel" value={calculatedAvgDuration} unit="sec" description="Calculată pe ultimele apeluri." />
                                </div>
                            </section>

                            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <CountryChart messages={data.allChatMessages || []} />
                                <PlatformChart messages={data.allChatMessages || []} />
                            </section>
                        </div>
                    </TabsContent>

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

                </Tabs>
            </main>
        </div>
    );
}
