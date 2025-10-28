import { Suspense } from 'react';
import DashboardLoginForm from './login-form';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const sanitizeRedirect = (value: string | undefined): string => {
  if (!value || typeof value !== 'string') return '/dashboard';
  if (!value.startsWith('/')) return '/dashboard';
  return value;
};

const LoginPage = ({ searchParams }: PageProps) => {
  const redirectParam = Array.isArray(searchParams.redirectTo)
    ? searchParams.redirectTo[0]
    : (searchParams.redirectTo as string | undefined);
  const redirectTo = sanitizeRedirect(redirectParam);

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background text-muted-foreground">Se încarcă formularul...</div>}>
      <DashboardLoginForm redirectTo={redirectTo} />
    </Suspense>
  );
};

export default LoginPage;
