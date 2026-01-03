# Changelog

All notable changes to the Bingoooal project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Created USER_STORIES.md with 27 comprehensive user stories covering:
  - User Management (registration, login, logout)
  - Bingo Board Management (create, view, edit, delete)
  - Goal Management (add, edit, delete, complete, view)
  - Progress Tracking (view progress, detect bingos)
  - Multi-User Features (view others' boards, sharing)
  - User Experience (responsive design, dashboard, filtering, search)
  - Data Management (persistence, export, archive)
  - Customization (appearance, categories)
  - Notifications & Reminders (goal reminders, progress notifications)
- Created CHANGELOG.md to track all project changes
- Initialized Astro project in `./src` directory with:
  - Astro v5.16.6
  - Minimal template
  - TypeScript with strict mode
  - Basic project structure with pages routing
- Researched OAuth authentication solutions for Astro
  - Evaluated Auth.js, Lucia, and Supabase Auth
  - Recommended Supabase Auth for OAuth implementation
- Integrated Supabase into the project:
  - Installed @supabase/supabase-js and @supabase/ssr packages
  - Created Supabase project and configured database
  - Configured environment variables (.env file)
  - Created Supabase client utilities (supabase.ts and supabaseServer.ts)
  - Researched new Supabase API key system (legacy JWT keys still supported until late 2026)
- Implemented Google OAuth authentication:
  - Created Astro middleware for session management and route protection
  - Built login page with Google OAuth button and beautiful gradient UI
  - Created OAuth callback handler with support for both PKCE and implicit OAuth flows
  - Built protected dashboard page with user avatar, name, and logout button
  - Configured Google OAuth in Supabase dashboard with proper client ID and secret
  - Set up redirect URIs for local development and production
  - Created logout page (`/logout`) with proper server-side session cleanup
  - Added manual cookie deletion to ensure complete logout
- Created database schema in Supabase:
  - Designed and documented `boards` and `goals` tables
  - Implemented Row Level Security (RLS) policies for data protection
  - Added indexes for performance optimization
  - Set up foreign key relationships with CASCADE delete
  - Created DATABASE_SCHEMA.md with complete SQL migration script
- Implemented board management functionality:
  - Created TypeScript types for Board and Goal models
  - Built API endpoint for board creation (`/api/boards/create`)
  - Updated dashboard to fetch and display user's boards
  - Added modal UI for creating new boards with form validation
  - Implemented board grid layout with gradient cards
  - Support both empty state and boards grid view
  - Added navigation from dashboard to board detail pages
- Implemented board detail page with 5x5 bingo grid:
  - Created dynamic route `/board/[id]` for viewing individual boards
  - Built 5x5 bingo grid with responsive layout
  - Added progress bar showing completion percentage
  - Visual distinction for empty cells, filled cells, and completed goals
  - Implemented mobile-responsive design
  - Added back button to return to dashboard
- Implemented complete goal management (CRUD operations):
  - Created API endpoints for goals:
    - `POST /api/goals/create` - Add new goal to board
    - `POST /api/goals/update` - Update goal text and completion status
    - `POST /api/goals/delete` - Delete goal from board
  - Built modal UI for adding goals to empty cells
  - Built modal UI for editing existing goals
  - Implemented goal completion toggle with checkbox
  - Added delete goal functionality with confirmation dialog
  - Included comprehensive form validation and error handling
  - Added authorization checks to ensure users can only modify their own goals
  - Handle unique constraint violations for duplicate positions
- Implemented confetti celebrations for goal completion:
  - Installed canvas-confetti library for animations
  - Created three levels of celebration:
    - Small confetti burst for completing a single goal
    - Medium confetti animation for completing a bingo (row/column/diagonal)
    - Big confetti celebration for completing the entire board
  - Built bingo detection system:
    - Detects when completing a goal creates a new bingo
    - Checks for completed rows, columns, and diagonals
    - Identifies when entire board is completed
  - Updated goal update API to return bingo achievement data
  - Integrated celebrations into UI with delayed page reload
- Implemented board editing functionality:
  - Created API endpoint for updating board title and year
  - Added edit button to board detail page header
  - Built modal UI for editing board details
  - Implemented form validation and error handling
  - Added authorization checks to ensure users can only edit their own boards
- Added goal inspiration feature:
  - Created example-goals.json with 126 wholesome, achievable goal suggestions
  - Added "✨ Inspire Me" button to Add Goal modal
  - Implemented random goal suggestion functionality
  - Styled button with gradient and positioned inside textarea for better UX
- Implemented board deletion functionality:
  - Created API endpoint for deleting boards with authorization checks
  - Added "Delete Board" button to Edit Board modal
  - Implemented confirmation dialog before deletion
  - Cascade delete all associated goals via database foreign key
  - Redirect to dashboard after successful deletion
- Implemented board locking functionality:
  - Added `locked` column to boards table via database migration
  - Created API endpoint for toggling board lock status
  - Added lock button to board header (one-way operation)
  - Implemented locking rules:
    - Unlocked boards: Can add, edit, delete goals (setup phase)
    - Locked boards: Can ONLY mark goals as complete (tracking phase)
    - Both states: Can delete entire board and edit board details
  - Disabled goal text editing and delete button when locked
  - Added info message in edit modal when board is locked
  - Added confirmation dialog before locking
  - **Lock is permanent** - once locked, board cannot be unlocked via UI
  - Lock button disabled until all 25 goals are added
  - Server-side validation prevents locking incomplete boards
- Implemented center square free space:
  - Position 12 (center square) automatically created as "FREE SPACE"
  - Free space is pre-completed and cannot be edited or deleted
  - Styled with distinctive gold gradient background
  - Clicking free space has no effect
  - API endpoints prevent modification of free space goal
- Enhanced goal creation UX with smart placeholder and dynamic button:
  - Random goal from example-goals.json now appears as placeholder text when Add Goal modal opens
  - Placeholder text is saved as the goal if user submits without typing
  - "✨ Inspire Me" button now dynamically shows/hides based on textarea content
  - Button only visible when textarea is empty for cleaner UX
  - Removed HTML5 required attribute to allow JavaScript validation with placeholder fallback
  - Placeholder resets to default when modal is closed
- Enforced goal completion only on locked boards:
  - Completion checkbox is now disabled on unlocked boards
  - Added informational message: "Lock the board to enable goal completion tracking"
  - Updated form submission to only send completion status when board is locked
  - Added server-side validation to prevent completion changes on unlocked boards
  - Prevents bypassing UI restrictions via direct API calls
  - Ensures proper workflow: setup goals first, then lock board to start tracking
- Migrated from Astro to Next.js:
  - Moved Astro source files from `src/` to `astro-src/` to preserve original implementation
  - Created Next.js app structure with App Router
  - Migrated all pages to Next.js:
    - Home page (`app/page.tsx`)
    - Login page (`app/login/page.tsx`)
    - Dashboard page (`app/dashboard/page.tsx`)
  - Migrated all API routes to Next.js API Routes:
    - `/api/boards/create`, `/api/boards/update`, `/api/boards/delete`, `/api/boards/toggle-lock`
    - `/api/goals/create`, `/api/goals/update`, `/api/goals/delete`
  - Preserved all functionality from Astro implementation
- Migrated authentication from Supabase Auth to Next-Auth v5:
  - Installed `next-auth@5.0.0-beta.25` (latest stable v5 release)
  - Created `lib/auth.ts` with Next-Auth v5 configuration
  - Configured Google OAuth provider with Next-Auth
  - Implemented custom callbacks for user creation in Supabase database
  - Updated all pages and API routes to use `auth()` instead of `getServerSession()`
  - Updated middleware to use Next-Auth v5 API
  - Configured environment variables:
    - `AUTH_URL` for production deployment
    - `AUTH_SECRET` for session encryption
    - Backward compatible with `NEXTAUTH_SECRET`
- Created comprehensive migration documentation:
  - `MIGRATION_GUIDE.md` with step-by-step migration instructions
  - Documented all breaking changes and required updates
  - Included environment variable configuration
  - Added Google OAuth setup instructions for Next-Auth
- Created RLS (Row Level Security) strategy documentation:
  - `docs/RLS_STRATEGY.md` explaining authorization approach
  - Documented why RLS is disabled in favor of application-level authorization
  - Provided examples of authorization patterns in API routes
  - Explained security model and user ownership verification

### Changed

- Updated project structure to support both Astro and Next.js:
  - Created `tsconfig.astro.json` for Astro-specific TypeScript configuration
  - Updated main `tsconfig.json` for Next.js with proper path aliases
  - Excluded `astro-src/` from Next.js TypeScript compilation
  - Updated `.gitignore` to include Next.js build artifacts (`.next/`, `out/`, etc.)
- Updated `package.json` scripts:
  - `dev` now runs Next.js development server
  - `build` now builds Next.js app
  - Added `dev:astro`, `build:astro`, `preview:astro` for Astro development
- Modified authentication flow:
  - Changed from Supabase Auth to Next-Auth v5
  - Updated callback URL from `/auth/callback` to `/api/auth/callback/google`
  - Simplified session management with Next-Auth built-in session handling

### Deprecated

### Removed

### Fixed

- Fixed Vercel deployment issues:

  - Moved `astro.config.mjs` to `astro-src/` directory to prevent Vercel from detecting Astro
  - Added `astro-src` to TypeScript exclude array to prevent compilation errors
  - Fixed TypeScript error in `lib/supabase.ts` by using explicit `SupabaseClient` type
  - Wrapped `useSearchParams()` in Suspense boundary in login page for Next.js static generation

- Fixed OAuth callback handler to support Supabase's implicit flow (tokens in URL hash fragment)
  - Updated callback to detect tokens in hash fragment on client side
  - Implemented POST endpoint to send tokens to server for proper session creation
  - Added comprehensive error handling and debug information display
  - Fixed issue where session wasn't being set on server side, causing middleware to reject authentication
- Fixed logout functionality
  - Changed from client-side only logout to server-side logout with cookie cleanup
  - Added manual deletion of all Supabase cookies to ensure complete session termination
  - Resolved "Auth session missing" error by gracefully handling logout errors

### Security

---

## Template for Future Entries

```markdown
## [Version Number] - YYYY-MM-DD

### Added

- New features

### Changed

- Changes to existing functionality

### Deprecated

- Soon-to-be removed features

### Removed

- Removed features

### Fixed

- Bug fixes

### Security

- Security updates
```
