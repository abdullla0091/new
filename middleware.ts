import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Check for required environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // If we're missing environment variables and not on the landing page or chat page, redirect to landing
  if ((!supabaseUrl || !supabaseKey) && 
      req.nextUrl.pathname !== '/' && 
      !req.nextUrl.pathname.startsWith('/chat/')) {
    return NextResponse.redirect(new URL('/', req.url))
  }
  
  try {
    // Create a Supabase client configured to use cookies
    const supabase = createMiddlewareClient({ 
      req, 
      res,
      options: {
        supabaseUrl: supabaseUrl || 'https://placeholder-url.supabase.co',
        supabaseKey: supabaseKey || 'placeholder-key'
      }
    })
    
    // Refresh session if expired - required for Server Components
    if (supabaseUrl && supabaseKey) {
      await supabase.auth.getSession()
    }
  } catch (error) {
    console.error('Middleware error:', error)
    // Continue the request even if there's an authentication error
  }
  
  return res
}

// Ensure the middleware is run for auth callback routes, but exclude the landing page
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 