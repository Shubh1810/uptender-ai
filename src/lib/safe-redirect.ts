/**
 * Returns `path` only if it is a same-origin relative path, otherwise `fallback`.
 *
 * Blocks open redirects such as `https://evil.com`, `//evil.com`, `/\evil.com`,
 * and `@evil.com` (which turns `https://site.com@evil.com` into evil.com).
 */
export function safeRedirectPath(path: string | null | undefined, fallback = '/'): string {
  if (!path) return fallback;
  if (!path.startsWith('/')) return fallback;
  if (path.startsWith('//') || path.startsWith('/\\')) return fallback;
  // Reject control characters (e.g. tab/newline tricks browsers strip).
  if (/[\u0000-\u001f\u007f]/.test(path)) return fallback;

  try {
    const base = 'http://placeholder.invalid';
    const url = new URL(path, base);
    if (url.origin !== base) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
