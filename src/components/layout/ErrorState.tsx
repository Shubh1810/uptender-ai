'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorStateProps {
  error: Error & { digest?: string };
  reset: () => void;
  /** Where the secondary button goes. */
  homeHref?: string;
  homeLabel?: string;
}

/**
 * Shared body for `error.tsx` boundaries. `reset()` re-renders the failed
 * segment without a full page reload. The digest matches the server log entry
 * in Vercel, so a user can quote it to support.
 */
export function ErrorState({ error, reset, homeHref = '/', homeLabel = 'Go to homepage' }: ErrorStateProps) {
  useEffect(() => {
    console.error('[ui] render error', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div role="alert" className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Something went wrong</h1>
        <p className="text-gray-600 dark:text-gray-400">
          This part of the page failed to load. Trying again usually fixes it.
        </p>
        {error.digest && <p className="text-xs text-gray-400">Error reference: {error.digest}</p>}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 dark:bg-white dark:text-gray-900"
          >
            Try again
          </button>
          <Link
            href={homeHref}
            className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-800 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            {homeLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
