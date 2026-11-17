import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/**
 * Only real, public, indexable pages. Every URL here must return 200 to a
 * signed-out visitor. No redirects, no 404s, nothing behind sign-in.
 * When you add a public page (e.g. a tender category page), add it here.
 *
 * `lastModified` is omitted on purpose: stamping everything "now" on each
 * build teaches Google to ignore the field.
 */
const PAGES: Array<{ path: string; changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly'; priority: number }> = [
  { path: '/', changeFrequency: 'daily', priority: 1.0 },
  { path: '/tender-guide', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/blog', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/privacy-policy', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/terms-and-conditions', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/cancellation-and-refund', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/shipping-and-delivery', changeFrequency: 'yearly', priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(({ path, changeFrequency, priority }) => ({
    url: path === '/' ? SITE_URL : `${SITE_URL}${path}`,
    changeFrequency,
    priority,
  }));
}
