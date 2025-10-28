"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase/provider';

export default function PlatformHomePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/platform/login?redirectTo=/platform');
    }
  }, [isUserLoading, user, router]);

  if (isUserLoading || (!user && typeof window === 'undefined')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background">
        <p className="text-muted-foreground">Se încarcă platforma...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect in progress
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="max-w-2xl space-y-6">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">Timpia Platform</span>
        <h1 className="text-3xl sm:text-4xl font-semibold text-foreground">
          Bun venit, {user.email?.split('@')[0] || 'creator de automatizări'}!
        </h1>
        <p className="text-muted-foreground">
          Suntem în faza de dezvoltare a platformei Timpia. În curând vei putea controla playbook-uri AI, monitoriza performanța angajaților virtuali și integra fluxuri automate direct dintr-un singur loc.
        </p>
        <div className="space-x-3">
          <Button asChild size="lg">
            <Link href="/">Înapoi la website</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="mailto:contact@timpia.ro">Solicită acces anticipat</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
