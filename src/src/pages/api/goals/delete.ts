import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../../lib/supabaseServer";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Get the authenticated user
    const supabase = createSupabaseServerClient(cookies);
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const body = await request.json();
    const { goal_id } = body;

    if (!goal_id) {
      return new Response(
        JSON.stringify({ success: false, error: "Goal ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verify the goal belongs to the user's board
    const { data: goal, error: goalError } = await supabase
      .from("goals")
      .select("board_id, position, boards!inner(user_id)")
      .eq("id", goal_id)
      .single();

    if (goalError || !goal) {
      return new Response(
        JSON.stringify({ success: false, error: "Goal not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // TypeScript workaround for nested object
    const goalData = goal as any;
    if (goalData.boards.user_id !== session.user.id) {
      return new Response(
        JSON.stringify({ success: false, error: "Access denied" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Prevent deleting the free space (position 12)
    if (goalData.position === 12) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Cannot delete free space goal",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Delete the goal
    const { error: deleteError } = await supabase
      .from("goals")
      .delete()
      .eq("id", goal_id);

    if (deleteError) {
      console.error("Error deleting goal:", deleteError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to delete goal" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Unexpected error in delete goal API:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
