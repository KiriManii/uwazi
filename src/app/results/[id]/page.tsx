'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Poll, PollOption } from '@/types';

type SupabasePollOption = {
  id: string | number;
  poll_id: string | number;
  option_text?: string | null;
  vote_count?: number | null;
  position?: number | null;
};

type SupabasePoll = {
  id: string | number;
  title?: string | null;
  description?: string | null;
  creator_email?: string | null;
  created_at?: string | null;
  is_active?: boolean | null;
  total_votes?: number | null;
  poll_options?: SupabasePollOption[] | null;
};

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadPoll() {
      setLoading(true);

      const { data, error } = await supabase
        .from('polls')
        .select(`*, poll_options(*)`)
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Failed to load poll:', error);
        if (mounted) setLoading(false);
        return;
      }

      if (data && mounted) {
        const raw = data as SupabasePoll;
        const rawOptions = raw.poll_options ?? [];

        const options: PollOption[] = rawOptions.map((o) => ({
          id: String(o.id),
          poll_id: String(o.poll_id),
          option_text: o.option_text ?? '',
          vote_count: Number(o.vote_count ?? 0),
          position: Number(o.position ?? 0),
        }));

        const transformedPoll: Poll = {
          id: String(raw.id),
          title: raw.title ?? '',
          description: raw.description ?? '',
          creator_email: raw.creator_email ?? undefined,
          created_at: raw.created_at ?? new Date().toISOString(),
          is_active: raw.is_active ?? true,
          total_votes:
            raw.total_votes ??
            options.reduce((sum, o) => sum + o.vote_count, 0),
          options,
        };

        setPoll(transformedPoll);
      }

      if (mounted) setLoading(false);
    }

    loadPoll();

    const channel = supabase
      .channel(`results-${params.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'votes',
          filter: `poll_id=eq.${params.id}`,
        },
        () => loadPoll()
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [params.id]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading results...</p>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Poll Not Found</h1>
        <p className="text-gray-600 mb-6">
          The poll you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <button onClick={() => router.push('/')} className="btn-primary">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">{poll.title}</h1>
        {poll.description && (
          <p className="text-gray-600 mb-6">{poll.description}</p>
        )}
      </div>

      {/* Live indicator */}
      <div className="flex items-center mb-8">
        <span className="flex h-3 w-3 mr-2">
          <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        <span className="text-sm text-gray-600">
          Live results • {poll.total_votes} votes
        </span>
      </div>

      {/* Results */}
      <div className="space-y-4 mb-8">
        {poll.options
          .sort((a, b) => b.vote_count - a.vote_count)
          .map((option, index) => {
            const percentage =
              poll.total_votes > 0
                ? ((option.vote_count / poll.total_votes) * 100).toFixed(1)
                : '0';

            return (
              <div
                key={option.id}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-3">
                    {index === 0 && poll.total_votes > 0 && (
                      <span className="flex items-center justify-center w-6 h-6 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">
                        🏆
                      </span>
                    )}
                    <span className="font-medium text-lg">
                      {option.option_text}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900">
                      {percentage}%
                    </span>
                    <p className="text-sm text-gray-500">
                      {option.vote_count} votes
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      index === 0
                        ? 'bg-gradient-to-r from-primary-600 to-primary-700'
                        : index === 1
                        ? 'bg-gradient-to-r from-secondary-600 to-secondary-700'
                        : 'bg-gradient-to-r from-gray-400 to-gray-500'
                    }`}
                    style={{
                      width: `${percentage}%`,
                      minWidth: percentage !== '0' ? '8px' : '0px',
                    }}
                  />
                </div>
              </div>
            );
          })}
      </div>

      {poll.total_votes === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No votes yet
          </h3>
          <p className="text-gray-600 mb-4">
            Be the first to vote on this poll!
          </p>
          <button
            onClick={() => router.push(`/poll/${params.id}`)}
            className="btn-primary"
          >
            Vote Now
          </button>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => router.push(`/poll/${params.id}`)}
          className="btn-secondary"
        >
          Vote on This Poll
        </button>
        <button onClick={() => router.push('/')} className="btn-primary">
          View More Polls
        </button>
      </div>
    </div>
  );
}
