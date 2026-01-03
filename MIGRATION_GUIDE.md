# Migration Guide: Astro + Supabase Auth → Next.js + Auth.js + Supabase DB

## Overview

This project is being migrated from Astro with Supabase Auth to Next.js with Auth.js (NextAuth) while keeping Supabase for the database.

## What's Been Completed

### ✅ Project Structure

- [x] Next.js 14+ configuration with App Router
- [x] TypeScript configuration
- [x] Package.json updated with Next.js dependencies
- [x] Environment variables template updated

### ✅ Authentication

- [x] Auth.js (NextAuth) configured with Google OAuth
- [x] Authentication middleware for route protection
- [x] Login page migrated to Next.js
- [x] Session management with JWT

### ✅ Database

- [x] Supabase client configured for Next.js
- [x] Database migration script for users table
- [x] Type definitions migrated

### ✅ Pages

- [x] Home page (/)
- [x] Login page (/login)
- [x] Dashboard page (/dashboard)

### ✅ API Routes

- [x] /api/auth/[...nextauth] - NextAuth handler
- [x] /api/boards/create - Create board endpoint

### ✅ Utilities

- [x] Bingo detection logic
- [x] Confetti celebrations
- [x] Type definitions

## What's Left to Do

### 🔲 API Routes (Remaining)

- [ ] /api/boards/delete
- [ ] /api/boards/update
- [ ] /api/boards/toggle-lock
- [ ] /api/goals/create
- [ ] /api/goals/update
- [ ] /api/goals/delete

### 🔲 Pages (Remaining)

- [ ] /board/[id] - Board detail page with bingo grid

### 🔲 Database Migration

- [ ] Run the users table migration in Supabase
- [ ] Update RLS policies to work with NextAuth user IDs
- [ ] Migrate existing data if any

### 🔲 Testing & Deployment

- [ ] Install dependencies (`npm install`)
- [ ] Set up environment variables
- [ ] Test authentication flow
- [ ] Test board creation
- [ ] Test board detail page
- [ ] Deploy to Vercel

## Installation Steps

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   Copy `.env.example` to `.env.local` and fill in:

   - `PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
   - `NEXTAUTH_URL` - http://localhost:3000 (or your production URL)
   - `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
   - `GOOGLE_CLIENT_ID` - From Google Cloud Console
   - `GOOGLE_CLIENT_SECRET` - From Google Cloud Console

3. **Run Database Migration**

   You have two options:

   **Option A: Preserve Existing Data** (Recommended for production)

   - Execute `supabase/migrations/create_users_table.sql`
   - This migrates existing users from Supabase Auth to the new users table
   - Preserves all existing boards and goals

   **Option B: Clean Slate** (For development only)

   - Execute `supabase/migrations/create_users_table_clean.sql`
   - ⚠️ **WARNING**: Deletes all existing boards and goals!
   - Use this if you have test data you don't need

   **Important**: The migration uses UUID for the users table to maintain compatibility with the existing boards table.

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Key Differences from Astro Version

### Authentication

- **Before**: Supabase Auth with `supabase.auth.signInWithOAuth()`
- **After**: Auth.js with `signIn('google')`

### Session Management

- **Before**: Supabase session in cookies via `@supabase/ssr`
- **After**: NextAuth JWT session

### Database Access

- **Before**: Supabase RLS with `auth.uid()`
- **After**: Application-level authorization with user ID from NextAuth session

### API Routes

- **Before**: Astro API routes with `APIRoute` type
- **After**: Next.js Route Handlers with `NextRequest`/`NextResponse`

### Pages

- **Before**: `.astro` files with frontmatter
- **After**: `.tsx` files with React Server Components

## Notes

- The Astro version is still in the `src/` directory and can be run with `npm run dev:astro`
- The Next.js version is in the `app/` directory and runs with `npm run dev`
- Both versions can coexist during migration
- Supabase database is shared between both versions

## Security Model

We've moved from database-level security (Supabase RLS with `auth.uid()`) to **application-level authorization**. This means:

- All API routes check the user's session and verify ownership
- RLS policies allow service role access (server-side only)
- Client-side code must go through API routes (can't use Supabase client directly)

See `docs/RLS_STRATEGY.md` for detailed information.

## Troubleshooting

### Migration Fails with Type Errors

Make sure you're running the latest version of the migration in `supabase/migrations/create_users_table.sql`. It should use UUID for the users table, not TEXT.

### Foreign Key Constraint Error

If you get an error like "Key (user_id)=(...) is not present in table users":

1. **If you have important data**: Use `create_users_table.sql` which migrates existing users
2. **If this is development**: Use `create_users_table_clean.sql` which starts fresh
3. **If you already ran part of the migration**: Drop the users table and run the migration again:
   ```sql
   DROP TABLE IF EXISTS users CASCADE;
   -- Then run the full migration
   ```

### Google OAuth Not Working

Make sure to add the correct redirect URIs in Google Cloud Console:

- http://localhost:3000/api/auth/callback/google (development)
- https://yourdomain.com/api/auth/callback/google (production)
