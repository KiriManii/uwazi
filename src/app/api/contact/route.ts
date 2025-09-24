import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { name, email, organization, plan, message } = await request.json();

    // Store contact inquiry in database
    const { error } = await supabase.from('contact_inquiries').insert({
      name,
      email,
      organization,
      plan,
      message,
      created_at: new Date().toISOString(),
    });

    if (error) throw error;

    // Also subscribe email for updates (ignore duplicate email errors)
    const { error: subscribeError } = await supabase
      .from('email_subscribers')
      .insert({ 
        email, 
        source: plan === 'professional' ? 'professional_plan' : 'enterprise_plan' 
      });

    // Ignore duplicate email errors (code 23505)
    if (subscribeError && subscribeError.code !== '23505') {
      console.error('Email subscription error:', subscribeError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}
