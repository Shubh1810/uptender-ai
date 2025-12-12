'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Force light mode on auth pages
  React.useEffect(() => {
    document.documentElement.classList.remove('dark');
    return () => {
      const storedTheme = localStorage.getItem('dashboard-theme');
      if (storedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    };
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        // Password updated successfully, redirect to dashboard
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Update password error:', err);
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: '#fefcf3',
        backgroundImage: `radial-gradient(circle, #d1d5db 1px, transparent 1px)`,
        backgroundSize: '16px 16px',
        backgroundPosition: '0 0, 8px 8px',
      }}
    >
      {/* Logo & Branding */}
      <div className="pt-12 pb-6 text-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="flex items-center space-x-2">
            <Image
              src="/tplogo.png"
              alt="TenderPost"
              className="h-8 w-8 rounded-lg object-contain"
              priority
              width={32}
              height={32}
            />
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              <span className="font-inter">Tender</span>
              <span className="font-kings -ml-1">Post</span>
            </span>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Update Password</h1>
            <p className="text-gray-600 text-lg">Enter your new password</p>
          </div>
        </div>
      </div>

      {/* Update Password Form */}
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </Button>

            <div className="text-center text-sm text-gray-600">
              <Link
                href="/onboarding"
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
              >
                Back to sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

