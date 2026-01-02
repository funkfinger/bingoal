# OAuth Implementation Plan for Bingoal

## Recommendation: Supabase Auth

After researching various OAuth solutions for Astro, **Supabase Auth** is the recommended choice for the following reasons:

### Why Supabase Auth?

1. **Built-in OAuth Support**
   - Pre-configured providers for Google, GitHub, and many others
   - No need to manually handle OAuth flows
   - Automatic token management and refresh

2. **Database Integration**
   - Includes PostgreSQL database for storing user data and bingo boards
   - Row Level Security (RLS) for data protection
   - Real-time subscriptions for live updates

3. **Astro Compatibility**
   - Official Supabase SSR package works seamlessly with Astro
   - Server-side authentication via Astro middleware
   - Easy integration with Astro API routes

4. **Additional Features**
   - User management dashboard
   - Email verification
   - Password reset flows
   - Session management
   - Free tier suitable for development and small projects

### Alternative Options Considered

| Solution | Pros | Cons | Verdict |
|----------|------|------|---------|
| **Supabase Auth** | All-in-one (auth + DB), easy OAuth setup, free tier | Vendor lock-in | ✅ **Recommended** |
| **Lucia** | Lightweight, framework-agnostic, full control | Manual OAuth setup, need separate DB | Good for custom needs |
| **Auth.js** | Feature-rich, many providers | Better suited for Next.js, heavier | Not ideal for Astro |

## Implementation Steps

### Phase 1: Supabase Setup

1. **Create Supabase Project**
   - Sign up at https://supabase.com
   - Create new project
   - Note the project URL and anon key

2. **Configure OAuth Providers**
   - Enable Google OAuth in Supabase dashboard
   - Enable GitHub OAuth in Supabase dashboard
   - Set up redirect URLs

3. **Install Dependencies**
   ```bash
   cd src
   npm install @supabase/supabase-js @supabase/ssr
   ```

### Phase 2: Astro Integration

1. **Environment Variables**
   - Create `.env` file with Supabase credentials
   - Add to `.gitignore`

2. **Create Supabase Client**
   - Server-side client for API routes
   - Client-side client for browser interactions

3. **Set Up Middleware**
   - Create Astro middleware for session management
   - Protect authenticated routes

4. **Create Auth Pages**
   - `/login` - Login page with OAuth buttons
   - `/auth/callback` - OAuth callback handler
   - `/dashboard` - Protected dashboard page

### Phase 3: Database Schema

1. **Users Table** (auto-created by Supabase Auth)
   - id (UUID)
   - email
   - created_at
   - metadata (JSON)

2. **Bingo Boards Table**
   - id (UUID)
   - user_id (FK to users)
   - title (TEXT)
   - year (INTEGER)
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)

3. **Goals Table**
   - id (UUID)
   - board_id (FK to boards)
   - position (INTEGER 0-24)
   - text (TEXT)
   - completed (BOOLEAN)
   - category (TEXT, nullable)
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)

### Phase 4: Security

1. **Row Level Security (RLS)**
   - Users can only read/write their own boards
   - Public boards can be read by anyone
   - Implement sharing permissions

2. **API Route Protection**
   - Verify session on all protected routes
   - Return 401 for unauthenticated requests

## Next Steps

1. Create Supabase account and project
2. Install Supabase dependencies
3. Set up environment variables
4. Implement authentication flow
5. Create database schema
6. Set up RLS policies
7. Test OAuth login with Google and GitHub

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth with Astro Guide](https://mihai-andrei.com/blog/how-to-add-supabase-auth-to-astro/)
- [Supabase SSR Package](https://supabase.com/docs/guides/auth/server-side/migrating-to-ssr-from-auth-helpers)
- [Astro Middleware Docs](https://docs.astro.build/en/guides/middleware/)

