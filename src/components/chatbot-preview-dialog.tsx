
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, Loader2, RefreshCw } from "lucide-react";

interface ChatbotPreviewDialogProps {
  clientName: string;
}

export default function ChatbotPreviewDialog({ clientName }: ChatbotPreviewDialogProps) {
  const [iframeContent, setIframeContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // A hardcoded list of React clients. In a real app, this might come from a config.
  const reactClients = ['snpad'];

  const loadAndPrepareContent = async () => {
    setIsLoading(true);
    setIframeContent(null);
    try {
      const isReactClient = reactClients.includes(clientName);
      let htmlContent;

      if (isReactClient) {
        // For React clients, we construct a simple HTML shell that loads the main app's script.
        // This is a simplified approach. A more robust solution might involve a dedicated preview route.
        // NOTE: This approach won't work if the React component has dependencies not available globally.
        // A better long-term solution is a dedicated preview route like /previews/[clientName]
         htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>React Preview</title>
               <base href="/">
            </head>
            <body>
              <p>Loading React Component for ${clientName}...</p>
              <!-- This is a conceptual placeholder. The actual loading is more complex -->
               <p style="color: red; font-weight: bold;">Standard preview is not supported for React clients. Please use the "Previzualizează Pagina" button.</p>
            </body>
          </html>
        `;
      } else {
        // For basic clients, fetch and prepare their index.html
        const basePath = `/chatbots/${clientName}/`;
        const response = await fetch(basePath + 'index.html');
        if (!response.ok) {
          throw new Error(`Fișierul index.html nu a fost găsit (Status: ${response.status})`);
        }
        const rawHtmlContent = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(rawHtmlContent, 'text/html');

        let baseTag = doc.querySelector('base');
        if (!baseTag) {
          baseTag = doc.createElement('base');
          doc.head.prepend(baseTag);
        }
        baseTag.href = new URL(basePath, window.location.origin).href;
        htmlContent = doc.documentElement.outerHTML;
      }
      
      setIframeContent(htmlContent);

    } catch (error) {
      console.error("Preview Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Eroare necunoscută.";
      setIframeContent(`
        <html lang="en">
          <body style="font-family: sans-serif; color: #333; padding: 2rem; text-align: center; background-color: #fff7f7;">
            <h2 style="color: #c53030;">Eroare la încărcarea previzualizării</h2>
            <p style="color: #718096; font-size: 0.9rem;">${errorMessage}</p>
          </body>
        </html>
      `);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      loadAndPrepareContent();
    } else {
      setIframeContent(null);
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Previzualizare Iframe
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[400px] p-0 border-0 h-[70vh] max-h-[600px] bg-transparent shadow-none flex flex-col">
        <DialogHeader className="p-4 border-b bg-background rounded-t-lg flex-row items-center justify-between">
          <div className="space-y-1">
            <DialogTitle>Previzualizare: {clientName}</DialogTitle>
            <DialogDescription>
              Acesta este un preview live al widget-ului.
            </DialogDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={loadAndPrepareContent} aria-label="Reîncarcă previzualizarea" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : <RefreshCw className="h-4 w-4"/>}
          </Button>
        </DialogHeader>
        <div className="w-full flex-grow bg-white">
          {isLoading && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2"/> Se încarcă...
            </div>
          )}
          {iframeContent && !isLoading && (
            <iframe
              srcDoc={iframeContent}
              title={`Previzualizare Chatbot - ${clientName}`}
              className="w-full h-full border-none shadow-lg"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
