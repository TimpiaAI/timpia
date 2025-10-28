// src/app/dashboard/[clientName]/page.tsx
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { requireSession } from '@/lib/auth/session';

export const dynamic = "force-dynamic";

type Props = {
  params: {
    clientName: string;
  };
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
export default async function DashboardPage({ params }: Props) {
  const session = await requireSession();
  const { clientName } = params;

  if (session.username.toLowerCase() !== clientName.toLowerCase()) {
    notFound();
  }

  redirect('/dashboard');
}
