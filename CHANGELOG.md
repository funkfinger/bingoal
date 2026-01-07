# Changelog

All notable changes to the Bingoooal project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Removed

- **Hand-Drawn Aesthetic Utilities**:

  - Removed all hand-drawn aesthetic CSS classes from `globals.css`:
    - `.organic-shape-1` through `.organic-shape-4` (irregular border-radius)
    - `.shadow-hand-sm`, `.shadow-hand-md`, `.shadow-hand-lg` (offset shadows)
    - `.rotate-slight-1` through `.rotate-slight-6` (rotation variations)
    - `.wiggle-on-hover` animation
    - `.hand-drawn-border`, `.hand-border-rough` (border effects)
    - `.sketchy-bg` (background pattern)
    - `.svg-filters` (SVG filter container)
  - Removed hand-drawn shadow CSS variables from `@theme` block
  - Removed all usages of hand-drawn classes from `BoardClient.tsx`
  - Simplified component styling to use standard shadcn/ui and Tailwind classes
  - Maintained all functionality while adopting a cleaner, more standard design system

- **Custom Theme and Styling**:
  - Removed all custom color palettes from `globals.css`:
    - Primary brand colors (purple/indigo gradient theme)
    - Secondary colors
    - Accent colors (purple, indigo, yellow, green, red)
    - Semantic colors (success, warning, danger with light/dark variants)
  - Removed custom spacing variables (`--spacing-18`, `--spacing-88`, `--spacing-128`)
  - Removed custom border radius variables (`--radius-xl`, `--radius-2xl`, `--radius-3xl`)
  - Removed custom box shadow variables (`--shadow-soft`, `--shadow-medium`, `--shadow-large`, `--shadow-xl`)
  - Removed custom font family variable (`--font-sans`)
  - Removed `.content-container` utility class
  - Removed dark mode media query overrides for RGB color variables
  - Removed all body and global element styling except essential resets
  - Set `--radius: 0` to remove all rounded corners throughout the application
  - Converted all color values to grayscale HSL format for minimal, plain aesthetic
  - Reduced `globals.css` from 229 lines to 85 lines (63% reduction)
  - Maintained only essential shadcn/ui CSS variables and Tailwind imports

### Added

- **shadcn/ui Component Library Integration**:
  - Initialized shadcn/ui with New York style and neutral color scheme
  - Added 11 core UI components:
    - Button - Accessible button component with multiple variants (default, secondary, destructive, outline, ghost, link)
    - Card - Flexible card component with header, content, footer, title, and description subcomponents
    - Dialog - Modal dialog component for forms and confirmations
    - Input - Styled input field component
    - Label - Form label component with proper accessibility
    - Badge - Small status/label component with variants
    - Separator - Visual divider component
    - Textarea - Multi-line text input component
    - Checkbox - Accessible checkbox component with proper ARIA attributes
    - Progress - Progress bar component for visual feedback
  - Created `lib/utils.ts` with `cn()` helper function for merging Tailwind classes
  - Created `components.json` configuration file for shadcn CLI
  - Added PostCSS configuration for Tailwind CSS processing

### Changed

- **Dashboard Component Migration to shadcn/ui**:

  - Replaced all custom button styles with shadcn Button component
  - Migrated welcome card and boards section to use shadcn Card component
  - Converted all 3 modals to shadcn Dialog component:
    - Create Board modal with form inputs and validation
    - Edit Board modal with pre-populated form data
    - Delete Confirmation modal with destructive action styling
  - Updated board cards to use gradient styling with shadcn Card
  - Improved accessibility with built-in ARIA attributes
  - Enhanced visual consistency across the dashboard

- **Friends Component Migration to shadcn/ui**:

  - Replaced all button elements with shadcn Button component
  - Maintained existing functionality while improving visual consistency
  - Prepared component for further Card/Dialog migration

- **Board Component Migration to shadcn/ui**:

  - Converted all buttons to shadcn Button component with appropriate variants:
    - "Back to Dashboard" buttons use outline variant
    - "Lock Board" button with success styling
    - "Share" button with secondary variant
    - "Edit" button with default variant
    - "Delete" button with destructive variant
  - Replaced custom cards with shadcn Card component:
    - Board header card with title and action buttons
    - Progress card with shadcn Progress component
  - Converted all 6 modals to shadcn Dialog component:
    - Goal Create/Edit modal with Textarea and Checkbox for free space
    - Goal Delete Confirmation modal with destructive action
    - Lock Board Confirmation modal with warning message
    - Edit Board modal with Input fields for title and year
    - Share Board modal with Checkbox for public sharing and Input for share link
    - Goal Details modal with Badge for completion status
  - Replaced progress bar with shadcn Progress component
  - Replaced status badges with shadcn Badge component
  - Improved accessibility with proper ARIA attributes from shadcn components
  - Enhanced form UX with shadcn Label components for better accessibility

