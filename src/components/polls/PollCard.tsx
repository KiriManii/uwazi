'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Poll } from '@/types';

interface PollCardProps {
  poll: Poll;
  showDelete?: boolean;
  onDelete?: (pollId: string) => void;
}

export default function PollCard({ poll, showDelete = false, onDelete }: PollCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this poll? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/polls/${poll.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDelete?.(poll.id);
      } else {
        alert('Failed to delete poll. Please try again.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('An error occurred while deleting the poll.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Link href={`/poll/${poll.id}`}>
      <div className="card hover:shadow-xl transition-all duration-300 cursor-pointer relative">
        {showDelete && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="absolute top-2 right-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-full p-2 transition-colors z-10"
            title="Delete poll"
          >
            {isDeleting ? (
              <span className="text-xs">...</span>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            )}
          </button>
        )}
        <h3 className="text-lg font-semibold mb-2 line-clamp-2 pr-8">{poll.title}</h3>
        {poll.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{poll.description}</p>
        )}
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{poll.total_votes} votes</span>
          <span>{poll.options.length} options</span>
        </div>
      </div>
    </Link>
  );
}
