#!/usr/bin/env node
/**
 * One-off: encrypt GST numbers that were stored in plain text in
 * `profiles.gst_number_enc` before field encryption existed.
 *
 * Usage (from the project root, with production env vars set):
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... GST_ENCRYPTION_KEY=... \
 *     node scripts/encrypt-existing-gst.mjs            # dry run
 *   ... node scripts/encrypt-existing-gst.mjs --apply  # write changes
 *
 * Must produce the same format as src/server/crypto.ts (v1:base64(iv|tag|ct)).
 */
import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const apply = process.argv.includes('--apply');
const { NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: serviceKey, GST_ENCRYPTION_KEY: rawKey } = process.env;

if (!url || !serviceKey || !rawKey) {
  console.error('Set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and GST_ENCRYPTION_KEY.');
  process.exit(1);
}
const key = Buffer.from(rawKey, 'base64');
if (key.length !== 32) {
  console.error('GST_ENCRYPTION_KEY must be 32 bytes, base64-encoded.');
  process.exit(1);
}

function encrypt(plaintext) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ct = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  return `v1:${Buffer.concat([iv, cipher.getAuthTag(), ct]).toString('base64')}`;
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
const { data, error } = await supabase
  .from('profiles')
  .select('id, gst_number_enc')
  .not('gst_number_enc', 'is', null);

if (error) {
  console.error(error);
  process.exit(1);
}

const plain = data.filter((row) => !String(row.gst_number_enc).startsWith('v1:'));
console.log(`${data.length} profiles with GST, ${plain.length} still in plain text.`);

if (!apply) {
  console.log('Dry run. Re-run with --apply to encrypt them.');
  process.exit(0);
}

for (const row of plain) {
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ gst_number_enc: encrypt(String(row.gst_number_enc).trim().toUpperCase()) })
    .eq('id', row.id);
  if (updateError) console.error(`Failed for ${row.id}:`, updateError.message);
}
console.log('Done.');
