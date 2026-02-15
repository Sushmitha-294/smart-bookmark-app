import { getSupabaseBrowserClient } from './supabaseClient';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

// Get the singleton browser client
const supabase = getSupabaseBrowserClient();

export const authService = {
  // Sign in with Google OAuth
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      throw error;
    }

    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      throw error;
    }
    return session;
  },

  // Get current user
  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      throw error;
    }
    return user;
  },

  // Subscribe to auth state changes
  onAuthStateChange(callback: (user: User | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        callback(session?.user as User || null);
      }
    );

    return subscription;
  },
};
