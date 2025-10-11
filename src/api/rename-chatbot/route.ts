// src/app/api/rename-chatbot/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
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
    const { oldName, newName, key } = await request.json();

    // 1. Validate the request
    const adminKey = process.env.CHATBOT_ADMIN_KEY;
    if (!adminKey || key !== adminKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!oldName || !newName || typeof oldName !== 'string' || typeof newName !== 'string') {
      return NextResponse.json({ error: 'Numele vechi și cel nou sunt obligatorii.' }, { status: 400 });
    }
    
    if (oldName === 'snpad' || newName === 'snpad') {
        return NextResponse.json({ error: 'Redenumirea clienților speciali (ex: snpad) nu este permisă.' }, { status: 403 });
    }
    
    if (!/^[a-zA-Z0-9_-]+$/.test(newName)) {
      return NextResponse.json({ error: 'Numele nou conține caractere invalide. Folosiți doar litere, cifre, cratime și underscore.' }, { status: 400 });
    }

    const oldDir = path.join(process.cwd(), 'public/chatbots', oldName);
    const newDir = path.join(process.cwd(), 'public/chatbots', newName);

    if (!(await pathExists(oldDir))) {
      return NextResponse.json({ error: `Clientul '${oldName}' nu există.` }, { status: 404 });
    }
    
    if (await pathExists(newDir)) {
      return NextResponse.json({ error: `Clientul '${newName}' există deja.` }, { status: 409 });
    }

    // 2. Rename the directory
    await fs.rename(oldDir, newDir);

    return NextResponse.json({ success: true, message: `Clientul '${oldName}' a fost redenumit în '${newName}'.` });

  } catch (error: any) {
    console.error('Error renaming chatbot:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
