/**
 * Landing page FAQ. Plain data: rendered by FaqSection (client accordion) and
 * emitted as FAQPage JSON-LD by HomePage (server), so both always match.
 *
 * TODO(founder): Google shows these answers in results. Keep claims
 * (portal counts, win-rate numbers, alert speed) accurate.
 */
export const FAQ: Array<{ question: string; answer: string }> = [
  {
    question: 'What types of tenders does Tender Post AI cover?',
    answer: 'Tender Post AI covers all major tender categories including government tenders, healthcare tenders, construction tenders, pharmaceutical tenders, medical equipment tenders, IT tenders, defense tenders, and infrastructure projects across India. We monitor GeM, eProcurement portals, state government websites, and central government tender portals.'
  },
  {
    question: 'How does the AI-powered tender notification system work?',
    answer: 'Our AI system continuously monitors 1000+ government and private tender portals across India. It uses advanced algorithms to match tenders with your business profile, location, and tender categories. You receive real-time notifications via email, SMS, and mobile app for relevant government tenders, healthcare tenders, and construction opportunities.'
  },
  {
    question: 'Can I track healthcare and pharmaceutical tenders specifically?',
    answer: 'Yes! Tender Post AI specializes in healthcare tender tracking. We monitor medical equipment tenders, pharmaceutical tenders, hospital supply tenders, diagnostic equipment procurement, and healthcare infrastructure projects from government hospitals, medical colleges, and healthcare institutions across India.'
  },
  {
    question: 'What is the success rate improvement with Tender Post AI?',
    answer: 'Our users report an average 40-60% improvement in tender win rates. The AI-powered bid analysis, competitor intelligence, and market insights help businesses make better bidding decisions. Our tender automation reduces preparation time by 70% and ensures timely submission.'
  },
  {
    question: 'Do you provide support for government tender documentation?',
    answer: 'Yes, our Professional and Enterprise plans include AI-assisted documentation support. We help with technical specifications, compliance documentation, EMD calculations, and bid preparation for government tenders, healthcare procurement, and construction projects.'
  },
  {
    question: 'How quickly will I receive tender notifications?',
    answer: 'Tender notifications are sent within 15 minutes of publication on government portals. Our real-time monitoring ensures you never miss important government tenders, healthcare opportunities, or construction projects. Premium users get priority alerts for high-value tenders.'
  }
];
