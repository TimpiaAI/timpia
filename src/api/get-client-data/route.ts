// src/app/api/get-client-data/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import type { firestore } from 'firebase-admin';

// (opțional, dar util dacă folosești admin SDK)
export const runtime = 'nodejs';

type SubcollectionName = 'callTranscripts' | 'chatMessages' | 'leads' | 'smsLogs';
const VALID_SUBCOLLECTIONS: SubcollectionName[] = ['callTranscripts', 'chatMessages', 'leads', 'smsLogs'];

async function fetchAllFromSubcollection(
  db: firestore.Firestore,
  clientId: string,
  subcollection: SubcollectionName
) {
  const base = db.collection('ClientDashboard').doc(clientId).collection(subcollection);
  // 1) Încercăm cu orderBy doar dacă există măcar un doc cu timestamp
  const snapAny = await base.limit(1).get();
  if (snapAny.empty) return [];

  const hasTimestamp = snapAny.docs.some(d => d.get('timestamp') !== undefined);

  const snap = hasTimestamp
    ? await base.orderBy('timestamp', 'desc').get()
    : await base.get();

  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    // Acceptă și clientId ca alias, dacă cineva trimite alt nume
    const clientId: string | undefined = payload.clientName ?? payload.clientId;
    const key: string | undefined = payload.key;
    let collections: string[] | undefined = payload.collections;

    const adminKey = process.env.DASHBOARD_ACCESS_KEY;
    if (!adminKey || key !== adminKey) {
      return NextResponse.json({ error: 'Unauthorized: Invalid or missing key.' }, { status: 401 });
    }
    if (!clientId) {
      return NextResponse.json({ error: 'Bad Request: clientName (or clientId) is required.' }, { status: 400 });
    }

    const db = getAdminDb();
    const clientDocRef = db.collection('ClientDashboard').doc(clientId);
    const clientDoc = await clientDocRef.get();

    // ⚠️ NU mai 404 dacă lipsește docul părinte — putem avea subcolecții valide
    const responseData: { [k: string]: any } = clientDoc.exists ? { ...clientDoc.data() } : { clientName: clientId, _no_parent_doc: true };

    // Dacă nu s-a specificat nimic, citește TOATE subcolecțiile valide
    if (!collections || !Array.isArray(collections) || collections.length === 0) {
      collections = VALID_SUBCOLLECTIONS;
    }

    const validCollections = (collections as string[]).filter((c): c is SubcollectionName =>
      (VALID_SUBCOLLECTIONS as string[]).includes(c)
    );

    const results = await Promise.all(
      validCollections.map(name => fetchAllFromSubcollection(db, clientId, name))
    );

    results.forEach((result, i) => {
      responseData[validCollections[i]] = result;
    });

    return NextResponse.json(responseData, { status: 200 });
  } catch (error: any) {
    console.error('Error in get-client-data:', error);
    if (typeof error?.message === 'string' && error.message.includes('Firebase Admin')) {
      return NextResponse.json(
        { error: 'Configuration Error: Could not connect to the database.', details: error.message },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: 'Internal Server Error', details: error?.message ?? String(error) }, { status: 500 });
  }
}
