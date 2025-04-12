import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { checkVerificationStatus } from '@/lib/auth-utils';
import { useLanguage } from '@/app/i18n/LanguageContext';
import VerificationCodeInput from '@/components/verification-code-input';

interface VerificationStatusProps {
  email: string;
}

export function VerificationStatus({ email }: VerificationStatusProps) {
  const { t } = useLanguage();
  const [status, setStatus] = useState<{
    isVerified: boolean;
    error?: string;
    loading: boolean;
  }>({
    isVerified: false,
    loading: true,
  });
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        setStatus(prev => ({ ...prev, loading: true }));
        const result = await checkVerificationStatus(email);
        setStatus({
          isVerified: result.isVerified,
          error: result.error,
          loading: false,
        });
      } catch (error) {
        setStatus({
          isVerified: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
          loading: false,
        });
      }
    };

    if (email) {
      checkStatus();
    } else {
      setStatus(prev => ({ ...prev, loading: false }));
    }
  }, [email]);

  const handleSendVerification = async () => {
    try {
      setIsSubmitting(true);
      setVerificationError(null);
      
      // Call API to send verification code
      const response = await fetch('/api/auth/send-verification-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send verification code');
      }
      
      // Show the code input
      setShowCodeInput(true);
      
    } catch (error) {
      setVerificationError(error instanceof Error ? error.message : 'Failed to send verification code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (code: string) => {
    try {
      setIsSubmitting(true);
      setVerificationError(null);
      
      // Call API to verify the code
      const response = await fetch('/api/auth/confirm-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Invalid verification code');
      }
      
      // Verification successful
      setStatus({
        isVerified: true,
        loading: false,
      });
      
      // Hide code input
      setShowCodeInput(false);
      
    } catch (error) {
      setVerificationError(error instanceof Error ? error.message : 'Failed to verify code');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status.loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">{t('verification.checking')}</p>
        </CardContent>
      </Card>
    );
  }

  if (status.error && !verificationError) {
    return (
      <Alert variant="destructive" className="w-full max-w-md mx-auto">
        <XCircle className="h-4 w-4" />
        <AlertTitle>{t('verification.errorTitle')}</AlertTitle>
        <AlertDescription>{status.error}</AlertDescription>
      </Alert>
    );
  }

  if (showCodeInput) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{t('verification.enterCode')}</CardTitle>
          <CardDescription>
            {t('verification.codeSentTo').replace('{email}', email)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {verificationError && (
            <Alert variant="destructive" className="mb-4">
              <XCircle className="h-4 w-4" />
              <AlertTitle>{t('verification.errorTitle')}</AlertTitle>
              <AlertDescription>{verificationError}</AlertDescription>
            </Alert>
          )}
          <VerificationCodeInput 
            length={4}
            onComplete={handleVerifyCode}
            isLoading={isSubmitting}
          />
          <p className="mt-4 text-xs text-muted-foreground">
            {t('verification.testingNote')}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            variant="link" 
            onClick={handleSendVerification} 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? t('verification.checking') : t('verification.resendCode')}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowCodeInput(false)} 
            className="w-full"
          >
            {t('verification.cancel')}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {status.isVerified ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              {t('verification.verifiedTitle')}
            </>
          ) : (
            <>
              <XCircle className="h-5 w-5 text-amber-500" />
              {t('verification.unverifiedTitle')}
            </>
          )}
        </CardTitle>
        <CardDescription>
          {status.isVerified
            ? t('verification.verifiedDescription')
            : t('verification.unverifiedDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {verificationError && (
          <Alert variant="destructive" className="mb-4">
            <XCircle className="h-4 w-4" />
            <AlertTitle>{t('verification.errorTitle')}</AlertTitle>
            <AlertDescription>{verificationError}</AlertDescription>
          </Alert>
        )}
        <p className="text-sm text-muted-foreground">
          {status.isVerified
            ? t('verification.verifiedMessage').replace('{email}', email)
            : t('verification.unverifiedMessage').replace('{email}', email)}
        </p>
      </CardContent>
      {!status.isVerified && (
        <CardFooter>
          <Button 
            onClick={handleSendVerification} 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? 'Sending...' 
              : t('verification.sendVerification')}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
