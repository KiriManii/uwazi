import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface PollOption {
  poll_id: string;
  option_text: string;
  position: number;
  vote_count: number;
}

interface SupabasePoll {
  id: string;
  title: string;
  description?: string | null;
  creator_email?: string | null;
  created_at: string;
  is_active: boolean;
  total_votes: number;
  poll_options?: PollOption[];
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('polls')
      .select(`
        *,
        poll_options (
          *
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform Supabase data structure
    const transformedData = (data as SupabasePoll[])?.map((poll) => ({
      ...poll,
      options: poll.poll_options || [],
    })) || [];

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching polls:', error);
    return NextResponse.json(
      { error: 'Failed to fetch polls' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, options, creatorEmail } = await request.json();

    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({
        title,
        description,
        creator_email: creatorEmail,
      })
      .select()
      .single();

    if (pollError) throw pollError;

    const optionsToInsert = options.map((text: string, index: number) => ({
      poll_id: poll.id,
      option_text: text,
      position: index,
      vote_count: 0,
    }));

    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(optionsToInsert);

    if (optionsError) throw optionsError;

    return NextResponse.json(poll);
  } catch (error) {
    console.error('Error creating poll:', error);
    return NextResponse.json(
      { error: 'Failed to create poll' },
      { status: 500 }
    );
  }
}
