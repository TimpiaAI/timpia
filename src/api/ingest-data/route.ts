
// src/app/api/ingest-data/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc, updateDoc, increment, collection, serverTimestamp, runTransaction, addDoc, getDoc } from 'firebase/firestore';

/**
 * Parses a duration string (e.g., "1 minut 12 secunde") into total seconds.
 * @param durationStr The string or number representing the duration.
 * @returns The total duration in seconds, or null if parsing fails.
 */
function parseDuration(durationStr: string | number | undefined | null): number | null {
  if (typeof durationStr === 'number') {
    return durationStr;
  }
  if (!durationStr || typeof durationStr !== 'string') {
    return null;
  }

  let totalSeconds = 0;
  const minuteMatch = durationStr.match(/(\d+)\s*(minut|minute)/i);
  if (minuteMatch) {
    totalSeconds += parseInt(minuteMatch[1], 10) * 60;
  }

  const secondMatch = durationStr.match(/(\d+)\s*(secund[aăe]|sec)/i);
  if (secondMatch) {
    totalSeconds += parseInt(secondMatch[1], 10);
  }
  
  if (totalSeconds === 0 && /^\d+$/.test(durationStr)) {
      return parseInt(durationStr, 10);
  }

  return totalSeconds > 0 ? totalSeconds : null;
}

/**
 * Formats the recording URL. If it's a base64 string, it creates a Data URI.
 * @param url The raw URL or base64 string.
 * @returns A usable URL or Data URI, or null.
 */
function formatRecordingUrl(url: string | undefined | null): string | null {
    if (!url) return null;
    if (!url.startsWith('http') && url.length > 200) {
        return `data:audio/mpeg;base64,${url}`;
    }
    return url;
}

export async function POST(request: NextRequest) {
  const authorizationHeader = request.headers.get('Authorization');
  const expectedToken = `Bearer ${process.env.N8N_WEBHOOK_SECRET}`;

  if (!authorizationHeader || authorizationHeader !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized: Invalid or missing token.' }, { status: 401 });
  }

  try {
    const data = await request.json();
    console.log("Received data payload:", JSON.stringify(data, null, 2));

    const { 
        clientId, 
        stats,
        call_id, transcript, duration, outcome, recording_url, call_summary, caller_phone_number,
        messageContent, country, sessionId, platform,
        sms_message, sms_phone_number,
    } = data;
    
    if (!clientId) {
      return NextResponse.json({ error: 'clientId is required.' }, { status: 400 });
    }

    const clientDocRef = doc(db, 'ClientDashboard', clientId);

    // --- Transaction for Main Stats Update & Parent Doc Creation ---
    await runTransaction(db, async (transaction) => {
        const clientDoc = await transaction.get(clientDocRef);
        
        const statsUpdate: {[key: string]: any} = {};
        if (stats && typeof stats === 'object') {
            if (stats.totalCalls) statsUpdate['stats.totalCalls'] = increment(Number(stats.totalCalls));
            if (stats.totalMessages) statsUpdate['stats.totalMessages'] = increment(Number(stats.totalMessages));
            if (stats.avgDuration) statsUpdate['stats.avgDuration'] = Number(stats.avgDuration);
            if (stats.totalSms) statsUpdate['stats.totalSms'] = increment(Number(stats.totalSms));
            if (stats.lastSmsMessage?.trim()) statsUpdate['stats.lastSmsMessage'] = stats.lastSmsMessage;
            if (stats.lastSmsPhoneNumber?.trim()) statsUpdate['stats.lastSmsPhoneNumber'] = stats.lastSmsPhoneNumber;
            if (stats.status) statsUpdate['stats.status'] = stats.status;
        }

        if (!clientDoc.exists()) {
            const initialData = {
                clientName: clientId,
                stats: {
                    totalCalls: stats?.totalCalls ? Number(stats.totalCalls) : 0,
                    totalMessages: stats?.totalMessages ? Number(stats.totalMessages) : 0,
                    avgDuration: stats?.avgDuration ? Number(stats.avgDuration) : 0,
                    totalSms: stats?.totalSms ? Number(stats.totalSms) : 0,
                    lastSmsMessage: stats?.lastSmsMessage || null,
                    lastSmsPhoneNumber: stats?.lastSmsPhoneNumber || null,
                    status: stats?.status || 'N/A',
                }
            };
            transaction.set(clientDocRef, initialData);
        } else {
            if (Object.keys(statsUpdate).length > 0) {
                transaction.update(clientDocRef, statsUpdate);
            }
        }
    });
    console.log("Stats/Parent Doc transaction completed successfully for client:", clientId);


    // --- UNIVERSAL DATA LOGGING ---
    
    // Log call details if present
    if (call_id) {
        const callTranscriptsCollectionRef = collection(db, 'ClientDashboard', clientId, 'callTranscripts');
        await addDoc(callTranscriptsCollectionRef, {
            call_id,
            timestamp: serverTimestamp(),
            transcript: transcript || null,
            duration: parseDuration(duration),
            outcome: outcome || 'N/A',
            recordingUrl: formatRecordingUrl(recording_url),
            summary: call_summary || null,
            caller_phone_number: caller_phone_number || null,
        });
    }
    
    // Log chat messages if present
    if (messageContent?.trim()) {
        const messagesCollectionRef = collection(db, 'ClientDashboard', clientId, 'chatMessages');
        await addDoc(messagesCollectionRef, {
            timestamp: serverTimestamp(),
            message: messageContent,
            country: country || null,
            platform: platform || null,
            sessionId: sessionId || null,
        });
    }

    // Log SMS messages if present
    if (sms_message?.trim() && sms_phone_number?.trim()) {
        const smsLogsCollectionRef = collection(db, 'ClientDashboard', clientId, 'smsLogs');
        await addDoc(smsLogsCollectionRef, {
            timestamp: serverTimestamp(),
            message: sms_message,
            phoneNumber: sms_phone_number,
        });
    }

    // --- Dynamic Lead Data Logging ---
    // Extract reserved keys
    const reservedKeys = ['clientId', 'stats', 'call_id', 'transcript', 'duration', 'outcome', 'recording_url', 'call_summary', 'caller_phone_number', 'messageContent', 'country', 'sessionId', 'platform', 'sms_message', 'sms_phone_number'];
    
    // Build the lead data object from all keys not in the reserved list
    const leadData: {[key: string]: any} = {};
    for (const key in data) {
        if (!reservedKeys.includes(key)) {
            leadData[key] = data[key];
        }
    }

    // Save as a lead if there's any dynamic data
    if (Object.keys(leadData).length > 0) {
         const leadsCollectionRef = collection(db, 'ClientDashboard', clientId, 'leads');
         const leadPayload = {
            ...leadData,
            timestamp: serverTimestamp(),
         };
         
         // Optional: Normalize 'services' to always be an array if it exists
         if (leadPayload.services && typeof leadPayload.services === 'string') {
            leadPayload.services = leadPayload.services.split(',').map((s: string) => s.trim()).filter((s: string) => s);
         }
         
         await addDoc(leadsCollectionRef, leadPayload);
    }
    
    return NextResponse.json({ success: true, message: `Data ingested successfully for client: ${clientId}` });

  } catch (error: any) {
    console.error('Error in ingest-data handler:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
