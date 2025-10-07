'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { GoogleSignInButton } from '@/components/ui/google-signin-button';

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
  const stickyClasses = variant === 'main' ? "fixed top-0 left-0 right-0 z-[90]" : "";
  const patternClasses = variant === 'main' ? "header-dots-pattern" : "";
  
  return (
    <>
      <header className={`${baseClasses} ${stickyClasses} ${patternClasses} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/tplogo.png" 
              alt="TenderPost - AI Tender Notifier Platform for India" 
              className="h-10 w-10 rounded-xl object-contain"
              priority={variant === 'main'}
              width={40}
              height={40}
            />
            <span className="text-2xl font-bold text-gray-900 tracking-tight">
              <span className="font-inter">Tender</span><span className="font-kings -ml-1">Post</span>
            </span>
            {variant === 'main' && (
              <div className="flex items-center space-x-1 ml-3 bg-white/40 backdrop-blur-sm rounded-full px-2 py-1 border border-white/30 shadow-sm">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full shadow-sm"></div>
                <span className="font-ubuntu text-xs font-medium text-gray-700">0</span>
                <span className="font-ubuntu text-[10px] text-gray-500">Live</span>
              </div>
            )}
          </Link>
          
          {variant === 'main' ? (
            <MainNavigation />
          ) : (
            <InternalPageNavigation />
          )}
        </div>
      </div>
    </header>
    </>
  );
}

function MainNavigation() {
  const triggerWaitlist = () => {
    // Force show waitlist overlay immediately
    localStorage.removeItem('waitlist-overlay-seen');
    // Dispatch a custom event to trigger the overlay
    window.dispatchEvent(new CustomEvent('show-waitlist-overlay'));
  };

  return (
    <nav className="flex items-center space-x-8">
      <div className="hidden md:flex items-center space-x-8 font-ubuntu">
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
      </div>
      
      <GoogleSignInButton className="relative bg-white hover:bg-blue-900 text-gray-900 hover:text-white border-2 border-transparent bg-clip-padding shadow-md hover:shadow-lg transition-all duration-300 before:absolute before:inset-0 before:-z-10 before:m-[-2px] before:rounded-[inherit] before:bg-gradient-to-r before:from-blue-900 before:via-blue-600 before:to-sky-400 hover:before:bg-blue-900">
        Sign in with Google
      </GoogleSignInButton>
    </nav>
  );
}

// Alternative navigation for tender-guide and other internal pages
export function InternalPageNavigation() {
  return (
    <nav className="hidden md:flex items-center space-x-8 font-ubuntu">
      <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
        Home
      </Link>
      <Link href="/#features" className="text-gray-600 hover:text-gray-900 transition-colors">
        Features
      </Link>
      <Link href="/#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
        Pricing
      </Link>
      <GoogleSignInButton className="relative bg-white hover:bg-blue-900 text-gray-900 hover:text-white border-2 border-transparent bg-clip-padding shadow-md hover:shadow-lg transition-all duration-300 before:absolute before:inset-0 before:-z-10 before:m-[-2px] before:rounded-[inherit] before:bg-gradient-to-r before:from-blue-900 before:via-blue-600 before:to-sky-400 hover:before:bg-blue-900">
        Sign in with Google
      </GoogleSignInButton>
    </nav>
  );
}

// Specialized header for tender-guide and similar content pages
export function ContentPageHeader({ className = '' }: { className?: string }) {
  return (
    <Header 
      variant="simple" 
      className={`bg-white/80 backdrop-blur-sm border-b border-gray-200 ${className}`}
    />
  );
} 