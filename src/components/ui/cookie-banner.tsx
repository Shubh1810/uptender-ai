'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Cookie } from 'lucide-react';
import Link from 'next/link';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (!cookieConsent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] animate-in slide-in-from-bottom duration-500">
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent backdrop-blur-sm" />
      
      {/* Cookie Banner */}
      <div className="relative bg-white border-t border-gray-200 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-6 sm:pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Left: Icon + Message */}
            <div className="flex items-start gap-3 flex-1">
              <div className="flex-shrink-0 w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <Cookie className="h-5 w-5 text-orange-600" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  We use cookies
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  We use essential cookies to make our site work. With your consent, we may also use non-essential cookies to improve user experience and analyze website traffic.{' '}
                  <Link href="/privacy-policy" className="text-orange-600 hover:text-orange-700 underline">
                    Learn more
                  </Link>
                </p>
              </div>
            </div>

            {/* Right: Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                onClick={handleDecline}
                variant="outline"
                className="flex-1 sm:flex-none text-sm px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Decline
              </Button>
              <Button
                onClick={handleAccept}
                className="flex-1 sm:flex-none text-sm px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white"
              >
                Accept
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Minimal version (even more compact)
export function CookieBannerMinimal() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (!cookieConsent) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleClose = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-[100] animate-in slide-in-from-bottom duration-500">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Cookie className="h-5 w-5 text-orange-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 mb-1">
              Cookie Notice
            </p>
            <p className="text-xs text-gray-600 mb-3">
              We use cookies for authentication and analytics.{' '}
              <Link href="/privacy-policy" className="text-orange-600 hover:underline">
                Learn more
              </Link>
            </p>
            
            <div className="flex gap-2">
              <Button
                onClick={handleAccept}
                className="flex-1 text-xs px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white h-auto"
              >
                Accept
              </Button>
              <Button
                onClick={handleClose}
                variant="outline"
                className="text-xs px-3 py-1.5 border-gray-300 text-gray-700 hover:bg-gray-50 h-auto"
              >
                Decline
              </Button>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

