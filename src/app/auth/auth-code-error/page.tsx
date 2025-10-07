'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle, Home, RefreshCcw } from 'lucide-react';

export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
          <AlertCircle className="h-10 w-10 text-red-600" />
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Authentication Error
        </h1>
        <p className="text-gray-600 mb-2">
          We couldn't complete your sign-in request. This could be due to:
        </p>
        
        {/* Error Reasons */}
        <ul className="text-sm text-gray-500 mb-8 space-y-2 text-left bg-white rounded-lg p-6 border border-gray-200">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>The authorization code has expired</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>The sign-in process was interrupted</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Invalid or missing authorization code</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Network connection issues</span>
          </li>
        </ul>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href="/" className="block">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <RefreshCcw className="mr-2 h-5 w-5" />
              Try Signing In Again
            </Button>
          </Link>
          
          <Link href="/" className="block">
            <Button variant="outline" className="w-full">
              <Home className="mr-2 h-5 w-5" />
              Go to Homepage
            </Button>
          </Link>
        </div>

        {/* Help Text */}
        <p className="text-xs text-gray-500 mt-8">
          If this problem persists, please contact support or try clearing your browser cookies.
        </p>
      </div>
    </div>
  );
}

