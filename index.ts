// User type matching Supabase's User type
export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
}

// Bookmark type for the database
export interface Bookmark {
  id: string;
  user_id: string;
  title: string;
  url: string;
  created_at: string;
}

// Auth state type
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
