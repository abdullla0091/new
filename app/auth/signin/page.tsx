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
  const [verificationCode, setVerificationCode] = useState("");

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
        // Magic link authentication is still kept as a fallback option
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
      
      // Normal flow using Auth context - try to sign in
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
            description: "We'll send you a verification code to verify your email.",
            variant: "default",
          });
          
          // Show verification UI and send verification code
          setNeedsVerification(true);
          
          // Send verification code
          try {
            await fetch('/api/auth/send-verification-code', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                email, 
                code: Math.floor(1000 + Math.random() * 9000).toString() 
              }),
            });
          } catch (verificationError) {
            console.error('Failed to send verification code:', verificationError);
          }
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

  // Handle verification code completion
  const handleVerificationComplete = async (code: string) => {
    setVerificationCode(code);
    setIsCheckingVerification(true);
    
    try {
      // Call the API to verify the code
      const response = await fetch('/api/auth/confirm-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify code');
      }
      
      // If verification was successful, try to sign in again
      await signIn(email, password);
      
      toast({
        title: "Success",
        description: "Your email has been verified and you are now signed in!",
      });
      
      // Redirect to home page
      window.location.href = "/";
      
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Failed to verify your email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingVerification(false);
    }
  };

  // Function to resend verification code
  const handleResendVerification = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to resend verification code.",
        variant: "destructive",
      });
      return;
    }
    
    setIsResendingVerification(true);
    
    try {
      const response = await fetch('/api/auth/send-verification-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          code: Math.floor(1000 + Math.random() * 9000).toString() 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }
      
      toast({
        title: "Verification Code Sent",
        description: "Please check your email for the verification code.",
        duration: 5000,
      });
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to resend verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResendingVerification(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sign In
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to access your account
          </p>
        </div>

        {!needsVerification ? (
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
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

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Password
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                  >
                    Forgot?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || authLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
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
                  className="w-full"
                  onClick={handleSkip}
                >
                  Skip and Continue as Guest <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Enter Verification Code
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We sent a 4-digit code to {email}
              </p>
            </div>
            
            <div className="mt-6">
              <VerificationCodeInput 
                length={4} 
                onComplete={handleVerificationComplete} 
                isLoading={isCheckingVerification} 
              />
            </div>
            
            <div className="text-center">
              <Button
                type="button"
                variant="link"
                className="text-sm"
                onClick={handleResendVerification}
                disabled={isResendingVerification}
              >
                {isResendingVerification ? "Sending..." : "Didn't receive the code? Send again"}
              </Button>
            </div>
            
            <div className="text-center">
              <Button
                type="button"
                variant="outline"
                className="text-sm w-full"
                onClick={() => setNeedsVerification(false)}
              >
                Back to Sign In
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 