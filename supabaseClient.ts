import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client (for browser)
export const createBrowserSupabaseClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};

// Server-side Supabase client (for server components/actions)
export const createServerSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// Singleton instance for client-side
let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export const getSupabaseBrowserClient = () => {
  if (!browserClient) {
    browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }
  return browserClient;
};
