
// src/app/[locale]/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css'; // Ajustat calea pentru a reflecta structura [locale]
import { ThemeProvider } from '@/components/theme-provider';
import { RootLayoutClient } from '@/components/layout/root-layout-client';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

// Metadata și Viewport rămân așa cum sunt definite, dar ar trebui
// actualizate pentru a nu mai depinde de 'locale' dacă site-ul este monolingv.
// Pentru moment, le lăsăm așa, presupunând că 'ro' este singurul locale valid.
export const metadata: Metadata = {
  title: {
    default: 'Timpia AI - Automatizare Inteligentă pentru Afaceri Eficiente',
    template: '%s | Timpia AI',
  },
  description: 'Timpia AI oferă soluții avansate de automatizare: Chatboți RAG, Voice Agents și Playbook-uri personalizate. Economisiți timp și optimizați costurile cu inteligența artificială. Încercați gratuit!',
  keywords: ['automatizare AI', 'chatbot RAG', 'voice agent', 'inteligență artificială', 'optimizare procese', 'suport clienți AI', 'Timpia AI', 'economisire timp', 'reducere costuri'],
  authors: [{ name: 'Timpia AI' }],
  creator: 'Timpia AI',
  publisher: 'Timpia AI',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
  openGraph: {
    title: 'Timpia AI - Automatizare Inteligentă pentru Afaceri Eficiente',
    description: 'Chatboți RAG, Voice Agents și Playbook-uri AI pentru a vă transforma afacerea. Încercați gratuit și vedeți impactul!',
    url: 'https://timpia.ro',
    siteName: 'Timpia AI',
     images: [
       {
         url: 'https://i.imgur.com/BkUPeAn.png',
         width: 1200,
         height: 630,
         alt: 'Timpia AI - Automatizare Inteligentă',
       },
     ],
    locale: 'ro_RO',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'hsl(0 0% 5%)' },
  ],
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string }; // params.locale este încă aici datorită structurii folderului [locale]
}

export default function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  return (
    // Atributul lang este încă setat dinamic. Dacă site-ul devine strict monolingv (doar 'ro'),
    // atunci structura de foldere [locale] ar trebui eliminată, iar lang="ro" setat static.
    <html lang={params.locale} suppressHydrationWarning>
      <body className={`${inter.variable} antialiased font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Am eliminat proprietatea 'locale' de aici */}
          <RootLayoutClient>{children}</RootLayoutClient>
        </ThemeProvider>
      </body>
    </html>
  );
}
