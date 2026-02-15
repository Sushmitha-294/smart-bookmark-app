-- Create bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  url text NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Insert policy
CREATE POLICY "Users can insert their own bookmarks"
ON public.bookmarks
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Select policy
CREATE POLICY "Users can view their own bookmarks"
ON public.bookmarks
FOR SELECT
USING (auth.uid() = user_id);

-- Delete policy
CREATE POLICY "Users can delete their own bookmarks"
ON public.bookmarks
FOR DELETE
USING (auth.uid() = user_id);
