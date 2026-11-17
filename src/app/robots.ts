import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/**
 * One rule for every crawler. Don't block /_next/: crawlers need the CSS and
 * JS to render pages. Auth pages stay crawlable so bots can see their
 * `noindex` tag (a blocked URL can still be indexed from links, without it).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard', '/ingest/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
