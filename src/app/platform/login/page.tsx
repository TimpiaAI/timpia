"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth, useUser } from '@/firebase/provider';

const googleProvider = new GoogleAuthProvider();

export default function PlatformLoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [redirectTo, setRedirectTo] = useState('/platform');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirectParam = params.get('redirectTo');
    if (redirectParam) {
      setRedirectTo(redirectParam);
    }
  }, []);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace(redirectTo);
    }
  }, [isUserLoading, user, router, redirectTo]);

  const handleEmailSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace(redirectTo);
    } catch (err: any) {
      console.error('Platform login error:', err);
      setError(err.message || 'Autentificare eșuată. Verifică datele introduse.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      await signInWithPopup(auth, googleProvider);
      router.replace(redirectTo);
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setError(err.message || 'Nu am putut finaliza autentificarea cu Google.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background">
        <p className="text-muted-foreground">Verificăm sesiunea ta...</p>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">Platformă Timpia</span>
          <h1 className="text-3xl font-semibold text-foreground">Autentificare</h1>
          <p className="text-sm text-muted-foreground">Intră în cont pentru a accesa platforma Timpia.</p>
        </div>

        <form onSubmit={handleEmailSignIn} className="space-y-5 rounded-2xl border border-border/30 bg-background/70 p-6 shadow-xl backdrop-blur">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="exemplu@domeniu.ro"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Parolă</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Parola ta"
              required
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Se autentifică...' : 'Autentifică-te'}
          </Button>
        </form>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase tracking-wide text-muted-foreground">sau</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <Button type="button" variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isSubmitting}>
          Continuă cu Google
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Nu ai cont?{' '}
          <Link href={`/platform/register?redirectTo=${encodeURIComponent(redirectTo)}`} className="text-primary hover:underline">
            Creează unul
          </Link>
        </p>
      </div>
    </div>
  );
}
