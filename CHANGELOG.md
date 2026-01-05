# Changelog

All notable changes to the Bingoooal project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Toggle Free Space Checkbox**:

  - Users can now toggle the free space checkbox when creating a new goal
  - Users can now toggle the free space checkbox when editing an existing goal
  - Checking the free space checkbox automatically updates the goal text to "Free Space"
  - Unchecking the free space checkbox allows users to edit the goal text freely

- **Comprehensive Mobile Responsiveness** (375px+ Support):
  - Implemented 5-tier responsive breakpoint system:
    - 768px (Tablet/large mobile)
    - 500px (Standard mobile)
    - 400px (Small mobile)
    - 375px (iPhone SE - critical breakpoint)
    - 360px (Android small devices)
  - Progressive enhancement approach with mobile-first design
  - Guaranteed 5x5 bingo grid display at all resolutions 375px and above
  - No horizontal scrolling on any mobile device
  - Vertical scrolling enabled for content overflow

### Changed

- **Grid Layout Optimizations**:

  - Progressive gap reduction: 12px → 8px → 6px → 4px → 3px → 2px
  - Progressive container padding reduction to maximize grid space
  - Responsive cell padding: 12px → 8px → 6px → 4px → 3px → 2px
  - Maintained `aspect-ratio: 1` for square cells across all breakpoints

- **Typography Enhancements**:

  - Progressive font size scaling: 14px → 12px → 11px → 10px → 9px → 8px
  - Line height optimization: 1.3 → 1.25 → 1.2 → 1.15 → 1.1 → 1.05
  - Reduced line clamp from 3 to 2 lines on mobile devices
  - Added `word-break: break-word` and `hyphens: auto` for text overflow prevention
  - Icon scaling: checkmark (20px → 13px), plus icon (32px → 18px)

- **Accessibility Improvements**:

  - Maintained minimum 44px touch targets at all breakpoints:
    - 400px: min-height 60px
    - 375px: min-height 58px
    - 360px: min-height 56px
  - All touch targets exceed WCAG accessibility standards

- **Visual Effects Scaling**:
  - Progressive box-shadow reduction: 3px → 2px → 1px
  - Border-radius scaling: 8px → 7px → 6px → 5px → 4px → 3px
  - Rotation effects reduced: 0.75deg → 0.3deg to prevent cell overlap
  - Hand-drawn aesthetic preserved while optimized for smaller screens

### Fixed

- **Mobile Layout Issues**:
  - Fixed bingo grid breaking at small screen sizes
  - Resolved text overflow in grid cells
  - Eliminated horizontal scrolling on 375px viewports
  - Ensured proper grid adaptation to narrow viewports

## [0.2.0] - 2026-01-04

### Changed

- **Major Framework Upgrade**: Upgraded from Next.js 14 to Next.js 16.1.1
  - Upgraded React from 18.3.0 to 19.2.3
  - Upgraded React DOM from 18.3.0 to 19.2.3
  - Updated @types/react to ^19
  - Updated @types/react-dom to ^19
  - Updated ESLint to v9 with new flat config format
  - Updated eslint-config-next to 16.1.1
  - Updated Tailwind CSS to 3.4.17
  - Updated PostCSS to 8.5.6
  - Updated Autoprefixer to 10.4.20

### Fixed

- **Next.js 16 Compatibility**:
  - Removed deprecated `serverActions` config from next.config.mjs (no longer needed in Next.js 16)
  - Removed webpack configuration (Turbopack is now the default bundler)
  - Added empty `turbopack: {}` config to silence migration warnings
  - Renamed `middleware.ts` to `proxy.ts` following Next.js 16 convention
  - Updated dynamic route params in `app/board/[id]/page.tsx` to await Promise (Next.js 16 requirement)
  - Updated TypeScript config: changed jsx from "preserve" to "react-jsx" for React 19 compatibility
  - Removed `@layer utilities` and `@layer components` directives from globals.css for Tailwind compatibility

### Technical Details

- **Build System**: Now using Turbopack as the default bundler (faster builds)
- **TypeScript**: All type errors resolved, full compatibility with React 19 types
- **Development Server**: Successfully running on Next.js 16.1.1 with Turbopack
- **Production Build**: Build process completes successfully without errors
- **Code Compatibility**: Verified no deprecated React 18 features in use (no string refs, propTypes, defaultProps, etc.)