- **Global CSS Cleanup**:

  - Removed all custom component CSS classes:
    - Deleted `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.btn-outline` button classes
    - Removed `.modal-base` and `.modal-overlay` modal classes
    - Deleted `.card-base`, `.card-interactive`, `.gradient-card` card classes
    - Removed `.page-container` layout class
  - Reduced globals.css from 515 lines to 368 lines (28% reduction)
  - Kept only essential layout utilities and theme variables
  - Maintained hand-drawn aesthetic utilities for future use
  - Preserved shadcn theme variables for light/dark mode support

- **Design System Improvements**:

  - Unified button styling across all components
  - Consistent modal/dialog behavior and appearance
  - Improved form input styling and validation states
  - Better focus states and keyboard navigation
  - Enhanced mobile responsiveness with shadcn's responsive utilities

- **User Invitation System**:

  - Moved "Invite User" button from dashboard to Friends page for better context
  - Button now appears in the "My Friends" section header
  - Invite modal allows users to generate shareable invite links
  - Generated links expire in 30 days and can only be used once
  - Copy-to-clipboard functionality for easy sharing
  - New users clicking invite links are automatically added to inviter's group

- **Group Management and Friends System**:

  - Implemented automatic group creation for all users:
    - Each user gets one personal group created automatically on registration
    - Existing users receive groups via database migration
    - User is automatically added as the owner of their group
  - Enhanced invitation system to support group membership:
    - New users signing up via invite link are automatically added to inviter's group
    - Existing users clicking invite links are added to inviter's group upon login
    - Prevents duplicate group memberships
    - Handles expired and already-used invitations
  - Created comprehensive group management UI:
    - New `/friends` page to view and manage group members
    - "👥 Friends" navigation button in dashboard header
    - Two main sections:
      - "My Friends" - View and manage members of your group
      - "Groups I'm In" - View groups you've joined through invites
  - Implemented group member management:
    - View all members with avatars, names, and join dates
    - Remove members from your group with confirmation dialog
    - Owner is hidden from the friends list (cannot see or remove themselves)
    - Member count excludes the owner
  - Implemented group membership management:
    - View all groups you're a member of with owner information
    - Leave groups you've joined with confirmation dialog
    - Cannot leave your own group (where you're the owner)
  - Created API endpoints for group operations:
    - `GET /api/groups/members` - Fetch members of user's group
    - `POST /api/groups/remove-member` - Remove a member from group
    - `GET /api/groups/my-groups` - Get groups user is a member of
    - `POST /api/groups/leave` - Leave a group
  - Database schema additions:
    - `groups` table - One personal group per user
    - `group_members` table - Tracks group membership with roles
    - `board_shares` table - Ready for future board sharing features
    - Proper indexes and foreign key constraints
    - Row Level Security (RLS) policies for service role access
  - UI/UX enhancements:
    - Responsive design for mobile and desktop
    - Loading states during data fetching
    - Empty states with helpful guidance
    - Confirmation dialogs for destructive actions
    - Hand-drawn aesthetic matching app design
    - Smooth animations and hover effects

- **Board Sharing Feature**:

  - Users can now share their boards with others via a public link
  - Added "🔗 Share" button to board header for board owners
  - Share modal with toggle to enable/disable public sharing
  - Each board gets a unique, hard-to-guess share token (UUID)
  - Share links work without authentication when sharing is enabled
  - Shared boards display in read-only mode with visual indicators:
    - Blue banner: "👁️ You are viewing a shared board in read-only mode"
    - "Read-Only" badge in header
    - "Viewing Shared Board" in user info section
    - Edit, delete, and lock buttons hidden for viewers
  - Copy-to-clipboard functionality for share links
  - Database migration adds `share_token` and `is_public` fields to boards table
  - Row Level Security (RLS) policies allow public read access to shared boards
  - API endpoint `/api/boards/toggle-share` to manage sharing status
  - Middleware updated to allow unauthenticated access to boards with share tokens

- **Toggle Free Space Checkbox**:

  - Users can now toggle the free space checkbox when creating a new goal
  - Users can now toggle the free space checkbox when editing an existing goal
  - Checking the free space checkbox automatically updates the goal text to "Free Space"
  - Unchecking the free space checkbox allows users to edit the goal text freely

### Changed

- **Friends Page UI Improvements**:

  - Relocated "Invite User" button from dashboard header to Friends page
  - Button now positioned in "My Friends" section header for better contextual placement
  - Added flex layout with section header and button side-by-side on desktop
  - Mobile-responsive design: button becomes full-width on smaller screens
  - Enhanced button styling with green color (#10b981) and hand-drawn aesthetic
  - Added `!important` flags to CSS to override Tailwind base styles
  - Improved visual hierarchy and user flow for inviting friends

- **Disabled Rotation Effects by Default**:

  - Removed slight rotation transforms from all UI elements (cells, buttons, modals)
  - Elements now display perfectly straight by default for a cleaner appearance
  - Rotation styles are preserved as comments in CSS for easy re-enabling if desired
  - Affected elements: board cells, lock button, edit button, delete button, back button, inspire button, submit button, cancel button, and confirm delete button
  - Hover states updated to only use translateY transforms without rotation resets

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
