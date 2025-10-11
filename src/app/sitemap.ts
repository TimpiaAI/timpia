// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { getSortedPostsData } from '@/lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://timpia.ro';

  // Get all blog post data to use correct dates
  const allPosts = getSortedPostsData();
  const postUrls: MetadataRoute.Sitemap = allPosts.map(post => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date), // Use the actual post date
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Define only the existing static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl, // The main homepage
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/blog`, // The blog listing page
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // Legal and policy pages that actually exist
    {
      url: `${siteUrl}/termeni-si-conditii`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/politica-confidentialitate`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/gdpr`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/cookies`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  return [...staticPages, ...postUrls];
}
