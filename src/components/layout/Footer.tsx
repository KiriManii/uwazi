'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'newsletter' }),
      });

      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    } catch (error) {
      console.error('Subscription failed:', error);
    }
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-900">Uwazi</span>
            </div>
            <p className="text-gray-600 mb-6">
              Transform African governance with data-driven insights. Create polls, gather
              opinions, and make informed decisions.
            </p>

            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="input-field text-sm"
                  required
                />
                <button type="submit" className="btn-primary text-sm">
                  Subscribe
                </button>
              </form>
            ) : (
              <div className="text-green-600 font-medium">✓ Subscribed successfully!</div>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/create" className="hover:text-primary-600">
                  Create Poll
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-primary-600">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-primary-600">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="hover:text-primary-600">
                  API Docs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/help" className="hover:text-primary-600">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary-600">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary-600">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary-600">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Uwazi. Built for African governance transformation.</p>
        </div>
      </div>
    </footer>
  );
}
