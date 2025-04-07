import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Create a response object we'll modify and return
  const res = NextResponse.next()
  
  try {
    // Check if the path is something we should never redirect from
    const path = req.nextUrl.pathname;
    const publicPaths = ['/', '/chat', '/explore', '/assets', '/_next', '/api', '/kurdish-font', '/test.html'];
    
    // Check if the current path matches any of our public paths or starts with them
    const isPublicPath = publicPaths.some(publicPath => 
      path === publicPath || path.startsWith(`${publicPath}/`)
    );
    
    // If this is a public path, don't try authentication
    if (isPublicPath) {
      return res;
    }
    
    // Check for required environment variables - only if we need auth
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // If we're missing environment variables for auth and on a protected path, redirect to landing
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Create a Supabase client with error handling
    try {
      const supabase = createMiddlewareClient({ 
        req, 
        res,
        options: {
          supabaseUrl,
          supabaseKey
        }
      });
      
      // Refresh session if expired - required for Server Components
      await supabase.auth.getSession();
    } catch (error) {
      console.error('Supabase middleware client error:', error);
      // Continue the request even if there's an authentication error
    }
  } catch (error) {
    console.error('Middleware general error:', error);
    // Return the original response object on any error
  }
  
  // Always allow the request to continue by default
  return res;
}

// Specify which paths the middleware should run on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 