import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { 
  CheckCircle, 
  AlertTriangle, 
  Target,
  TrendingUp,
  Search,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Complete Guide to Government Tenders in India 2024 | Tender Post AI',
  description: 'Comprehensive guide to government tenders, healthcare tenders, construction tenders in India. Learn about tender processes, bidding strategies, GeM tenders, and how to win more government contracts with AI-powered insights.',
  keywords: 'government tenders India, tender process, healthcare tenders, construction tenders, GeM tenders, tender bidding guide, government procurement India, tender management, bid preparation',
  openGraph: {
    title: 'Complete Guide to Government Tenders in India 2024 | Tender Post AI',
    description: 'Master government tender processes with our comprehensive guide. Learn about healthcare tenders, construction tenders, bidding strategies and AI-powered tender management.',
    url: 'https://tenderpost.org/tender-guide',
    type: 'article',
  },
  alternates: {
    canonical: 'https://tenderpost.org/tender-guide',
  },
};

export default function TenderGuide() {
  const tableOfContents = [
    { id: 'introduction', title: 'Introduction to Government Tenders in India' },
    { id: 'types', title: 'Types of Tenders: Healthcare, Construction, IT & More' },
    { id: 'process', title: 'Tender Process and Documentation' },
    { id: 'platforms', title: 'Major Tender Platforms: GeM, eProcurement, CPPP' },
    { id: 'strategies', title: 'Winning Tender Strategies and Best Practices' },
    { id: 'common-mistakes', title: 'Common Mistakes to Avoid in Tender Bidding' },
    { id: 'automation', title: 'AI-Powered Tender Management and Automation' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3">
              <Image 
                src="/uptenderlogo.png" 
                alt="Tender Post AI Logo" 
                className="h-10 w-10 rounded-xl object-contain"
                width={40}
                height={40}
              />
              <span className="text-2xl font-bold text-gray-900">Tender Post AI</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Home</Link>
              <Link href="/#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</Link>
              <Link href="/#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</Link>
              <Link href="/make-payment">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Get Started
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Complete Guide to Government Tenders in India 2024: 
            Healthcare, Construction & IT Tenders
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Master the art of government tender bidding with our comprehensive guide. 
            Learn about healthcare tenders, construction tenders, defense procurement, 
            and how AI can boost your success rate.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8">
            <span>Published: January 1, 2024</span>
            <span>•</span>
            <span>15 min read</span>
            <span>•</span>
            <span>Government Tenders Guide</span>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              🚀 Want to Get Started with Tender Notifications?
            </h2>
            <p className="text-blue-800 mb-4">
              Get instant alerts for relevant government tenders, healthcare opportunities, 
              and construction projects with Tender Post AI&apos;s intelligent notification system.
            </p>
            <Link href="/make-payment">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Bell className="mr-2 h-4 w-4" />
                Start Getting Tender Alerts
              </Button>
            </Link>
          </div>
        </header>

        {/* Table of Contents */}
        <nav className="bg-gray-50 rounded-lg p-6 mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h2>
          <ul className="space-y-2">
            {tableOfContents.map((item) => (
              <li key={item.id}>
                <a 
                  href={`#${item.id}`} 
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          <section id="introduction" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Introduction to Government Tenders in India
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Government tenders in India represent a massive opportunity worth over ₹50 lakh crores annually. 
              From healthcare tenders for medical equipment and pharmaceutical supplies to construction tenders 
              for infrastructure development, the government procurement ecosystem offers unprecedented 
              business opportunities for companies of all sizes.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">Key Benefits of Government Tender Business</h3>
                  <ul className="text-green-800 space-y-1">
                    <li>• Guaranteed payments from government entities</li>
                    <li>• Long-term contracts and repeat business opportunities</li>
                    <li>• Access to high-value healthcare and infrastructure projects</li>
                    <li>• Transparent and fair bidding process</li>
                    <li>• Building credibility and reputation in the market</li>
                  </ul>
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              Understanding the tender ecosystem is crucial for success. Whether you&apos;re targeting 
              <strong> healthcare tenders</strong> for hospitals and medical institutions, 
              <strong> construction tenders</strong> for roads and buildings, or 
              <strong> IT tenders</strong> for digital transformation projects, each category 
              has specific requirements and processes.
            </p>
          </section>

          <section id="types" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Types of Tenders: Healthcare, Construction, IT & More
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Healthcare & Medical Tenders</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Medical equipment procurement</li>
                  <li>• Pharmaceutical and drug tenders</li>
                  <li>• Hospital supplies and consumables</li>
                  <li>• Diagnostic equipment tenders</li>
                  <li>• Healthcare infrastructure projects</li>
                  <li>• Medical college equipment tenders</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Construction & Infrastructure</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Road construction and maintenance</li>
                  <li>• Building and housing projects</li>
                  <li>• Water supply and sanitation</li>
                  <li>• Smart city development tenders</li>
                  <li>• Bridge and flyover construction</li>
                  <li>• Public works department tenders</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">IT & Technology Tenders</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Software development projects</li>
                  <li>• IT infrastructure setup</li>
                  <li>• Cybersecurity implementations</li>
                  <li>• Digital transformation initiatives</li>
                  <li>• E-governance solutions</li>
                  <li>• Data center and cloud services</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Defense & Security</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Defense equipment procurement</li>
                  <li>• Security services tenders</li>
                  <li>• Military vehicle maintenance</li>
                  <li>• Border security projects</li>
                  <li>• Defense research and development</li>
                  <li>• Surveillance system tenders</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="process" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Tender Process and Documentation
            </h2>
            
            <p className="text-gray-700 mb-6">
              The government tender process in India follows a structured approach designed to ensure 
              transparency and fairness. Understanding each step is crucial for successful bid submission.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">1</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Tender Notification & Publication</h3>
                  <p className="text-gray-700">
                    Government tenders are published on various platforms including GeM portal, 
                    eProcurement websites, newspaper advertisements, and department websites. 
                    Healthcare tenders are often published on medical college and hospital websites.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">2</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Pre-Bid Meeting & Site Visit</h3>
                  <p className="text-gray-700">
                    For construction tenders and complex healthcare equipment procurement, 
                    pre-bid meetings are conducted to clarify specifications and address queries.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">3</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Bid Preparation & Documentation</h3>
                  <p className="text-gray-700">
                    Prepare technical and financial bids with all required documents including 
                    company registration, GST certificates, experience certificates, and compliance declarations.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">4</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Bid Submission & Opening</h3>
                  <p className="text-gray-700">
                    Submit bids before the deadline through online portals. Technical bids are 
                    opened first, followed by financial bid opening for qualified vendors.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">5</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Evaluation & Award</h3>
                  <p className="text-gray-700">
                    Bids are evaluated based on technical compliance and commercial criteria. 
                    The successful bidder is awarded the contract and work order is issued.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="platforms" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Major Tender Platforms: GeM, eProcurement, CPPP
            </h2>
            
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  GeM (Government e-Marketplace)
                </h3>
                <p className="text-gray-700 mb-3">
                  India&apos;s largest government procurement platform handling over ₹1 lakh crore transactions annually. 
                  Covers everything from office supplies to complex healthcare equipment tenders.
                </p>
                <ul className="text-gray-700 space-y-1">
                  <li>• Direct purchase and bid-based procurement</li>
                  <li>• Healthcare and medical equipment categories</li>
                  <li>• IT and electronics procurement</li>
                  <li>• Construction materials and services</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  CPPP (Central Public Procurement Portal)
                </h3>
                <p className="text-gray-700 mb-3">
                  Central hub for high-value government tenders from various ministries and departments. 
                  Major healthcare, construction, and defense tenders are published here.
                </p>
                <ul className="text-gray-700 space-y-1">
                  <li>• Ministry-wise tender categorization</li>
                  <li>• High-value infrastructure projects</li>
                  <li>• Defense and security tenders</li>
                  <li>• Policy and procurement guidelines</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  State eProcurement Portals
                </h3>
                <p className="text-gray-700 mb-3">
                  Each state has its own eProcurement portal for state government tenders including 
                  healthcare, education, and infrastructure projects.
                </p>
                <ul className="text-gray-700 space-y-1">
                  <li>• State-specific tender opportunities</li>
                  <li>• Local healthcare and hospital tenders</li>
                  <li>• Municipal and district-level projects</li>
                  <li>• State public works department tenders</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="strategies" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Winning Tender Strategies and Best Practices
            </h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <div className="flex items-start">
                <TrendingUp className="h-6 w-6 text-yellow-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-2">Pro Tip: Success Rate Improvement</h3>
                  <p className="text-yellow-800">
                    Companies using AI-powered tender management systems report 40-60% improvement 
                    in win rates due to better opportunity identification and bid optimization.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Research & Preparation</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Monitor multiple tender portals daily</li>
                  <li>• Analyze past tender patterns and winners</li>
                  <li>• Build relationships with procurement officials</li>
                  <li>• Maintain updated compliance documentation</li>
                  <li>• Understand specific department requirements</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Excellence</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Meet all technical specifications exactly</li>
                  <li>• Provide detailed technical documentation</li>
                  <li>• Include relevant certifications and approvals</li>
                  <li>• Demonstrate past project experience</li>
                  <li>• Address all evaluation criteria thoroughly</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Commercial Strategy</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Competitive yet sustainable pricing</li>
                  <li>• Clear payment terms and schedules</li>
                  <li>• Appropriate earnest money deposit</li>
                  <li>• Performance guarantee arrangements</li>
                  <li>• Value engineering proposals</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Management</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Comprehensive insurance coverage</li>
                  <li>• Financial capacity demonstration</li>
                  <li>• Quality assurance processes</li>
                  <li>• Compliance with safety standards</li>
                  <li>• Environmental clearance requirements</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="common-mistakes" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Common Mistakes to Avoid in Tender Bidding
            </h2>
            
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Incomplete Documentation</h3>
                  <p className="text-red-800 text-sm">
                    Missing or incomplete documents lead to technical disqualification. 
                    Ensure all required certificates, registrations, and declarations are included.
                  </p>
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Non-Compliance with Specifications</h3>
                  <p className="text-red-800 text-sm">
                    Deviating from technical specifications without proper justification. 
                    For healthcare tenders, ensure exact compliance with medical device regulations.
                  </p>
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Late Submission</h3>
                  <p className="text-red-800 text-sm">
                    Missing submission deadlines due to last-minute preparation. 
                    Use automated tender tracking systems to avoid missing opportunities.
                  </p>
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Unrealistic Pricing</h3>
                  <p className="text-red-800 text-sm">
                    Extremely low bids that are commercially unviable or excessively high bids 
                    that are uncompetitive. Research market rates thoroughly.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="automation" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              AI-Powered Tender Management and Automation
            </h2>
            
            <p className="text-gray-700 mb-6">
              Modern tender management leverages artificial intelligence to automate opportunity 
              identification, bid preparation, and submission processes. This technological 
              advancement is revolutionizing how businesses approach government procurement.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                Benefits of AI-Powered Tender Management
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-blue-800">
                  <li>• Automated tender discovery and matching</li>
                  <li>• Real-time notifications for relevant opportunities</li>
                  <li>• Intelligent bid analysis and pricing recommendations</li>
                  <li>• Automated compliance checking</li>
                </ul>
                <ul className="space-y-2 text-blue-800">
                  <li>• Competitor analysis and market intelligence</li>
                  <li>• Document automation and template management</li>
                  <li>• Performance tracking and analytics</li>
                  <li>• Risk assessment and mitigation</li>
                </ul>
              </div>
            </div>

            <div className="text-center bg-gray-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Ready to Transform Your Tender Success Rate?
              </h3>
                              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Join thousands of businesses using Tender Post AI&apos;s intelligent tender management platform 
                  to track government tenders, healthcare opportunities, and construction projects across India.
                </p>
              <Link href="/make-payment">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Target className="mr-2 h-5 w-5" />
                  Start Your Tender Success Journey
                </Button>
              </Link>
            </div>
          </section>
        </article>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white mt-12">
          <h2 className="text-2xl font-bold mb-4">
            Never Miss Another Tender Opportunity
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Get instant notifications for government tenders, healthcare opportunities, 
            construction projects, and pharmaceutical tenders matching your business profile.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/make-payment">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Bell className="mr-2 h-5 w-5" />
                Start Getting Tender Alerts
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Search className="mr-2 h-5 w-5" />
                Explore All Features
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Image 
                  src="/uptenderlogo.png" 
                  alt="Tender Post AI" 
                  className="h-8 w-8 rounded-lg object-contain"
                  width={32}
                  height={32}
                />
                <span className="text-xl font-bold">Tender Post AI</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered tender management platform for government tenders, 
                healthcare tenders, and construction opportunities in India.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Tender Categories</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors">Government Tenders</Link></li>
                <li><Link href="/" className="hover:text-white transition-colors">Healthcare Tenders</Link></li>
                <li><Link href="/" className="hover:text-white transition-colors">Construction Tenders</Link></li>
                <li><Link href="/" className="hover:text-white transition-colors">IT Tenders</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/tender-guide" className="hover:text-white transition-colors">Tender Guide</Link></li>
                <li><Link href="/" className="hover:text-white transition-colors">Tender Alerts</Link></li>
                <li><Link href="/" className="hover:text-white transition-colors">Bid Analysis</Link></li>
                <li><Link href="/" className="hover:text-white transition-colors">Market Intelligence</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 Tender Post AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 