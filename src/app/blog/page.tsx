
// src/app/blog/page.tsx (Server Component)
import { getSortedPostsData } from '@/lib/blog';
import BlogListingClient from './blog-listing-client';
import type { Metadata } from 'next';

// Metadata can be defined here as it's a Server Component
export const metadata: Metadata = {
  title: 'Blog Timpia AI | Articole și Noutăți despre Inteligența Artificială',
  description: 'Explorați blogul Timpia AI pentru articole despre automatizare, chatboți RAG, voice agents, studii de caz și ultimele tendințe în AI pentru afaceri în România.',
  openGraph: {
    title: 'Blog Timpia AI | Noutăți și Resurse despre Automatizare Inteligentă',
    description: 'Resurse și insight-uri despre automatizarea inteligentă, optimizarea proceselor și tehnologii AI pentru afaceri.',
    url: 'https://timpia.ro/blog', // Static URL, no locale
    images: [
      {
        url: 'https://i.imgur.com/BkUPeAn.png', // Replaced with a relevant OG image
        width: 1200,
        height: 630,
        alt: 'Blog Timpia AI - Articole despre Tehnologie și Automatizare',
      },
    ],
  },
};

// This page component does not take params from the router
export default function BlogPage() {
  // Data fetching happens on the server
  const allPosts = getSortedPostsData(); // Does not require locale

  // Pass the fetched data to the Client Component
  return <BlogListingClient allPosts={allPosts} />;
}
