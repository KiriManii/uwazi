import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface SupabasePollOption {
  id: string
  poll_id: string
  option_text: string | null
  vote_count: number | null
  position: number | null
}

interface SupabasePoll {
  id: string
  title: string | null
  description: string | null
  creator_email: string | null
  created_at: string | null
  is_active: boolean | null
  total_votes: number | null
  poll_options?: SupabasePollOption[] | null
}

interface SupabaseError {
  message: string
  code?: string
}

// ✅ GET handler
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const pollId = context.params.id

    const { data, error } = await supabase
      .from('polls')
      .select(
        `
        *,
        poll_options (*)
      `
      )
      .eq('id', pollId)
      .single()

    if (error) {
      const supabaseError = error as SupabaseError
      return NextResponse.json(
        { error: supabaseError.message || 'Poll not found' },
        { status: 404 }
      )
    }

    const poll = data as SupabasePoll
    const options = poll.poll_options || []

    const transformedPoll = {
      id: poll.id,
      title: poll.title || '',
      description: poll.description || '',
      creator_email: poll.creator_email || undefined,
      created_at: poll.created_at || undefined,
      is_active: poll.is_active ?? true,
      total_votes: poll.total_votes || 0,
      options: options.map((option) => ({
        id: option.id,
        poll_id: option.poll_id,
        option_text: option.option_text || '',
        vote_count: option.vote_count || 0,
        position: option.position || 0,
      })),
    }

    return NextResponse.json(transformedPoll)
  } catch (err) {
    console.error('Get poll error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ✅ DELETE handler
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const pollId = context.params.id

    const { error } = await supabase.rpc('delete_poll', {
      poll_id: pollId,
    })

    if (error) {
      const supabaseError = error as SupabaseError
      console.error('Delete poll RPC error:', error)
      return NextResponse.json(
        { error: supabaseError.message || 'Failed to delete poll' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Poll deleted successfully',
    })
  } catch (err) {
    console.error('Delete poll error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
