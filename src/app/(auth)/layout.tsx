import type { Metadata } from 'next';

// Sign-in, signup, password and onboarding screens: useful to users, useless in search results.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthGroupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
