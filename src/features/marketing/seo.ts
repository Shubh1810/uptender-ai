import { CURRENCY, PAID_PLANS, PAID_PLAN_IDS } from '@/features/plans/catalog';
import { SITE_NAME, SITE_URL } from '@/lib/site';

/**
 * Site-wide SEO copy and structured data.
 *
 * Target searches: "all India tenders", "government tenders India",
 * "construction tenders", "railway tenders / railway contracts", plus the
 * portals people search by name (GeM, CPPP / eProcure, IREPS, state portals).
 *
 * Keep claims true: only name sources the scraper actually covers.
 */

/** ~60 characters so Google doesn't truncate it. Used for the homepage. */
export const DEFAULT_TITLE = 'All India Tenders: Government, Construction & Railway | TenderPost';

/** Appended to every other page's title: "Privacy Policy | TenderPost". */
export const TITLE_TEMPLATE = `%s | ${SITE_NAME}`;

/** ~155 characters: the snippet under the title in search results. */
export const DEFAULT_DESCRIPTION =
  'Search all India tenders in one place: government, construction, railway and PSU tenders from GeM, CPPP and state portals, with daily alerts and AI bid analysis.';

/** Ignored by Google, still read by Bing and some Indian search tools. Keep it short and honest. */
export const KEYWORDS = [
  'all India tenders',
  'government tenders India',
  'online tenders India',
  'construction tenders',
  'civil construction tenders',
  'road construction tenders',
  'railway tenders',
  'railway contracts',
  'Indian Railways tenders',
  'IREPS tenders',
  'GeM tenders',
  'CPPP tenders',
  'eProcure tenders',
  'PSU tenders',
  'state government tenders',
  'tender alerts India',
  'tender search India',
];

/**
 * One JSON-LD graph for the whole site. Prices come from the plan catalog so
 * they can never disagree with checkout.
 */
export function structuredData() {
  const org = `${SITE_URL}/#organization`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': org,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/icon-512x512.png`,
        description: DEFAULT_DESCRIPTION,
        areaServed: { '@type': 'Country', name: 'India' },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'sales@tenderpost.org',
          areaServed: 'IN',
          availableLanguage: ['English', 'Hindi'],
        },
        // TODO(founder): keep only profiles that exist.
        sameAs: ['https://twitter.com/tenderpost', 'https://linkedin.com/company/tenderpost'],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: 'en-IN',
        publisher: { '@id': org },
      },
      {
        '@type': 'SoftwareApplication',
        name: SITE_NAME,
        url: SITE_URL,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        description:
          'Tender search and alert platform for India covering government, construction, railway and PSU tenders, with AI eligibility checks and bid analysis.',
        featureList: [
          'All India tender search',
          'Government tenders (GeM, CPPP, state portals)',
          'Construction and civil works tenders',
          'Railway tenders and contracts',
          'Daily email and WhatsApp tender alerts',
          'AI eligibility verdicts and bid analysis',
        ],
        publisher: { '@id': org },
        offers: PAID_PLAN_IDS.map((id) => ({
          '@type': 'Offer',
          name: `${PAID_PLANS[id].name} (annual)`,
          price: String(PAID_PLANS[id].yearlyPrice),
          priceCurrency: CURRENCY,
          availability: 'https://schema.org/InStock',
          url: `${SITE_URL}/#pricing`,
        })),
      },
    ],
  };
}
