# Row Level Security (RLS) Strategy

## Overview

Since we migrated from Supabase Auth to NextAuth, we can no longer use Supabase's built-in `auth.uid()` function in RLS policies. This document explains our approach to security.

## Current Approach: Application-Level Authorization

We've chosen to handle authorization in the application code rather than at the database level. Here's why:

### Pros
- ✅ Simpler to implement and maintain
- ✅ More flexible - can implement complex business logic
- ✅ Easier to debug and test
- ✅ Works seamlessly with NextAuth sessions
- ✅ No need to set session variables on every request

### Cons
- ❌ Security depends on application code being correct
- ❌ Must remember to check authorization in every API route
- ❌ Can't use Supabase client directly from client-side (must go through API routes)

## RLS Policies

All tables have simple policies that allow the service role (server-side) to access everything:

```sql
CREATE POLICY "Service role can manage [table]"
  ON [table] FOR ALL
  USING (true)
  WITH CHECK (true);
```

## Authorization in API Routes

Every API route must:

1. **Get the session** using `getServerSession(authOptions)`
2. **Check if user is authenticated** - return 401 if not
3. **Verify ownership** - ensure the user owns the resource they're accessing
4. **Perform the operation** using the Supabase client

### Example Pattern

```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  // 1. Get session
  const session = await getServerSession(authOptions)
  
  // 2. Check authentication
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // 3. Verify ownership (for updates/deletes)
  const { data: board } = await supabase
    .from('boards')
    .select('user_id')
    .eq('id', boardId)
    .single()
  
  if (board?.user_id !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  
  // 4. Perform operation
  const { data, error } = await supabase
    .from('boards')
    .update({ ... })
    .eq('id', boardId)
    .eq('user_id', session.user.id) // Extra safety check
}
```

## Alternative Approach: Session Variables (Not Implemented)

We could set a session variable on every request and use it in RLS policies:

```sql
-- Set session variable in middleware
await supabase.rpc('set_user_id', { user_id: session.user.id })

-- Use in RLS policy
CREATE POLICY "Users can view own boards"
  ON boards FOR SELECT
  USING (user_id::text = current_setting('app.current_user_id', true)::text);
```

This approach was not chosen because:
- Requires setting the variable on every request
- More complex to implement
- Harder to debug
- Type casting issues between UUID and TEXT

## Security Checklist

When creating a new API route, ensure:

- [ ] Session is checked at the start
- [ ] User ID is verified
- [ ] Ownership is verified for resource access
- [ ] All database queries filter by `user_id`
- [ ] Error messages don't leak sensitive information
- [ ] Input validation is performed

## Future Improvements

If we need database-level security in the future, we could:

1. Create a PostgreSQL function to set session variables
2. Update RLS policies to use those variables
3. Call the function in middleware before each request

For now, application-level authorization is sufficient for this application.

