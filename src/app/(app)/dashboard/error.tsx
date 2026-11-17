'use client';

import { ErrorState } from '@/components/layout/ErrorState';

/**
 * Catches errors in a dashboard page. Rendered inside the dashboard layout,
 * so the sidebar and tabs stay usable and the user can navigate away.
 */
export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorState error={error} reset={reset} homeHref="/dashboard" homeLabel="Back to dashboard" />;
}
