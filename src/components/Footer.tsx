import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface FooterProps {
  className?: string;
}

export function Footer({ className = '' }: FooterProps) {
  return (
    <footer className={`bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Image
                src="/tpllogo-wite.PNG" 
                alt="TenderPost - Tender Management Platform" 
                className="h-8 w-8 rounded-lg object-contain"
                width={32}
                height={32}
              />
              <span className="text-xl font-bold text-white tracking-tight">
                <span className="font-inter">Tender</span><span className="font-kings -ml-1">Post</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              India&apos;s leading AI-powered tender notification and management platform for 
              government tenders, healthcare tenders, and construction opportunities.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Tender Categories</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Government Tenders</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Healthcare Tenders</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Construction Tenders</a></li>
              <li><a href="#" className="hover:text-white transition-colors">IT & Software Tenders</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Defense Tenders</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Tender Notifications</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AI Bid Analysis</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Tender Tracking</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Market Intelligence</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Compliance Support</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/cancellation-and-refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2024 Tender Post AI. All rights reserved. Leading tender management platform for India&apos;s business community.</p>
          <p className="mt-2 text-sm">Specialized in government tenders, healthcare tender notifications, construction tender tracking, and AI-powered bid analysis.</p>
        </div>
      </div>
    </footer>
  );
}

// Alternative footer for tender-guide with resource links
export function ContentPageFooter({ className = '' }: { className?: string }) {
  return (
    <footer className={`bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Image 
                src="/tpllogo-wite.PNG" 
                alt="TenderPost" 
                className="h-8 w-8 rounded-lg object-contain"
                width={32}
                height={32}
              />
              <span className="text-xl font-bold text-white tracking-tight">
                <span className="font-inter">Tender</span><span className="font-kings -ml-1">Post</span>
              </span>
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
  );
} 