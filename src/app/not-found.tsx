import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#fefcf3' }}>
      <div className="max-w-md text-center space-y-5">
        <p className="text-sm font-medium text-orange-600">404</p>
        <h1 className="text-3xl font-semibold text-gray-900">This page doesn&apos;t exist</h1>
        <p className="text-gray-600">
          The link may be old, or the page may have moved. Search live tenders from the dashboard instead.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link href="/" className="px-5 py-2.5 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800">
            Go to homepage
          </Link>
          <Link
            href="/dashboard/search"
            className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-800 text-sm font-medium hover:bg-white"
          >
            Search tenders
          </Link>
        </div>
      </div>
    </main>
  );
}
