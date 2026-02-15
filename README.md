# Smart Bookmark App

A secure, cloud-based bookmark management application with real-time synchronization.

## Features

- Google OAuth Authentication - Secure login without passwords
- Bookmark Management - Create and delete bookmarks
- Privacy-First - Row-level security ensures users only see their own bookmarks
- Real-time Sync - Instant updates across multiple tabs and devices
- Responsive Design- Works on desktop and mobile

## Tech Stack

- Frontend: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- Backend: Supabase (Auth, Database, Realtime)
- Deployment: Vercel

## Quick Start

### 1. Clone and Install

```bash
cd smart-bookmark-app
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `schema.sql`
3. Enable Google OAuth in Authentication > Providers
4. Copy your project URL and anon key

### 3. Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/smart-bookmark-app.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and import your GitHub repository
2. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy!

## Database Schema

```sql
-- Bookmarks table with RLS
create table bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table bookmarks enable row level security;

create policy "Users can only view their own bookmarks"
  on bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can only insert their own bookmarks"
  on bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can only delete their own bookmarks"
  on bookmarks for delete
  using (auth.uid() = user_id);

-- Enable realtime
alter publication supabase_realtime add table bookmarks;
```

## Project Structure

```
app/                    # Next.js App Router
├── login/page.tsx      # Login page
├── dashboard/page.tsx  # Main dashboard
├── layout.tsx          # Root layout
└── page.tsx            # Landing/redirect

components/             # React components
├── LoginButton.tsx
├── BookmarkForm.tsx
├── BookmarkList.tsx
├── BookmarkItem.tsx
└── ui/                 # UI components

hooks/                  # Custom hooks
├── useAuth.ts
├── useBookmarks.ts
└── useRealtimeBookmarks.ts

services/               # Supabase services
├── supabaseClient.ts
├── authService.ts
└── bookmarkService.ts

types/                  # TypeScript types
└── index.ts
```

## Testing Checklist

- [ ] Login with Google works
- [ ] Can create a bookmark
- [ ] Can delete a bookmark
- [ ] Bookmarks are private (other users can't see them)
- [ ] Real-time sync works across tabs
- [ ] Responsive on mobile devices

## Security

- Row Level Security (RLS) enforced on all database operations
- Google OAuth for secure authentication
- No passwords stored in the application
- HTTPS enforced in production

## License

MIT
