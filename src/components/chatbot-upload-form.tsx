// src/components/chatbot-upload-form.tsx
"use client";

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, CheckCircle, AlertCircle, Loader2, FolderPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatbotUploadFormProps {
  adminKey: string;
}

export default function ChatbotUploadForm({ adminKey }: ChatbotUploadFormProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.zip')) {
      setErrorMessage('Tip fișier invalid. Te rog încarcă o arhivă .zip');
      setUploadStatus('error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setErrorMessage('Fișierul este prea mare. Maxim 10MB.');
      setUploadStatus('error');
      return;
    }

    setUploadStatus('uploading');
    setErrorMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('key', adminKey);

    try {
      const response = await fetch('/api/upload-chatbot', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      setUploadStatus('success');
      toast({
        title: "Succes!",
        description: result.message || `Clientul a fost adăugat cu succes.`,
        variant: "default",
        className: "bg-green-100 border-green-300 dark:bg-green-900"
      });
      setTimeout(() => {
        router.refresh();
        setUploadStatus('idle');
      }, 2000);

    } catch (error: any) {
      setUploadStatus('error');
      setErrorMessage(error.message);
      toast({
        title: "Eroare la upload",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [adminKey, router, toast]);

  const dropzoneContent = {
    idle: { icon: UploadCloud, text: 'Trage arhiva .zip aici', subtext: 'sau apasă pentru a selecta fișierul' },
    dragging: { icon: FolderPlus, text: 'Eliberează pentru a încărca', subtext: 'Arhiva .zip trebuie să conțină index.html și loader.js' },
    uploading: { icon: Loader2, text: 'Se încarcă...', subtext: 'Acest proces poate dura câteva momente.' },
    success: { icon: CheckCircle, text: 'Upload realizat cu succes!', subtext: 'Pagina se va reîncărca...' },
    error: { icon: AlertCircle, text: 'Eroare la upload', subtext: errorMessage },
  };

  const { icon: Icon, text, subtext } = dropzoneContent[uploadStatus];
  const iconColor = {
    idle: 'text-gray-500',
    dragging: 'text-primary',
    uploading: 'text-blue-500 animate-spin',
    success: 'text-green-500',
    error: 'text-destructive',
  }[uploadStatus];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderPlus className="h-5 w-5" /> Adaugă Client Basic (via .ZIP)
        </CardTitle>
        <CardDescription>
          Încarcă o arhivă .zip cu `index.html` și `loader.js` personalizat pentru un client.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300',
            isDragging ? 'border-primary bg-primary/10' : 'border-input hover:border-primary/50 bg-secondary/50 hover:bg-muted',
            uploadStatus === 'error' && 'border-destructive bg-destructive/10'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".zip"
            className="hidden"
            onChange={handleFileSelect}
            disabled={uploadStatus === 'uploading'}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={uploadStatus}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="flex flex-col items-center justify-center text-center p-4"
            >
              <Icon className={cn('h-10 w-10 mb-3 transition-colors', iconColor)} />
              <p className="text-base font-semibold text-foreground">{text}</p>
              <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
