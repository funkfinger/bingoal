import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../../lib/supabaseServer";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const supabase = createSupabaseServerClient(cookies);

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { board_id, locked } = await request.json();

    if (!board_id || typeof locked !== "boolean") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Board ID and locked status are required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Verify the board belongs to the user
    const { data: board, error: boardError } = await supabase
      .from("boards")
      .select("user_id")
      .eq("id", board_id)
      .single();

    if (boardError || !board) {
      return new Response(
        JSON.stringify({ success: false, error: "Board not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (board.user_id !== session.user.id) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Unauthorized to modify this board",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // If locking the board, verify all 25 goals are filled
    if (locked) {
      const { count, error: countError } = await supabase
        .from("goals")
        .select("*", { count: "exact", head: true })
        .eq("board_id", board_id);

      if (countError) {
        console.error("Error counting goals:", countError);
        return new Response(
          JSON.stringify({ success: false, error: "Failed to verify goals" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      if (count !== 25) {
        return new Response(
          JSON.stringify({
            success: false,
            error: `Cannot lock board. Please add ${
              25 - (count || 0)
            } more goal(s).`,
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // Update the locked status
    const { error: updateError } = await supabase
      .from("boards")
      .update({ locked })
      .eq("id", board_id);

    if (updateError) {
      console.error("Error updating board lock status:", updateError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to update board lock status",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ success: true, locked }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in toggle lock API:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
