// src/components/edit-chatbot-file-dialog.tsx
"use client";

import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Loader2, Save, FileEdit } from 'lucide-react';

interface EditChatbotFileDialogProps {
  clientName: string;
  fileName: 'index.html' | 'loader.js';
  adminKey: string;
}

export default function EditChatbotFileDialog({ clientName, fileName, adminKey }: EditChatbotFileDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      const fetchContent = async () => {
        setIsLoading(true);
        try {
          const response = await fetch('/api/manage-chatbot-file', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientName, fileName, key: adminKey, action: 'read' }),
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error);
          setContent(result.content);
        } catch (error: any) {
          toast({ title: 'Eroare la încărcare', description: error.message, variant: 'destructive' });
          setIsOpen(false);
        } finally {
          setIsLoading(false);
        }
      };
      fetchContent();
    }
  }, [isOpen, clientName, fileName, adminKey, toast]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
        const response = await fetch('/api/manage-chatbot-file', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientName, fileName, key: adminKey, action: 'write', content }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        toast({ title: 'Succes', description: result.message });
        setIsOpen(false);
    } catch (error: any) {
        toast({ title: 'Eroare la salvare', description: error.message, variant: 'destructive' });
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-xs">
          <FileEdit className="h-3.5 w-3.5" /> {fileName}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Editare fișier: {fileName}</DialogTitle>
          <DialogDescription>
            Modifică conținutul fișierului pentru clientul <strong>{clientName}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow py-4 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Conținutul fișierului ${fileName}...`}
              className="h-full w-full resize-none font-mono text-xs"
            />
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" disabled={isSaving}>Anulează</Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={isSaving || isLoading}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Salvează Modificările
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
