import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Server-side Supabase client for Next.js
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client-side Supabase client (for use in client components)
export function createBrowserClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Create a Supabase client with user context for RLS
export function createSupabaseClient(userId: string) {
  const client = createClient(supabaseUrl, supabaseAnonKey);

  // Set the user context for RLS policies
  // This is a workaround since we're not using Supabase Auth
  // We'll need to set this in our API routes
  return client;
}

// Helper to execute queries with user context
export async function withUserContext<T>(
  userId: string,
  callback: (client: ReturnType<typeof createClient>) => Promise<T>
): Promise<T> {
  const client = createClient(supabaseUrl, supabaseAnonKey);

  // Set the user context using a custom header or session variable
  // For now, we'll handle authorization in our application code
  // rather than relying on RLS with auth.uid()

  return callback(client);
}
