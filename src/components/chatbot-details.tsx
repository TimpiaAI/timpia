"use client";

import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, FileText, Link2, Loader2, Save, Tag } from 'lucide-react';

interface ChatbotDetailsProps {
  clientName: string;
  adminKey: string;
}

interface Details {
  indexHtml?: { lastModified: string; size: number };
  loaderJs?: { lastModified: string; size: number };
  webhookUrl?: string | null;
  suggestedType?: string;
}

export default function ChatbotDetails({ clientName, adminKey }: ChatbotDetailsProps) {
  const [details, setDetails] = useState<Details | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [webhookInput, setWebhookInput] = useState('');
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/chatbot-meta?client=${clientName}&key=${adminKey}`);
        if (!response.ok) {
          throw new Error('Failed to fetch details');
        }
        const data = await response.json();
        setDetails(data);
        setWebhookInput(data.webhookUrl || '');
      } catch (error) {
        console.error(error);
        setDetails(null); // Clear details on error
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDetails();
  }, [clientName, adminKey]);

  const handleWebhookSave = async () => {
    setIsSaving(true);
    try {
        const response = await fetch('/api/chatbot-meta', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientName, key: adminKey, newWebhookUrl: webhookInput }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        toast({ title: 'Succes', description: result.message });
        if (details) setDetails({...details, webhookUrl: webhookInput});
    } catch (error: any) {
        toast({ title: 'Eroare', description: error.message, variant: 'destructive' });
    } finally {
        setIsSaving(false);
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="px-6 pb-4 space-y-3">
        <Separator />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-4">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/3" />
        </div>
        <Skeleton className="h-9 w-full" />
      </div>
    );
  }

  if (!details) {
    return (
        <div className="px-6 pb-4">
            <Separator />
            <p className="text-xs text-destructive mt-3">Nu am putut încărca detaliile.</p>
        </div>
    );
  }

  const lastModified = details.indexHtml?.lastModified || details.loaderJs?.lastModified;

  return (
    <div className="px-6 pb-4 pt-2 space-y-4 text-sm">
        <Separator />
        <div>
            <h4 className="font-semibold text-foreground mb-3">Detalii & Statistici</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-muted-foreground text-xs">
                {lastModified && (
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Modificat: {new Date(lastModified).toLocaleDateString('ro-RO')}</span>
                    </div>
                )}
                 {details.suggestedType && (
                    <div className="flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5" />
                        <span>Tip Sugerat: {details.suggestedType}</span>
                    </div>
                )}
                 {details.indexHtml?.size && (
                    <div className="flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5" />
                        <span>index.html: {formatBytes(details.indexHtml.size)}</span>
                    </div>
                )}
                 {details.loaderJs?.size && (
                    <div className="flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5" />
                        <span>loader.js: {formatBytes(details.loaderJs.size)}</span>
                    </div>
                )}
            </div>
        </div>
        
        {details.webhookUrl !== undefined && (
            <div>
                 <h4 className="font-semibold text-foreground mb-2 flex items-center gap-1.5"><Link2 className="h-4 w-4" /> Webhook URL</h4>
                {details.webhookUrl ? (
                    <div className="flex items-center gap-2">
                        <Input 
                            value={webhookInput} 
                            onChange={(e) => setWebhookInput(e.target.value)}
                            className="h-9 text-xs"
                            placeholder="Adaugă URL webhook..."
                        />
                        <Button size="sm" onClick={handleWebhookSave} disabled={isSaving || webhookInput === details.webhookUrl}>
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin"/> : <Save className="h-4 w-4" />}
                        </Button>
                    </div>
                ) : (
                    <p className="text-xs text-amber-600 dark:text-amber-500 p-2 bg-amber-500/10 rounded-md">
                        Nu a fost detectat niciun webhook. Asigură-te că ai definit `const WEBHOOK_URL = "..."` în `index.html`.
                    </p>
                )}
            </div>
        )}
    </div>
  );
}
