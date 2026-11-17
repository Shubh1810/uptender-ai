import type { Metadata } from 'next';

// The contact page is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Talk to the TenderPost team about tender search, alerts and plans for your business.',
  alternates: { canonical: '/contact' },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
