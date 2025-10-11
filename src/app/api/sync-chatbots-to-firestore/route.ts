// src/app/api/sync-chatbots-to-firestore/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import path from 'path';
import fs from 'fs/promises';
import { FieldValue } from 'firebase-admin/firestore';

// --- React Clients Configuration ---
// This should be kept in sync with the one in the xyzbca page.
const reactClients = [
  { name: 'snpad', secretKeyEnv: 'SNPAD_SECRET_KEY' }
];

async function getChatbotDirectories() {
    const chatbotsDir = path.join(process.cwd(), 'public/chatbots');
    try {
        const entries = await fs.readdir(chatbotsDir, { withFileTypes: true });
        return entries
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name);
    } catch (error) {
        console.warn('Could not read chatbots directory:', error);
        return [];
    }
}

async function getFileContent(clientName: string, fileName: string): Promise<string> {
    try {
        const filePath = path.join(process.cwd(), 'public/chatbots', clientName, fileName);
        return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
        return ''; // Return empty string if file doesn't exist
    }
}

export async function POST(request: NextRequest) {
    try {
        const { key } = await request.json();
        const adminKey = process.env.CHATBOT_ADMIN_KEY;
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

        if (!adminKey || key !== adminKey) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (!siteUrl) {
            return NextResponse.json({ error: 'NEXT_PUBLIC_SITE_URL is not configured.' }, { status: 500 });
        }

        const db = getAdminDb();
        const clientDirs = await getChatbotDirectories();
        const batch = db.batch();
        let processedCount = 0;

        for (const clientName of clientDirs) {
            const clientDocRef = db.collection('ChatbotClients').doc(clientName);
            const reactClientConfig = reactClients.find(rc => rc.name === clientName);
            
            let clientData: { [key: string]: any; };

            if (reactClientConfig) {
                // --- Handle React Client ---
                const secretKey = process.env[reactClientConfig.secretKeyEnv];
                if (!secretKey) {
                    console.warn(`Secret key for React client ${clientName} not found. Skipping sync.`);
                    continue; // Skip this client if secret key is missing
                }

                // Replace the placeholder in loader.js with the actual secret key from .env
                let loaderJsContent = await getFileContent(clientName, 'loader.js');
                loaderJsContent = loaderJsContent.replace(/__SNPAD_SECRET_KEY__/g, secretKey);
                
                // Replace placeholder domain in loader.js
                loaderJsContent = loaderJsContent.replace(/https:\/\/your-live-domain\.com/g, siteUrl);

                const scriptTag = `<script src="${siteUrl}/chatbots/${clientName}/loader.js" async defer></script>`;

                clientData = {
                    clientName,
                    type: 'React',
                    scriptTag,
                    loaderJsContent, // Save the processed loader content
                    secretKey: secretKey, // Store the key for reference if needed
                    lastSynced: FieldValue.serverTimestamp(),
                };

            } else {
                // --- Handle Basic Client ---
                const indexHtmlContent = await getFileContent(clientName, 'index.html');
                const loaderJsContent = await getFileContent(clientName, 'loader.js');
                const scriptTag = `<script src="${siteUrl}/chatbots/${clientName}/loader.js" async defer></script>`;

                clientData = {
                    clientName,
                    type: 'Basic',
                    scriptTag,
                    indexHtmlContent,
                    loaderJsContent,
                    lastSynced: FieldValue.serverTimestamp(),
                };
            }

            batch.set(clientDocRef, clientData, { merge: true });
            processedCount++;
        }

        await batch.commit();

        return NextResponse.json({
            success: true,
            message: `Sincronizare reușită. ${processedCount} clienți au fost actualizați în Firestore.`,
        });

    } catch (error: any) {
        console.error('Error syncing chatbots to Firestore:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