## [0.1.0] - Previous Release

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
- Implemented comprehensive goal management features:
  - Created `data/example-goals.json` with 100 sample goal suggestions
  - Built Add Goal modal with:
    - Textarea with 200 character limit and character counter
    - Pre-populated with random example goal as placeholder
    - "✨ Inspire Me" button to get new random goals (only shown when field is empty)
    - Option to mark goal as "free space" (auto-completed)
  - Built Edit Goal modal with same interface as Add Goal
  - Implemented Delete Goal with confirmation dialog
  - Added Mark Goal as Complete functionality (only on locked boards):
    - Click goals to toggle completion status
    - Visual checkmark (✓) on completed goals
    - Three levels of confetti animations:
      - Small confetti for single goal completion
      - Medium confetti for bingo (row/column/diagonal)
      - Big confetti for full board completion
  - Implemented Lock Board feature:
    - "🔒 Lock Board" button in header (only enabled when all 25 goals added)
    - Confirmation dialog explaining lock is permanent
    - Locked boards show "🔒 Locked" badge
    - Once locked, only completion toggling allowed (no add/edit/delete)
  - All goal operations respect board lock status
  - Comprehensive error handling and loading states
- Enhanced board navigation:
  - Added "← Back to Dashboard" button at top of board view
  - Existing "← Back to Dashboard" button remains at bottom
  - Users now have clear navigation options at both top and bottom of page
- Improved free space display:
  - Goals marked as free space now display "Free Space" as the text
  - Maintains distinctive gold gradient styling
  - Clearer visual indication of free space goals
- Implemented goal details modal:
  - Users can click on goal squares (on locked boards) to view full details
  - Modal displays goal text, completion status, and completion date
  - Users can mark goals as complete/incomplete directly from the modal
  - Free space goals show special note explaining they cannot be changed
  - Easy to close with close button or clicking outside modal
  - Provides better UX for viewing long goal text and managing completion
- Protected free space goals from completion status changes:
  - Free space goals cannot have their completion status toggled
  - Clicking free space on locked board does nothing (no interaction)
  - Client-side and server-side validation prevents free space completion changes
  - UI clearly indicates free space is automatically completed and unchangeable

### Changed

- Updated goal completion behavior:

  - Changed from green gradient background to white background with large semi-transparent "X"
  - Completed goals now show a large "✕" (120px) in background with 20% opacity green color
  - Goal text remains dark and clearly visible over the "X" background
  - Maintains good contrast and readability for completed goals

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

- Removed Astro implementation after successful Next.js migration:
  - Deleted `astro-src/` directory containing original Astro source code
  - Removed `tsconfig.astro.json` TypeScript configuration
  - Removed Astro-specific npm scripts (`dev:astro`, `build:astro`, `preview:astro`)
  - Cleaned up TypeScript exclude array to remove `astro-src` reference

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
- Fixed 404 error after creating new bingo board:
  - Created missing `/board/[id]` dynamic route that was referenced but not implemented
  - Implemented `app/board/[id]/page.tsx` server component for board data fetching
  - Created `app/board/[id]/BoardClient.tsx` client component with interactive 5x5 bingo grid
  - Added `app/board/[id]/board.module.css` with responsive styling and color-coded cells
  - Board creation now successfully navigates to board detail page instead of 404
  - Includes progress bar, visual distinction for empty/filled/completed/free space cells
  - Added back navigation to dashboard
- Fixed text visibility issue on bingo cells:
  - Added dark gray text color (`#1f2937`) to `.filled` class
  - Ensures goal text is clearly visible against white background on uncompleted goals
  - Maintains proper color contrast for accessibility
- Fixed checkbox label visibility in Add/Edit Goal modal:
  - Added `.checkboxGroup` CSS class with proper styling
  - Set label text color to `#333` (dark gray) to ensure visibility against white modal background
  - Fixed issue where "Mark as free space (auto-completed)" text was white-on-white and invisible
  - Text is now visible whether selected/highlighted or not
- Fixed goal details modal text visibility:
  - Added `!important` to `.detailsLabel` and `.detailsText` color properties
  - Set text color to `#333` (dark gray) to ensure visibility against white modal background
  - Fixed issue where goal text and labels were white-on-white and invisible
  - Goal details now clearly visible in the modal

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
