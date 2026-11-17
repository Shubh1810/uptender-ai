'use client';

import { ErrorState } from '@/components/layout/ErrorState';

/** Catches render errors on any page (inside the root layout). */
export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main style={{ backgroundColor: '#fefcf3' }}>
      <ErrorState error={error} reset={reset} />
    </main>
  );
}
