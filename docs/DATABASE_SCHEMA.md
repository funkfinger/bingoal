# Database Schema - Bingoooal

## Overview

This document describes the database schema for the Bingoooal application using Supabase (PostgreSQL).

## Tables

### 1. `boards`

Stores bingo board information.

| Column       | Type        | Constraints                             | Description                     |
| ------------ | ----------- | --------------------------------------- | ------------------------------- |
| `id`         | UUID        | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique board identifier         |
| `user_id`    | UUID        | NOT NULL, FOREIGN KEY → auth.users(id)  | Owner of the board              |
| `title`      | TEXT        | NOT NULL                                | Board title/name                |
| `year`       | INTEGER     | NOT NULL                                | Year for the board (e.g., 2025) |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now()                 | When board was created          |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now()                 | Last update timestamp           |

**Indexes:**

- `user_id` - For querying user's boards
- `year` - For filtering by year

**Row Level Security (RLS):**

- Users can only view/edit/delete their own boards
- Users can create new boards

---

### 2. `goals`

Stores individual goals within bingo boards.

| Column         | Type        | Constraints                                          | Description                 |
| -------------- | ----------- | ---------------------------------------------------- | --------------------------- |
| `id`           | UUID        | PRIMARY KEY, DEFAULT uuid_generate_v4()              | Unique goal identifier      |
| `board_id`     | UUID        | NOT NULL, FOREIGN KEY → boards(id) ON DELETE CASCADE | Parent board                |
| `position`     | INTEGER     | NOT NULL, CHECK (position >= 0 AND position <= 24)   | Position on 5x5 grid (0-24) |
| `text`         | TEXT        | NOT NULL                                             | Goal description            |
| `completed`    | BOOLEAN     | NOT NULL, DEFAULT false                              | Completion status           |
| `completed_at` | TIMESTAMPTZ | NULL                                                 | When goal was completed     |
| `created_at`   | TIMESTAMPTZ | NOT NULL, DEFAULT now()                              | When goal was created       |
| `updated_at`   | TIMESTAMPTZ | NOT NULL, DEFAULT now()                              | Last update timestamp       |

**Constraints:**

- UNIQUE(board_id, position) - Each position can only have one goal per board

**Indexes:**

- `board_id` - For querying board's goals
- `completed` - For filtering completed/incomplete goals

**Row Level Security (RLS):**

- Users can only view/edit/delete goals on their own boards
- Users can create new goals on their own boards

---

## SQL Migration Script

```sql
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create boards table
CREATE TABLE boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index on user_id for faster queries
CREATE INDEX idx_boards_user_id ON boards(user_id);

-- Create index on year for filtering
CREATE INDEX idx_boards_year ON boards(year);

-- Enable Row Level Security
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;

-- RLS Policies for boards
-- Users can view their own boards
CREATE POLICY "Users can view own boards"
  ON boards FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own boards
CREATE POLICY "Users can create own boards"
  ON boards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own boards
CREATE POLICY "Users can update own boards"
  ON boards FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own boards
CREATE POLICY "Users can delete own boards"
  ON boards FOR DELETE
  USING (auth.uid() = user_id);

-- Create goals table
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  position INTEGER NOT NULL CHECK (position >= 0 AND position <= 24),
  text TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(board_id, position)
);

-- Create index on board_id for faster queries
CREATE INDEX idx_goals_board_id ON goals(board_id);

-- Create index on completed for filtering
CREATE INDEX idx_goals_completed ON goals(completed);

-- Enable Row Level Security
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for goals
-- Users can view goals on their own boards
CREATE POLICY "Users can view goals on own boards"
  ON goals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = goals.board_id
      AND boards.user_id = auth.uid()
    )
  );

-- Users can create goals on their own boards
CREATE POLICY "Users can create goals on own boards"
  ON goals FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = goals.board_id
      AND boards.user_id = auth.uid()
    )
  );

-- Users can update goals on their own boards
CREATE POLICY "Users can update goals on own boards"
  ON goals FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = goals.board_id
      AND boards.user_id = auth.uid()
    )
  );

-- Users can delete goals on their own boards
CREATE POLICY "Users can delete goals on own boards"
  ON goals FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = goals.board_id
      AND boards.user_id = auth.uid()
    )
  );
```

## Notes

- All timestamps use `TIMESTAMPTZ` for timezone awareness
- `ON DELETE CASCADE` ensures goals are deleted when their board is deleted
- Row Level Security (RLS) ensures users can only access their own data
- The `position` field uses 0-24 to represent the 5x5 grid (row \* 5 + col)
- The `UNIQUE(board_id, position)` constraint prevents duplicate goals at the same position
