import {
  Funnel_Display,
  Geist,
  Geist_Mono,
  Google_Sans,
  Kings,
  Lexend,
  Playfair_Display,
  Roboto,
  Ubuntu,
} from 'next/font/google';

/**
 * Every font the site uses, self-hosted by next/font (no requests to Google at
 * runtime, no render-blocking stylesheets).
 *
 * - Each exposes a CSS variable (`--font-*`) used by globals.css classes or
 *   inline `fontFamily: 'var(--font-…)'`.
 * - `preload: true` only for fonts on most pages (header, auth screens).
 *   Section-specific fonts load when first used instead of on every page.
 * - Variable fonts (no `weight`) ship one file for every weight.
 *
 * Don't add a family without removing one. See CLAUDE.md.
 */

// Body / UI text (`.font-inter`, `font-sans`) on auth and dashboard screens.
const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });

// `font-mono`: reference numbers in search and onboarding.
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'], preload: false });

// Brand wordmark in Header, Footer, dashboard, auth pages.
const kings = Kings({ variable: '--font-kings', subsets: ['latin'], weight: '400' });

// Header nav and landing copy. Not a variable font, so weights are listed.
const ubuntu = Ubuntu({ variable: '--font-ubuntu', subsets: ['latin'], weight: ['300', '400', '500', '700'] });

// Landing page section fonts.
const roboto = Roboto({ variable: '--font-roboto', subsets: ['latin'], preload: false });
const lexend = Lexend({ variable: '--font-lexend', subsets: ['latin'], preload: false });
const playfairDisplay = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['700'],
  style: ['italic'],
  preload: false,
});
const funnelDisplay = Funnel_Display({ variable: '--font-funnel', subsets: ['latin'], preload: false });

// Dashboard search page heading.
const googleSans = Google_Sans({ variable: '--font-google-sans', subsets: ['latin'], preload: false });

/** Put on <body> so every `--font-*` variable is defined. */
export const fontVariables = [
  geistSans,
  geistMono,
  kings,
  ubuntu,
  roboto,
  lexend,
  playfairDisplay,
  funnelDisplay,
  googleSans,
]
  .map((font) => font.variable)
  .join(' ');
