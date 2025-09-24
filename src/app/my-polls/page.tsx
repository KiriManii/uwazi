'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPolls } from '@/store/slices/pollsSlice';
import PollCard from '@/components/polls/PollCard';

export default function MyPollsPage() {
  const dispatch = useAppDispatch();
  const { polls, loading } = useAppSelector((state) => state.polls);

  useEffect(() => {
    dispatch(fetchPolls());
  }, [dispatch]);

  const handleDelete = (pollId: string) => {
    // Refresh polls after deletion
    dispatch(fetchPolls());
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage Polls</h1>
        <p className="text-gray-600">
          View and manage all polls. For testing purposes only.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading polls...</div>
      ) : polls.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No polls found.</p>
          <a href="/create" className="btn-primary">
            Create Your First Poll
          </a>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {polls.map((poll) => (
            <PollCard key={poll.id} poll={poll} showDelete onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
