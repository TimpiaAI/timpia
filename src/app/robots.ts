
// src/app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://timpia.ro';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/snpad/'], // Disallow sensitive or private routes
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
