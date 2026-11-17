import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/features/marketing/HeroSection';
import { WorkflowSection } from '@/features/marketing/WorkflowSection';
import { FeaturesSection } from '@/features/marketing/FeaturesSection';
import { PricingSection } from '@/features/marketing/PricingSection';
import { FaqSection } from '@/features/marketing/FaqSection';
import { FAQ } from '@/features/marketing/faq';
import { WaitlistOverlay } from '@/features/marketing/waitlist/waitlist-overlay';
import { WaitlistCtaForm } from '@/features/marketing/waitlist/WaitlistCtaForm';

/**
 * The landing page. A Server Component: static sections render to HTML with
 * no client JavaScript. Interactive pieces are client components imported
 * here (Header, Hero, Workflow, Features, Pricing, FAQ, waitlist form/overlay).
 */
export default function HomePage() {
  const faqJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }).replace(/</g, '\\u003c');

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fefcf3' }}>
      <Header variant="main" />
      <HeroSection />
      <WorkflowSection />
      <FeaturesSection />
      <PricingSection />
      <FaqSection />
      <WaitlistCtaSection />
      <TenderCategoriesSection />
      <Footer />
      <WaitlistOverlay />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />
    </div>
  );
}

function WaitlistCtaSection() {
  return (
    <section className="py-16 sm:py-32 px-4 sm:px-6 lg:px-8 relative z-10 overflow-hidden" style={{ backgroundColor: '#ff8c42' }}>
      {/* Rotated background image */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Decorative, CSS-rotated background; next/image's fill sizing can't express the 90° swap. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/mobile wallpaper.jpeg"
          alt=""
          className="absolute lg:block hidden"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(90deg)',
            transformOrigin: 'center center',
            width: '100vh',
            height: '100vw',
            minWidth: '100%',
            minHeight: '100%',
            objectFit: 'contain',
          }}
        />
        {/* Mobile version - no rotation, fit to cover */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/mobile wallpaper.jpeg"
          alt=""
          className="absolute lg:hidden block"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            transformOrigin: 'center center',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>

      {/* Wavy motif lines */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <svg className="absolute top-0 left-0 w-full opacity-30" viewBox="0 0 1200 100" preserveAspectRatio="none" style={{ height: '80px' }}>
          <path d="M0,50 Q300,20 600,50 T1200,50" stroke="white" strokeWidth="2" fill="none" />
          <path d="M0,40 Q200,60 400,40 T800,40 T1200,40" stroke="white" strokeWidth="2" fill="none" />
          <path d="M0,60 Q250,30 500,60 T1000,60 T1200,60" stroke="white" strokeWidth="2" fill="none" />
        </svg>
        <svg className="absolute bottom-0 left-0 w-full opacity-30" viewBox="0 0 1200 100" preserveAspectRatio="none" style={{ height: '80px' }}>
          <path d="M0,50 Q300,80 600,50 T1200,50" stroke="white" strokeWidth="2" fill="none" />
          <path d="M0,60 Q200,40 400,60 T800,60 T1200,60" stroke="white" strokeWidth="2" fill="none" />
          <path d="M0,40 Q250,70 500,40 T1000,40 T1200,40" stroke="white" strokeWidth="2" fill="none" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-20">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-white">
          Join the Waitlist
        </h2>
        <p className="text-base sm:text-xl mb-12 max-w-2xl mx-auto text-white/90">
          Be the first to access AI-powered tender notifications. Get early access and exclusive launch pricing.
        </p>

        <WaitlistCtaForm />

        {/* Trust indicators */}
        <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-white/80">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>No spam</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>Early access</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>5,000+ joined</span>
          </div>
        </div>
      </div>
    </section>
  );
}

const CATEGORIES: Array<{ label: string; src: string; className: string; style?: React.CSSProperties }> = [
  { label: 'Healthcare', src: '/healthcare-icon.svg', className: 'h-10 w-10', style: { filter: 'brightness(0)' } },
  { label: 'Construction', src: '/construction-site.png', className: 'h-10 w-10 object-contain' },
  { label: 'IT & Software', src: '/layers.png', className: 'h-10 w-10 object-contain' },
  { label: 'Government', src: '/government.png', className: 'h-10 w-10 object-contain' },
  { label: 'Transport', src: '/fast-delivery.png', className: 'h-10 w-10 object-contain' },
  { label: 'Energy', src: '/renewable-energy.png', className: 'h-10 w-10 object-contain' },
];

function TenderCategoriesSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Tender Categories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore tenders across all major industries
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {CATEGORIES.map(({ label, src, className, style }) => (
            <div key={label} className="flex flex-col items-center justify-center group">
              <div className="mb-3">
                <Image src={src} alt={label} width={40} height={40} className={className} style={style} />
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
