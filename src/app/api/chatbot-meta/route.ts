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

// GET handler for fetching details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientName = searchParams.get('client');
    const key = searchParams.get('key');
    const adminKey = process.env.CHATBOT_ADMIN_KEY;

    if (!adminKey || key !== adminKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!clientName) {
      return NextResponse.json({ error: 'Client name is required.' }, { status: 400 });
    }
    
    const clientDir = path.join(process.cwd(), 'public/chatbots', clientName);
    if (!(await pathExists(clientDir))) {
      return NextResponse.json({ error: 'Client not found.' }, { status: 404 });
    }

    const indexPath = path.join(clientDir, 'index.html');
    const loaderPath = path.join(clientDir, 'loader.js');
    
    let indexStats, loaderStats, indexContent;
    let details = {} as any;

    if (await pathExists(indexPath)) {
        indexStats = await fs.stat(indexPath);
        indexContent = await fs.readFile(indexPath, 'utf-8');
        details.indexHtml = {
            lastModified: indexStats.mtime,
            size: indexStats.size,
        };
        
        // Find webhook URL with flexible variable name (e.g., WEBHOOK_URL, N8N_WEBHOOK_URL)
        const webhookRegex = /(?:const|let|var)\s+\w*WEBHOOK_URL\w*\s*=\s*['"](https?:\/\/[^'"]+)['"]/;
        const webhookMatch = indexContent.match(webhookRegex);
        details.webhookUrl = webhookMatch ? webhookMatch[1] : null;

        // Suggest type based on keywords
        if (indexContent.toLowerCase().includes('product')) details.suggestedType = 'E-commerce';
        else if (indexContent.toLowerCase().includes('appointment')) details.suggestedType = 'Booking';
        else if (indexContent.toLowerCase().includes('lead')) details.suggestedType = 'Lead Generation';
        else details.suggestedType = 'General';
    }

    if (await pathExists(loaderPath)) {
        loaderStats = await fs.stat(loaderPath);
        details.loaderJs = {
            lastModified: loaderStats.mtime,
            size: loaderStats.size,
        };
    }
    
    return NextResponse.json(details);

  } catch (error: any) {
    console.error('Error fetching chatbot details:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}


// POST handler for updating the webhook
export async function POST(request: NextRequest) {
    try {
        const { clientName, key, newWebhookUrl } = await request.json();
        const adminKey = process.env.CHATBOT_ADMIN_KEY;

        if (!adminKey || key !== adminKey) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!clientName || !newWebhookUrl) {
            return NextResponse.json({ error: 'Client name and new webhook URL are required.' }, { status: 400 });
        }

        const clientDir = path.join(process.cwd(), 'public/chatbots', clientName);
        const indexPath = path.join(clientDir, 'index.html');

        if (!(await pathExists(indexPath))) {
            return NextResponse.json({ error: 'Client index.html not found.' }, { status: 404 });
        }

        let indexContent = await fs.readFile(indexPath, 'utf-8');
        
        // Regex to find variable names like WEBHOOK_URL or N8N_WEBHOOK_URL
        const webhookRegex = /((?:const|let|var)\s+\w*WEBHOOK_URL\w*\s*=\s*['"]).*?(['"])/;
        if (!webhookRegex.test(indexContent)) {
             return NextResponse.json({ error: 'Webhook URL variable not found in index.html. Cannot update.' }, { status: 400 });
        }
        
        const updatedContent = indexContent.replace(webhookRegex, `$1${newWebhookUrl}$2`);

        await fs.writeFile(indexPath, updatedContent, 'utf-8');

        return NextResponse.json({ success: true, message: `Webhook pentru '${clientName}' a fost actualizat.` });

    } catch (error: any) {
        console.error('Error updating webhook:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
