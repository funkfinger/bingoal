import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { CreateGoalRequest } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const body: CreateGoalRequest = await request.json();
    const { board_id, position, text, is_free_space = false } = body;

    // Validate input
    if (!board_id || !text || text.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: "Board ID and goal text are required",
        },
        { status: 400 }
      );
    }

    if (position < 0 || position > 24) {
      return NextResponse.json(
        {
          success: false,
          error: "Position must be between 0 and 24",
        },
        { status: 400 }
      );
    }

    // Verify the board belongs to the user
    const { data: board, error: boardError } = await supabase
      .from("boards")
      .select("user_id")
      .eq("id", board_id)
      .single();

    if (boardError || !board || board.user_id !== session.user.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Board not found or access denied",
        },
        { status: 403 }
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
        return NextResponse.json(
          {
            success: false,
            error: "A goal already exists at this position",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { success: false, error: "Failed to create goal" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, goal }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error in create goal API:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
