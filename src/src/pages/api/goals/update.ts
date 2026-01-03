import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../../lib/supabaseServer";
import type { UpdateGoalRequest, Goal } from "../../../lib/types";
import { checkForNewBingo, isBoardComplete } from "../../../lib/bingoDetection";

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
    const body: UpdateGoalRequest & { goal_id: string } = await request.json();
    const { goal_id, text, completed } = body;

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

    // Prevent editing the free space (position 12) text
    if (goalData.position === 12 && text !== undefined) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Cannot edit free space goal",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build update object
    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (text !== undefined) {
      if (text.trim() === "") {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Goal text cannot be empty",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      updates.text = text.trim();
    }

    if (completed !== undefined) {
      updates.completed = completed;
      updates.completed_at = completed ? new Date().toISOString() : null;
    }

    // Update the goal
    const { data: updatedGoal, error: updateError } = await supabase
      .from("goals")
      .update(updates)
      .eq("id", goal_id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating goal:", updateError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to update goal" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check for bingo and board completion if goal was just completed
    let bingoType = null;
    let boardComplete = false;

    if (completed && updatedGoal) {
      // Fetch all goals for this board to check for bingos
      const { data: allGoals } = await supabase
        .from("goals")
        .select("*")
        .eq("board_id", goalData.board_id);

      if (allGoals) {
        const goals = allGoals as Goal[];
        bingoType = checkForNewBingo(goals, updatedGoal.position);
        boardComplete = isBoardComplete(goals);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        goal: updatedGoal,
        bingoType,
        boardComplete,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Unexpected error in update goal API:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
