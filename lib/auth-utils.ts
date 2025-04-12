/**
 * Checks if the user's email is verified
 * @param email - The email to check verification status for
 * @returns Promise with the verification status and any error message
 */
export async function checkVerificationStatus(email: string): Promise<{ 
  isVerified: boolean; 
  error?: string 
}> {
  try {
    // Replace with your actual API endpoint
    const response = await fetch(`/api/auth/verify-status?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { 
        isVerified: false, 
        error: errorData.message || 'Failed to check verification status' 
      };
    }

    const data = await response.json();
    return { isVerified: data.isVerified };
  } catch (error) {
    console.error('Error checking verification status:', error);
    return { 
      isVerified: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
} 