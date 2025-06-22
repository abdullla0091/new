import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { validateVerificationCode, removeVerificationCode } from '@/lib/verification-codes'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, code } = body
    
    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and code are required' },
        { status: 400 }
      )
    }
    
    // Validate the verification code
    const isValid = validateVerificationCode(email, code)
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      )
    }
    
    // Code is valid, mark the email as verified in the database
    const { error } = await supabase
      .from('users')
      .update({ email_confirmed: true })
      .eq('email', email)
    
    if (error) {
      console.error('Error updating verification status:', error)
      return NextResponse.json(
        { error: 'Failed to update verification status' },
        { status: 500 }
      )
    }
    
    // Remove the code from storage
    removeVerificationCode(email)
    
    return NextResponse.json({ 
      success: true,
      message: 'Email verified successfully'
    })
  } catch (error) {
    console.error('Error confirming verification code:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 