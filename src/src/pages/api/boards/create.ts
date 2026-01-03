import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../../lib/supabaseServer";
import type {
  CreateBoardRequest,
  CreateBoardResponse,
} from "../../../lib/types";

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
        JSON.stringify({
          success: false,
          error: "Unauthorized",
        } as CreateBoardResponse),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const body: CreateBoardRequest = await request.json();
    const { title, year } = body;

    // Validate input
    if (!title || !title.trim()) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Title is required",
        } as CreateBoardResponse),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!year || year < 2000 || year > 2100) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Valid year is required (2000-2100)",
        } as CreateBoardResponse),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create the board
    const { data: board, error: createError } = await supabase
      .from("boards")
      .insert({
        user_id: session.user.id,
        title: title.trim(),
        year: year,
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating board:", createError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to create board",
        } as CreateBoardResponse),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Automatically create the center square (position 12) as a free space
    const { error: freeSpaceError } = await supabase.from("goals").insert({
      board_id: board.id,
      position: 12,
      text: "FREE SPACE",
      completed: true,
      completed_at: new Date().toISOString(),
    });

    if (freeSpaceError) {
      console.error("Error creating free space:", freeSpaceError);
      // Don't fail the board creation if free space fails
      // The user can still use the board
    }

    return new Response(
      JSON.stringify({
        success: true,
        board,
      } as CreateBoardResponse),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error in create board API:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal server error",
      } as CreateBoardResponse),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
