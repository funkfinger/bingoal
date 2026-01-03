import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { board_id, title, year } = body

    if (!board_id) {
      return NextResponse.json(
        { success: false, error: 'Board ID is required' },
        { status: 400 }
      )
    }

    // Validate input
    if (!title || title.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Board title is required' },
        { status: 400 }
      )
    }

    if (!year || year < 1900 || year > 2100) {
      return NextResponse.json(
        { success: false, error: 'Valid year is required (1900-2100)' },
        { status: 400 }
      )
    }

    // Verify the board belongs to the user
    const { data: board, error: boardError } = await supabase
      .from('boards')
      .select('user_id')
      .eq('id', board_id)
      .single()

    if (boardError || !board || board.user_id !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Board not found or access denied' },
        { status: 403 }
      )
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
      .eq('user_id', session.user.id) // Extra safety check
      .select()
      .single()

    if (updateError) {
      console.error('Error updating board:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update board' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, board: updatedBoard },
      { status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error in update board API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

