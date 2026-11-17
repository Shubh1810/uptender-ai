'use client';

/**
 * Last resort: the root layout itself failed, so this replaces the whole
 * document (it must render <html> and <body>, and can't rely on globals.css).
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-IN">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#fefcf3', color: '#111827' }}>
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div role="alert" style={{ maxWidth: 420, textAlign: 'center' }}>
            <h1 style={{ fontSize: 24, fontWeight: 600, margin: '0 0 12px' }}>TenderPost is having trouble</h1>
            <p style={{ color: '#4b5563', margin: '0 0 20px' }}>Please try again in a moment.</p>
            {error.digest && <p style={{ fontSize: 12, color: '#9ca3af' }}>Error reference: {error.digest}</p>}
            <button
              onClick={reset}
              style={{ padding: '10px 20px', borderRadius: 999, border: 0, background: '#111827', color: 'white', cursor: 'pointer' }}
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
