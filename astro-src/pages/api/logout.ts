import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../lib/supabaseServer";

export const POST: APIRoute = async ({ cookies }) => {
  try {
    const supabase = createSupabaseServerClient(cookies);

    console.log("Logout endpoint called");

    // Sign out on the server side (clears cookies)
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error);
      // Even if there's an error, we'll still return success
      // because the user wants to log out
    }

    console.log("User signed out successfully");

    // Return success
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected error in logout:", err);
    // Still return success to allow user to log out
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
};
