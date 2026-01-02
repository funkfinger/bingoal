# Changelog

All notable changes to the Bingoal project will be documented in this file.

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
  - Created Supabase project (wiekhzjypbqkwgljvzzu.supabase.co)
  - Configured environment variables (.env file)
  - Created Supabase client utilities (supabase.ts and supabaseServer.ts)
  - Researched new Supabase API key system (legacy JWT keys still supported until late 2026)

### Changed

### Deprecated

### Removed

### Fixed

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
