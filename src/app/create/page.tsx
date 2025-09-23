'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch } from '@/store/hooks';
import { createPoll } from '@/store/slices/pollsSlice';
import { trackFreePollCreation } from '@/lib/tracking';

const pollSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().max(500).optional(),
  options: z.array(z.string().min(1, 'Option cannot be empty')).min(2).max(6),
  creatorEmail: z.string().email('Valid email required to receive results'),
});

type PollFormData = z.infer<typeof pollSchema>;

export default function CreatePollPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [options, setOptions] = useState(['', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<PollFormData>({
    resolver: zodResolver(pollSchema),
    defaultValues: {
      options: ['', ''],
    },
  });
  
  const onSubmit = async (data: PollFormData) => {
    // Check free tier limits
    const canCreate = await trackFreePollCreation();
    if (!canCreate) {
      alert('You have reached your free limit of 2 polls per week. Upgrade to Professional for unlimited polls!');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const result = await dispatch(createPoll(data)).unwrap();
      
      // Collect email for lead generation
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: data.creatorEmail, 
          source: 'poll_creation' 
        }),
      });
      
      router.push(`/poll/${result.id}`);
    } catch (error) {
      console.error('Failed to create poll:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const addOption = () => {
    if (options.length < 6) {
      const newOptions = [...options, ''];
      setOptions(newOptions);
      setValue('options', newOptions);
    }
  };
  
  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      setValue('options', newOptions);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create a New Poll</h1>
      
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Step 1 of 1</span>
          <span className="text-sm font-medium text-primary-600">Almost done!</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full w-3/4"></div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Poll Title *
          </label>
          <input
            {...register('title')}
            className="input-field"
            placeholder="e.g., What should be our budget priority for 2025?"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>
        
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            {...register('description')}
            className="input-field"
            rows={3}
            placeholder="Add context to help voters understand the poll"
          />
        </div>
        
        {/* Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Poll Options *
          </label>
          <div className="space-y-3">
            {options.map((_, index) => (
              <div key={index} className="flex gap-2">
                <input
                  {...register(`options.${index}`)}
                  className="input-field"
                  placeholder={`Option ${index + 1}`}
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          {options.length < 6 && (
            <button
              type="button"
              onClick={addOption}
              className="mt-3 text-primary-600 hover:text-primary-700 font-medium"
            >
              + Add Option
            </button>
          )}
        </div>
        
        {/* Email for Results - Lead Capture */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Email * (to receive results)
          </label>
          <input
            {...register('creatorEmail')}
            type="email"
            className="input-field"
            placeholder="your@email.com"
          />
          {errors.creatorEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.creatorEmail.message}</p>
          )}
          <p className="mt-2 text-xs text-gray-600">
            We'll send you real-time results and insights. No spam, ever.
          </p>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full"
        >
          {isSubmitting ? 'Creating...' : 'Create Poll & Get Link'}
        </button>
      </form>
    </div>
  );
}
