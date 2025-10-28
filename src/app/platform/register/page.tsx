"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth, useFirestore, useUser } from '@/firebase/provider';

const googleProvider = new GoogleAuthProvider();

export default function PlatformRegisterPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [redirectTo, setRedirectTo] = useState('/platform');

  const [fullName, setFullName] = useState('');
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

  const createUserDoc = async (uid: string, data: Record<string, unknown>) => {
    const userRef = doc(firestore, 'platformUsers', uid);
    await setDoc(userRef, data, { merge: true });
  };

  const handleEmailRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const credentials = await createUserWithEmailAndPassword(auth, email.trim(), password);
      if (fullName.trim()) {
        await updateProfile(credentials.user, { displayName: fullName.trim() });
      }

      await createUserDoc(credentials.user.uid, {
        email: credentials.user.email,
        displayName: fullName.trim() || credentials.user.displayName || null,
        provider: 'password',
        createdAt: serverTimestamp(),
      });

      router.replace(redirectTo);
    } catch (err: any) {
      console.error('Platform register error:', err);
      setError(err.message || 'Nu am putut crea contul. Încearcă din nou.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const credentials = await signInWithPopup(auth, googleProvider);
      await createUserDoc(credentials.user.uid, {
        email: credentials.user.email,
        displayName: credentials.user.displayName || null,
        provider: 'google',
        photoURL: credentials.user.photoURL || null,
        createdAt: serverTimestamp(),
      });

      router.replace(redirectTo);
    } catch (err: any) {
      console.error('Google sign-up error:', err);
      setError(err.message || 'Nu am putut crea contul cu Google.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background">
        <p className="text-muted-foreground">Se încarcă...</p>
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
          <h1 className="text-3xl font-semibold text-foreground">Creează un cont</h1>
          <p className="text-sm text-muted-foreground">Devino parte din platforma Timpia și primește acces prioritar.</p>
        </div>

        <form onSubmit={handleEmailRegister} className="space-y-5 rounded-2xl border border-border/30 bg-background/70 p-6 shadow-xl backdrop-blur">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nume complet</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Nume și prenume"
            />
          </div>
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
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Cel puțin 6 caractere"
              required
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Se creează contul...' : 'Creează cont'}
          </Button>
        </form>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase tracking-wide text-muted-foreground">sau</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <Button type="button" variant="outline" className="w-full" onClick={handleGoogleSignUp} disabled={isSubmitting}>
          Continuă cu Google
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Ai deja cont?{' '}
          <Link href={`/platform/login?redirectTo=${encodeURIComponent(redirectTo)}`} className="text-primary hover:underline">
            Autentifică-te
          </Link>
        </p>
      </div>
    </div>
  );
}
