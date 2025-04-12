import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fzzmgutmyoccbsthsgbh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6em1ndXRteW9jY2JzdGhzZ2JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyODgxNzQsImV4cCI6MjA1ODg2NDE3NH0.1nlXJPQe4_Jbg9MtpIMwIJB0WuDH1Tde8NzVBVE1Pm0'

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseKey)

// Helper functions for auth
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Signup error:', error)
    throw error
  }
}

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    // After successful sign-in, verify the user has a record in the users table
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
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser()
  if (error) return null
  return data?.user
}

export const getUserSession = async () => {
  const { data, error } = await supabase.auth.getSession()
  if (error) return null
  return data.session
}

export const signInWithMagicLink = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Magic link error:', error)
    throw error
  }
}

export const resendVerificationEmail = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Resend verification error:', error)
    throw error
  }
}

export const checkEmailVerificationBypass = async (email: string) => {
  try {
    // Try signing in with OTP (Magic Link)
    // This is a workaround to force Supabase to check verification status directly
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    });
    
    // If we get an "Email not confirmed" error, it means the email is still not verified
    // If we get a success or a different error (like rate limiting), it likely means the email is verified
    if (error && error.message.includes("Email not confirmed")) {
      return { verified: false, message: "Email still not verified" };
    } else if (error && error.message.includes("rate limit")) {
      return { verified: true, message: "Likely verified (hit rate limit)" };
    } else {
      return { verified: true, message: "Magic link sent - email is verified" };
    }
  } catch (error) {
    console.error('Verification bypass check error:', error);
    return { verified: false, message: "Error checking verification status" };
  }
};

export const forceSignInWithPassword = async (email: string, password: string) => {
  try {
    // Try to get a session directly through Supabase API
    // This is a workaround for cases where email verification state is out of sync
    const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apiKey': supabaseKey,
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || data.error_description || 'Failed to sign in');
    }
    
    // Manually refresh the session
    await supabase.auth.setSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });
    
    return { success: true, data };
  } catch (error) {
    console.error('Force sign in error:', error);
    throw error;
  }
}; 