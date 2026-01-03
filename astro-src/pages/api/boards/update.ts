import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabaseServer';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Get the authenticated user
    const supabase = createSupabaseServerClient(cookies);
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body = await request.json();
    const { board_id, title, year } = body;

    if (!board_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Board ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate input
    if (!title || title.trim() === '') {
      return new Response(
        JSON.stringify({ success: false, error: 'Board title is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!year || year < 1900 || year > 2100) {
      return new Response(
        JSON.stringify({ success: false, error: 'Valid year is required (1900-2100)' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify the board belongs to the user
    const { data: board, error: boardError } = await supabase
      .from('boards')
      .select('user_id')
      .eq('id', board_id)
      .single();

    if (boardError || !board || board.user_id !== session.user.id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Board not found or access denied' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update the board
    const { data: updatedBoard, error: updateError } = await supabase
      .from('boards')
      .update({
        title: title.trim(),
        year: year,
        updated_at: new Date().toISOString(),
      })
      .eq('id', board_id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating board:', updateError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to update board' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, board: updatedBoard }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error in update board API:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

