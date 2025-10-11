// src/app/api/delete-chatbot/route.ts
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
    const { clientName, key } = await request.json();

    // 1. Validate the request
    const adminKey = process.env.CHATBOT_ADMIN_KEY;
    if (!adminKey || key !== adminKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!clientName || typeof clientName !== 'string') {
      return NextResponse.json({ error: 'Nume client invalid.' }, { status: 400 });
    }
    
    // Prevent deleting special clients
    if (clientName === 'snpad') {
        return NextResponse.json({ error: `Ștergerea clientului special '${clientName}' nu este permisă.` }, { status: 403 });
    }

    const targetDir = path.join(process.cwd(), 'public/chatbots', clientName);

    if (!(await pathExists(targetDir))) {
      return NextResponse.json({ error: `Clientul '${clientName}' nu există.` }, { status: 404 });
    }

    // 2. Delete the directory
    await fs.rm(targetDir, { recursive: true, force: true });

    return NextResponse.json({ success: true, message: `Clientul '${clientName}' a fost șters cu succes de pe server.` });

  } catch (error: any) {
    console.error('Error deleting chatbot:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
