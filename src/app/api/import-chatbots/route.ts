// src/app/api/import-chatbots/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import path from 'path';
import AdmZip from 'adm-zip';
import fs from 'fs/promises';

async function pathExists(path: string): Promise<boolean> {
  try {
    await fs.stat(path);
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

    const chatbotsDir = path.join(process.cwd(), 'public/chatbots');
    if (!(await pathExists(chatbotsDir))) {
        await fs.mkdir(chatbotsDir, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const zip = new AdmZip(buffer);
    
    // Extract with overwrite.
    zip.extractAllTo(chatbotsDir, /*overwrite*/ true);
    
    const importedFolders = zip.getEntries().filter(e => e.isDirectory).map(e => e.entryName.split('/')[0]).filter((v, i, a) => a.indexOf(v) === i);
    const importedCount = importedFolders.length;


    return NextResponse.json({ 
        success: true, 
        message: `Importare reușită. ${importedCount} clienți au fost importați/actualizați.` 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error importing chatbots:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
