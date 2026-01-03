import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import type { CreateBoardRequest, CreateBoardResponse } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        } as CreateBoardResponse,
        { status: 401 }
      )
    }

    // Parse request body
    const body: CreateBoardRequest = await request.json()
    const { title, year, include_free_space = false } = body

    // Validate input
    if (!title || !title.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Title is required',
        } as CreateBoardResponse,
        { status: 400 }
      )
    }

    if (!year || year < 2000 || year > 2100) {
      return NextResponse.json(
        {
          success: false,
          error: 'Valid year is required (2000-2100)',
        } as CreateBoardResponse,
        { status: 400 }
      )
    }

    // Create the board
    const { data: board, error: createError } = await supabase
      .from('boards')
      .insert({
        user_id: session.user.id,
        title: title.trim(),
        year: year,
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating board:', createError)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create board',
        } as CreateBoardResponse,
        { status: 500 }
      )
    }

    // Optionally create the center square (position 12) as a free space
    if (include_free_space) {
      const { error: freeSpaceError } = await supabase.from('goals').insert({
        board_id: board.id,
        position: 12,
        text: 'FREE SPACE',
        completed: true,
        completed_at: new Date().toISOString(),
        is_free_space: true,
      })

      if (freeSpaceError) {
        console.error('Error creating free space:', freeSpaceError)
        // Don't fail the board creation if free space fails
        // The user can still use the board
      }
    }

    return NextResponse.json(
      {
        success: true,
        board,
      } as CreateBoardResponse,
      { status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error in create board API:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      } as CreateBoardResponse,
      { status: 500 }
    )
  }
}

