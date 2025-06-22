"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, AlertCircle, CheckCircle, Bug, RefreshCw, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { 
  supabase, 
  signInWithMagicLink, 
  resendVerificationEmail, 
  checkEmailVerificationBypass,
  forceSignInWithPassword
} from "@/lib/supabase";

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verificationStatus = searchParams.get('verified');
  const magicLinkSent = searchParams.get('magic_link') === 'sent';
  const { toast } = useToast();
  const { signIn, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [useMagicLink, setUseMagicLink] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [isCheckingVerification, setIsCheckingVerification] = useState(false);
  const [isForceSignIn, setIsForceSignIn] = useState(false);

  // Show verification message if coming from signup
  useEffect(() => {
    if (verificationStatus === 'pending') {
      toast({
        title: "Email Verification Required",
        description: "Please check your email and verify your account before signing in.",
        variant: "default",
      });
    }
    
    if (magicLinkSent) {
      toast({
        title: "Magic Link Sent",
        description: "Check your email for a magic link to sign in.",
        variant: "default",
      });
    }
  }, [verificationStatus, magicLinkSent, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setDebugInfo(null);

    try {
      if (useMagicLink) {
        // Magic link authentication
        try {
          await signInWithMagicLink(email);
          toast({
            title: "Magic Link Sent",
            description: "Check your email for a link to sign in.",
            duration: 5000,
          });
          // Redirect to a confirmation page or add a UI state
          window.location.href = `/auth/signin?magic_link=sent`;
        } catch (error: any) {
          // Handle rate limiting error specifically
          if (error.message?.includes("security purposes") || error.message?.includes("request this after")) {
            toast({
              title: "Rate Limited",
              description: "Please wait before requesting another magic link.",
              variant: "destructive",
            });
          } else {
            throw error; // Re-throw other errors to be handled by the main catch block
          }
        }
        return;
      }
      
      // Force sign-in option (bypass verification check)
      if (isForceSignIn) {
        try {
          await forceSignInWithPassword(email, password);
          
          toast({
            title: "Success",
            description: "Force sign-in successful! You are now signed in.",
          });
          
          // Redirect to home page
          window.location.href = "/";
          return;
        } catch (error: any) {
          setDebugInfo({ 
            forceSignInError: error instanceof Error ? error.message : String(error),
            time: new Date().toISOString()
          });
          
          toast({
            title: "Force Sign-in Failed",
            description: "Could not bypass verification. Check your credentials or try another method.",
            variant: "destructive",
          });
          
          throw error; // Let the main catch block handle it
        }
      }
      
      // In debug mode, bypass the context and call Supabase directly
      if (showDebug) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          setDebugInfo({ error: error.message, code: error.status });
          throw error;
        }
        
        setDebugInfo({ success: true, data });
        
        toast({
          title: "Debug Success",
          description: "Sign in successful in debug mode. See console for details.",
        });
        
        console.log("Debug sign-in successful:", data);
        
        // Redirect to home page after short delay to see the debug info
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
        
        return;
      }
      
      // Normal flow using Auth context
      try {
        await signIn(email, password);
        
        toast({
          title: "Success",
          description: "You have been signed in!",
        });
        
        // Redirect to home page
        window.location.href = "/";
      } catch (error: any) {
        // Handle email not confirmed error specifically
        if (error.message?.includes("Email not confirmed")) {
          toast({
            title: "Email Not Verified",
            description: "Please verify your email before signing in. Check your inbox for a confirmation link.",
            variant: "destructive",
          });
          
          // Show verification UI
          setNeedsVerification(true);
          setDebugInfo({ 
            error: "Email not verified", 
            message: "Please check your email for a verification link or request a new one." 
          });
        } else {
          throw error; // Re-throw other errors to be handled by the main catch block
        }
      }
      
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Authentication Error",
        description: error instanceof Error ? error.message : "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    toast({
      title: "Guest Mode",
      description: "You're using the app without an account. Your chats won't be saved across devices.",
      duration: 5000,
    });
    window.location.href = "/";
  };

  const toggleAuthMethod = () => {
    setUseMagicLink(!useMagicLink);
  };

  // Function to resend verification email
  const handleResendVerification = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to resend verification.",
        variant: "destructive",
      });
      return;
    }
    
    setIsResendingVerification(true);
    
    try {
      await resendVerificationEmail(email);
      toast({
        title: "Verification Email Sent",
        description: "Please check your inbox for the verification link.",
        duration: 5000,
      });
    } catch (error: any) {
      // Handle rate limiting error specifically
      if (error.message?.includes("security purposes") || error.message?.includes("request this after")) {
        toast({
          title: "Rate Limited",
          description: "Please wait before requesting another verification email.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to resend verification email. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsResendingVerification(false);
    }
  };

  // Function to manually check verification status
  const handleManualVerificationCheck = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to check verification status.",
        variant: "destructive",
      });
      return;
    }
    
    setIsCheckingVerification(true);
    
    try {
      const result = await checkEmailVerificationBypass(email);
      
      if (result.verified) {
        toast({
          title: "Email Verified",
          description: "Your email appears to be verified. Try signing in again or use the magic link option.",
          duration: 5000,
        });
        
        // If verified, switch to magic link mode for easier sign-in
        setUseMagicLink(true);
        setNeedsVerification(false);
      } else {
        toast({
          title: "Email Not Verified",
          description: "Your email is not verified yet. Please check your inbox for the verification link.",
          variant: "destructive",
        });
      }
      
      setDebugInfo({ 
        verificationCheck: result,
        time: new Date().toISOString()
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check verification status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingVerification(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
        {verificationStatus === 'pending' && (
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded p-3 flex items-start">
            <AlertCircle className="text-blue-500 mr-2 mt-0.5 h-5 w-5 flex-shrink-0" />
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Please check your email to verify your account before signing in.
            </p>
          </div>
        )}
        
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sign In
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to access your characters and chat history
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                placeholder="you@example.com"
              />
            </div>

            {!useMagicLink && (
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required={!useMagicLink}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  placeholder="••••••••"
                />
              </div>
            )}

            {magicLinkSent && (
              <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded p-3 flex items-start">
                <CheckCircle className="text-green-500 mr-2 mt-0.5 h-5 w-5 flex-shrink-0" />
                <p className="text-sm text-green-800 dark:text-green-300">
                  Magic link sent! Check your email for a link to sign in.
                </p>
              </div>
            )}

            {needsVerification && (
              <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded p-3">
                <div className="flex items-start mb-2">
                  <AlertCircle className="text-amber-500 mr-2 mt-0.5 h-5 w-5 flex-shrink-0" />
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    Your email needs to be verified before you can sign in.
                  </p>
                </div>
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full mt-1 text-amber-700 dark:text-amber-300 border-amber-300"
                    onClick={handleResendVerification}
                    disabled={isResendingVerification}
                  >
                    <RefreshCw className={`h-3 w-3 mr-1 ${isResendingVerification ? 'animate-spin' : ''}`} />
                    {isResendingVerification ? "Sending..." : "Resend verification email"}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full mt-1 text-green-700 dark:text-green-300 border-green-300"
                    onClick={handleManualVerificationCheck}
                    disabled={isCheckingVerification}
                  >
                    <ShieldCheck className={`h-3 w-3 mr-1 ${isCheckingVerification ? 'animate-spin' : ''}`} />
                    {isCheckingVerification ? "Checking..." : "I've already verified my email"}
                  </Button>
                  
                  <div className="text-xs text-amber-700 dark:text-amber-400 mt-2">
                    <p className="font-medium">Already verified but still seeing this error?</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Try using magic link sign-in instead</li>
                      <li>Clear your browser cache and try again</li>
                      <li>Use a different browser or private/incognito mode</li>
                      <li>
                        <button 
                          className="underline text-blue-600 dark:text-blue-400" 
                          onClick={() => setIsForceSignIn(!isForceSignIn)}
                        >
                          {isForceSignIn ? "Disable bypass mode" : "Enable bypass mode"}
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="button"
                variant="link"
                size="sm"
                className="text-xs text-blue-600 dark:text-blue-400"
                onClick={toggleAuthMethod}
              >
                {useMagicLink 
                  ? "Sign in with password instead" 
                  : "Sign in with magic link instead"}
              </Button>
            </div>

            {showDebug && (
              <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded p-3">
                <p className="text-xs text-yellow-800 dark:text-yellow-300 font-medium mb-2">
                  Debug Mode Active
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-400">
                  This bypasses the AuthContext and calls Supabase directly.
                </p>
                {debugInfo && (
                  <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto">
                    <pre className="text-xs">
                      {JSON.stringify(debugInfo, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <Button
              type="submit"
              className={`w-full ${isForceSignIn ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
              disabled={isLoading}
            >
              {isLoading 
                ? "Processing..." 
                : useMagicLink 
                  ? "Send Magic Link" 
                  : isForceSignIn 
                    ? "Force Sign In (Bypass Verification)" 
                    : "Sign In"}
            </Button>
          </div>

          <div className="flex flex-col space-y-3">
            <div className="text-center">
              <span className="text-sm text-gray-500">Don't have an account? </span>
              <Link 
                href="/auth/signup" 
                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                Sign up
              </Link>
            </div>
            
            <div className="text-center">
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2"
                onClick={handleSkip}
              >
                Skip and Continue as Guest <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-center mt-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs text-gray-500"
                onClick={() => setShowDebug(!showDebug)}
              >
                <Bug className="h-3 w-3 mr-1" />
                {showDebug ? "Hide Debug Mode" : "Debug Mode"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 