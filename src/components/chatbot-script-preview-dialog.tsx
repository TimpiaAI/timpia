"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Code2 } from "lucide-react";

interface ChatbotScriptPreviewDialogProps {
  clientName: string;
  scriptSrc: string; // Receive the full script URL
}

export default function ChatbotScriptPreviewDialog({ clientName, scriptSrc }: ChatbotScriptPreviewDialogProps) {
  // The full script URL is now passed in
  // Construct the HTML content for the iframe
  const iframeContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Script Test: ${clientName}</title>
      <style>
        body { 
          font-family: sans-serif; 
          background-color: #f0f2f5; 
          margin: 0;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          box-sizing: border-box;
          text-align: center;
          color: #333;
        }
        .container {
          background-color: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        h1 { margin-top: 0; }
        code {
            display: inline-block;
            background-color: #e2e8f0;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
            word-break: break-all;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Pagină de Test pentru Script</h1>
        <p>Această pagină încarcă scriptul <code>${scriptSrc}</code>.</p>
        <p>Dacă totul este corect, o bulă de chat ar trebui să apară în colțul paginii.</p>
      </div>
      <script src="${scriptSrc}" async defer></script>
    </body>
    </html>
  `;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Code2 className="h-4 w-4" />
          Testează Script
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl h-[90vh] p-0 border-0 flex flex-col">
         <DialogHeader className="p-4 border-b">
            <DialogTitle>Testare Script Loader: {clientName}</DialogTitle>
            <DialogDescription>
              Această fereastră simulează încărcarea script-ului pe o pagină goală.
            </DialogDescription>
         </DialogHeader>
         <iframe
            srcDoc={iframeContent}
            title={`Testare Script - ${clientName}`}
            className="w-full h-full flex-grow border-none"
            sandbox="allow-scripts allow-same-origin"
          />
      </DialogContent>
    </Dialog>
  );
}
