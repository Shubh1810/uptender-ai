/** Canonical public origin, no trailing slash. Used by metadata, sitemap and robots. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://tenderpost.org').replace(/\/+$/, '');

export const SITE_NAME = 'TenderPost';
