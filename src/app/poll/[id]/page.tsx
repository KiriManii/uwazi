'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Poll } from '@/types';
import VoteInterface from '@/components/polls/VoteInterface';

export default function VotePage() {
  const params = useParams();
  const router = useRouter();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadPoll();
    checkVoteStatus();
    
    // Real-time subscription for live updates
    const channel = supabase
      .channel(`poll-${params.id}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'votes', filter: `poll_id=eq.${params.id}` },
        () => {
          loadPoll(); // Reload poll data when votes change
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [params.id]);
  
  const loadPoll = async () => {
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
    
    if (data) {
      // Transform data to match our interface
      const transformedPoll = {
        ...data,
        options: data.poll_options || [],
      };
      setPoll(transformedPoll);
    }
    setLoading(false);
  };
  
  const checkVoteStatus = () => {
    const voted = localStorage.getItem(`voted_${params.id}`);
    setHasVoted(!!voted);
  };
  
  const handleVote = async (optionId: string) => {
    try {
      // Submit vote to API
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          poll_id: params.id,
          option_id: optionId,
        }),
      });
      
      if (response.ok) {
        // Mark as voted locally
        localStorage.setItem(`voted_${params.id}`, 'true');
        setHasVoted(true);
        
        // Redirect to results
        router.push(`/results/${params.id}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to submit vote');
      }
    } catch (error) {
      console.error('Vote submission error:', error);
      alert('Failed to submit vote');
    }
  };
  
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading poll...</p>
      </div>
    );
  }
  
  if (!poll) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Poll Not Found</h1>
        <p className="text-gray-600 mb-6">The poll you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => router.push('/')}
          className="btn-primary"
        >
          Back to Home
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{poll.title}</h1>
      {poll.description && (
        <p className="text-gray-600 mb-8">{poll.description}</p>
      )}
      
      {hasVoted ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Thank you for voting!</h2>
            <p className="text-gray-600 mb-6">Your vote has been recorded anonymously.</p>
          </div>
          <button
            onClick={() => router.push(`/results/${params.id}`)}
            className="btn-primary"
          >
            View Results
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Choose your option:</h2>
            <VoteInterface poll={poll} onVote={handleVote} />
          </div>
          
          {/* Live vote counter */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span>{poll.total_votes} people have voted</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
