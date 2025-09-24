'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPolls } from '@/store/slices/pollsSlice';
import PollCard from '@/components/polls/PollCard';
import ContactModal from '@/components/ui/ContactModal';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { polls, loading } = useAppSelector((state) => state.polls);
  const [showContactModal, setShowContactModal] = useState<'professional' | 'enterprise' | null>(null);

  useEffect(() => {
    dispatch(fetchPolls());
  }, [dispatch]);

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Transform African Governance with
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
            {' '}
            Data-Driven Insights
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join 10,000+ government officials, NGOs, and candidates using Uwazi to understand
          public opinion in real-time.
        </p>

        <div className="mb-8">
          <span className="inline-block px-4 py-2 bg-yellow-50 text-yellow-800 rounded-full text-sm font-medium">
            ⏰ Limited: Only 2 free polls per week
          </span>
        </div>

        <Link href="/create" className="btn-primary text-lg px-8 py-4">
          Create Your First Poll Free
        </Link>

        <div className="mt-8 flex justify-center items-center space-x-8 text-sm text-gray-500">
          <span>✓ No account required</span>
          <span>✓ Results in 60 seconds</span>
          <span>✓ 100% Anonymous</span>
        </div>
      </section>

      {/* Recent Polls */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Live Polls</h2>
        {loading ? (
          <div className="text-center py-12">Loading polls...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {polls.slice(0, 6).map((poll) => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </div>
        )}
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-50 rounded-2xl px-8 my-12">
        <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="card text-center">
            <h3 className="text-xl font-bold mb-2">Free</h3>
            <p className="text-4xl font-bold mb-4">$0</p>
            <ul className="space-y-2 mb-6 text-left">
              <li>✓ 2 polls per week</li>
              <li>✓ 25 responses per poll</li>
              <li>✓ Basic charts</li>
              <li>✓ Email results</li>
            </ul>
            <Link href="/create" className="btn-secondary block w-full">
              Start Free
            </Link>
          </div>

          <div className="card border-2 border-primary-600 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-600 text-white text-sm rounded-full">
              Most Popular
            </span>
            <h3 className="text-xl font-bold mb-2">Professional</h3>
            <p className="text-4xl font-bold mb-4">
              $79 <span className="text-lg font-normal">one-time</span>
            </p>
            <ul className="space-y-2 mb-6 text-left">
              <li>✓ 15 polls total</li>
              <li>✓ 1,000 responses</li>
              <li>✓ Advanced charts</li>
              <li>✓ PDF exports</li>
            </ul>
            <button
              onClick={() => setShowContactModal('professional')}
              className="btn-primary block w-full"
            >
              Get Professional
            </button>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold mb-2">Enterprise</h3>
            <p className="text-4xl font-bold mb-4">
              $45 <span className="text-lg font-normal">/user/mo</span>
            </p>
            <ul className="space-y-2 mb-6 text-left">
              <li>✓ Unlimited polls</li>
              <li>✓ AI insights</li>
              <li>✓ Team features</li>
              <li>✓ Priority support</li>
            </ul>
            <button
              onClick={() => setShowContactModal('enterprise')}
              className="btn-secondary block w-full"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Contact Modals */}
      {showContactModal && (
        <ContactModal
          plan={showContactModal}
          onClose={() => setShowContactModal(null)}
        />
      )}
    </div>
  );
}
