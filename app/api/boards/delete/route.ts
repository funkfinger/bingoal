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

    const { board_id } = await request.json();

    if (!board_id) {
      return NextResponse.json(
        { success: false, error: "Board ID is required" },
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
        { success: false, error: "Unauthorized to delete this board" },
        { status: 403 }
      );
    }

    // Delete the board (goals will be cascade deleted due to foreign key constraint)
    const { error: deleteError } = await supabase
      .from("boards")
      .delete()
      .eq("id", board_id)
      .eq("user_id", session.user.id); // Extra safety check

    if (deleteError) {
      console.error("Error deleting board:", deleteError);
      return NextResponse.json(
        { success: false, error: "Failed to delete board" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in delete board API:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
