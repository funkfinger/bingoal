import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../../lib/supabaseServer";
import type { CreateGoalRequest } from "../../../lib/types";

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
    const body: CreateGoalRequest = await request.json();
    const { board_id, position, text, is_free_space = false } = body;

    // Validate input
    if (!board_id || !text || text.trim() === "") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Board ID and goal text are required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (position < 0 || position > 24) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Position must be between 0 and 24",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verify the board belongs to the user
    const { data: board, error: boardError } = await supabase
      .from("boards")
      .select("user_id")
      .eq("id", board_id)
      .single();

    if (boardError || !board || board.user_id !== session.user.id) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Board not found or access denied",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create the goal
    const goalData: any = {
      board_id,
      position,
      text: text.trim(),
      is_free_space,
      completed: is_free_space, // Auto-complete if it's a free space
    };

    // If it's a free space, set completed_at
    if (is_free_space) {
      goalData.completed_at = new Date().toISOString();
    }

    const { data: goal, error: createError } = await supabase
      .from("goals")
      .insert(goalData)
      .select()
      .single();

    if (createError) {
      console.error("Error creating goal:", createError);

      // Check if it's a unique constraint violation
      if (createError.code === "23505") {
        return new Response(
          JSON.stringify({
            success: false,
            error: "A goal already exists at this position",
          }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: false, error: "Failed to create goal" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ success: true, goal }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Unexpected error in create goal API:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
