// src/components/chatbot-import-form.tsx
"use client";

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, AlertCircle, Loader2, FileUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface ChatbotImportFormProps {
  adminKey: string;
}

export default function ChatbotImportForm({ adminKey }: ChatbotImportFormProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
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
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.name.toLowerCase().endsWith('.zip')) {
        setErrorMessage('Tip fișier invalid. Te rog încarcă o arhivă .zip');
        setUploadStatus('error');
        setFile(null);
        return;
    }
    setFile(selectedFile);
    setUploadStatus('idle');
    setErrorMessage('');
  };

  const handleImport = async () => {
    if (!file) return;

    setUploadStatus('uploading');
    setErrorMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('key', adminKey);

    try {
      const response = await fetch('/api/import-chatbots', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      setUploadStatus('success');
      toast({
        title: "Import reușit!",
        description: result.message,
      });
      setTimeout(() => {
        router.refresh();
        setUploadStatus('idle');
        setFile(null);
      }, 2000);

    } catch (error: any) {
      setUploadStatus('error');
      setErrorMessage(error.message);
    }
  };

  const dropzoneText = file ? file.name : 'Trage arhiva .zip aici';
  const dropzoneSubtext = file ? `${(file.size / 1024).toFixed(2)} KB` : 'sau apasă pentru a selecta fișierul de backup';
  
  const iconColor = {
    idle: file ? 'text-primary' : 'text-gray-500',
    dragging: 'text-primary',
    uploading: 'text-blue-500 animate-spin',
    success: 'text-green-500',
    error: 'text-destructive',
  }[uploadStatus];
  
  const IdleIcon = file ? FileUp : Upload;
  const { icon: StatusIcon, text: statusText, subtext: statusSubtext } = {
    idle: { icon: IdleIcon, text: dropzoneText, subtext: dropzoneSubtext },
    dragging: { icon: FileUp, text: 'Eliberează pentru a selecta', subtext: 'Arhiva de backup va fi pregătită pentru import.' },
    uploading: { icon: Loader2, text: 'Se importă...', subtext: 'Fișierele sunt extrase și salvate. Nu închide pagina.' },
    success: { icon: CheckCircle, text: 'Import realizat cu succes!', subtext: 'Pagina se va reîncărca...' },
    error: { icon: AlertCircle, text: 'Eroare la import', subtext: errorMessage },
  }[uploadStatus];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5"/> Import / Restore</CardTitle>
        <CardDescription>
          Importează o arhivă .zip cu toți clienții. Avertisment: va suprascrie clienții existenți cu același nume.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300',
            isDragging ? 'border-primary bg-primary/10' : 'border-input hover:border-primary/50 bg-secondary/50 hover:bg-muted',
            uploadStatus === 'error' && 'border-destructive bg-destructive/10'
          )}
        >
          <input ref={fileInputRef} type="file" accept=".zip" className="hidden" onChange={handleFileSelect} disabled={uploadStatus === 'uploading'} />
          <AnimatePresence mode="wait">
            <motion.div
              key={uploadStatus + (file?.name || '')}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              className="flex flex-col items-center justify-center text-center p-4"
            >
              <StatusIcon className={cn('h-8 w-8 mb-2 transition-colors', iconColor)} />
              <p className="text-sm font-semibold text-foreground truncate max-w-full">{statusText}</p>
              <p className="text-xs text-muted-foreground mt-1">{statusSubtext}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <Button onClick={handleImport} disabled={!file || uploadStatus === 'uploading'} className="w-full">
          {uploadStatus === 'uploading' ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          {uploadStatus === 'uploading' ? 'Se procesează...' : 'Importă Backup'}
        </Button>
      </CardContent>
    </Card>
  );
}
