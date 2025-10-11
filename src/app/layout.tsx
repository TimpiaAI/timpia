
// src/app/layout.tsx (fostul src/app/[locale]/layout.tsx)
import type { Metadata, Viewport } from 'next';
import { Inter, Caveat, Playfair_Display, Montserrat } from 'next/font/google'; // Import Montserrat
import './globals.css'; // Ajustat calea pentru a reflecta noua locație
import { RootLayoutClient } from '@/components/layout/root-layout-client';
import { ThemeProvider } from '@/components/theme-provider';
import AnalyticsConsentManager from '@/components/analytics-consent-manager';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  weight: ['400', '700'],
});

// Replaced Rencana with Playfair_Display
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-rencana', // Keep the same variable name to avoid changing Tailwind config
  weight: ['400'],
});

// Add Montserrat for a professional business look
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['700', '800'], // Import bold weights
});


export const metadata: Metadata = {
  metadataBase: new URL('https://timpia.ro'),
  title: {
    default: 'Angajați AI Timpia | Automatizare și Eficiență pentru Afacerea Ta',
    template: '%s | Timpia AI',
  },
  description: 'Descoperă viitorul muncii cu angajații AI de la Timpia. Automatizăm sarcini, eficientizăm procese și economisim timp cu asistenți virtuali personalizabili, disponibili 24/7. Rezervă-ți locul acum!',
  keywords: [
    'angajati AI',
    'asistent virtual',
    'automatizare HR',
    'inteligență artificială România',
    'chatbot angajati',
    'recrutare AI',
    'eficientizare procese',
    'Timpia AI',
    'automatizare business',
    'angajat digital',
    'reducere costuri',
    'soluții AI pentru afaceri',
    'automatizare afaceri',
    'agenti vocali AI',
    'chatboti personalizati',
    'automatizari AI 2025',
    'ai automation',
    'suport clienti automatizare',
    'agentie ai romania',
    'ai romania',
    'calificare lead-uri automata',
    'telefon AI',
    'sisteme personalizate',
    'software cu ai',
    'aplicatie mobila',
    'aplicatii mobile automatizate',
    'website cu functii AI',
    'apeluri automate prin AI',
    'AI in CRM',
    'preluare automata clienti',
    'date automate in CRM',
    'chatgpt pentru companii',
    'receptionista AI',
    'realtor AI',
    'imobiliare AI',
    'asigurari AI',
    'ecommerce AI',
    'automatizari prin inteligenta artificiala',
    'salvare timp',
    'preluare lead-uri fara angajat',
    'angajati AI disponibili la orice ora',
    'AI prezent mereu',
    'suport clienti 24/7',
    'chatbot avansat pentru companii',
    'cum imi pot face un chatbot',
    'raspuns clienti la orice ora',
    'automatizare procese repetitive',
    'CRM romania AI',
    'automatizari Romania',
    'automatizari Brasov',
    'automatizari procese repetitive Romania',
    'automatizare personalizata',
    'dezvoltare software romania',
    'dezvoltare website romania',
    'dezvoltare magazin online romania',
    'dezvoltare sistem calificare lead-uri',
    'dezvoltare sistem cautare lead-uri',
    'dezvoltare sistem 100% personalizat'
  ],
  authors: [{ name: 'Timpia AI' }],
  creator: 'Timpia AI',
  publisher: 'Timpia AI',
  verification: {
    google: 'guMQnFwi7upprFiy-YkKCrhrBHKnwvu8BPMHO4rr0_c',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Angajați AI Timpia: Primii Angajați Digitali din România',
    description: 'Revoluționează-ți afacerea cu angajați AI personalizabili care lucrează non-stop. Scalează, eficientizează și salvează timp. Află mai multe și rezervă-ți locul în programul de early access.',
    url: 'https://timpia.ro',
    siteName: 'Timpia AI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Prezentarea angajaților AI Timpia',
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
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    manifest: '/site.webmanifest',
    shortcut: '/favicon-32x32.png',
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
  maximumScale: 5,
  userScalable: true,
};

// Props-urile sunt acum doar pentru children, params.locale a fost eliminat
interface RootLayoutProps {
  children: React.ReactNode;
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Timpia AI",
  "url": "https://timpia.ro",
  "logo": "https://timpia.ro/icon-512.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+40-787-578-482",
    "contactType": "Customer Service",
    "email": "contact@timpia.ro"
  },
  "sameAs": [
    "https://www.facebook.com/profile.php?id=61564264426543",
    "https://www.instagram.com/timpia.ro/",
    "https://www.linkedin.com/in/timpia-ai-71138b365/",
    "https://www.tiktok.com/@timpia.ro"
  ]
};


export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    // Atributul lang este acum setat static la "ro"
    <html lang="ro" suppressHydrationWarning>
       <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={`${inter.variable} ${caveat.variable} ${playfair.variable} ${montserrat.variable} antialiased font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <RootLayoutClient>{children}</RootLayoutClient>
        </ThemeProvider>
        <AnalyticsConsentManager />
      </body>
    </html>
  );
}
