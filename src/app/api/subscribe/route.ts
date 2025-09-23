import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, source } = await request.json();
    
    const { error } = await supabase
      .from('email_subscribers')
      .insert({ email, source });
    
    if (error && error.code !== '23505') {
      throw error;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
