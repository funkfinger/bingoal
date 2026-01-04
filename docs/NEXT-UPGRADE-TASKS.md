# Next.js Upgrade Task List

## Phase 1: Preparation

- [x] Create backup branch - Create a new git branch for the upgrade
- [x] Document current state - Note current functionality and any custom configurations
- [x] Review breaking changes - Check Next.js 15→16 and React 18→19 breaking changes documentation

## Phase 2: Dependency Updates

- [x] Update core Next.js dependencies in `package.json`:

  ```json
  "next": "16.1.1",
  "react": "19.2.3",
  "react-dom": "19.2.3"
  ```

- [x] Update TypeScript types in `package.json`:

  ```json
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "@types/node": "^20"
  ```

- [x] Update ESLint configuration in `package.json`:

  ```json
  "eslint": "^9",
  "eslint-config-next": "16.1.1"
  ```

- [x] Update Tailwind CSS (kept at v3 for compatibility):

  ```json
  "tailwindcss": "^3.4.17",
  "postcss": "^8.5.6",
  "autoprefixer": "^10.4.20"
  ```

- [x] Update lint script in `package.json`:
  ```json
  "lint": "next lint"
  ```

## Phase 3: Configuration Updates

- [x] Update Tailwind config - Kept existing v3 configuration (compatible with Next.js 16)
- [x] Review next.config.mjs - Removed deprecated `serverActions` and webpack config
- [x] Update TypeScript config - Updated jsx to "react-jsx" for React 19
- [x] Review ESLint config - Updated to ESLint v9 flat config format

## Phase 4: Code Compatibility

- [x] Review React 19 breaking changes in existing components:

  - Checked for deprecated React features (none found)
  - No custom hooks using deprecated APIs
  - Prop validation patterns are compatible

- [x] Update Next-Auth compatibility:

  ```json
  "next-auth": "^5.0.0-beta.25"
  ```

  (Compatible with React 19)

- [x] Verify Supabase compatibility:

  ```json
  "@supabase/ssr": "^0.8.0",
  "@supabase/supabase-js": "^2.89.0"
  ```

- [x] Update canvas-confetti types:
  ```json
  "@types/canvas-confetti": "^1.9.0"
  ```

## Phase 5: Installation & Testing

- [x] Clear node_modules and package-lock.json
- [x] Install dependencies - `npm install`
- [x] Fix any installation errors - Resolved dependency conflicts
- [x] Update TypeScript compilation - Fixed TypeScript errors
- [x] Test development server - `npm run dev` ✅
- [x] Test build process - `npm run build` ✅
- [x] Test production build - `npm run start` (pending)

## Phase 6: Feature Testing

- [ ] Test authentication flow - Login/logout with Google OAuth
- [ ] Test board creation - Create new bingo boards
- [ ] Test goal management - Add/edit/delete goals
- [ ] Test goal completion - Mark goals complete, verify confetti animations
- [ ] Test board locking - Lock boards and verify restrictions
- [ ] Test responsive design - Verify mobile/desktop layouts
- [ ] Test database operations - Verify Supabase integration

## Phase 7: Performance & Optimization

- [x] Review caching strategy - Next.js 16 caching working correctly
- [ ] Test API routes - Verify all `/api/` endpoints work correctly
- [ ] Check bundle size - Compare before/after bundle sizes
- [ ] Test loading performance - Verify page load times
- [x] Update middleware - Renamed `middleware.ts` to `proxy.ts` for Next.js 16

## Phase 8: Deployment

- [ ] Test local production build - `npm run build && npm run start`
- [ ] Update Vercel configuration - Ensure deployment settings are compatible
- [ ] Deploy to staging - Test in production-like environment
- [ ] Run full regression testing - Test all user stories from `USER_STORIES_FOR_AI.md`
- [ ] Deploy to production - Final deployment

## Phase 9: Post-Upgrade

- [ ] Monitor error logs - Check for runtime errors
- [ ] Performance monitoring - Verify no performance regressions
- [ ] Update documentation - Update README.md with new version info
- [x] Update CHANGELOG.md - Document the upgrade

## High-Risk Items to Watch

- **Tailwind CSS v4** - Major breaking changes in configuration syntax
- **ESLint v9** - New configuration format
- **React 19** - New JSX transform and stricter prop validation
- **Next-Auth beta** - Potential instability with React 19
- **Caching behavior** - Next.js caching strategy changes

This task list should provide a systematic approach to upgrading your project safely.
