import type { Metadata } from 'next';
import HomePage from '@/features/marketing/HomePage';
import { DEFAULT_TITLE } from '@/features/marketing/seo';

export const metadata: Metadata = {
  // `absolute` skips the "%s | TenderPost" template; the default title already has the brand.
  title: { absolute: DEFAULT_TITLE },
  alternates: { canonical: '/' },
};

export default function Page() {
  return <HomePage />;
}
