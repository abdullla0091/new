"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight } from "lucide-react";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, try to sign up the user
      await signUp(email, password);
      
      // Then send verification code
      await sendVerificationCode(email);
      
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
          await sendVerificationCode(email);
          setShowVerification(true);
          
          toast({
            title: "Verification Code Sent",
            description: "Please check your email for the verification code.",
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
      const isValid = await verifyCode(email, code);
      
      if (isValid) {
        toast({
          title: "Success",
          description: "Your email has been verified. You can now sign in.",
          duration: 5000,
        });
        
        // Redirect to signin page
        router.push('/auth/signin');
      } else {
        toast({
          title: "Invalid Code",
          description: "The verification code is incorrect. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
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
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Enter Verification Code
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We sent a 6-digit code to {email}
              </p>
            </div>
            
            <VerificationCodeInput onComplete={handleVerification} />
            
            <div className="text-center">
              <Button
                type="button"
                variant="link"
                className="text-sm"
                onClick={handleSubmit}
                disabled={isLoading || verificationLoading}
              >
                Didn't receive the code? Send again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 