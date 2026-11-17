import crypto from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { safeRedirectPath } from '@/lib/safe-redirect';
import { escapeHtml } from '@/lib/escape-html';
import { sanitizeSearchTerm, sanitizeSearchTerms, MAX_TERMS } from '@/features/tenders/search-terms';
import { signaturesMatch, verifyCheckoutSignature, verifyWebhookSignature } from '@/features/billing/server/razorpay';
import { decryptField, encryptField } from '@/server/crypto';

describe('safeRedirectPath', () => {
  it.each([
    ['/dashboard', '/dashboard'],
    ['/dashboard/search?q=solar#top', '/dashboard/search?q=solar#top'],
  ])('keeps same-origin path %s', (input, expected) => {
    expect(safeRedirectPath(input)).toBe(expected);
  });

  it.each([
    'https://evil.com',
    '//evil.com',
    '/\\evil.com',
    '@evil.com',
    '.evil.com',
    'javascript:alert(1)',
    '/\tevil',
    '',
    null,
    undefined,
  ])('rejects %s', (input) => {
    expect(safeRedirectPath(input as string | null | undefined, '/fallback')).toBe('/fallback');
  });
});

describe('escapeHtml', () => {
  it('neutralises markup and attribute breakouts', () => {
    expect(escapeHtml('<img src=x onerror="alert(1)">')).toBe('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
    expect(escapeHtml("a'b&c")).toBe('a&#39;b&amp;c');
    expect(escapeHtml(undefined)).toBe('');
  });
});

describe('search term sanitising', () => {
  it('strips PostgREST filter syntax so input cannot add conditions', () => {
    expect(sanitizeSearchTerm('x%,is_active.eq.false')).toBe('x is active.eq.false');
    expect(sanitizeSearchTerm('pumps, valves')).toBe('pumps valves');
    expect(sanitizeSearchTerm('a(b)"c"\\d*e')).toBe('a b c d e');
  });

  it('drops empties and duplicates and caps the number of terms', () => {
    expect(sanitizeSearchTerms(['solar', ' ', 'solar', 'pump'])).toEqual(['solar', 'pump']);
    expect(sanitizeSearchTerms(Array.from({ length: 50 }, (_, i) => `t${i}`))).toHaveLength(MAX_TERMS);
  });
});

describe('Razorpay signatures', () => {
  const saved = { ...process.env };
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon';
    process.env.RAZORPAY_KEY_SECRET = 'test_secret';
    process.env.RAZORPAY_WEBHOOK_SECRET = 'webhook_secret';
  });
  afterEach(() => {
    process.env = { ...saved };
  });

  const hmac = (secret: string, body: string) => crypto.createHmac('sha256', secret).update(body).digest('hex');

  it('verifies checkout signatures', () => {
    const sig = hmac('test_secret', 'order_1|pay_1');
    expect(verifyCheckoutSignature('order_1', 'pay_1', sig)).toBe(true);
    expect(verifyCheckoutSignature('order_1', 'pay_2', sig)).toBe(false);
    expect(verifyCheckoutSignature('order_1', 'pay_1', 'short')).toBe(false);
  });

  it('verifies webhook signatures over the raw body', () => {
    const body = '{"event":"order.paid"}';
    expect(verifyWebhookSignature(body, hmac('webhook_secret', body))).toBe(true);
    expect(verifyWebhookSignature(`${body} `, hmac('webhook_secret', body))).toBe(false);
  });

  it('compares in constant time without throwing on length mismatch', () => {
    expect(signaturesMatch('abc', 'abc')).toBe(true);
    expect(signaturesMatch('abc', 'abcd')).toBe(false);
  });
});

describe('field encryption', () => {
  const saved = { ...process.env };
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon';
    process.env.GST_ENCRYPTION_KEY = crypto.randomBytes(32).toString('base64');
  });
  afterEach(() => {
    process.env = { ...saved };
  });

  it('round-trips and never stores the plaintext', () => {
    const enc = encryptField('27AAPFU0939F1ZV');
    expect(enc.startsWith('v1:')).toBe(true);
    expect(enc).not.toContain('27AAPFU0939F1ZV');
    expect(decryptField(enc)).toBe('27AAPFU0939F1ZV');
  });

  it('uses a fresh IV each time and rejects tampering', () => {
    const a = encryptField('same');
    expect(encryptField('same')).not.toBe(a);
    const bytes = Buffer.from(a.slice(3), 'base64');
    bytes[bytes.length - 1] ^= 1; // flip a ciphertext bit
    const tampered = `v1:${bytes.toString('base64')}`;
    expect(() => decryptField(tampered)).toThrow();
  });
});
