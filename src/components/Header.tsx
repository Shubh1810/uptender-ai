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
          </Link>
          
          {variant === 'main' ? (
            <MainNavigation />
          ) : (
            <InternalPageNavigation />
          )}
        </div>
      </div>
    </header>
  );
}

function MainNavigation() {
  return (
    <nav className="flex items-center space-x-8">
      <div className="hidden md:flex items-center space-x-8">
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
      <Link href="/signup">
        <Button className="relative bg-white text-gray-900 border-2 border-transparent bg-clip-padding shadow-md hover:shadow-lg transition-all duration-300 before:absolute before:inset-0 before:-z-10 before:m-[-2px] before:rounded-[inherit] before:bg-gradient-to-r before:from-teal-300 before:via-emerald-300 before:to-yellow-300 hover:before:from-teal-400 hover:before:via-emerald-400 hover:before:to-yellow-400">
          Sign Up
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
      <Link href="/signup">
        <Button className="relative bg-white text-gray-900 border-2 border-transparent bg-clip-padding shadow-md hover:shadow-lg transition-all duration-300 before:absolute before:inset-0 before:-z-10 before:m-[-2px] before:rounded-[inherit] before:bg-gradient-to-r before:from-teal-300 before:via-emerald-300 before:to-yellow-300 hover:before:from-teal-400 hover:before:via-emerald-400 hover:before:to-yellow-400">
          Sign Up
        </Button>
      </Link>
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