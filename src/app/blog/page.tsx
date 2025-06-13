import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { 
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  FileText,
  Users,
  Target,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentPageHeader } from '@/components/Header';
import { ContentPageFooter } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Tender Management Blog | Government Tender Insights & Tips | TenderPost AI',
  description: 'Expert insights on government tenders, healthcare tenders, construction tenders in India. Latest tender news, bidding strategies, procurement updates, and AI-powered tender management tips.',
  keywords: 'tender blog, government tender news, tender bidding tips, procurement insights, tender management strategies, healthcare tender updates, construction tender news, GeM tender guide',
  openGraph: {
    title: 'Tender Management Blog | Government Tender Insights & Tips',
    description: 'Expert insights on government tenders, healthcare tenders, and procurement strategies in India. Latest tender news and AI-powered management tips.',
    url: 'https://tenderpost.org/blog',
    type: 'website',
  },
  alternates: {
    canonical: 'https://tenderpost.org/blog',
  },
};

export default function Blog() {
  const featuredArticles = [
    {
      id: 1,
      title: 'Complete Guide to GeM Tenders 2024: Registration, Bidding & Winning Strategies',
      excerpt: 'Master the Government e-Marketplace (GeM) with our comprehensive guide covering registration process, bidding strategies, and tips to win more government contracts.',
      category: 'Government Tenders',
      readTime: '8 min read',
      publishDate: '2024-01-15',
      image: '/blog/gem-tenders-guide.jpg',
      slug: 'complete-guide-gem-tenders-2024',
      featured: true
    },
    {
      id: 2,
      title: 'Healthcare Tender Opportunities in India: Medical Equipment Procurement Trends',
      excerpt: 'Explore the booming healthcare tender market in India. Learn about medical equipment procurement trends, major opportunities, and how to position your business.',
      category: 'Healthcare Tenders',
      readTime: '6 min read',
      publishDate: '2024-01-12',
      image: '/blog/healthcare-tender-trends.jpg',
      slug: 'healthcare-tender-opportunities-india-2024',
      featured: true
    },
    {
      id: 3,
      title: 'AI-Powered Tender Analysis: How Machine Learning is Revolutionizing Bid Management',
      excerpt: 'Discover how artificial intelligence and machine learning are transforming tender management, improving win rates, and streamlining the bidding process.',
      category: 'AI & Technology',
      readTime: '7 min read',
      publishDate: '2024-01-10',
      image: '/blog/ai-tender-analysis.jpg',
      slug: 'ai-powered-tender-analysis-machine-learning',
      featured: true
    }
  ];

  const recentArticles = [
    {
      id: 4,
      title: 'Top 10 Mistakes to Avoid in Government Tender Bidding',
      excerpt: 'Common pitfalls that cost businesses government contracts and how to avoid them.',
      category: 'Bidding Tips',
      readTime: '5 min read',
      publishDate: '2024-01-08',
      slug: 'top-10-mistakes-government-tender-bidding'
    },
    {
      id: 5,
      title: 'Construction Tender Market Analysis: Infrastructure Boom in India',
      excerpt: 'Analysis of the growing construction tender market and infrastructure opportunities.',
      category: 'Construction Tenders',
      readTime: '6 min read',
      publishDate: '2024-01-05',
      slug: 'construction-tender-market-analysis-india'
    },
    {
      id: 6,
      title: 'Digital Transformation in Government Procurement: eProcurement Trends',
      excerpt: 'How digital transformation is changing government procurement processes across India.',
      category: 'Digital Procurement',
      readTime: '4 min read',
      publishDate: '2024-01-03',
      slug: 'digital-transformation-government-procurement'
    },
    {
      id: 7,
      title: 'Pharmaceutical Tender Compliance: Regulatory Requirements Guide',
      excerpt: 'Essential compliance requirements for pharmaceutical tenders in India.',
      category: 'Pharmaceutical',
      readTime: '7 min read',
      publishDate: '2024-01-01',
      slug: 'pharmaceutical-tender-compliance-guide'
    },
    {
      id: 8,
      title: 'State-wise Tender Opportunities: Regional Procurement Analysis',
      excerpt: 'Comprehensive analysis of tender opportunities across different Indian states.',
      category: 'Market Analysis',
      readTime: '9 min read',
      publishDate: '2023-12-28',
      slug: 'state-wise-tender-opportunities-india'
    },
    {
      id: 9,
      title: 'Tender Documentation Best Practices: Winning Proposal Strategies',
      excerpt: 'Expert tips on creating compelling tender documents that win contracts.',
      category: 'Documentation',
      readTime: '6 min read',
      publishDate: '2023-12-25',
      slug: 'tender-documentation-best-practices'
    }
  ];

  const categories = [
    { name: 'Government Tenders', count: 15, color: 'bg-blue-100 text-blue-800' },
    { name: 'Healthcare Tenders', count: 12, color: 'bg-red-100 text-red-800' },
    { name: 'Construction Tenders', count: 10, color: 'bg-green-100 text-green-800' },
    { name: 'AI & Technology', count: 8, color: 'bg-purple-100 text-purple-800' },
    { name: 'Bidding Tips', count: 14, color: 'bg-yellow-100 text-yellow-800' },
    { name: 'Market Analysis', count: 9, color: 'bg-indigo-100 text-indigo-800' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <ContentPageHeader />

      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
          <li><ArrowRight className="h-4 w-4" /></li>
          <li className="text-gray-900 font-medium">Blog</li>
        </ol>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Tender Management Insights & Expert Tips
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Stay ahead in the tender game with expert insights, latest procurement news, 
            and AI-powered strategies to win more government and private sector contracts.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Articles */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Articles</h2>
              <div className="space-y-8">
                {featuredArticles.map((article) => (
                  <article key={article.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <div className="h-48 md:h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                          <FileText className="h-16 w-16 text-blue-600" />
                        </div>
                      </div>
                      <div className="md:w-2/3 p-8">
                        <div className="flex items-center space-x-4 mb-4">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {article.category}
                          </span>
                          <div className="flex items-center text-gray-500 text-sm">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(article.publishDate).toLocaleDateString('en-IN', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </div>
                          <div className="flex items-center text-gray-500 text-sm">
                            <Clock className="h-4 w-4 mr-1" />
                            {article.readTime}
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 hover:text-blue-600 transition-colors">
                          <Link href={`/blog/${article.slug}`}>
                            {article.title}
                          </Link>
                        </h3>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                          {article.excerpt}
                        </p>
                        <Link href={`/blog/${article.slug}`}>
                          <Button variant="outline" className="group">
                            Read More
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Recent Articles */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Articles</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {recentArticles.map((article) => (
                  <article key={article.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                        {article.category}
                      </span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="h-4 w-4 mr-1" />
                        {article.readTime}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                      <Link href={`/blog/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(article.publishDate).toLocaleDateString('en-IN', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <Link href={`/blog/${article.slug}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                        Read More →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Categories */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Categories</h3>
              <div className="space-y-3">
                {categories.map((category) => (
                  <Link 
                    key={category.name}
                    href={`/blog/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{category.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
                      {category.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Stay Updated</h3>
              <p className="text-blue-100 mb-6">
                Get the latest tender insights and opportunities delivered to your inbox.
              </p>
              <Link href="/make-payment">
                <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
                  <Bell className="mr-2 h-4 w-4" />
                  Subscribe to Alerts
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <ContentPageFooter />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "TenderPost Blog",
            "description": "Expert insights on government tenders, healthcare tenders, construction tenders in India. Latest tender news, bidding strategies, and AI-powered tender management tips.",
            "url": "https://tenderpost.org/blog",
            "publisher": {
              "@type": "Organization",
              "name": "TenderPost",
              "logo": {
                "@type": "ImageObject",
                "url": "https://tenderpost.org/uptenderlogo.png"
              }
            },
            "blogPost": featuredArticles.map(article => ({
              "@type": "BlogPosting",
              "headline": article.title,
              "description": article.excerpt,
              "url": `https://tenderpost.org/blog/${article.slug}`,
              "datePublished": article.publishDate,
              "author": {
                "@type": "Organization",
                "name": "TenderPost Team"
              },
              "publisher": {
                "@type": "Organization",
                "name": "TenderPost"
              }
            })),
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://tenderpost.org"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Blog",
                  "item": "https://tenderpost.org/blog"
                }
              ]
            }
          }),
        }}
      />
    </div>
  );
} 