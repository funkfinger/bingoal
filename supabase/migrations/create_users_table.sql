-- Create users table for NextAuth
-- This replaces the auth.users table from Supabase Auth
-- Using UUID to maintain compatibility with existing boards table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  provider TEXT NOT NULL DEFAULT 'google',
  provider_account_id TEXT, -- Store the original provider ID
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create index on provider_account_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_provider_account_id ON users(provider_account_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
-- Since we're using NextAuth instead of Supabase Auth, we'll handle authorization in the application
-- For now, allow service role to manage users
CREATE POLICY "Service role can manage users"
  ON users FOR ALL
  USING (true)
  WITH CHECK (true);

-- Migrate existing users from auth.users to new users table
-- This preserves existing user data and their boards
INSERT INTO users (id, email, name, avatar_url, provider, provider_account_id)
SELECT
  au.id,
  au.email,
  au.raw_user_meta_data->>'full_name' as name,
  au.raw_user_meta_data->>'avatar_url' as avatar_url,
  'google' as provider,
  au.raw_user_meta_data->>'sub' as provider_account_id
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM users u WHERE u.id = au.id
);

-- Update boards table to reference new users table
-- First, we need to drop the existing foreign key constraint
ALTER TABLE boards DROP CONSTRAINT IF EXISTS boards_user_id_fkey;

-- Add new foreign key constraint to users table
ALTER TABLE boards
  ADD CONSTRAINT boards_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES users(id)
  ON DELETE CASCADE;

-- Update RLS policies for boards and goals tables
-- Since we're using NextAuth, we'll handle authorization in the application code
-- Drop existing policies that rely on auth.uid()
DROP POLICY IF EXISTS "Users can view own boards" ON boards;
DROP POLICY IF EXISTS "Users can create own boards" ON boards;
DROP POLICY IF EXISTS "Users can update own boards" ON boards;
DROP POLICY IF EXISTS "Users can delete own boards" ON boards;

DROP POLICY IF EXISTS "Users can view goals on own boards" ON goals;
DROP POLICY IF EXISTS "Users can create goals on own boards" ON goals;
DROP POLICY IF EXISTS "Users can update goals on own boards" ON goals;
DROP POLICY IF EXISTS "Users can delete goals on own boards" ON goals;

-- Create simple policies that allow service role access
-- The application will handle user authorization
CREATE POLICY "Service role can manage boards"
  ON boards FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage goals"
  ON goals FOR ALL
  USING (true)
  WITH CHECK (true);

-- Add comment to document the table
COMMENT ON TABLE users IS 'User accounts managed by NextAuth';

