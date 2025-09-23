import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { poll_id, option_id } = await request.json();
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    
    const { error } = await supabase
      .from('votes')
      .insert({
        poll_id,
        option_id,
        ip_address: ip,
      });
    
    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'You have already voted on this poll' },
          { status: 400 }
        );
      }
      throw error;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error submitting vote:', error);
    return NextResponse.json(
      { error: 'Failed to submit vote' },
      { status: 500 }
    );
  }
}
