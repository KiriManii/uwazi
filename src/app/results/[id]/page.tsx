'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Poll, PollOption } from '@/types';
import ResultsChart from '@/components/charts/ResultsChart';
import { generatePDF, generateCSV } from '@/lib/export';

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
  const [poll, setPoll] = useState<Poll | null>(null);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadPoll() {
      setLoading(true);

      const { data, error } = await supabase
        .from('polls')
        .select(`
          *,
          poll_options (
            *
          )
        `)
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

    // initial load
    loadPoll();

    // Real-time subscription for live updates
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
        () => {
          // refresh when votes change
          loadPoll();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
    // params.id is the only external dependency we need here
  }, [params.id]);

  const handleExportPDF = async () => {
    if (!poll) return;
    setShowEmailCapture(true);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !poll) return;

    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'results' }),
      });

      await generatePDF(poll);

      setShowEmailCapture(false);
      setEmail('');
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Poll Not Found</h2>
        <p className="text-gray-600">
          This poll may have been deleted or doesn&apos;t exist.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{poll.title}</h1>
      {poll.description && <p className="text-gray-600 mb-6">{poll.description}</p>}

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <span className="flex h-3 w-3 mr-2">
            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm text-gray-600">Live results • {poll.total_votes} votes</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Vote Distribution</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                chartType === 'bar' ? 'bg-primary-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Bar Chart
            </button>
            <button
              onClick={() => setChartType('pie')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                chartType === 'pie' ? 'bg-primary-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Pie Chart
            </button>
          </div>
        </div>
        <ResultsChart poll={poll} type={chartType} />
      </div>

      <div className="space-y-4 mb-8">
        {poll.options
          .slice() // avoid mutating original array
          .sort((a, b) => b.vote_count - a.vote_count)
          .map((option, index) => {
            const percentage =
              poll.total_votes > 0
                ? ((option.vote_count / poll.total_votes) * 100).toFixed(1)
                : '0';

            return (
              <div key={option.id} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{option.option_text}</span>
                  <span className="text-sm text-gray-500">
                    {option.vote_count} votes ({percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      index === 0 ? 'bg-primary-600' : 'bg-secondary-600'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
      </div>

      <div className="flex gap-4">
        <button onClick={handleExportPDF} className="btn-primary">
          📄 Download PDF Report
        </button>
        <button
          onClick={() => {
            if (poll) generateCSV(poll);
          }}
          className="btn-secondary"
        >
          📊 Export CSV
        </button>
      </div>

      {showEmailCapture && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Get Your Professional Report</h3>
            <p className="text-gray-600 mb-4">Enter your email to receive the PDF report with detailed insights.</p>
            <form
              onSubmit={handleEmailSubmit}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input-field mb-4"
                required
              />
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">
                  Get Report
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmailCapture(false)}
                  className="px-4 py-2 text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
