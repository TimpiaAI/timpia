
// src/app/api/get-client-data/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { getSessionFromCookies } from '@/lib/auth/session';

type CollectionName = 'callTranscripts' | 'chatMessages' | 'leads' | 'smsLogs';

async function fetchAllFromSubcollection(db: FirebaseFirestore.Firestore, clientName: string, subcollection: CollectionName) {
    const snapshot = await db.collection('ClientDashboard').doc(clientName).collection(subcollection).get();
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Changed from GET to POST to allow for a request body with options
export async function POST(request: NextRequest) {
    try {
        const { clientName, collections } = await request.json();
        const session = await getSessionFromCookies();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized: missing session.' }, { status: 401 });
        }
        if (!clientName) {
            return NextResponse.json({ error: 'Bad Request: clientName is required.' }, { status: 400 });
        }

        // Ensure user is authorized to access this client dashboard
        if (session.username.toLowerCase() !== clientName.toLowerCase()) {
            return NextResponse.json({ error: 'Forbidden: access denied for this client.' }, { status: 403 });
        }

        const db = getAdminDb();
        const clientDocRef = db.collection('ClientDashboard').doc(clientName);
        const clientDoc = await clientDocRef.get();

        const responseData: { [key: string]: any } = clientDoc.exists
            ? { ...clientDoc.data() }
            : { clientName, _no_parent_doc: true };
        
        // 3. Conditionally fetch collections based on the 'collections' parameter
        if (collections && Array.isArray(collections)) {
            const fetchPromises: Promise<any>[] = [];
            const collectionNames: CollectionName[] = [];

            if (collections.includes('callTranscripts')) {
                fetchPromises.push(fetchAllFromSubcollection(db, clientName, 'callTranscripts'));
                collectionNames.push('callTranscripts');
            }
            if (collections.includes('chatMessages')) {
                fetchPromises.push(fetchAllFromSubcollection(db, clientName, 'chatMessages'));
                collectionNames.push('chatMessages');
            }
            if (collections.includes('leads')) {
                fetchPromises.push(fetchAllFromSubcollection(db, clientName, 'leads'));
                collectionNames.push('leads');
            }
            if (collections.includes('smsLogs')) {
                fetchPromises.push(fetchAllFromSubcollection(db, clientName, 'smsLogs'));
                collectionNames.push('smsLogs');
            }
            
            const results = await Promise.all(fetchPromises);

            results.forEach((result, index) => {
                const collectionName = collectionNames[index];
                responseData[collectionName] = result;
            });
        }
        
        // 4. Return the aggregated data
        return NextResponse.json(responseData, { status: 200 });

    } catch (error: any) {
        console.error('Error in get-client-data:', error);
        const message = typeof error?.message === 'string' ? error.message : 'Unknown error';
        if (message.includes('Firestore Admin')) {
             return NextResponse.json({ error: 'Configuration Error: Could not connect to the database.', details: message }, { status: 503 });
        }
        return NextResponse.json({ error: 'Internal Server Error', details: message }, { status: 500 });
    }
}
