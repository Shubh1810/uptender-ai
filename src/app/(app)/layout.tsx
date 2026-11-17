import type { Metadata } from 'next';

// Signed-in product (dashboard, checkout): never indexed.
export const metadata: Metadata = {
  title: { default: 'Dashboard', template: '%s | TenderPost' },
  robots: { index: false, follow: false },
};

export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
