/**
 * Shared authentication hook — singleton pattern.
 *
 * Only ONE onAuthStateChange listener exists across the entire app.
 *
 * Exports:
 *  - useAuth()        — React hook returning { user, loading }
 *  - resetAuthState() — imperative helper called during sign-out
 */
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js';

let cachedUser: User | null = null;
let initialized = false;
let listeners: Set<() => void> = new Set();
let authSubscription: { unsubscribe: () => void } | null = null;
let signingOut = false;

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

export function resetAuthState() {
  signingOut = true;
  cachedUser = null;
  initialized = true;

  if (authSubscription) {
    authSubscription.unsubscribe();
    authSubscription = null;
  }

  notifyListeners();
}

function initializeAuthListener() {
  if (authSubscription) return;
  // Don't re-initialize during sign-out — the hard redirect will
  // load a fresh page that starts from scratch.
  if (signingOut) return;

  const supabase = createClient();

  supabase.auth.getUser().then(({ data: { user } }: { data: { user: User | null } }) => {
    if (signingOut) return;
    cachedUser = user ?? null;
    initialized = true;
    notifyListeners();
  });

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
    if (signingOut) return;

    if (event === 'SIGNED_OUT') {
      cachedUser = null;
      initialized = true;
      notifyListeners();
      authSubscription = null;
      subscription.unsubscribe();
      return;
    }

    cachedUser = session?.user ?? null;
    initialized = true;
    notifyListeners();
  });

  authSubscription = subscription;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(cachedUser);
  const [loading, setLoading] = useState(!initialized);

  useEffect(() => {
    initializeAuthListener();

    const listener = () => {
      setUser(cachedUser);
      setLoading(!initialized);
    };
    listeners.add(listener);
    listener();

    return () => {
      listeners.delete(listener);
    };
  }, []);

  return { user, loading };
}
