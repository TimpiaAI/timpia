import { type MetadataRoute } from 'next';

import icon192 from '@/images/icon-192.png';
import icon512 from '@/images/icon-512.png';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Automatizări create pentru tine',
    short_name: 'Timpia AI',
    description: 'Automatizăm procese cu angajați AI personalizați pentru afacerea ta.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: icon192.src,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: icon512.src,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
