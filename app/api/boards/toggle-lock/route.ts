import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

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

    const { board_id, locked } = await request.json();

    if (!board_id || typeof locked !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          error: "Board ID and locked status are required",
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

    if (boardError || !board) {
      return NextResponse.json(
        { success: false, error: "Board not found" },
        { status: 404 }
      );
    }

    if (board.user_id !== session.user.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized to modify this board",
        },
        { status: 403 }
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
        return NextResponse.json(
          { success: false, error: "Failed to verify goals" },
          { status: 500 }
        );
      }

      if (count !== 25) {
        return NextResponse.json(
          {
            success: false,
            error: `Cannot lock board. Please add ${
              25 - (count || 0)
            } more goal(s).`,
          },
          { status: 400 }
        );
      }
    }

    // Update the locked status
    const { error: updateError } = await supabase
      .from("boards")
      .update({ locked })
      .eq("id", board_id)
      .eq("user_id", session.user.id); // Extra safety check

    if (updateError) {
      console.error("Error updating board lock status:", updateError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update board lock status",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, locked }, { status: 200 });
  } catch (error) {
    console.error("Error in toggle lock API:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
