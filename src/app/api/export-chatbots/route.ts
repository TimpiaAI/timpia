// src/app/api/export-chatbots/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import AdmZip from 'adm-zip';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    const adminKey = process.env.CHATBOT_ADMIN_KEY;

    if (!adminKey || key !== adminKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chatbotsDir = path.join(process.cwd(), 'public/chatbots');
    const zip = new AdmZip();

    const entries = await fs.readdir(chatbotsDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const fullPath = path.join(chatbotsDir, entry.name);
        // We add all directories to the zip.
        zip.addLocalFolder(fullPath, entry.name);
      }
    }

    const zipBuffer = zip.toBuffer();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `timpia-chatbots-backup-${timestamp}.zip`;

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error: any) {
    console.error('Error exporting chatbots:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
