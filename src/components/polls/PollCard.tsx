import Link from 'next/link';
import { Poll } from '@/types';

interface PollCardProps {
  poll: Poll;
}

export default function PollCard({ poll }: PollCardProps) {
  return (
    <Link href={`/poll/${poll.id}`}>
      <div className="card hover:shadow-xl transition-all duration-300 cursor-pointer">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
          {poll.title}
        </h3>
        {poll.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {poll.description}
          </p>
        )}
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{poll.total_votes} votes</span>
          <span>{poll.options?.length ?? 0} options</span>
        </div>
      </div>
    </Link>
  );
}
