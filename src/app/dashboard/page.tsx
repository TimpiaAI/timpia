// src/app/dashboard/page.tsx
import DashboardClientPage from '@/components/dashboard-client-page';
import { requireSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await requireSession();
  const clientName = session.username;

  return (
    <div className="bg-muted/40 min-h-screen">
      <DashboardClientPage clientName={clientName} />
    </div>
  );
}
