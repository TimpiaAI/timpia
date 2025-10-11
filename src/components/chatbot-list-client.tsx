"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Server, Search } from 'lucide-react';
import ChatbotPreviewDialog from '@/components/chatbot-preview-dialog';
import { CopyButton } from '@/components/copy-button';
import ChatbotClientActions from '@/components/chatbot-client-actions';
import EditChatbotFileDialog from '@/components/edit-chatbot-file-dialog';
import ChatbotDetails from '@/components/chatbot-details';
import { Input } from '@/components/ui/input';
import ChatbotScriptPreviewDialog from '@/components/chatbot-script-preview-dialog';

interface ChatbotListClientProps {
  clients: string[];
  adminKey: string;
  baseUrl: string;
}

export default function ChatbotListClient({ clients, adminKey, baseUrl }: ChatbotListClientProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = clients.filter(client =>
    client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold text-center md:text-left w-full md:w-auto">
            Chatbots Activi ({filteredClients.length})
          </h2>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Caută un client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              aria-label="Search clients"
            />
          </div>
      </div>

      <div className="space-y-6">
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => {
            const absoluteScriptSrc = `${baseUrl}/chatbots/${client}/loader.js`;
            const relativeScriptSrc = `/chatbots/${client}/loader.js`;
            const scriptTag = `<script src="${absoluteScriptSrc}" async defer></script>`;

            return (
              <Card key={client} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Server className="h-5 w-5 text-primary" />
                            Client: <Badge variant="secondary">{client}</Badge>
                        </CardTitle>
                        <CardDescription className="mt-2">
                            Trimite acest tag de script clientului pentru a integra chatbot-ul.
                        </CardDescription>
                    </div>
                     <ChatbotClientActions clientName={client} adminKey={adminKey} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-muted p-4 rounded-md group">
                    <pre className="text-sm text-foreground overflow-x-auto">
                        <code>{scriptTag}</code>
                    </pre>
                    <CopyButton textToCopy={scriptTag} />
                  </div>
                </CardContent>
                 <CardFooter className="flex flex-wrap items-center justify-end gap-2 pt-2 pb-4 px-6">
                  <EditChatbotFileDialog clientName={client} fileName="index.html" adminKey={adminKey} />
                  <EditChatbotFileDialog clientName={client} fileName="loader.js" adminKey={adminKey} />
                  <ChatbotPreviewDialog clientName={client} />
                  <ChatbotScriptPreviewDialog clientName={client} scriptSrc={relativeScriptSrc} />
                </CardFooter>

                <ChatbotDetails clientName={client} adminKey={adminKey} />
              </Card>
            );
          })
        ) : (
          <div className="text-center py-10 border border-dashed rounded-lg">
            <p className="text-muted-foreground">{clients.length > 0 ? 'Niciun client nu corespunde căutării.' : 'Niciun chatbot de client găsit.'}</p>
            {clients.length === 0 && <p className="text-xs text-muted-foreground mt-2">Folosește una din metodele de mai sus pentru a adăuga primul client.</p>}
          </div>
        )}
      </div>
    </>
  );
}
