
// src/app/api/get-client-data/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';

type CollectionName = 'callTranscripts' | 'chatMessages' | 'leads';

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
        const { clientName, key, collections } = await request.json();

        const adminKey = process.env.DASHBOARD_ACCESS_KEY;

        // 1. Validate request
        if (!adminKey || key !== adminKey) {
            return NextResponse.json({ error: 'Unauthorized: Invalid or missing key.' }, { status: 401 });
        }
        if (!clientName) {
            return NextResponse.json({ error: 'Bad Request: clientName is required.' }, { status: 400 });
        }

        const db = getAdminDb();
        const clientDocRef = db.collection('ClientDashboard').doc(clientName);
        const clientDoc = await clientDocRef.get();

        if (!clientDoc.exists) {
            return NextResponse.json({ error: `Not Found: Client '${clientName}' does not exist.` }, { status: 404 });
        }
        
        // 2. Start with main data
        const responseData: { [key: string]: any } = {
            ...clientDoc.data()
        };
        
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
        // Distinguish between initialization errors and runtime errors
        if (error.message.includes("Firestore Admin")) {
             return NextResponse.json({ error: 'Configuration Error: Could not connect to the database.', details: error.message }, { status: 503 });
        }
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
