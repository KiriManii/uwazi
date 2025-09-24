'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Poll } from '@/types';
import VoteInterface from '@/components/polls/VoteInterface';
import LiveCounter from '@/components/charts/LiveCounter';

export default function VotePage() {
  const params = useParams();
  const router = useRouter();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    loadPoll();
    checkVoteStatus();

    const channel = supabase
      .channel(`poll-${params.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'votes',
          filter: `poll_id=eq.${params.id}`,
        },
        () => {
          loadPoll();
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
    setIsVoting(true);
    
    try {
      const { error } = await supabase.from('votes').insert({
        poll_id: params.id,
        option_id: optionId,
        ip_address: '127.0.0.1',
      });

      if (!error) {
        await supabase.rpc('increment_vote_count', {
          option_id: optionId,
          poll_id: params.id,
        });

        localStorage.setItem(`voted_${params.id}`, 'true');
        setHasVoted(true);
        
        setTimeout(() => {
          router.push(`/results/${params.id}`);
        }, 1000);
      } else {
        console.error('Vote error:', error);
        if (error.code === '23505') {
          alert('You have already voted on this poll!');
          setHasVoted(true);
        }
      }
    } catch (error) {
      console.error('Vote submission failed:', error);
    } finally {
      setIsVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading poll...</p>
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Poll Not Found</h2>
        <p className="text-gray-600">This poll may have been deleted or doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{poll.title}</h1>
      {poll.description && <p className="text-gray-600 mb-8">{poll.description}</p>}

      {hasVoted || isVoting ? (
        <div className="text-center py-12 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg">
          {isVoting ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-lg font-medium">Submitting your vote...</p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">✓</div>
              <p className="text-lg font-medium mb-4">Thank you for voting!</p>
              <button
                onClick={() => router.push(`/results/${params.id}`)}
                className="btn-primary"
              >
                View Results
              </button>
            </>
          )}
        </div>
      ) : (
        <>
          <VoteInterface poll={poll} onVote={handleVote} />
          
          <div className="mt-8">
            <LiveCounter value={poll.total_votes} label="people have voted" />
          </div>
        </>
      )}
    </div>
  );
}
