import { useState } from 'react';
import { checkVerificationStatus } from '@/lib/auth-utils';

export function useVerificationStatus() {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = async (email: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const verified = await checkVerificationStatus(email);
      setIsVerified(verified);
      return verified;
    } catch (err) {
      setError('Failed to check verification status');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isVerified,
    isLoading,
    error,
    checkStatus,
  };
} 