'use client';

import { createClient } from '@/lib/supabase/client';
import { resetAuthState } from '@/hooks/useAuth';

/** localStorage keys (or key prefixes) holding per-user data to wipe on sign-out. */
const USER_STORAGE_PREFIXES = ['sb-', 'supabase', 'saved_tender_ids', 'tender_cache', 'last_refresh_timestamp'];

function clearUserStorage() {
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && USER_STORAGE_PREFIXES.some((prefix) => key.startsWith(prefix))) keys.push(key);
    }
    keys.forEach((key) => localStorage.removeItem(key));
  } catch {
    /* storage unavailable (private mode etc.) */
  }
}

/**
 * Signs the user out everywhere in this browser, then hands off to the server
 * route via a real form POST. A navigation is needed because Safari ignores
 * Set-Cookie on fetch() responses.
 */
export function signOut(redirect = '/') {
  resetAuthState();
  createClient()
    .auth.signOut({ scope: 'local' })
    .catch(() => {});
  clearUserStorage();

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = `/api/auth/signout?redirect=${encodeURIComponent(redirect)}`;
  document.body.appendChild(form);
  form.submit();
}
