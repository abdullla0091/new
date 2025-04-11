'use client'

import { ReactNode } from 'react'
import { AuthProvider } from '@/context/auth-context'
import { Toaster } from '@/components/ui/sonner'
import { VerificationProvider } from '@/context/verification-context'
import { ThemeProvider } from '@/components/theme-provider'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <VerificationProvider>
          {children}
          <Toaster />
        </VerificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
} 