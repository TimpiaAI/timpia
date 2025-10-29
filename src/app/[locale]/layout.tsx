import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { getMessages, getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { Inter, Playfair_Display, Montserrat, Poppins } from 'next/font/google';
import { ReactNode } from 'react';

import '@/app/globals.css';

import { isLocale, locales, type Locale } from '@/i18n';
import { ThemeProvider } from '@/components/theme-provider';
import { RootLayoutClient } from '@/components/layout/root-layout-client';
import AnalyticsConsentManager from '@/components/analytics-consent-manager';
import { FirebaseClientProvider } from '@/firebase/client-provider';

import favicon16 from '@/images/favicon-16x16.png';
import favicon32 from '@/images/favicon-32x32.png';
import appleTouchIcon from '@/images/apple-touch-icon.png';
import icon192 from '@/images/icon-192.png';
import icon512 from '@/images/icon-512.png';
import ogImage from '@/images/og-image.png';

export const dynamic = 'force-dynamic';

const siteUrl = 'https://timpia.ro';

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

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);

  if (!isLocale(resolvedParams.locale)) {
    notFound();
  }

  const t = await getTranslations({ locale: resolvedParams.locale, namespace: 'meta' });

  return {
    metadataBase: new URL(siteUrl),
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${resolvedParams.locale}`,
    },
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: `${siteUrl}/${resolvedParams.locale}`,
      siteName: 'Timpia AI',
      images: [
        {
          url: ogImage.src,
          width: 1200,
          height: 630,
          alt: 'Timpia AI',
        },
      ],
      locale: resolvedParams.locale === 'ro' ? 'ro_RO' : 'en_US',
      type: 'website',
    },
    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: favicon32.src, sizes: '32x32', type: 'image/png' },
        { url: favicon16.src, sizes: '16x16', type: 'image/png' },
        { url: icon192.src, sizes: '192x192', type: 'image/png' },
        { url: '/icon.svg', type: 'image/svg+xml' },
      ],
      apple: [{ url: appleTouchIcon.src, sizes: '180x180', type: 'image/png' }],
      shortcut: ['/favicon.ico'],
    },
    manifest: '/manifest.webmanifest',
  };
}

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

function getOrganizationSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Timpia AI',
    url: siteUrl,
    logo: `${siteUrl}${icon512.src}`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+40-787-578-482',
      contactType: 'Customer Service',
      email: 'contact@timpia.ro',
    },
    sameAs: [
      'https://www.facebook.com/profile.php?id=61564264426543',
      'https://www.instagram.com/timpia.ro/',
      'https://www.linkedin.com/in/timpia-ai-71138b365/',
      'https://www.tiktok.com/@timpia.ro',
    ],
    areaServed: locale === 'ro' ? 'RO' : 'US',
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const resolvedParams = await Promise.resolve(params);

  if (!isLocale(resolvedParams.locale)) {
    notFound();
  }

  unstable_setRequestLocale(resolvedParams.locale);

  const messages = await getMessages();

  return (
    <html lang={resolvedParams.locale} suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="Timpia AI" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getOrganizationSchema(resolvedParams.locale as Locale)),
          }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} ${montserrat.variable} ${poppins.variable} antialiased font-sans`}>
        <FirebaseClientProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <NextIntlClientProvider locale={resolvedParams.locale} messages={messages}>
              <RootLayoutClient>{children}</RootLayoutClient>
            </NextIntlClientProvider>
          </ThemeProvider>
          <AnalyticsConsentManager />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
