// In a real app, these would be stored in a database with expiration
// For demo purposes, we'll use this in-memory store
export const verificationCodes = new Map<string, { code: string, expiresAt: number }>();

/**
 * Creates a verification code for the given email
 * @param email - The email to create a code for
 * @returns The generated code
 */
export function createVerificationCode(email: string): string {
  // Generate a 4-digit code
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  
  // Store the code with a 10-minute expiration
  verificationCodes.set(email, { 
    code, 
    expiresAt: Date.now() + 10 * 60 * 1000 
  });
  
  return code;
}

/**
 * Validates a verification code for the given email
 * @param email - The email to validate the code for
 * @param code - The code to validate
 * @returns Whether the code is valid
 */
export function validateVerificationCode(email: string, code: string): boolean {
  const storedData = verificationCodes.get(email);
  
  if (!storedData) {
    return false;
  }
  
  // Check if the code is expired
  if (storedData.expiresAt < Date.now()) {
    verificationCodes.delete(email);
    return false;
  }
  
  // Check if the code matches
  if (storedData.code !== code) {
    return false;
  }
  
  return true;
}

/**
 * Removes a verification code for the given email
 * @param email - The email to remove the code for
 */
export function removeVerificationCode(email: string): void {
  verificationCodes.delete(email);
} 