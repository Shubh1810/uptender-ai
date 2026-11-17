import type { MetadataRoute } from 'next';

/**
 * Web app manifest, served at /manifest.webmanifest (Next adds the <link> tag).
 *
 * Makes TenderPost installable ("Add to Home Screen" on Android / desktop
 * Chrome) with the right name, icon and colours, and opens straight into the
 * dashboard. Signed-out users are redirected to the landing page by the proxy.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'TenderPost: All India Tenders',
    short_name: 'TenderPost',
    description:
      'Search all India tenders: government, construction, railway and PSU tenders, with daily alerts and AI bid analysis.',
    start_url: '/dashboard',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    lang: 'en-IN',
    dir: 'ltr',
    categories: ['business', 'productivity'],
    icons: [
      { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  };
}
