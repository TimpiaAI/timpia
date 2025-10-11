// src/components/chatbot-export-button.tsx
"use client";

import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';

interface ChatbotExportButtonProps {
  adminKey: string;
}

export default function ChatbotExportButton({ adminKey }: ChatbotExportButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/export-chatbots?key=${adminKey}`);
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'A eșuat exportul.');
      }
      
      const blob = await response.blob();
      const contentDisposition = response.headers.get('content-disposition');
      let fileName = 'chatbots-backup.zip';
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch.length === 2) {
          fileName = fileNameMatch[1];
        }
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast({ title: 'Export Reușit', description: 'Arhiva de backup a fost descărcată.' });
      
    } catch (error: any) {
      toast({ title: 'Eroare la export', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleExport} disabled={isLoading} variant="outline" className="w-full">
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      Exportă Toți Clienții (.zip)
    </Button>
  );
}
