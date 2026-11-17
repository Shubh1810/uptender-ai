'use client';

import { useState } from 'react';

/** Email form in the orange "Join the Waitlist" section. Posts to /api/signup. */
export function WaitlistCtaForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'cta-section' }),
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setSuccess(true);
        setEmail('');
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(data.error || 'Failed to join waitlist. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-14 pl-6 pr-32 bg-white text-gray-900 placeholder-gray-500 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
          style={{ borderRadius: 0 }}
          disabled={loading}
          required
        />
        <button
          type="submit"
          className="absolute right-2 top-2 h-10 px-6 bg-[#3d2817] hover:bg-[#2d1f12] text-white font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ borderRadius: 0 }}
          disabled={loading}
        >
          {loading ? 'Joining...' : 'Join'}
        </button>
      </form>
      {success && (
        <p className="mt-4 text-white text-sm text-center font-medium">
          Thank you for joining! We&apos;ll be in touch soon.
        </p>
      )}
      {error && (
        <p role="alert" className="mt-4 text-white text-sm text-center font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
