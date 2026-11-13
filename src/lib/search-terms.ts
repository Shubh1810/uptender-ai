/**
 * Helpers for turning user-typed search input into values that are safe to
 * embed in PostgREST filter strings (e.g. `.or('title.ilike.%x%,...')`).
 *
 * PostgREST treats `,` `(` `)` as filter syntax, `"` and `\` as quoting, and
 * `%` `*` `_` as wildcards. Unsanitised input either breaks the query (a plain
 * search like "pumps, valves" returned 500) or lets a caller inject extra
 * filter conditions.
 */

export const MAX_TERM_LENGTH = 100;
export const MAX_TERMS = 10;

export function sanitizeSearchTerm(raw: string): string {
  return raw
    .replace(/[,()"\\%*_:]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_TERM_LENGTH);
}

/** Sanitise a list of terms, dropping empties/duplicates and capping the count. */
export function sanitizeSearchTerms(terms: Iterable<string>): string[] {
  const out = new Set<string>();
  for (const term of terms) {
    const clean = sanitizeSearchTerm(term);
    if (clean) out.add(clean);
    if (out.size >= MAX_TERMS) break;
  }
  return [...out];
}
