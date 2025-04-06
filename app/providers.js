'use client'

import { AuthProvider } from '@/context/auth-context'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { VerificationProvider } from '@/context/verification-context'

export function Providers({ children }) {
  return (
    <AuthProvider>
      <VerificationProvider>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </VerificationProvider>
    </AuthProvider>
  )
} 