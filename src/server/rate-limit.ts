import 'server-only';
import { tooManyRequests } from '@/server/http';

/**
 * Fixed-window, in-memory rate limiter.
 *
 * Best effort only: each serverless instance keeps its own counters, so a
 * determined attacker spread across instances gets more than `limit`. It still
 * stops casual abuse and runaway scripts. For a hard global limit, swap the
 * store for Upstash Redis / Vercel KV behind this same interface.
 */
interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 10_000;

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();

  if (buckets.size > MAX_BUCKETS) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}

/** Throws a 429 `ApiError` when the limit is exceeded. */
export function enforceRateLimit(key: string, limit: number, windowMs: number) {
  if (!rateLimit(key, limit, windowMs)) throw tooManyRequests();
}
