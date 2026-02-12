import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = await createClient();

    // Server-side signOut properly clears cookies via Set-Cookie response headers.
    // Using 'global' scope revokes ALL sessions for this user across all devices.
    const { error } = await supabase.auth.signOut({ scope: 'global' });

    if (error) {
      console.error('Server sign-out error:', error.message);
      // Still return 200 so the client proceeds with cleanup — the local
      // cookies will have been cleared by the server client even if the
      // Supabase backend revocation failed.
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 200 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Unexpected sign-out error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
