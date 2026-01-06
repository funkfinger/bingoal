# AI Agent Memory - Bingoooal Project

## Technology Stack (DO NOT CHANGE WITHOUT EXPLICIT PERMISSION)

### Core Technologies

- **Framework**: Next.js (App Router) - Currently v16.1.1
- **Language**: TypeScript with strict mode
- **Database**: Supabase (PostgreSQL with RLS)
- **Authentication**: NextAuth.js v5.0.0-beta.30 with OAuth (Google, GitHub)
- **Styling**: Tailwind CSS v4
- **Deployment**: Vercel (web), Capacitor for mobile

### Mobile Strategy

- **Mobile Framework**: Capacitor (selected over Expo/React Native)
- **Rationale**: 95% code reusability, minimal changes required
- **Target Platform**: iOS first, Android future

### Dependency Version Control (CRITICAL)

- **NEVER upgrade or downgrade dependencies without explicit permission**
- **Current versions are locked and tested together**
- **Breaking changes can occur between major/minor versions**
- **Beta versions (like NextAuth) require special care**

#### Current Locked Versions

- Next.js: `16.1.1`
- NextAuth: `5.0.0-beta.30`
- React: `19.2.3`
- React DOM: `19.2.3`
- Supabase JS: `^2.89.0`
- Supabase SSR: `^0.9.0-rc.2`
- Tailwind CSS: `^4`
- TypeScript: `^5.0.0`

## Development Protocols

### Code Standards

- Always use TypeScript with strict typing
- Follow existing file structure and naming conventions
- Maintain responsive design (mobile-first, 375px minimum)
- Use existing component patterns and styling approach

### Dependency Management Rules

- **NO version changes without permission** - This includes:
  - Major version upgrades (e.g., Next.js 14 → 15)
  - Minor version upgrades that might introduce breaking changes
  - Downgrading versions for "compatibility"
  - Adding new dependencies without discussion
  - Changing package manager (npm/yarn/pnpm)
- **Security updates only** - Exception for critical security patches
- **Document reasoning** - If suggesting version changes, explain why

### Database Rules

- All database changes must use Supabase migrations
- Always implement Row Level Security (RLS) policies
- Use UUID for primary keys
- Follow existing table naming and column conventions

### Authentication Rules

- Never modify core NextAuth configuration without permission
- Maintain OAuth-only authentication (no passwords)
- Preserve existing session management
- Mobile auth changes require explicit approval

### UI/UX Constraints

- Maintain hand-drawn aesthetic (9-slice borders, organic shapes, rotations)
- Preserve existing color scheme and typography
- Keep mobile responsiveness at 375px minimum
- Use existing component library and patterns

## Project Context

### Current Status

- Web application is fully functional and deployed
- Mobile conversion is in progress using Capacitor
- Focus on iOS development first
- Board sharing feature is the current priority

### Key Features (Completed)

- User authentication with OAuth
- Bingo board creation and management
- Goal management with completion tracking
- Board locking functionality
- Confetti animations for completions
- Hand-drawn aesthetic throughout

### Active Development Areas

- Mobile app conversion with Capacitor
- Board sharing functionality implementation
- iOS development environment setup

## File Structure Rules

### Never Modify Without Permission

- `app/layout.tsx` - Core app layout
- `lib/supabase.ts` - Database client
- `lib/auth.ts` - Authentication configuration
- `package.json` - Dependencies and versions
- `package-lock.json` - Locked dependency tree
- Database migration files
- Core component structure

### Safe to Modify/Extend

- Individual page components
- New utility functions
- New database migrations (following patterns)
- Mobile-specific configurations
- Documentation files

## Decision History

### Technology Choices Made

- **Capacitor over Expo**: Chosen for code reusability (95% vs 30-40%)
- **NextAuth over custom auth**: Maintains OAuth-only approach
- **Supabase over other databases**: Existing investment, RLS policies
- **Static export for mobile**: Required for Capacitor compatibility
- **Next.js 16.x**: Latest stable with App Router
- **NextAuth beta**: Required for Next.js 15+ compatibility

### Rejected Approaches

- React Native/Expo (too much rewrite required)
- Custom authentication system
- Different styling frameworks
- Server-side rendering for mobile
- Downgrading to older Next.js versions for "stability"

## Current Priorities (In Order)

1. **Mobile Setup**: Complete Capacitor configuration and iOS setup
2. **Authentication**: Adapt NextAuth for mobile OAuth flows
3. **Board Sharing**: Implement the selected user story
4. **Testing**: Ensure feature parity between web and mobile
5. **App Store**: Prepare for iOS submission

## Communication Protocols

### Always Ask Before

- Changing core technology stack
- **Upgrading or downgrading ANY dependencies**
- Modifying authentication flow
- Changing database schema significantly
- Altering build/deployment configuration
- Making breaking changes to existing APIs
- Adding new dependencies to package.json

### Safe to Proceed With

- Adding new features following existing patterns
- Creating new components using established styles
- Writing new database migrations
- Adding mobile-specific enhancements
- Updating documentation

## Key Constraints

### Technical Constraints

- Must maintain web app functionality
- Mobile app must achieve 95% code reusability
- Static export required for Capacitor
- OAuth-only authentication (no passwords)
- **Dependency versions are locked and tested**

### Business Constraints

- iOS first, Android later
- Maintain existing user experience
- No breaking changes to existing features
- Focus on selected user stories from `USER_STORIES_FOR_AI.md`

## Version Compatibility Notes

### Critical Dependencies

- **NextAuth 5.0.0-beta.30**: Required for Next.js 16+ compatibility
- **React 19.x**: Latest stable, required by Next.js 16
- **Tailwind CSS 4.x**: Major version with breaking changes from v3
- **Supabase packages**: Specific versions tested with current auth flow

### Known Issues to Avoid

- NextAuth v4 incompatible with Next.js 15+
- Tailwind v3 → v4 has breaking changes in config format
- React 18 → 19 has breaking changes in some hooks
- Supabase SSR package versions must match JS client

## Reference Files

### Key Documentation

- `docs/MOBILE_CONVERSION_PLAN.md` - Complete mobile strategy
- `docs/MOBILE_CONVERSION_TASKS.md` - Implementation checklist
- `USER_STORIES_FOR_AI.md` - Feature requirements and priorities
- `data/example-goals.json` - Sample data for goal inspiration

### Critical Code Files

- `app/layout.tsx` - App structure
- `lib/supabase.ts` - Database client
- `lib/auth.ts` - Authentication setup
- `supabase/migrations/` - Database schema
- `package.json` - Dependency versions (DO NOT MODIFY)

---

**IMPORTANT FOR HUMANS**:

- Share this file (`@docs/AI_MEMORY.md`) at the start of each new AI session
- This ensures the AI agent understands the project constraints and protocols
- The AI cannot remember this information between separate conversations

**Last Updated**: [Current Date]
**AI Agent**: Remember to update this file when making significant decisions or changes.
**CRITICAL**: Never change dependency versions without explicit human approval.
