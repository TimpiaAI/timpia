// src/app/api/manage-chatbot-file/route.ts
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

function sanitizeClientName(name: string): string {
    // Basic sanitization to prevent path traversal
    return path.normalize(name).replace(/^(\.\.(\/|\\|$))+/, '');
}

export async function POST(request: NextRequest) {
  try {
    const { clientName, fileName, key, action, content } = await request.json();

    // 1. Validate the request
    const adminKey = process.env.CHATBOT_ADMIN_KEY;
    if (!adminKey || key !== adminKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!clientName || !fileName || !action) {
      return NextResponse.json({ error: 'Client name, file name, and action are required.' }, { status: 400 });
    }

    if (fileName !== 'index.html' && fileName !== 'loader.js') {
        return NextResponse.json({ error: 'Invalid file name. Can only edit index.html or loader.js.' }, { status: 400 });
    }

    const sanitizedName = sanitizeClientName(clientName);
    if(sanitizedName !== clientName) {
        return NextResponse.json({ error: 'Invalid client name.' }, { status: 400 });
    }
    
    // Disallow editing for special clients
    if (sanitizedName === 'snpad') {
         return NextResponse.json({ error: 'Editing special client files is not allowed through this interface.' }, { status: 403 });
    }

    const targetDir = path.join(process.cwd(), 'public/chatbots', sanitizedName);
    const targetFile = path.join(targetDir, fileName);

    if (!(await pathExists(targetDir))) {
      return NextResponse.json({ error: `Client '${clientName}' does not exist.` }, { status: 404 });
    }
     if (action === 'write' && !(await pathExists(targetFile))) {
        // This handles cases where one of the files might have been accidentally deleted.
     } else if (action === 'read' && !(await pathExists(targetFile))) {
         return NextResponse.json({ error: `File '${fileName}' does not exist for client '${clientName}'.` }, { status: 404 });
     }

    if (action === 'read') {
        const fileContent = await fs.readFile(targetFile, 'utf-8');
        return NextResponse.json({ success: true, content: fileContent });
    } else if (action === 'write') {
        if (typeof content !== 'string') {
            return NextResponse.json({ error: 'Content must be a string.' }, { status: 400 });
        }
        await fs.writeFile(targetFile, content, 'utf-8');
        
        return NextResponse.json({ success: true, message: `File '${fileName}' for client '${clientName}' has been updated.` });
    } else {
        return NextResponse.json({ error: `Invalid action: ${action}` }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Error managing chatbot file:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
