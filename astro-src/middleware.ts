import { defineMiddleware } from 'astro:middleware';
import { createSupabaseServerClient } from './lib/supabaseServer';

export const onRequest = defineMiddleware(async ({ locals, url, cookies, redirect }, next) => {
  // Create Supabase client
  const supabase = createSupabaseServerClient(cookies);
  
  // Get the current session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Make session available to all pages
  locals.session = session;
  locals.supabase = supabase;

  // Protected routes - redirect to login if not authenticated
  const protectedRoutes = ['/dashboard'];
  const isProtectedRoute = protectedRoutes.some(route => url.pathname.startsWith(route));

  if (isProtectedRoute && !session) {
    return redirect('/login');
  }

  // If user is logged in and tries to access login page, redirect to dashboard
  if (url.pathname === '/login' && session) {
    return redirect('/dashboard');
  }

  return next();
});

