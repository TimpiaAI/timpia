
import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bot, Folder, Database, Download, Upload, Film, Star } from 'lucide-react';
import ChatbotPreviewDialog from '@/components/chatbot-preview-dialog';
import { CopyButton } from '@/components/copy-button';
import { Separator } from '@/components/ui/separator';
import ChatbotUploadForm from '@/components/chatbot-upload-form';
import ChatbotListClient from '@/components/chatbot-list-client';
import ChatbotExportButton from '@/components/chatbot-export-button';
import ChatbotImportForm from '@/components/chatbot-import-form';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ChatbotClientActions from '@/components/chatbot-client-actions';
import SnpadWidgetPreview from '@/components/snpad-widget-preview'; // Import the new component


// --- React Clients Configuration ---
// In a real app, this might come from a database or a config file.
const reactClients = [
  {
    name: 'snpad',
    description: 'Chatbot avansat pentru managementul campaniilor publicitare.',
    secretKeyEnv: 'SNPAD_SECRET_KEY', // The .env variable that holds the secret key
  }
];

async function getDirectorySize(directoryPath: string): Promise<number> {
    try {
        const entries = await fs.readdir(directoryPath, { withFileTypes: true });
        let totalSize = 0;
        for (const entry of entries) {
            const fullPath = path.join(directoryPath, entry.name);
            if (entry.isDirectory()) {
                totalSize += await getDirectorySize(fullPath);
            } else if(entry.isFile()) {
                const stats = await fs.stat(fullPath);
                totalSize += stats.size;
            }
        }
        return totalSize;
    } catch {
        return 0; // If directory doesn't exist, size is 0
    }
}

// This is a server component, so we can use Node.js APIs
export default async function AdminChatbotsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const adminKey = process.env.CHATBOT_ADMIN_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!adminKey || searchParams.key !== adminKey) {
    notFound();
  }
  
  if (!siteUrl) {
    return (
        <div className="container py-20 text-center">
            <h1 className="text-2xl font-bold text-destructive">Eroare de Configurare</h1>
            <p className="text-muted-foreground mt-4">
                Variabila de mediu `NEXT_PUBLIC_SITE_URL` nu este setată. Te rugăm să adaugi `NEXT_PUBLIC_SITE_URL=https://domeniul-tau.ro` în fișierul `.env` și să repornești serverul.
            </p>
        </div>
    );
  }

  const chatbotsDir = path.join(process.cwd(), 'public/chatbots');
  let basicChatbotClients: string[] = [];
  
  try {
    const entries = await fs.readdir(chatbotsDir, { withFileTypes: true });
    basicChatbotClients = entries
      .filter((dirent) => dirent.isDirectory() && !reactClients.some(rc => rc.name === dirent.name))
      .map((dirent) => dirent.name)
      .sort();
  } catch (error) {
    console.warn('Could not read chatbots directory. Ensure public/chatbots exists.');
  }
  
  const totalSize = await getDirectorySize(chatbotsDir);
  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
  const totalClients = basicChatbotClients.length + reactClients.length;

  return (
    <div className="container py-12 md:py-20">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Panou de Administrare Chatbots</h1>
        <p className="text-muted-foreground mt-2">Gestionează toți clienții de chatbot, Basic și React.</p>
      </div>

      <div className="mb-8 text-center">
        <Button asChild variant="outline">
          <Link href={`/demos?key=${adminKey}`}>
            <Film className="mr-2 h-4 w-4" />
            Generator de Simulări Animate
          </Link>
        </Button>
      </div>

      {/* Mini Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clienți</CardTitle>
                <Folder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalClients}</div>
                <p className="text-xs text-muted-foreground">{reactClients.length} React / {basicChatbotClients.length} Basic</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Spațiu Utilizat</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalSizeMB} MB</div>
                <p className="text-xs text-muted-foreground">În folderul public/chatbots</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Download className="h-5 w-5"/> Management Date</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                <ChatbotExportButton adminKey={adminKey} />
                 <ChatbotImportForm adminKey={adminKey} />
            </CardContent>
        </Card>
      </div>
      
      <Separator className="my-12" />

      {/* --- React Clients Section --- */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
          <Star className="text-yellow-500" />Clienți React Avansați ({reactClients.length})
        </h2>
        <div className="space-y-6">
          {reactClients.map(client => {
            // The secret key is intentionally left as a placeholder in the loader.js file.
            // The sync-to-firestore process will replace it with the real key from .env
            // This prevents the secret from being hardcoded in the public git repo.
            const scriptTag = `<script src="${siteUrl}/chatbots/${client.name}/loader.js" async defer></script>`;
            
            return (
              <Card key={client.name} className="shadow-md hover:shadow-lg transition-shadow bg-card/90 border-primary/20">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Bot className="h-5 w-5 text-primary"/>
                        {client.name}
                        <Badge variant="outline" className="text-primary border-primary/50">React</Badge>
                      </CardTitle>
                      <CardDescription className="mt-2">{client.description}</CardDescription>
                    </div>
                     <div className="flex items-center gap-2">
                        <ChatbotClientActions clientName={client.name} adminKey={adminKey} isReactClient={true} />
                        {/* Add the new preview component here */}
                        <SnpadWidgetPreview />
                    </div>
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
                 <CardFooter>
                    <p className="text-xs text-muted-foreground">
                        Acest client folosește un `loader.js` personalizat pentru a crea widget-ul de chat.
                    </p>
                 </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>

      <Separator className="my-12" />

      {/* --- Basic Clients Section --- */}
       <div>
          <h2 className="text-2xl font-semibold mb-6">Clienți Basic (HTML/JS)</h2>
          <div className="grid grid-cols-1 gap-8 mb-8">
            <ChatbotUploadForm adminKey={adminKey} />
          </div>
          <Separator className="my-12" />
          <ChatbotListClient clients={basicChatbotClients} adminKey={adminKey} baseUrl={siteUrl} />
      </div>

    </div>
  );
}
