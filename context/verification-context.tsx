'use client'

import { createContext, useContext, useState } from 'react'
import { supabase } from '@/lib/supabase'

type VerificationContextType = {
  sendVerificationCode: (email: string) => Promise<void>
  verifyCode: (email: string, code: string) => Promise<boolean>
  isLoading: boolean
  error: string | null
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined)

export function VerificationProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendVerificationCode = async (email: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false, // Don't create user here since we're using signUp
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) throw error
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send verification code')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const verifyCode = async (email: string, code: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'email'
      })
      
      if (error) throw error
      
      // If we get here, the verification was successful
      return true
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify code')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VerificationContext.Provider value={{
      sendVerificationCode,
      verifyCode,
      isLoading,
      error
    }}>
      {children}
    </VerificationContext.Provider>
  )
}

export function useVerification() {
  const context = useContext(VerificationContext)
  if (context === undefined) {
    throw new Error('useVerification must be used within a VerificationProvider')
  }
  return context
} 