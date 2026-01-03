import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabaseServer';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const supabase = createSupabaseServerClient(cookies);

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { board_id } = await request.json();

    if (!board_id) {
      return new Response(JSON.stringify({ success: false, error: 'Board ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify the board belongs to the user
    const { data: board, error: boardError } = await supabase
      .from('boards')
      .select('user_id')
      .eq('id', board_id)
      .single();

    if (boardError || !board) {
      return new Response(JSON.stringify({ success: false, error: 'Board not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (board.user_id !== session.user.id) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized to delete this board' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Delete the board (goals will be cascade deleted due to foreign key constraint)
    const { error: deleteError } = await supabase
      .from('boards')
      .delete()
      .eq('id', board_id);

    if (deleteError) {
      console.error('Error deleting board:', deleteError);
      return new Response(JSON.stringify({ success: false, error: 'Failed to delete board' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in delete board API:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

