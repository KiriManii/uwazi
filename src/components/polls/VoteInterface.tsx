import { Poll } from '@/types';

interface VoteInterfaceProps {
  poll: Poll;
  onVote: (optionId: string) => void;
}

export default function VoteInterface({ poll, onVote }: VoteInterfaceProps) {
  return (
    <div className="space-y-4">
      {poll.options.map((option) => (
        <button
          key={option.id}
          onClick={() => onVote(option.id)}
          className="w-full text-left p-6 bg-white border-2 border-gray-200 rounded-lg hover:border-primary-600 hover:shadow-lg transition-all duration-200 group"
        >
          <span className="text-lg group-hover:text-primary-600 transition-colors">
            {option.option_text}
          </span>
        </button>
      ))}
    </div>
  );
}
