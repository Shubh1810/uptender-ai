import 'server-only';
import { z } from 'zod';

/**
 * Server-side environment, validated once on first use.
 *
 * Validation is lazy (not at import time) so `next build` works in CI without
 * production secrets. Each feature asks for exactly the variables it needs via
 * `requireEnv`, which fails with a clear message instead of an `undefined!`.
 */
const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.url().optional(),

  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

  RAZORPAY_KEY_ID: z.string().min(1).optional(),
  RAZORPAY_KEY_SECRET: z.string().min(1).optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1).optional(),

  RESEND_API_KEY: z.string().min(1).optional(),
  EMAIL_FROM: z.string().min(1).default('TenderPost <onboarding@resend.dev>'),
  NOTIFICATION_EMAIL: z.email().default('sales@tenderpost.org'),
  SALES_NOTIFICATION_EMAIL: z.email().default('sales@tenderpost.org'),

  /** 32-byte key, base64-encoded. Generate with: openssl rand -base64 32 */
  GST_ENCRYPTION_KEY: z.string().min(1).optional(),
});

export type ServerEnv = z.infer<typeof schema>;

let cached: { source: NodeJS.ProcessEnv; value: ServerEnv } | null = null;

export function env(): ServerEnv {
  // Re-validate if process.env was replaced (tests do this); otherwise parse once.
  if (cached && cached.source === process.env) return cached.value;
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Invalid server environment variables:\n${issues}`);
  }
  cached = { source: process.env, value: parsed.data };
  return cached.value;
}

type OptionalKeys = {
  [K in keyof ServerEnv]-?: undefined extends ServerEnv[K] ? K : never;
}[keyof ServerEnv];

/** Read an optional env var that a specific feature requires. */
export function requireEnv<K extends OptionalKeys>(key: K): NonNullable<ServerEnv[K]> {
  const value = env()[key];
  if (value === undefined || value === null || value === '') {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value as NonNullable<ServerEnv[K]>;
}

export const isProduction = () => env().NODE_ENV === 'production';
