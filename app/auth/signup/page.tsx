"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, Mail, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useVerification } from "@/context/verification-context";
import VerificationCodeInput from "@/components/verification-code-input";

export default function SignUp() {
  const router = useRouter();
  const { toast } = useToast();
  const { signUp } = useAuth();
  const { sendVerificationCode, verifyCode, isLoading: verificationLoading } = useVerification();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, try to sign up the user
      await signUp(email, password);
      
      // Then generate and send a verification code
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      
      // Send the verification code
      const response = await fetch('/api/auth/send-verification-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send verification code');
      }
      
      // Show verification code input
      setShowVerification(true);
      
      toast({
        title: "Verification Code Sent",
        description: "Please check your email for the verification code.",
        duration: 5000,
      });
      
    } catch (error: any) {
      console.error("Sign up error:", error);
      
      // If the error is because the user already exists, still send the verification code
      if (error.message?.includes("already registered")) {
        try {
          // Generate and send a verification code for existing user
          const code = Math.floor(1000 + Math.random() * 9000).toString();
          
          await fetch('/api/auth/send-verification-code', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, code }),
          });
          
          setShowVerification(true);
          
          toast({
            title: "Account Already Exists",
            description: "We've sent a verification code to your email.",
            duration: 5000,
          });
        } catch (verificationError) {
          toast({
            title: "Error",
            description: "Failed to send verification code. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description: error.message || "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (code: string) => {
    try {
      // Call the API to verify the code
      const response = await fetch('/api/auth/confirm-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to verify code');
      }
      
      // Show verification success state
      setVerificationSuccess(true);
      
      toast({
        title: "Success",
        description: "Your email has been verified. You can now sign in.",
        duration: 5000,
      });
      
      // Auto-redirect to signin page after 3 seconds
      setTimeout(() => {
        router.push('/auth/signin');
      }, 3000);
      
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "Invalid Code",
        description: error instanceof Error ? error.message : "The verification code is incorrect. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResendVerification = async () => {
    try {
      // Generate and send a new verification code
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      
      const response = await fetch('/api/auth/send-verification-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send verification code');
      }
      
      toast({
        title: "Code Resent",
        description: "A new verification code has been sent to your email.",
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to resend verification code.",
        variant: "destructive",
      });
    }
  };

  const handleSkip = () => {
    toast({
      title: "Guest Mode",
      description: "You're using the app without an account. Your chats won't be saved across devices.",
      duration: 5000,
    });
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign up to save your characters and chat history
          </p>
        </div>

        {!showVerification ? (
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
                  autoComplete="new-password"
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
                disabled={isLoading || verificationLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </div>

            <div className="flex flex-col space-y-3">
              <div className="text-center">
                <span className="text-sm text-gray-500">Already have an account? </span>
                <Link 
                  href="/auth/signin" 
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  Sign in
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
            {!verificationSuccess ? (
              <>
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
                    onComplete={handleVerification} 
                    isLoading={verificationLoading} 
                  />
                </div>
                
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm"
                    onClick={handleResendVerification}
                    disabled={verificationLoading}
                  >
                    {verificationLoading ? "Sending..." : "Didn't receive the code? Send again"}
                  </Button>
                </div>
                
                <div className="text-center">
                  <Button
                    type="button"
                    variant="outline"
                    className="text-sm w-full"
                    onClick={() => setShowVerification(false)}
                  >
                    Back
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center space-y-4 py-6">
                <div className="mb-2">
                  <CheckCircle className="text-green-500 w-16 h-16" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Verification Successful!
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-xs">
                  Your email has been verified. You'll be redirected to the sign-in page in a moment.
                </p>
                <Button
                  className="mt-4"
                  onClick={() => router.push('/auth/signin')}
                >
                  Sign In Now
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 