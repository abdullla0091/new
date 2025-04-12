'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface VerificationContextProps {
  sendVerificationCode: (email: string) => Promise<void>
  verifyCode: (email: string, code: string) => Promise<boolean>
  isLoading: boolean
  error: string | null
}

const VerificationContext = createContext<VerificationContextProps | undefined>(undefined)

export function VerificationProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Function to send a verification code
  const sendVerificationCode = async (email: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Generate a 4-digit code
      const code = Math.floor(1000 + Math.random() * 9000).toString()
      
      // Call API to send verification code
      const response = await fetch('/api/auth/send-verification-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to send verification code')
      }
      
      // In development, log the code for testing
      if (process.env.NODE_ENV === 'development') {
        console.log('Verification code sent to', email, ':', code)
      }
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Function to verify a code
  const verifyCode = async (email: string, code: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Call API to verify the code
      const response = await fetch('/api/auth/confirm-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to verify code')
      }
      
      return true
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VerificationContext.Provider
      value={{
        sendVerificationCode,
        verifyCode,
        isLoading,
        error,
      }}
    >
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