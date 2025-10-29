import type { Metadata } from 'next';
import './globals.css';
import { Suspense } from 'react';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { Inter, Playfair_Display, Montserrat, Poppins } from 'next/font/google';
import SiteLoader from '@/components/ui/site-loader';

export const metadata: Metadata = {
  title: 'Timpia AI',
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400'],
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['700', '800'],
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} ${montserrat.variable} ${poppins.variable} antialiased font-sans relative min-h-screen overflow-x-hidden`}>
        <FirebaseClientProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="relative z-10 min-h-screen bg-black/35 backdrop-blur-md">
              <Suspense fallback={<SiteLoader />}>{children}</Suspense>
            </div>
          </ThemeProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
