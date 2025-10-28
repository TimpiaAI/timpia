import { redirect, notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { requireSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

type Params = {
  clientName: string;
  secretKey: string;
};

type Props = {
  params: Promise<Params> | Params;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Dashboard | Timpia AI',
    description: 'Acces securizat la dashboard-ul Timpia AI.',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function DashboardRedirect({ params }: Props) {
  const session = await requireSession();
  const { clientName } = await Promise.resolve(params);

  if (session.username.toLowerCase() !== clientName.toLowerCase()) {
    notFound();
  }

  redirect('/dashboard');
}
