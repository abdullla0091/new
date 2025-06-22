import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createVerificationCode } from '@/lib/verification-codes'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Generate and store a verification code
    const code = createVerificationCode(email);

    // In a real app, you would send this code via email
    console.log(`Verification code for ${email}: ${code}`);

    // Check if user exists in the users table
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError && userError.code === 'PGRST116') {
      // User not found in our users table - create them
      await supabase.from('users').insert({
        email,
        email_confirmed: false,
        created_at: new Date().toISOString()
      });
    }

    // For demo purposes, we'll just log the code
    return NextResponse.json({ 
      success: true, 
      message: 'Verification code sent successfully'
    });
  } catch (error) {
    console.error('Error sending verification code:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 