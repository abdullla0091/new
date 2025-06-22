import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
export const dynamic = 'force-dynamic'; // Force dynamic rendering

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // First check auth state from Supabase
    const { data: { session } } = await supabase.auth.getSession();
    const isAuthorized = session?.user?.email === email;

    if (!isAuthorized) {
      console.log('Unauthorized access or no session found', { sessionEmail: session?.user?.email, requestedEmail: email });
    }

    // Get user from supabase users table - still proceed even if unauthorized
    // to allow checking verification status during login process
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email_confirmed')
      .eq('email', email)
      .single();

    if (userError) {
      console.error('Error fetching user:', userError);
      
      // If the user is not found in our database, try to create a record for them
      try {
        await supabase.from('users').insert({
          email,
          email_confirmed: false,
          created_at: new Date().toISOString()
        });
        
        return NextResponse.json({ isVerified: false });
      } catch (insertError) {
        console.error('Error creating user record:', insertError);
        return NextResponse.json(
          { message: 'User not found and could not create record' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({ isVerified: !!user.email_confirmed });
  } catch (error) {
    console.error('Error checking verification status:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 