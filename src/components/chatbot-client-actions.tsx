// src/components/chatbot-client-actions.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Edit, Trash2, Loader2 } from 'lucide-react';

interface ChatbotClientActionsProps {
  clientName: string;
  adminKey: string;
  isReactClient?: boolean;
}

export default function ChatbotClientActions({ clientName, adminKey, isReactClient = false }: ChatbotClientActionsProps) {
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [newName, setNewName] = useState(clientName);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleRename = async () => {
    if (!newName || newName === clientName) {
      setIsRenameOpen(false);
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch('/api/rename-chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldName: clientName, newName, key: adminKey }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      
      toast({ title: 'Succes', description: result.message });
      setIsRenameOpen(false);
      router.refresh();

    } catch (error: any) {
      toast({ title: 'Eroare', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/delete-chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientName, key: adminKey }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      
      toast({ title: 'Succes', description: result.message });
      router.refresh();

    } catch (error: any) {
      toast({ title: 'Eroare', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isReactClient) {
     return (
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" disabled>
                <Edit className="h-4 w-4 mr-2" /> Redenumește
            </Button>
             <Button variant="destructive" size="sm" disabled>
                <Trash2 className="h-4 w-4 mr-2" /> Șterge
            </Button>
        </div>
     )
  }

  return (
    <>
      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-2" disabled={isReactClient}>
            <Edit className="h-4 w-4" /> Redenumește
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redenumește Clientul</DialogTitle>
            <DialogDescription>
              Schimbă numele clientului. Această acțiune va actualiza și URL-ul scriptului.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Noul nume al clientului"
            />
            <p className="text-xs text-muted-foreground mt-2">Folosește doar litere, cifre, cratime și underscore.</p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={isLoading}>Anulează</Button>
            </DialogClose>
            <Button onClick={handleRename} disabled={isLoading || !newName || newName === clientName}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Salvează
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm" className="flex items-center gap-2" disabled={isReactClient}>
            <Trash2 className="h-4 w-4" /> Șterge
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ești absolut sigur?</AlertDialogTitle>
            <AlertDialogDescription>
              Această acțiune nu poate fi anulată. Folderul clientului '{clientName}' și toate fișierele sale vor fi șterse definitiv.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Anulează</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isLoading} className="bg-destructive hover:bg-destructive/90">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Da, șterge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
