
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
    console.log("----------\n[INGEST-DATA] Received payload:", JSON.stringify(data, null, 2));

    const { clientId } = data;
    
    if (!clientId) {
      console.error("[INGEST-DATA] Error: clientId is missing from payload.");
      return NextResponse.json({ error: 'clientId is required.' }, { status: 400 });
    }

    const clientDocRef = doc(db, 'ClientDashboard', clientId);

    // --- Transaction for Main Stats Update & Parent Doc Creation ---
    if (data.stats && typeof data.stats === 'object') {
        await runTransaction(db, async (transaction) => {
            const clientDoc = await transaction.get(clientDocRef);
            
            const statsUpdate: {[key: string]: any} = {};
            if (data.stats.totalCalls) statsUpdate['stats.totalCalls'] = increment(Number(data.stats.totalCalls));
            if (data.stats.totalMessages) statsUpdate['stats.totalMessages'] = increment(Number(data.stats.totalMessages));
            if (data.stats.avgDuration) statsUpdate['stats.avgDuration'] = Number(data.stats.avgDuration);
            if (data.stats.totalSms) statsUpdate['stats.totalSms'] = increment(Number(data.stats.totalSms));
            if (data.stats.lastSmsMessage?.trim()) statsUpdate['stats.lastSmsMessage'] = data.stats.lastSmsMessage;
            if (data.stats.lastSmsPhoneNumber?.trim()) statsUpdate['stats.lastSmsPhoneNumber'] = data.stats.lastSmsPhoneNumber;
            if (data.stats.status) statsUpdate['stats.status'] = data.stats.status;

            if (!clientDoc.exists()) {
                console.log(`[INGEST-DATA] Client doc for '${clientId}' does not exist. Creating...`);
                const initialData = {
                    clientName: clientId,
                    stats: {
                        totalCalls: data.stats?.totalCalls ? Number(data.stats.totalCalls) : 0,
                        totalMessages: data.stats?.totalMessages ? Number(data.stats.totalMessages) : 0,
                        avgDuration: data.stats?.avgDuration ? Number(data.stats.avgDuration) : 0,
                        totalSms: data.stats?.totalSms ? Number(data.stats.totalSms) : 0,
                        lastSmsMessage: data.stats?.lastSmsMessage || null,
                        lastSmsPhoneNumber: data.stats?.lastSmsPhoneNumber || null,
                        status: data.stats?.status || 'N/A',
                    }
                };
                transaction.set(clientDocRef, initialData);
                 console.log(`[INGEST-DATA] Client doc for '${clientId}' created successfully.`);
            } else {
                if (Object.keys(statsUpdate).length > 0) {
                    console.log(`[INGEST-DATA] Updating stats for client '${clientId}':`, statsUpdate);
                    transaction.update(clientDocRef, statsUpdate);
                }
            }
        });
        console.log("[INGEST-DATA] Stats/Parent Doc transaction completed successfully for client:", clientId);
    }


    // --- UNIVERSAL DATA LOGGING ---
    const isCallData = !!data.call_id;
    const isChatData = !!data.messageContent?.trim();
    const isSmsData = !!data.sms_message?.trim() && !!data.sms_phone_number?.trim();

    // Log call details if present
    if (isCallData) {
        console.log(`[INGEST-DATA] Logging call transcript for client '${clientId}'.`);
        const callTranscriptsCollectionRef = collection(db, 'ClientDashboard', clientId, 'callTranscripts');
        await addDoc(callTranscriptsCollectionRef, {
            call_id: data.call_id,
            timestamp: serverTimestamp(),
            transcript: data.transcript || null,
            duration: parseDuration(data.duration),
            outcome: data.outcome || 'N/A',
            recordingUrl: formatRecordingUrl(data.recording_url),
            summary: data.call_summary || null,
            caller_phone_number: data.caller_phone_number || null,
        });
    }
    
    // Log chat messages if present
    if (isChatData) {
        console.log(`[INGEST-DATA] Logging chat message for client '${clientId}'.`);
        const messagesCollectionRef = collection(db, 'ClientDashboard', clientId, 'chatMessages');
        await addDoc(messagesCollectionRef, {
            timestamp: serverTimestamp(),
            message: data.messageContent,
            country: data.country || null,
            platform: data.platform || null,
            sessionId: data.sessionId || null,
        });
    }

    // Log SMS messages if present
    if (isSmsData) {
        console.log(`[INGEST-DATA] Logging SMS for client '${clientId}'.`);
        const smsLogsCollectionRef = collection(db, 'ClientDashboard', clientId, 'smsLogs');
        await addDoc(smsLogsCollectionRef, {
            timestamp: serverTimestamp(),
            message: data.sms_message,
            phoneNumber: data.sms_phone_number,
        });
    }

    // --- Dynamic Lead Data Logging (New Robust Logic) ---
    // Define all keys that are *not* part of a lead and should be excluded.
    const nonLeadKeys = new Set(['clientId', 'stats', 'call_id', 'transcript', 'duration', 'outcome', 'recording_url', 'call_summary', 'caller_phone_number', 'messageContent', 'country', 'sessionId', 'platform', 'sms_message', 'sms_phone_number']);
    
    const leadData: {[key: string]: any} = {};
    for (const key in data) {
        if (!nonLeadKeys.has(key)) {
            leadData[key] = data[key];
        }
    }

    // Save as a lead if there's any dynamic data collected
    if (Object.keys(leadData).length > 0) {
         console.log(`[INGEST-DATA] Found dynamic lead data for client '${clientId}'. Saving...`, leadData);
         const leadsCollectionRef = collection(db, 'ClientDashboard', clientId, 'leads');
         
         const leadPayload = {
            ...leadData,
            timestamp: serverTimestamp(),
         };
         
         // Optional: Normalize 'services' to always be an array if it exists and is a string
         if (leadPayload.services && typeof leadPayload.services === 'string') {
            leadPayload.services = leadPayload.services.split(',').map((s: string) => s.trim()).filter((s: string) => s);
         }
         
         await addDoc(leadsCollectionRef, leadPayload);
         console.log(`[INGEST-DATA] Successfully saved lead data for '${clientId}'.`);
    } else {
        console.log(`[INGEST-DATA] No dynamic lead data found for client '${clientId}'. Skipping lead creation.`);
    }
    
    return NextResponse.json({ success: true, message: `Data ingested successfully for client: ${clientId}` });

  } catch (error: any) {
    console.error('[INGEST-DATA] Critical Error in handler:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
