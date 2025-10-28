"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Lock, User, Eye, EyeOff, KeyRound } from 'lucide-react';

interface DashboardLoginFormProps {
  redirectTo?: string;
}

const DashboardLoginForm: React.FC<DashboardLoginFormProps> = ({ redirectTo = '/dashboard' }) => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<'login' | 'change'>('login');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRevealStart = () => setShowPassword(true);
  const handleRevealEnd = () => setShowPassword(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          newPassword: mode === 'change' ? newPassword : undefined,
          confirmPassword: mode === 'change' ? confirmPassword : undefined,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));

        if (response.status === 409 && payload?.requiresPasswordChange) {
          setMode('change');
          setNewPassword('');
          setConfirmPassword('');
          setSuccessMessage('Setează o parolă nouă pentru a continua.');
          return;
        }

        throw new Error(payload?.error || 'Autentificare eșuată.');
      }

      router.replace(redirectTo);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Autentificare eșuată.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-border/30 shadow-xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10"><Lock className="h-6 w-6 text-primary" /></div>
          <CardTitle className="text-2xl font-semibold text-foreground">Intră în dashboard</CardTitle>
          <p className="text-sm text-muted-foreground">Autentifică-te pentru a-ți gestiona datele și antrenamentele.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4 text-primary" />
                Nume utilizator
              </Label>
              <Input
                id="username"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Utilizator"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Parolă</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Parola ta"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-2 flex items-center rounded-md px-2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  onMouseDown={handleRevealStart}
                  onMouseUp={handleRevealEnd}
                  onMouseLeave={handleRevealEnd}
                  onTouchStart={handleRevealStart}
                  onTouchEnd={handleRevealEnd}
                  aria-label={showPassword ? 'Ascunde parola' : 'Ține apăsat pentru a afișa parola'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Ține apăsat pe icon pentru a vizualiza temporar parola.
              </p>
            </div>

            {mode === 'change' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="flex items-center gap-2 text-sm font-medium">
                    <KeyRound className="h-4 w-4 text-primary" />
                    Parolă nouă
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="Cel puțin 8 caractere"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirmă parola nouă</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Reintrodu parola"
                    required
                  />
                </div>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert>
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'change' ? 'Salvează parola' : 'Se autentifică...'}
                </>
              ) : (
                mode === 'change' ? 'Actualizează parola' : 'Intră în cont'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardLoginForm;
