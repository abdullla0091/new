'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  supabase, 
  signInWithEmail, 
  signUpWithEmail, 
  signOut, 
  getCurrentUser 
} from '@/lib/supabase';

type User = any;

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error checking user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setIsLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    isLoading,
    signIn: async (email: string, password: string) => {
      try {
        const result = await signInWithEmail(email, password);
        return result;
      } catch (error: any) {
        // Log and rethrow the error with the original message intact
        console.error('Auth context sign-in error:', error);
        
        // Preserve the original error message for specific handling in components
        throw error;
      }
    },
    signUp: async (email: string, password: string) => {
      try {
        const result = await signUpWithEmail(email, password);
        return result;
      } catch (error: any) {
        // Log and rethrow the error with the original message intact
        console.error('Auth context sign-up error:', error);
        
        // Preserve the original error message for specific handling in components
        throw error;
      }
    },
    logout: async () => {
      try {
        await signOut();
        setUser(null);
      } catch (error) {
        console.error('Auth context logout error:', error);
        throw error;
      }
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 