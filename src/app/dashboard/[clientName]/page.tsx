// src/app/dashboard/[clientName]/page.tsx
import { notFound } from 'next/navigation';
import DashboardClientPage from '@/components/dashboard-client-page';
import type { Metadata } from 'next';

export const dynamic = "force-dynamic";

type Props = {
  params: {
    clientName: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

// Generare metadate dinamice - rămâne simplă, fără a accesa baza de date
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pageTitle = params.clientName.replace(/_/g, ' ');

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
// Rolul ei este acum mult mai simplu: validează accesul și randează componenta client.
export default async function DashboardPage({ params, searchParams }: Props) {
  const { clientName } = params;
  const accessKey = searchParams.key as string; // Get key from URL
  
  // 1. Validarea cheii de acces pe server
  const expectedKey = process.env.DASHBOARD_ACCESS_KEY;
  if (!expectedKey || accessKey !== expectedKey) {
      notFound();
  }

  // 2. Randare componentă client, care va gestiona preluarea datelor
  return (
    <div className="bg-muted/40 min-h-screen">
      <DashboardClientPage
        clientName={clientName}
        accessKey={accessKey} // Pass the key to the client component
      />
    </div>
  );
}
