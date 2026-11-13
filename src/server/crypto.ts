import 'server-only';
import crypto from 'node:crypto';
import { requireEnv } from '@/server/env';

/**
 * Field-level encryption for sensitive values stored in Postgres
 * (e.g. `profiles.gst_number_enc`). AES-256-GCM, authenticated.
 *
 * Format: `v1:<base64(iv[12] | authTag[16] | ciphertext)>`
 * Key:    GST_ENCRYPTION_KEY, 32 random bytes, base64 (openssl rand -base64 32).
 */
const VERSION = 'v1';
const IV_BYTES = 12;
const TAG_BYTES = 16;

function key(): Buffer {
  const raw = Buffer.from(requireEnv('GST_ENCRYPTION_KEY'), 'base64');
  if (raw.length !== 32) throw new Error('GST_ENCRYPTION_KEY must be 32 bytes, base64-encoded');
  return raw;
}

export function encryptField(plaintext: string): string {
  const iv = crypto.randomBytes(IV_BYTES);
  const cipher = crypto.createCipheriv('aes-256-gcm', key(), iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  return `${VERSION}:${Buffer.concat([iv, cipher.getAuthTag(), ciphertext]).toString('base64')}`;
}

export function decryptField(value: string): string {
  const [version, payload] = value.split(':', 2);
  if (version !== VERSION || !payload) throw new Error('Unsupported encrypted field format');
  const buf = Buffer.from(payload, 'base64');
  const iv = buf.subarray(0, IV_BYTES);
  const tag = buf.subarray(IV_BYTES, IV_BYTES + TAG_BYTES);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(buf.subarray(IV_BYTES + TAG_BYTES)), decipher.final()]).toString('utf8');
}
