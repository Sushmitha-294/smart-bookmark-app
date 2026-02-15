'use client';

import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/authService';
import { User } from '@/types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authService.getUser();
        setUser(currentUser);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Auth initialization failed');
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Subscribe to auth state changes
    const subscription = authService.onAuthStateChange((newUser) => {
      setUser(newUser);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with Google
  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
      setLoading(false);
      throw err;
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.signOut();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign out failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    signInWithGoogle,
    signOut,
  };
};
