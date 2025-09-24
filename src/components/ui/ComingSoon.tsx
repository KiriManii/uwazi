'use client';

import Link from 'next/link';
import { useState } from 'react';

interface ComingSoonProps {
  title: string;
  description: string;
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'coming_soon' }),
      });

      if (response.ok) {
        setSubscribed(true);
        setEmail('');
      }
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <div className="text-6xl mb-6">🚧</div>
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-xl text-gray-600 mb-8">{description}</p>

        {subscribed ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="text-green-600 font-medium text-lg mb-2">
              You are on the list!
            </div>
            <p className="text-gray-600">
              We will notify you when this feature launches.
            </p>
          </div>
        ) : (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
            <h3 className="font-semibold mb-4">Get notified when we launch</h3>
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input-field flex-1"
                required
              />
              <button type="submit" className="btn-primary">
                Notify Me
              </button>
            </form>
          </div>
        )}

        <div className="mt-8">
          <Link href="/" className="text-primary-600 hover:text-primary-700">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
