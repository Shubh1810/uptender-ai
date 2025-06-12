'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  variant?: 'main' | 'simple';
  className?: string;
  showBackButton?: boolean;
  backButtonText?: string;
}

export function Header({ 
  variant = 'main', 
  className = '', 
  showBackButton = false,
  backButtonText = 'Back to Home'
}: HeaderProps) {
  const baseClasses = "bg-white/40 backdrop-blur-sm";
  const stickyClasses = variant === 'main' ? "sticky top-0 z-50" : "";
  const patternClasses = variant === 'main' ? "header-dots-pattern" : "";
  
  return (
    <header className={`${baseClasses} ${stickyClasses} ${patternClasses} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/uptenderlogo.png" 
              alt="TenderPost - AI Tender Notifier Platform for India" 
              className="h-10 w-10 rounded-xl object-contain"
              priority={variant === 'main'}
              width={40}
              height={40}
            />
            <span className="text-2xl font-bold text-gray-900">
              Tender<span className="italic">Post</span>
            </span>
          </Link>
          
          {variant === 'main' ? (
            <MainNavigation />
          ) : (
            showBackButton && (
              <Link href="/">
                <Button variant="outline" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>{backButtonText}</span>
                </Button>
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
}

function MainNavigation() {
  return (
    <nav className="hidden md:flex items-center space-x-8">
      <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
        Tender Features
      </a>
      <a href="#categories" className="text-gray-600 hover:text-gray-900 transition-colors">
        Tender Categories
      </a>
      <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
        Pricing
      </a>
      <a href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors">
        FAQs
      </a>
      <Link href="/make-payment">
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          Start Tracking Tenders
        </Button>
      </Link>
    </nav>
  );
}

// Alternative navigation for tender-guide and other internal pages
export function InternalPageNavigation() {
  return (
    <nav className="hidden md:flex items-center space-x-8">
      <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
        Home
      </Link>
      <Link href="/#features" className="text-gray-600 hover:text-gray-900 transition-colors">
        Features
      </Link>
      <Link href="/#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
        Pricing
      </Link>
      <Link href="/make-payment">
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          Get Started
        </Button>
      </Link>
    </nav>
  );
}

// Specialized header for tender-guide and similar content pages
export function ContentPageHeader({ className = '' }: { className?: string }) {
  return (
    <header className={`bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 ${className}`}>
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
            <span className="text-2xl font-bold text-gray-900">
              Tender<span className="italic">Post</span>
            </span>
          </Link>
          
          <InternalPageNavigation />
        </div>
      </div>
    </header>
  );
} 