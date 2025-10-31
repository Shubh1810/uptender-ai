import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface FooterProps {
  className?: string;
}

export function Footer({ className = '' }: FooterProps) {
  return (
    <footer className={`bg-white text-gray-900 py-12 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Image
                src="/tplogo.png" 
                alt="TenderPost - Tender Management Platform" 
                className="h-8 w-8 rounded-lg object-contain"
                width={32}
                height={32}
              />
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                <span className="font-inter">Tender</span><span className="font-kings -ml-1">Post</span>
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              India&apos;s leading AI-powered tender notification and management platform for 
              government tenders, healthcare tenders, and construction opportunities.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Tender Categories</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900 transition-colors">Government Tenders</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Healthcare Tenders</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Construction Tenders</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">IT & Software Tenders</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Defense Tenders</a></li>
            </ul>
          </div>
          
          <div className="md:order-4">
            <div className="flex items-center gap-5 mb-4">
              <a
                href="https://wa.me/919512247247"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="text-gray-900 hover:text-gray-900/90 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 md:h-7 md:w-7">
                  <path d="M20.52 3.48A11.5 11.5 0 0 0 2.23 17.29L1 22l4.86-1.27a11.5 11.5 0 0 0 5.53 1.41h.01c6.34 0 11.5-5.16 11.5-11.5a11.45 11.45 0 0 0-2.38-6.16zm-9.02 17.04h-.01a9.53 9.53 0 0 1-4.85-1.33l-.35-.2-2.88.75.77-2.81-.22-.36A9.55 9.55 0 1 1 11.5 20.52zm5.22-7.32c-.29-.15-1.72-.85-1.99-.94-.27-.1-.46-.15-.66.15-.19.29-.76.94-.93 1.14-.17.19-.34.22-.63.07-.29-.15-1.21-.45-2.3-1.44-.85-.76-1.43-1.7-1.6-1.99-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.19.05-.37-.02-.52-.07-.15-.66-1.59-.9-2.18-.24-.58-.49-.5-.66-.51h-.57c-.19 0-.5.07-.76.37-.26.29-1 1-1 2.43s1.03 2.82 1.17 3.01c.15.19 2.03 3.1 4.92 4.35.69.3 1.23.48 1.65.62.69.22 1.32.19 1.82.12.56-.08 1.72-.7 1.97-1.38.24-.68.24-1.26.17-1.38-.08-.12-.27-.19-.56-.34z"/>
                </svg>
              </a>
              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="text-gray-900 hover:text-gray-900/90 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 md:h-7 md:w-7">
                  <path d="M18.244 2H21l-6.56 7.49L22.5 22h-6.93l-4.54-6.03L5.7 22H3l7.03-8.02L1.5 2h7.07l4.11 5.61L18.244 2zm-2.425 18h1.7L7.3 4h-1.7l10.219 16z"/>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-gray-900 hover:text-gray-900/90 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 md:h-7 md:w-7">
                  <path d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2.5V12h2.5V9.7c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.3.2 2.3.2v2.5h-1.3c-1.3 0-1.8.8-1.8 1.7V12h3l-.5 2.9h-2.5v7A10 10 0 0 0 22 12"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-gray-900 hover:text-gray-900/90 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 md:h-7 md:w-7">
                  <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.9.25 2.4.42.6.23 1 .5 1.5 1 .5.5.8.9 1 1.5.2.5.4 1.2.4 2.4.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.9-.4 2.4-.2.6-.5 1-1 1.5-.5.5-.9.8-1.5 1-.5.2-1.2.4-2.4.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.2-2.4-.4-.6-.2-1-.5-1.5-1-.5-.5-.8-.9-1-1.5-.2-.5-.4-1.2-.4-2.4C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.9.4-2.4.2-.6.5-1 1-1.5.5-.5.9-.8 1.5-1 .5-.2 1.2-.4 2.4-.4C8.4 2.2 8.8 2.2 12 2.2m0 1.8c-3.1 0-3.5 0-4.7.1-1 .1-1.6.2-1.9.4-.5.2-.8.4-1.2.8-.4.4-.6.7-.8 1.2-.1.3-.3.9-.4 1.9-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1 .2 1.6.4 1.9.2.5.4.8.8 1.2.4.4.7.6 1.2.8.3.1.9.3 1.9.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1-.1 1.6-.2 1.9-.4.5-.2.8-.4 1.2-.8.4-.4.6-.7.8-1.2.1-.3.3-.9.4-1.9.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1-.2-1.6-.4-1.9-.2-.5-.4-.8-.8-1.2-.4-.4-.7-.6-1.2-.8-.3-.1-.9-.3-1.9-.4-1.2-.1-1.6-.1-4.7-.1m0 3.3a5.4 5.4 0 1 1 0 10.8 5.4 5.4 0 0 1 0-10.8m0 1.8a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2m5.5-2.6a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6" />
                </svg>
              </a>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <span className="font-medium text-gray-900">Support:</span>
                <a href="tel:+919821944444" className="ml-2 hover:text-gray-900 transition-colors">+91 98219 44444</a>
              </li>
              <li>
                <span className="font-medium text-gray-900">Sales:</span>
                <a href="tel:+919821844444" className="ml-2 hover:text-gray-900 transition-colors">+91 98219 44444</a>
              </li>
              <li>
                <span className="font-medium text-gray-900">Email:</span>
                <a href="mailto:sales@tenderpost.org" className="ml-2 hover:text-gray-900 transition-colors">sales@tenderpost.org</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/privacy-policy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-gray-900 transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/cancellation-and-refund" className="hover:text-gray-900 transition-colors">Refund Policy</Link></li>
              <li><Link href="/contact" className="hover:text-gray-900 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-gray-600">
          <p className="text-sm">&copy; 2025 TenderPost. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/privacy-policy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-gray-900 transition-colors">Terms & Conditions</Link>
          </div>
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
          <p>&copy; 2025 TenderPost. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 