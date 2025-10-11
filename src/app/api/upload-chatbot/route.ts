// src/app/api/upload-chatbot/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import AdmZip from 'adm-zip';
import { stat } from 'fs/promises';

async function pathExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const providedKey = formData.get('key') as string | null;

    // 1. Validate the request
    const adminKey = process.env.CHATBOT_ADMIN_KEY;
    if (!adminKey || providedKey !== adminKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith('.zip')) {
      return NextResponse.json({ error: 'Invalid file type. Please upload a .zip file.' }, { status: 400 });
    }

    // 2. Process the file
    const clientName = file.name.replace(/\.zip$/, '');
    if (!/^[a-zA-Z0-9_-]+$/.test(clientName)) {
      return NextResponse.json({ error: 'Invalid client name in zip file. Use only letters, numbers, hyphens, and underscores.' }, { status: 400 });
    }

    const chatbotsDir = path.join(process.cwd(), 'public/chatbots');
    const targetDir = path.join(chatbotsDir, clientName);

    if (await pathExists(targetDir)) {
      return NextResponse.json({ error: `Client '${clientName}' already exists.` }, { status: 409 });
    }

    // 3. Create directory and extract
    await fs.mkdir(targetDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const zip = new AdmZip(buffer);
    
    // Check for required files
    const zipEntries = zip.getEntries();
    const hasIndexHtml = zipEntries.some(entry => entry.entryName.toLowerCase() === 'index.html');
    const hasLoaderJs = zipEntries.some(entry => entry.entryName.toLowerCase() === 'loader.js');

    if (!hasIndexHtml || !hasLoaderJs) {
      // Cleanup the created directory if validation fails
      await fs.rm(targetDir, { recursive: true, force: true });
      return NextResponse.json({ error: 'ZIP file must contain both index.html and loader.js' }, { status: 400 });
    }
    
    zip.extractAllTo(targetDir, /*overwrite*/ true);

    return NextResponse.json({ success: true, message: `Chatbot for client '${clientName}' created.` }, { status: 201 });

  } catch (error: any) {
    console.error('Error uploading chatbot:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
