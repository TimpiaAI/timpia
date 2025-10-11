
// src/app/dashboard/[clientName]/[secretKey]/page.tsx
import { notFound } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import DashboardClientPage from '@/components/dashboard-client-page';
import type { Metadata } from 'next';

type Props = {
  params: {
    clientName: string;
    secretKey: string;
  };
};

async function getClientData(clientName: string) {
    try {
        const docRef = doc(db, 'ClientDashboard', clientName);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            // Chiar dacă nu există, returnăm un obiect gol pentru a nu crăpa pagina
            // Componenta client va afișa o stare "fără date"
            return { clientName: clientName, stats: { totalCalls: 0, avgDuration: 0 } };
        }
        return docSnap.data();
    } catch (error) {
        console.error("Firebase fetch error:", error);
        // În caz de eroare la preluarea datelor, returnăm null pentru a afișa notFound
        return null;
    }
}


// Generare metadate dinamice pentru fiecare dashboard
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Preluăm datele pentru a obține un nume mai "frumos" dacă există
  const data = await getClientData(params.clientName);
  const pageTitle = data?.clientName || params.clientName.replace(/_/g, ' ');

  return {
    title: `Dashboard: ${pageTitle} | Timpia AI`,
    description: `Dashboard de analiză și performanță pentru ${pageTitle}.`,
    // Important: Previne indexarea de către motoarele de căutare
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
        'max-video-preview': -1,
        'max-image-preview': 'none',
        'max-snippet': -1,
      },
    },
  };
}

// -- Componenta de Pagină (Server Component) --
export default async function DashboardPage({ params }: Props) {
  const { clientName, secretKey } = params;
  
  // 1. Validarea cheii de acces pe server
  const accessKey = process.env.DASHBOARD_ACCESS_KEY;
  if (!accessKey || secretKey !== accessKey) {
      notFound();
  }

  // 2. Preluare date inițiale (opțional, pentru a evita un ecran de încărcare gol)
  const initialData = await getClientData(clientName);
  
  if (initialData === null) {
      // Dacă a apărut o eroare la preluarea datelor (ex: pb cu cheia de serviciu), afișăm 404
      notFound();
  }

  // 3. Randare componentă client, care va gestiona actualizările în timp real
  return (
    <div className="bg-muted/40 min-h-screen">
      <DashboardClientPage
        clientName={clientName}
        // Asigurăm serializarea datelor pentru a le pasa clientului în siguranță
        initialData={JSON.parse(JSON.stringify(initialData))} 
      />
    </div>
  );
}
