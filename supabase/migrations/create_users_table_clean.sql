-- CLEAN SLATE MIGRATION - USE THIS IF YOU WANT TO START FRESH
-- WARNING: This will delete all existing boards and goals!
-- Only use this in development if you don't have important data

-- Drop existing foreign key constraints
ALTER TABLE boards DROP CONSTRAINT IF EXISTS boards_user_id_fkey;

-- Delete all existing data
DELETE FROM goals;
DELETE FROM boards;

-- Drop and recreate users table
DROP TABLE IF EXISTS users CASCADE;

-- Create users table for NextAuth
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  provider TEXT NOT NULL DEFAULT 'google',
  provider_account_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_provider_account_id ON users(provider_account_id);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create simple policy for service role
CREATE POLICY "Service role can manage users"
  ON users FOR ALL
  USING (true)
  WITH CHECK (true);

-- Add foreign key constraint back
ALTER TABLE boards
  ADD CONSTRAINT boards_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES users(id)
  ON DELETE CASCADE;

-- Update RLS policies for boards and goals
DROP POLICY IF EXISTS "Users can view own boards" ON boards;
DROP POLICY IF EXISTS "Users can create own boards" ON boards;
DROP POLICY IF EXISTS "Users can update own boards" ON boards;
DROP POLICY IF EXISTS "Users can delete own boards" ON boards;

DROP POLICY IF EXISTS "Users can view goals on own boards" ON goals;
DROP POLICY IF EXISTS "Users can create goals on own boards" ON goals;
DROP POLICY IF EXISTS "Users can update goals on own boards" ON goals;
DROP POLICY IF EXISTS "Users can delete goals on own boards" ON goals;

CREATE POLICY "Service role can manage boards"
  ON boards FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage goals"
  ON goals FOR ALL
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE users IS 'User accounts managed by NextAuth';

